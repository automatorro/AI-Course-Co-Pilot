import React, { useState, useEffect } from 'react';
import { Upload, FileText, File, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { CourseFile } from '../types';
import { uploadCourseFile, getCourseFiles, deleteCourseFile } from '../services/fileStorageService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../contexts/I18nContext';

interface FileManagerProps {
    courseId: string;
    onUseFile?: (file: CourseFile) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ courseId, onUseFile }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [files, setFiles] = useState<CourseFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadFiles();
    }, [courseId]);

    const loadFiles = async () => {
        setLoading(true);
        const courseFiles = await getCourseFiles(courseId);
        setFiles(courseFiles);
        setLoading(false);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        console.log('[FileManager] File selected:', selectedFile?.name);

        if (!user) {
            console.error('[FileManager] No user found in AuthContext');
            showToast('You must be logged in to upload files.', 'error');
            return;
        }

        if (!selectedFile) return;

        setUploading(true);
        try {
            console.log('[FileManager] Uploading file for course:', courseId);
            const result = await uploadCourseFile(courseId, selectedFile, user.id);

            if (result.success) {
                console.log('[FileManager] Upload success');
                showToast('File uploaded successfully!', 'success');
                await loadFiles();
            } else {
                console.error('[FileManager] Upload failed:', result.error);
                showToast(result.error || 'Upload failed', 'error');
            }
        } catch (err) {
            console.error('[FileManager] Unexpected error:', err);
            showToast('An unexpected error occurred.', 'error');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        setDeletingId(fileId);
        const result = await deleteCourseFile(fileId);

        if (result.success) {
            showToast('File deleted successfully', 'success');
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } else {
            showToast(result.error || 'Delete failed', 'error');
        }

        setDeletingId(null);
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case 'pdf':
                return <FileText className="text-red-500" size={20} />;
            case 'docx':
                return <FileText className="text-blue-500" size={20} />;
            case 'txt':
                return <File className="text-gray-500" size={20} />;
            case 'pptx':
                return <FileText className="text-orange-500" size={20} />;
            default:
                return <File className="text-gray-500" size={20} />;
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('fileManager.title')}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {files.length} {files.length === 1 ? t('fileManager.file_one') : t('fileManager.file_other')}
                </span>
            </div>

            {/* Upload Button */}
            <div className="mb-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload-input"
                    disabled={uploading}
                />
                <label
                    htmlFor="file-upload-input"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                        : 'border-hairline hover:border-gold hover:bg-paper-alt dark:border-hairline dark:hover:bg-paper-alt'
                        }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin text-gold" size={20} />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {t('fileManager.uploading')}
                            </span>
                        </>
                    ) : (
                        <>
                            <Upload className="text-gold" size={20} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('fileManager.uploadButton')}
                            </span>
                        </>
                    )}
                </label>
            </div>

            {/* Files List */}
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
            ) : files.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    {t('fileManager.noFiles')}
                </div>
            ) : (
                <div className="space-y-2">
                    {files.map(file => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {getFileIcon(file.file_type)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {file.filename}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.file_size)} • {file.file_type.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                {onUseFile && (
                                    <button
                                        onClick={() => onUseFile(file)}
                                        className="p-2 text-gold hover:bg-paper-alt rounded-lg transition-colors"
                                        title={t('fileManager.useInEditor')}
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    disabled={deletingId === file.id}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                    title={t('fileManager.deleteFile')}
                                >
                                    {deletingId === file.id ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileManager;
