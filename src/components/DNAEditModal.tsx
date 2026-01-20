import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Code, LayoutTemplate } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { CourseDNA } from '../types';

interface DNAEditModalProps {
    isOpen: boolean;
    dna: CourseDNA;
    onClose: () => void;
    onSave: (dna: CourseDNA) => Promise<void>;
}

const DNAEditModal: React.FC<DNAEditModalProps> = ({ isOpen, dna, onClose, onSave }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
    
    // JSON State
    const [jsonText, setJsonText] = useState('');
    
    // Form State (Flattened for easier editing)
    const [formData, setFormData] = useState<Partial<CourseDNA>>({});
    
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [parseErrorMode, setParseErrorMode] = useState(false);

    useEffect(() => {
        if (dna) {
            setJsonText(JSON.stringify(dna, null, 2));
            setFormData(dna);
            if ((dna as any)._status === 'parse_error') {
                setParseErrorMode(true);
                setActiveTab('json'); // Default to JSON if broken
            } else {
                setParseErrorMode(false);
                setActiveTab('form');
            }
        }
    }, [dna]);

    // Sync Form -> JSON when switching tabs
    const handleTabChange = (tab: 'form' | 'json') => {
        if (tab === 'json') {
            // Update JSON from Form
            const currentJson = parseJsonSafe(jsonText);
            const merged = { ...currentJson, ...formData };
            setJsonText(JSON.stringify(merged, null, 2));
        } else {
            // Update Form from JSON
            try {
                const parsed = JSON.parse(jsonText);
                setFormData(parsed);
                setError(null);
            } catch (e) {
                setError("Invalid JSON. Fix syntax before switching to Form view.");
                return; // Block switch
            }
        }
        setActiveTab(tab);
    };

    const parseJsonSafe = (text: string) => {
        try { return JSON.parse(text); } catch { return {}; }
    };

    const handleSave = async () => {
        try {
            setError(null);
            let finalDNA: any;

            if (activeTab === 'json') {
                finalDNA = JSON.parse(jsonText);
            } else {
                // Merge form data into original structure to preserve other fields
                const currentJson = parseJsonSafe(jsonText);
                finalDNA = { ...currentJson, ...formData };
                // Clean up parse error status if we are saving valid data
                delete finalDNA._status;
                delete finalDNA._raw_content;
            }
            
            // Basic validation
            if (!finalDNA.terminology || !finalDNA.narrativeUniverse) {
                throw new Error("Invalid DNA structure: Missing 'terminology' or 'narrativeUniverse'.");
            }

            setIsSaving(true);
            await onSave(finalDNA);
            setIsSaving(false);
            onClose();
        } catch (e: any) {
            setError(e.message || "Invalid JSON format.");
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🧬</span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t('dna.edit.title', 'Edit Course DNA')}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => handleTabChange('form')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                            activeTab === 'form'
                                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <LayoutTemplate size={16} />
                        {t('dna.edit.tabs.form', 'Visual Editor')}
                    </button>
                    <button
                        onClick={() => handleTabChange('json')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                            activeTab === 'json'
                                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <Code size={16} />
                        {t('dna.edit.tabs.json', 'JSON Editor (Advanced)')}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/30">
                    {parseErrorMode && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 border-b border-red-100 dark:border-red-900/50 flex items-start gap-3">
                            <AlertTriangle size={18} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-800 dark:text-red-200">
                                {t('dna.edit.parseError', 'Structure error detected. Use JSON editor to fix manually or fill the form to overwrite.')}
                            </p>
                        </div>
                    )}

                    {activeTab === 'form' ? (
                        <div className="p-6 space-y-8">
                            {/* Terminology Section */}
                            <section>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 border-b pb-2">
                                    {t('dna.edit.section.terminology', 'Terminology')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('dna.edit.field.participant', 'Participant Term')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.terminology?.participant || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                terminology: { ...formData.terminology!, participant: e.target.value }
                                            })}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('dna.edit.field.trainer', 'Trainer Term')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.terminology?.trainer || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                terminology: { ...formData.terminology!, trainer: e.target.value }
                                            })}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('dna.edit.field.exercise', 'Exercise Term')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.terminology?.exercise || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                terminology: { ...formData.terminology!, exercise: e.target.value }
                                            })}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Voice Profile Section */}
                            <section>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 border-b pb-2">
                                    {t('dna.edit.section.voice', 'Voice Profile')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('dna.edit.field.formality', 'Formality')}
                                        </label>
                                        <select
                                            value={formData.voiceProfile?.formality || 'professional'}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                voiceProfile: { ...formData.voiceProfile!, formality: e.target.value as any }
                                            })}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                        >
                                            <option value="professional">Professional</option>
                                            <option value="buddy">Buddy / Casual</option>
                                            <option value="academic">Academic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('dna.edit.field.humor', 'Humor Level')}
                                        </label>
                                        <select
                                            value={formData.voiceProfile?.humorLevel || 'none'}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                voiceProfile: { ...formData.voiceProfile!, humorLevel: e.target.value as any }
                                            })}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                        >
                                            <option value="none">None</option>
                                            <option value="light">Light</option>
                                            <option value="heavy">Heavy</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Narrative Section - Simplified to JSON for now as it's complex array */}
                            <section>
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 border-b pb-2">
                                    {t('dna.edit.section.narrative', 'Narrative Universe')} (JSON)
                                </h3>
                                <textarea
                                    value={JSON.stringify(formData.narrativeUniverse || {}, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const val = JSON.parse(e.target.value);
                                            setFormData({ ...formData, narrativeUniverse: val });
                                        } catch {}
                                    }}
                                    className="w-full h-40 font-mono text-xs rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * Edit protagonists directly in JSON for now.
                                </p>
                            </section>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 border-b border-yellow-100 dark:border-yellow-900/50 flex items-start gap-3">
                                <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    {t('dna.edit.warning', 'Warning: Raw JSON editing.')}
                                </p>
                            </div>
                            <textarea
                                value={jsonText}
                                onChange={(e) => setJsonText(e.target.value)}
                                className="flex-1 w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
                                spellCheck={false}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div className="text-red-500 text-sm font-medium">
                        {error}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {t('dna.edit.cancel', 'Cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isSaving ? <span className="animate-spin">⏳</span> : <Save size={18} />}
                            {t('dna.edit.save', 'Save DNA')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DNAEditModal;
