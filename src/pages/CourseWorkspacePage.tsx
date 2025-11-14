import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { Course, CourseStep } from '../types';
import { generateCourseContent, refineCourseContent } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { CheckCircle, Circle, Loader2, Sparkles, Wand, DownloadCloud, Heading1, Heading2, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Code, Minus, Link as LinkIcon, Image as ImageIcon, Save, Lightbulb, Pilcrow, Combine, BookOpen, ChevronRight, X, ListTodo, Grid2x2, ArrowLeft } from 'lucide-react';
import { exportCourseAsZip } from '../services/exportService';
import { replaceBlobUrlsWithPublic, uploadBlobToStorage } from '../services/imageService';
import { useToast } from '../contexts/ToastContext';
import ReviewChangesModal from '../components/ReviewChangesModal';
import ImageStudioModal from '../components/ImageStudioModal';

import MarkdownPreview from '../components/MarkdownPreview';

const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();
    const helpItems = [
        { title: t('course.helpModal.step1.title'), desc: t('course.helpModal.step1.desc'), icon: BookOpen },
        { title: t('course.helpModal.step2.title'), desc: t('course.helpModal.step2.desc'), icon: Sparkles },
        { title: t('course.helpModal.step3.title'), desc: t('course.helpModal.step3.desc'), icon: Wand },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s'}}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                <div className="p-6 text-center border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold">{t('course.helpModal.title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('course.helpModal.intro')}</p>
                </div>
                <div className="p-8 space-y-6">
                    {helpItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-full h-10 w-10 flex items-center justify-center">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 flex items-center gap-2">
                        {t('course.helpModal.button')} <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};


const CourseWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [userCourses, setUserCourses] = useState<Array<{ id: string; title: string }>>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProposingChanges, setIsProposingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isAiActionsOpen, setIsAiActionsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [proposedContent, setProposedContent] = useState<string | null>(null);
  const [originalForProposal, setOriginalForProposal] = useState<string | null>(null);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [showTablePanel, setShowTablePanel] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkUrlValid, setLinkUrlValid] = useState(true);
  const [imageUrlValid, setImageUrlValid] = useState(true);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showImageStudio, setShowImageStudio] = useState(false);
  const [imageMap, setImageMap] = useState<Record<string, { previewUrl?: string; publicUrl?: string; alt?: string }>>({});
  // Local image upload state
  const [localImageFile, setLocalImageFile] = useState<File | null>(null);
const [localImageMode, setLocalImageMode] = useState<'data' | 'blob' | 'upload'>('upload');
  const [localImageError, setLocalImageError] = useState<string | null>(null);

  // Import document state (DOCX/TXT/PDF prototype)
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<{ start: number, end: number }>({ start: 0, end: 0 });
  const aiActionsRef = useRef<HTMLDivElement>(null);
  const linkPanelRef = useRef<HTMLDivElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const tablePanelRef = useRef<HTMLDivElement>(null);

  // Helper functions for image token system
  const genImageId = useCallback(() => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`, []);

  const resolveTokensForPreview = useCallback((md: string) => {
    return md.replace(/!\[([^\]]*)\]\(@img\{([^}]+)\}\)/g, (m, alt, id) => {
      const entry = imageMap[id];
      const url = entry?.publicUrl || entry?.previewUrl || '';
      const safeAlt = (alt || entry?.alt || 'Image').trim();
      if (!url) return `![${safeAlt}](data:image/gif;base64,R0lGODlhAQABAAAAACw=)`;
      return `![${safeAlt}](${url})`;
    });
  }, [imageMap]);

  // Process @img tokens and upload images to storage, replacing tokens with public URLs
  const processImageTokensForSave = useCallback(async (md: string) => {
    let processed = md;
    const tokenMatches = [...md.matchAll(/!\[([^\]]*)\]\(@img\{([^}]+)\}\)/g)];
    
    for (const match of tokenMatches) {
      const [fullMatch, altText, tokenId] = match;
      const entry = imageMap[tokenId];
      
      if (entry?.previewUrl && !entry.publicUrl) {
        try {
          let blob: Blob;
          
          if (entry.previewUrl.startsWith('data:')) {
            // Convert data URL to blob
            const parts = entry.previewUrl.split(',');
            const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
            const bstr = atob(parts[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            blob = new Blob([u8arr], { type: mime });
          } else if (entry.previewUrl.startsWith('blob:')) {
            // Fetch blob URL
            const res = await fetch(entry.previewUrl);
            if (!res.ok) continue;
            blob = await res.blob();
          } else {
            continue;
          }
          
          // Upload to storage
          const publicUrl = await uploadBlobToStorage(blob, user?.id || null, course?.id || null, altText);
          
          // Update imageMap with public URL
          setImageMap(prev => ({
            ...prev,
            [tokenId]: { ...prev[tokenId], publicUrl }
          }));
          
          // Replace token with public URL in content
          processed = processed.replace(fullMatch, `![${altText || entry.alt || 'Image'}](${publicUrl})`);
        } catch (error) {
          console.error('Failed to upload image token:', error);
          // Leave token as-is if upload fails
        }
      } else if (entry?.publicUrl) {
        // Already has public URL, just replace token
        processed = processed.replace(fullMatch, `![${altText || entry.alt || 'Image'}](${entry.publicUrl})`);
      }
    }
    
    return processed;
  }, [imageMap, user?.id, course?.id]);

const ACCEPTED_IMAGE_TYPES = ['image/png','image/jpeg','image/jpg','image/gif','image/webp'];
  const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

  const fetchCourseData = useCallback(async () => {
    if (!id || !user) return null;
    const { data, error } = await supabase
        .from('courses')
        .select(`*, steps:course_steps(*)`)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
    if (error) {
        console.error('Error fetching course data:', error);
        showToast('Failed to load course data.', 'error');
        return null;
    }
    const sortedSteps = (data?.steps || []).sort((a: CourseStep, b: CourseStep) => a.step_order - b.step_order);
    return { ...data, steps: sortedSteps } as Course;
  }, [id, user, showToast]);

  useEffect(() => {
    const loadUserCourses = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching user courses:', error);
        return;
      }
      setUserCourses((data || []).map(c => ({ id: c.id as string, title: c.title as string })));
    };
    loadUserCourses();
  }, [user]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const targetNode = event.target as Node;
        if (aiActionsRef.current && !aiActionsRef.current.contains(targetNode)) {
            setIsAiActionsOpen(false);
        }
        if (linkPanelRef.current && !linkPanelRef.current.contains(targetNode)) {
            setShowLinkPanel(false);
        }
        if (imagePanelRef.current && !imagePanelRef.current.contains(targetNode)) {
            setShowImagePanel(false);
        }
        if (tablePanelRef.current && !tablePanelRef.current.contains(targetNode)) {
            setShowTablePanel(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
      const hasSeenHelp = localStorage.getItem('hasSeenWorkspaceHelp');
      if (hasSeenHelp !== 'true') {
          setIsHelpModalOpen(true);
      }
  }, []);
  
  const handleCloseHelpModal = () => {
      setIsHelpModalOpen(false);
      localStorage.setItem('hasSeenWorkspaceHelp', 'true');
  };

  useEffect(() => {
    let isMounted = true;
    const loadCourse = async () => {
      setIsLoading(true);
      const courseData = await fetchCourseData();
      if (isMounted && courseData) {
        setCourse(courseData);
        const stepsArr = courseData.steps ?? [];
        const firstIncompleteStep = stepsArr.findIndex((s: CourseStep) => !s.is_completed);
        setActiveStepIndex(firstIncompleteStep >= 0 ? firstIncompleteStep : 0);
      }
      if(isMounted) setIsLoading(false);
    };
    loadCourse();
    return () => { isMounted = false; };
  }, [fetchCourseData]);
  
  const originalContentForStep = course?.steps?.[activeStepIndex]?.content ?? '';

  useEffect(() => {
    setEditedContent(originalContentForStep);
  }, [originalContentForStep]);

  // Asigură resetarea editorului imediat ce se schimbă pasul activ
  useEffect(() => {
    const nextContent = course?.steps?.[activeStepIndex]?.content ?? '';
    setEditedContent(nextContent);
  }, [activeStepIndex]);

  const hasUnsavedChanges = editedContent !== originalContentForStep;

  const handleGenerate = useCallback(async () => {
    if (!course || !course.steps) return;
    setIsGenerating(true);
    const currentStep = course.steps[activeStepIndex];
    const generatedContent = await generateCourseContent(course, currentStep);
    setEditedContent(generatedContent);
    setIsGenerating(false);
  }, [course, activeStepIndex]);

  const handleAiAction = async (actionType: 'simplify' | 'expand' | 'example') => {
    if (!course || !course.steps || !editedContent) return;
    setIsAiActionsOpen(false);
    setIsProposingChanges(true);

    const currentStep = course.steps[activeStepIndex];
    const contentToRefine = selectedText ? selectedText : editedContent;
    setOriginalForProposal(contentToRefine);

    const refinedText = await refineCourseContent(course, currentStep, editedContent, selectedText, actionType);
    
    setProposedContent(refinedText);
    setIsProposingChanges(false);
  };

  const handleAcceptChanges = () => {
      if (proposedContent === null) return;
      
      if (selectedText && selectionRef.current.end > selectionRef.current.start) {
          const { start, end } = selectionRef.current;
          const newContent = editedContent.substring(0, start) + proposedContent + editedContent.substring(end);
          setEditedContent(newContent);
      } else {
          setEditedContent(proposedContent);
      }
      
      setProposedContent(null);
      setOriginalForProposal(null);
      setSelectedText('');
      selectionRef.current = { start: 0, end: 0 };
  };

  const handleRejectChanges = () => {
      setProposedContent(null);
      setOriginalForProposal(null);
  };

  const handleSaveChanges = async (andContinue = false) => {
    if (!course || !course.steps) return;
    setIsSaving(true);
    
    const currentStep = course.steps[activeStepIndex];
    const isCompletingStep = andContinue && !currentStep.is_completed;

    // Convert any blob: URLs to public Storage URLs before saving
    // Process image tokens first, then convert any remaining blob: URLs to public Storage URLs before saving
    const contentWithProcessedTokens = await processImageTokensForSave(editedContent);
    const processedContent = await replaceBlobUrlsWithPublic(contentWithProcessedTokens, user?.id || null, course?.id || null);

    const stepUpdatePayload: { content: string, is_completed?: boolean } = { 
        content: processedContent 
    };
    if (isCompletingStep) {
        stepUpdatePayload.is_completed = true;
    }

    const { error: stepError } = await supabase
      .from('course_steps')
      .update(stepUpdatePayload)
      .eq('id', currentStep.id);
      
    if (stepError) {
      console.error("Error updating step:", stepError);
      showToast('Failed to save changes.', 'error');
      setIsSaving(false);
      return;
    }

    // Reflect processed content back into editor
    setEditedContent(processedContent);
    showToast('Changes saved successfully!', 'success');
    
    const updatedCourseData = await fetchCourseData();
    if (updatedCourseData) {
        setCourse(updatedCourseData);
        // Actualizează progresul cursului în funcție de pașii completați
        const total = (updatedCourseData.steps ?? []).length;
        const done = (updatedCourseData.steps ?? []).filter(s => s.is_completed).length;
        const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;
        try {
          await supabase
            .from('courses')
            .update({ progress: progressPct })
            .eq('id', updatedCourseData.id);
          // Reflectă progresul și local
          setCourse(prev => prev ? { ...prev, progress: progressPct } : prev);
        } catch (e) {
          console.warn('Progress update failed:', e);
        }
    }
    
    if (isCompletingStep && activeStepIndex < course.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
    setIsSaving(false);
  };

  const handleDownload = async () => {
    if (!course) return;
    setIsDownloading(true);
    try {
        await exportCourseAsZip(course, t);
    } catch (error) {
        console.error("Failed to export course:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  const handleFormat = (formatType: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'codeblock' | 'blockquote' | 'hr' | 'h1' | 'h2' | 'ul' | 'ol' | 'link' | 'image' | 'task' | 'table') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editedContent.substring(start, end);
    let newContent = editedContent;

    if (formatType === 'link') {
        setShowImagePanel(false);
        setShowTablePanel(false);
        setLinkText(selected);
        setLinkUrl('');
        setLinkUrlValid(true);
        setShowLinkPanel(true);
        return;
    } else if (formatType === 'image') {
        setShowLinkPanel(false);
        setShowTablePanel(false);
        setImageAlt(selected || 'Image');
        setImageUrl('');
        setImageUrlValid(true);
        setShowImagePanel(true);
        return;
    } else if (formatType === 'table') {
        setShowLinkPanel(false);
        setShowImagePanel(false);
        setTableRows(3);
        setTableCols(3);
        setShowTablePanel(true);
        return;
    } else if (formatType === 'bold' || formatType === 'italic' || formatType === 'strike' || formatType === 'code') {
        const syntax = formatType === 'bold' ? '**' : formatType === 'italic' ? '*' : formatType === 'strike' ? '~~' : '`';
        newContent = `${editedContent.substring(0, start)}${syntax}${selected}${syntax}${editedContent.substring(end)}`;
    } else {
        const lineStartIdx = editedContent.lastIndexOf('\n', start - 1) + 1;
        const lineEndIdx = editedContent.indexOf('\n', end);
        const effectiveEnd = lineEndIdx === -1 ? editedContent.length : lineEndIdx;
        const linesText = editedContent.substring(lineStartIdx, effectiveEnd);
        const lines = linesText.split('\n');

        let formatted = '';
        if (formatType === 'h1' || formatType === 'h2') {
            const prefix = formatType === 'h1' ? '# ' : '## ';
            formatted = prefix + lines[0];
            if (lines.length > 1) formatted += '\n' + lines.slice(1).join('\n');
        } else if (formatType === 'ul') {
            formatted = lines.map(line => `* ${line}`).join('\n');
        } else if (formatType === 'ol') {
            formatted = lines.map((line, idx) => `${idx + 1}. ${line}`).join('\n');
        } else if (formatType === 'task') {
            formatted = lines.map(line => `- [ ] ${line}`).join('\n');
        } else if (formatType === 'blockquote') {
            formatted = lines.map(line => `> ${line}`).join('\n');
        } else if (formatType === 'codeblock') {
            formatted = '```\n' + lines.join('\n') + '\n```';
        } else if (formatType === 'hr') {
            formatted = '---';
        } else if (formatType === 'underline') {
            // Markdown nu are underline nativ; folosim tag HTML
            formatted = `<u>${lines.join('\n')}</u>`;
        }
        newContent = `${editedContent.substring(0, lineStartIdx)}${formatted}${editedContent.substring(effectiveEnd)}`;
    }
    setEditedContent(newContent);
    setTimeout(() => textarea.focus(), 0);
  };

  const handleSubmitLink = () => {
    if (!textareaRef.current) return;
    const urlPattern = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\.~:\/?#\[\]@!$&'()*+,;=%]*)?$/i;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editedContent.substring(start, end);
    const text = selected && selected.length > 0 ? selected : (linkText || 'Link');
    const url = linkUrl.trim();
    const valid = urlPattern.test(url);
    setLinkUrlValid(valid);
    if (!url || !valid) { return; }
    const insert = `[${text}](${url})`;
    const newContent = `${editedContent.substring(0, start)}${insert}${editedContent.substring(end)}`;
    setEditedContent(newContent);
    setShowLinkPanel(false);
    setTimeout(() => textarea.focus(), 0);
  };

  const handleSubmitImage = () => {
    if (!textareaRef.current) return;
    const urlPattern = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\.~:\/?#\[\]@!$&'()*+,;=%]*)?$/i;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const alt = imageAlt?.trim() || 'Image';
    const url = imageUrl.trim();
    const valid = urlPattern.test(url);
    setImageUrlValid(valid);
    if (!url || !valid) { return; }
    const insert = `![${alt}](${url})`;
    const newContent = `${editedContent.substring(0, start)}${insert}${editedContent.substring(end)}`;
    setEditedContent(newContent);
    setShowImagePanel(false);
    setTimeout(() => textarea.focus(), 0);
  };

  const insertImageAtCursor = (url: string, alt: string = 'Image') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const safeAlt = alt?.trim() || 'Image';
    let insert = '';
    
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const id = genImageId();
      setImageMap(prev => ({ ...prev, [id]: { previewUrl: url, alt: safeAlt } }));
      insert = `![${safeAlt}](@img{${id}})`;
    } else {
      insert = `![${safeAlt}](${url})`;
    }
    const newContent = `${editedContent.substring(0, start)}${insert}${editedContent.substring(end)}`;
    setEditedContent(newContent);
    setTimeout(() => textarea.focus(), 0);
  };

  

  const handleLocalImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] || null;
    setLocalImageError(null);
    setLocalImageFile(null);
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setLocalImageError('Tip de fișier neacceptat. Folosește PNG, JPEG, GIF sau WEBP.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setLocalImageError('Fișier prea mare. Limita este 8MB.');
      return;
    }
    setLocalImageFile(file);
    const doInsert = async () => {
      if (!textareaRef.current) return;
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const alt = imageAlt?.trim() || file.name || 'Image';
      try {
        const dataUrl = await fileToDataURL(file);
        const insert = `![${alt}](${dataUrl})`;
        const newContent = `${editedContent.substring(0, start)}${insert}${editedContent.substring(end)}`;
        setEditedContent(newContent);
        setShowImagePanel(false);
        setTimeout(() => textarea.focus(), 0);
        uploadAndReplaceDataUrl(dataUrl);
      } catch {
        setLocalImageError('Nu am putut procesa imaginea. Încearcă din nou.');
      }
    };
    doInsert();
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Eroare la citirea fișierului.'));
      reader.readAsDataURL(file);
    });
  };

  const handleInsertLocalImage = async () => {
    if (!textareaRef.current || !localImageFile) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const alt = imageAlt?.trim() || localImageFile.name || 'Image';
    try {
      let url: string;
      if (localImageMode === 'upload') {
        // Upload to Supabase Storage and insert public URL
        const BUCKET = 'course-assets';
        const fileExt = localImageFile.name.split('.').pop()?.toLowerCase() || 'png';
        const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const path = `${user?.id || 'anonymous'}/${course?.id || 'course'}/${uniqueName}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, localImageFile, { contentType: localImageFile.type, upsert: false });
        if (uploadError) {
          console.error('Upload image error:', uploadError);
          setLocalImageError((uploadError.message || 'Upload eșuat. Verifică configurația Storage.') + ' — Inserăm ca Data URL.');
          // Fallback: create blob URL for token system
          url = URL.createObjectURL(localImageFile);
        } else {
          const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
          url = pub.publicUrl;
        }
      } else if (localImageMode === 'blob') {
        // For reliable preview, convert blob to Data URL at insert time
        // This keeps the UX consistent: immediate render in Preview tab
        url = URL.createObjectURL(localImageFile);
      } else {
        url = URL.createObjectURL(localImageFile);
      }
      // Use insertImageAtCursor which will handle token creation
      insertImageAtCursor(url, alt);
      return; // Exit early since insertImageAtCursor handles everything
      // Restul este gestionat de insertImageAtCursor
      setEditedContent(newContent);
      setShowImagePanel(false);
      setTimeout(() => textarea.focus(), 0);
    } catch (err) {
      setLocalImageError('Nu am putut procesa imaginea. Încearcă din nou.');
    }
  };

  // =============================
  // Document Import (Prototype)
  // =============================
  const handleImportFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] || null;
    setImportFile(file);
    setImportError(null);
  };

  const processImportDocument = async () => {
    if (!importFile || !course || !user) return;
    setImporting(true);
    setImportError(null);
    try {
      const arrayBuffer = await importFile.arrayBuffer();
      const ext = importFile.name.toLowerCase().split('.').pop() || '';
      let steps: { title_key: string; content: string }[] = [];

      if (ext === 'docx') {
        steps = await parseDocxToSteps(arrayBuffer);
      } else if (ext === 'txt') {
        const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
        steps = parseTxtToSteps(text);
      } else if (ext === 'pdf') {
        steps = await parsePdfToSteps(arrayBuffer);
      } else {
        throw new Error('Format neacceptat. Accept: .docx, .txt, .pdf');
      }

      if (steps.length === 0) throw new Error('Nu s-au identificat pași din document.');

      const newStepsPayload = steps.map((s, idx) => ({
        course_id: course.id,
        user_id: user.id,
        title_key: s.title_key,
        content: s.content,
        is_completed: false,
        step_order: (course.steps?.length || 0) + idx + 1,
      }));

      const { error: stepsError } = await supabase.from('course_steps').insert(newStepsPayload);
      if (stepsError) throw stepsError;

      showToast('Import reușit: pașii au fost adăugați.', 'success');
      setImportFile(null);
      setCourse(prev => prev ? {
        ...prev,
        steps: [...(prev.steps || []), ...newStepsPayload.map(s => ({ ...s, id: '', created_at: new Date().toISOString() }))],
      } : prev);
    } catch (err: any) {
      console.error('Import error:', err);
      setImportError(err.message || 'A apărut o eroare la import.');
      showToast('Import nereușit.', 'error');
    } finally {
      setImporting(false);
    }
  };

  const parseDocxToSteps = async (arrayBuffer: ArrayBuffer): Promise<{ title_key: string; content: string }[]> => {
    try {
      const mammothLib: any = await import('mammoth');
      const result = await mammothLib.convertToHtml({ arrayBuffer });
      const html: string = result.value || '';
      const md = htmlToSimpleMarkdown(html);
      return splitMarkdownIntoSteps(md, 'course.steps.manual');
    } catch (e) {
      console.warn('DOCX parse fallback:', e);
      const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
      return [{ title_key: 'course.steps.manual', content: text }];
    }
  };

  const parsePdfToSteps = async (arrayBuffer: ArrayBuffer): Promise<{ title_key: string; content: string }[]> => {
    try {
      const pdfjsLib: any = await import('pdfjs-dist');
      // Configure worker for performance
      try {
        const workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
        if (pdfjsLib?.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        }
      } catch { /* best-effort; continue */ }
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const steps: { title_key: string; content: string }[] = [];
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((i: any) => (i.str || '')).join(' ').replace(/\s+/g, ' ').trim();
        const chunkSize = 5000;
        if (pageText.length <= chunkSize) {
          const content = `# Slide ${p}\n\n${pageText}`;
          steps.push({ title_key: 'course.steps.slides', content });
        } else {
          let idx = 0; let chunkIndex = 1;
          while (idx < pageText.length) {
            const chunk = pageText.slice(idx, idx + chunkSize);
            const content = `# Slide ${p} • Parte ${chunkIndex}\n\n${chunk}`;
            steps.push({ title_key: 'course.steps.slides', content });
            idx += chunkSize; chunkIndex += 1;
          }
        }
      }
      return steps;
    } catch (e) {
      console.warn('PDF parse failed:', e);
      throw new Error('Nu am potut procesa PDF-ul. Verifică fișierul sau încearcă altul.');
    }
  };

  const parseTxtToSteps = (text: string): { title_key: string; content: string }[] => {
    const sections = text.split(/\n(?=##\s)/g).filter(s => s.trim().length > 0);
    if (sections.length === 0) {
      return [{ title_key: 'course.steps.manual', content: text }];
    }
    return sections.map(s => ({ title_key: 'course.steps.manual', content: s }));
  };

  const htmlToSimpleMarkdown = (html: string): string => {
    return html
      .replace(/<h1[^>]*>/gi, '# ').replace(/<\/h1>/gi, '\n\n')
      .replace(/<h2[^>]*>/gi, '## ').replace(/<\/h2>/gi, '\n\n')
      .replace(/<h3[^>]*>/gi, '### ').replace(/<\/h3>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<ul[^>]*>/gi, '').replace(/<\/ul>/gi, '')
      .replace(/<ol[^>]*>/gi, '').replace(/<\/ol>/gi, '')
      .replace(/<li[^>]*>/gi, '- ').replace(/<\/li>/gi, '\n')
      .replace(/<strong[^>]*>/gi, '**').replace(/<\/strong>/gi, '**')
      .replace(/<b[^>]*>/gi, '**').replace(/<\/b>/gi, '**')
      .replace(/<em[^>]*>/gi, '*').replace(/<\/em>/gi, '*')
      .replace(/<i[^>]*>/gi, '*').replace(/<\/i>/gi, '*')
      .replace(/<[^>]+>/g, '')
      .trim();
  };

  const splitMarkdownIntoSteps = (md: string, titleKey: string): { title_key: string; content: string }[] => {
    const parts = md.split(/\n(?=##\s)/g).filter(p => p.trim().length > 0);
    if (parts.length === 0) return [{ title_key: titleKey, content: md }];
    return parts.map(p => ({ title_key: titleKey, content: p }));
  };

  const handleSubmitTable = () => {
    if (!textareaRef.current) return;
    const rows = Math.max(1, Math.min(20, Number(tableRows) || 1));
    const cols = Math.max(1, Math.min(10, Number(tableCols) || 1));
    const header = Array.from({ length: cols }, (_, i) => `Col ${i + 1}`).join(' | ');
    const sep = Array.from({ length: cols }, () => '---').join(' | ');
    const bodyRows = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ' ').join(' | ')).join('\n');
    const tableMd = `${header}\n${sep}\n${bodyRows}\n`;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = `${editedContent.substring(0, start)}${tableMd}${editedContent.substring(end)}`;
    setEditedContent(newContent);
    setShowTablePanel(false);
    setTimeout(() => textarea.focus(), 0);
  };
  
  const handleSelect = () => {
      if (!textareaRef.current) return;
      const { selectionStart, selectionEnd } = textareaRef.current;
      selectionRef.current = { start: selectionStart, end: selectionEnd };
      setSelectedText(editedContent.substring(selectionStart, selectionEnd));
  };
  
  const currentStep = course?.steps?.[activeStepIndex];

  if (isLoading || !course || !currentStep) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary-500" size={32}/></div>;
  }
  
  const isLastStep = activeStepIndex === ((course.steps?.length ?? 0) - 1);
  const isCourseComplete = (course.steps ?? []).every(s => s.is_completed);
  const isBusy = isGenerating || isProposingChanges;
  const canEdit = !isBusy;
  const canGenerateOrRefine = canEdit && !currentStep.is_completed;

  const EditorToolbar = () => (
    <div className="relative p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-1 flex-wrap">
        <button onClick={() => handleFormat('h1')} title={t('course.editor.toolbar.h1')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Heading1 size={18} /></button>
        <button onClick={() => handleFormat('h2')} title={t('course.editor.toolbar.h2')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Heading2 size={18} /></button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button onClick={() => handleFormat('bold')} title={t('course.editor.toolbar.bold')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Bold size={18} /></button>
        <button onClick={() => handleFormat('italic')} title={t('course.editor.toolbar.italic')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Italic size={18} /></button>
        <button onClick={() => handleFormat('underline')} title="Underline" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><Underline size={18} /></button>
        <button onClick={() => handleFormat('strike')} title="Strikethrough" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><Strikethrough size={18} /></button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button onClick={() => handleFormat('ul')} title={t('course.editor.toolbar.list')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><List size={18} /></button>
        <button onClick={() => handleFormat('ol')} title="Ordered list" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><ListOrdered size={18} /></button>
        <button onClick={() => handleFormat('task')} title="Task list" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><ListTodo size={18} /></button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button onClick={() => handleFormat('blockquote')} title="Quote" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Quote size={18} /></button>
        <button onClick={() => handleFormat('code')} title="Inline code" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Code size={18} /></button>
        <button onClick={() => handleFormat('codeblock')} title="Code block" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><Code size={18} /></button>
        <button onClick={() => handleFormat('hr')} title="Horizontal rule" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><Minus size={18} /></button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button onClick={() => handleFormat('link')} title="Insert link" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><LinkIcon size={18} /></button>
        <button onClick={() => handleFormat('image')} title="Insert image" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><ImageIcon size={18} /></button>
        <button onClick={() => setShowImageStudio(true)} title="Image Studio (AI)" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><Sparkles size={18} /></button>
        <button onClick={() => handleFormat('table')} title="Insert table" disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 hide-tiny"><Grid2x2 size={18} /></button>

        {showLinkPanel && (
          <div
            ref={linkPanelRef}
            className="fixed left-3 right-3 top-20 bottom-[env(safe-area-inset-bottom)] sm:absolute sm:top-full sm:left-2 sm:right-auto sm:bottom-auto sm:mt-2 sm:w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-3 z-50 panel-scroll"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Insert Link</span>
              <button onClick={() => setShowLinkPanel(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text</label>
                <input value={linkText} onChange={(e) => setLinkText(e.target.value)} className="w-full px-3 py-2 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-900" placeholder="Ex: Documentație" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL</label>
                <input value={linkUrl} onChange={(e) => { setLinkUrl(e.target.value); setLinkUrlValid(true); }} className={`w-full px-3 py-2 text-sm rounded border bg-white dark:bg-gray-900 ${linkUrlValid ? 'dark:border-gray-700' : 'border-red-500 dark:border-red-500'}`} placeholder="https://..." />
                {!linkUrlValid && (<p className="mt-1 text-xs text-red-600">Introduce un URL valid care începe cu http(s)://</p>)}
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => setShowLinkPanel(false)} className="px-3 py-1.5 text-sm rounded border dark:border-gray-700">Cancel</button>
                <button onClick={handleSubmitLink} disabled={!linkUrl || !/^https?:\/\//i.test(linkUrl)} className="px-3 py-1.5 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">Insert</button>
              </div>
            </div>
          </div>
        )}

        {showImagePanel && (
          <div
            ref={imagePanelRef}
            className="fixed left-3 right-3 top-20 bottom-[env(safe-area-inset-bottom)] sm:absolute sm:top-full sm:left-2 sm:right-auto sm:bottom-auto sm:mt-2 sm:w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-3 z-50 panel-scroll"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Insert Image</span>
              <button onClick={() => setShowImagePanel(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Alt text</label>
                <input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className="w-full px-3 py-2 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-900" placeholder="Ex: Diagrama arhitectură" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL</label>
                <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageUrlValid(true); }} className={`w-full px-3 py-2 text-sm rounded border bg-white dark:bg-gray-900 ${imageUrlValid ? 'dark:border-gray-700' : 'border-red-500 dark:border-red-500'}`} placeholder="https://..." />
                {!imageUrlValid && (<p className="mt-1 text-xs text-red-600">Introduce un URL valid care începe cu http(s)://</p>)}
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => setShowImagePanel(false)} className="px-3 py-1.5 text-sm rounded border dark:border-gray-700">Cancel</button>
                <button onClick={handleSubmitImage} disabled={!imageUrl || !/^https?:\/\//i.test(imageUrl)} className="px-3 py-1.5 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">Insert</button>
              </div>

              <div className="pt-3 border-t dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Sau încarcă imagine locală (PNG, JPEG, GIF, WEBP):</p>
                <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleLocalImageChange} className="w-full text-sm" />
                {localImageFile && (
                  <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                    Selectat: {localImageFile.name} ({Math.round(localImageFile.size/1024)} KB)
                  </div>
                )}
                {localImageError && (
                  <div className="mt-2 text-xs text-red-600">{localImageError}</div>
                )}
                <p className="text-[11px] mt-1 text-gray-500 dark:text-gray-400">Selectează un fișier și imaginea apare imediat. Se salvează automat în cloud în fundal, iar conținutul se actualizează cu link public.</p>
              </div>
            </div>
          </div>
        )}

        {showTablePanel && (
          <div ref={tablePanelRef} className="absolute top-full left-2 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-3 z-30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Insert Table</span>
              <button onClick={() => setShowTablePanel(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Rows</label>
                <input type="number" min={1} max={20} value={tableRows} onChange={(e) => setTableRows(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-900" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Columns</label>
                <input type="number" min={1} max={10} value={tableCols} onChange={(e) => setTableCols(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-900" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowTablePanel(false)} className="px-3 py-1.5 text-sm rounded border dark:border-gray-700">Cancel</button>
              <button onClick={handleSubmitTable} className="px-3 py-1.5 text-sm rounded bg-primary-600 text-white hover:bg-primary-700">Insert</button>
            </div>
          </div>
        )}
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-x-hidden">
      {isHelpModalOpen && <HelpModal onClose={handleCloseHelpModal} />}
      {proposedContent !== null && originalForProposal !== null && (
          <ReviewChangesModal 
              originalContent={originalForProposal}
              proposedContent={proposedContent}
              onAccept={handleAcceptChanges}
              onReject={handleRejectChanges}
          />
      )}
      {showImageStudio && (
        <ImageStudioModal
          onClose={() => setShowImageStudio(false)}
          onInsert={(url, alt) => insertImageAtCursor(url, alt)}
        />
      )}

      {/* Sidebar */}
      <aside className="hidden lg:block w-1/4 max-w-sm p-6 bg-white dark:bg-gray-800/50 border-r dark:border-gray-700 overflow-y-auto">
        <div className="flex items-center justify-between mb-2 gap-3">
          <h2 className="text-xl font-bold truncate">{course.title}</h2>
        </div>
        {userCourses.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Schimbă cursul</label>
            <select
              value={course.id}
              onChange={(e) => {
                const nextId = e.target.value;
                window.location.hash = `#/course/${nextId}`;
              }}
              className="w-full px-3 py-2 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              {userCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('course.workspace.title')}</p>
        <div className="mb-6 p-3 card-premium">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Importă document</span>
          </div>
          <div className="mt-2 space-y-2">
            <input type="file" accept=".docx,.txt,.pdf" onChange={handleImportFileChange} className="w-full text-sm input-premium" />
            {importFile && (
              <div className="text-xs text-gray-600 dark:text-gray-400">Fișier selectat: {importFile.name}</div>
            )}
            {importError && (
              <div className="text-xs text-red-600">{importError}</div>
            )}
            <button
              className="btn-premium text-sm disabled:opacity-50"
              onClick={processImportDocument}
              disabled={!importFile || importing}
            >
              {importing ? 'Import în curs...' : 'Importă în pași'}
            </button>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">Acceptă .docx, .txt (secțiuni "## "), .pdf (prototip).</div>
          </div>
        </div>
        <nav>
          <ul>
            {(course.steps ?? []).map((step, index) => (
              <li key={step.id}>
                <button 
                  onClick={() => setActiveStepIndex(index)}
                  disabled={index > 0 && !((course.steps ?? [])[index - 1]?.is_completed)}
                  className={`w-full text-left p-3 my-1 rounded-lg flex items-center gap-3 transition-colors ${
                    activeStepIndex === index 
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {step.is_completed ? <CheckCircle className="text-green-500" size={20}/> : <Circle className="text-gray-400" size={20} />}
                  <span className="font-medium">{t(step.title_key)}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 lg:p-10 pb-24 sm:pb-10">
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <button 
                    onClick={() => window.location.href = '/#/dashboard'} 
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2" 
                    title="Înapoi la cursurile mele"
                    aria-label="Înapoi la dashboard"
                >
                    <ArrowLeft size={18} />
                </button>
                <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsSidebarOpen(true)} aria-label="Deschide pașii">
                    <ListTodo size={18} />
                </button>
                <h1 className="text-lg sm:text-2xl font-bold">{t(currentStep.title_key)}</h1>
            </div>

            <div className="border-b dark:border-gray-700 px-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('editor')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'editor' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}`}>{t('course.editor.tab.editor')}</button>
                    <button onClick={() => setActiveTab('preview')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}`}>{t('course.editor.tab.preview')}</button>
                </nav>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
                {isBusy && (
                    <div className="absolute inset-1 bg-gray-100/50 dark:bg-gray-900/50 flex items-center justify-center z-20 rounded-lg">
                        <div className="text-center p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
                            <Loader2 className="animate-spin text-primary-500 mx-auto" size={40} />
                            <p className="mt-3 text-lg font-semibold">{isGenerating ? t('course.generating') : t('course.refine.button')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('course.generating.waitMessage')}</p>
                        </div>
                    </div>
                )}
                {activeTab === 'editor' ? (
                    <div className="flex-1 flex flex-col">
                        <EditorToolbar />
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={editedContent}
                                onSelect={handleSelect}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder={t('course.editor.placeholder')}
                                disabled={!canEdit}
                                className="w-full h-full p-4 sm:p-5 text-sm sm:text-base leading-relaxed bg-transparent border-none focus:ring-0 resize-none dark:placeholder-gray-500 disabled:opacity-50 break-words"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <MarkdownPreview content={resolveTokensForPreview(editedContent)} />
                    </div>
                )}
            </div>

            <div className="hidden sm:flex p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 justify-between items-center">
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={handleGenerate}
                        disabled={!canGenerateOrRefine}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 disabled:opacity-50"
                    >
                        <Sparkles size={16}/>
                        {t('course.generate')}
                    </button>
                    
                    <div ref={aiActionsRef} className="relative">
                        <button
                            onClick={() => setIsAiActionsOpen(prev => !prev)}
                            disabled={!canGenerateOrRefine || !editedContent}
                            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 disabled:opacity-50"
                            title={t('course.refine.tooltip')}
                        >
                            <Wand size={16}/>
                            {t('course.refine.button')}
                        </button>
                        {isAiActionsOpen && (
                             <div className="absolute bottom-full mb-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-30">
                                <button onClick={() => handleAiAction('simplify')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                    <Pilcrow size={16}/> {t('course.refine.simplify')}
                                </button>
                                <button onClick={() => handleAiAction('expand')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                    <Combine size={16}/> {t('course.refine.expand')}
                                </button>
                                <button onClick={() => handleAiAction('example')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                    <Lightbulb size={16}/> {t('course.refine.example')}
                                </button>
                             </div>
                        )}
                    </div>

                    {isCourseComplete && (
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {isDownloading ? <Loader2 className="animate-spin" size={16}/> : <DownloadCloud size={16}/>}
                            {t(isDownloading ? 'course.download.preparing' : 'course.download.button')}
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    {currentStep.is_completed && hasUnsavedChanges && (
                        <button
                            onClick={() => handleSaveChanges(false)}
                            disabled={isBusy || isSaving}
                            className="px-6 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                            {t('course.saveChanges')}
                        </button>
                    )}
                    {!currentStep.is_completed && (
                        <button
                        onClick={() => handleSaveChanges(true)}
                        disabled={isBusy || isSaving || !editedContent}
                        className="px-6 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
                        >
                        {isSaving && <Loader2 className="animate-spin inline-block mr-2" size={16}/>}
                        {isLastStep ? t('course.saveAndContinue').replace(' & Continue', '') : t('course.saveAndContinue')}
                        </button>
                    )}
                </div>
            </div>
        </div>
      </main>
      {/* Sticky mobile actions bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg safe-area-bottom">
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex gap-2 flex-1">
            <button
              onClick={handleGenerate}
              disabled={!canGenerateOrRefine}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 disabled:opacity-50"
            >
              <Sparkles size={16}/>
              {t('course.generate')}
            </button>
            <div ref={aiActionsRef} className="relative flex-1">
              <button
                onClick={() => setIsAiActionsOpen(prev => !prev)}
                disabled={!canGenerateOrRefine || !editedContent}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 disabled:opacity-50"
                title={t('course.refine.tooltip')}
              >
                <Wand size={16}/>
                {t('course.refine.button')}
              </button>
              {isAiActionsOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  <button onClick={() => handleAiAction('simplify')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                    <Pilcrow size={16}/> {t('course.refine.simplify')}
                  </button>
                  <button onClick={() => handleAiAction('expand')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                    <Combine size={16}/> {t('course.refine.expand')}
                  </button>
                  <button onClick={() => handleAiAction('example')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                    <Lightbulb size={16}/> {t('course.refine.example')}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {isCourseComplete ? (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                {isDownloading ? <Loader2 className="animate-spin" size={16}/> : <DownloadCloud size={16}/>} 
                {t(isDownloading ? 'course.download.preparing' : 'course.download.button')}
              </button>
            ) : currentStep.is_completed && hasUnsavedChanges ? (
              <button
                onClick={() => handleSaveChanges(false)}
                disabled={isBusy || isSaving}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                {t('course.saveChanges')}
              </button>
            ) : !currentStep.is_completed ? (
              <button
                onClick={() => handleSaveChanges(true)}
                disabled={isBusy || isSaving || !editedContent}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
              >
                {isSaving && <Loader2 className="animate-spin inline-block mr-2" size={16}/>} 
                <span className="hide-tiny">{isLastStep ? t('course.save') : t('course.saveAndContinue')}</span>
                <span className="show-tiny">{t('course.save')}</span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-5/6 max-w-xs bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { window.location.href = '/#/dashboard'; }} 
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
                  title="Înapoi la cursurile mele"
                  aria-label="Înapoi la dashboard"
                >
                  <ArrowLeft size={18} />
                </button>
                <h2 className="text-lg font-semibold truncate">{course?.title}</h2>
              </div>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Închide" onClick={() => setIsSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              {userCourses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Schimbă cursul</label>
                  <select
                    value={course?.id}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      window.location.hash = `#/course/${nextId}`;
                    }}
                    className="w-full px-3 py-2 text-sm rounded border dark:border-gray-700 bg-white dark:bg-gray-900"
                  >
                    {userCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6 p-3 card-premium">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Importă document</span>
                </div>
                <div className="mt-2 space-y-2">
                  <input type="file" accept=".docx,.txt,.pdf" onChange={handleImportFileChange} className="w-full text-sm input-premium" />
                  {importFile && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">Fișier selectat: {importFile.name}</div>
                  )}
                  {importError && (
                    <div className="text-xs text-red-600">{importError}</div>
                  )}
                  <button
                    className="btn-premium text-sm disabled:opacity-50 w-full"
                    onClick={processImportDocument}
                    disabled={!importFile || importing}
                  >
                    {importing ? 'Import în curs...' : 'Importă în pași'}
                  </button>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Acceptă .docx, .txt (secțiuni "## "), .pdf (prototip).</div>
                </div>
              </div>

              <nav>
                <ul>
                  {(course?.steps ?? []).map((step, index) => (
                    <li key={step.id}>
                      <button
                        onClick={() => { setActiveStepIndex(index); setIsSidebarOpen(false); }}
                        disabled={index > 0 && !((course?.steps ?? [])[index - 1]?.is_completed)}
                        className={`w-full text-left p-3 my-1 rounded-lg flex items-center gap-3 transition-colors ${
                          activeStepIndex === index
                            ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {step.is_completed ? <CheckCircle className="text-green-500" size={20}/> : <Circle className="text-gray-400" size={20} />}
                        <span className="font-medium">{t(step.title_key)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseWorkspacePage;
