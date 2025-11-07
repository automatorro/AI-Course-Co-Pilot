import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';
import { Course, CourseStep } from '../types';
import { generateCourseContent, refineCourseContent } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { CheckCircle, Circle, Loader2, Sparkles, Wand, DownloadCloud, Heading1, Heading2, Bold, Italic, List, Save, Lightbulb, Pilcrow, Combine, BookOpen, ChevronRight } from 'lucide-react';
import { exportCourseAsZip } from '../services/exportService';
import { useToast } from '../contexts/ToastContext';
import ReviewChangesModal from '../components/ReviewChangesModal';

// A simple component to render Markdown content as HTML for the preview tab
const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderHtml = () => {
        let html = '';
        let inList = false;
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Handle headings, close list if active
            if (trimmedLine.startsWith('# ') || trimmedLine.startsWith('## ')) {
                if (inList) {
                    html += '</ul>\n';
                    inList = false;
                }
                if (trimmedLine.startsWith('## ')) {
                    html += `<h2>${line.substring(3)}</h2>\n`;
                } else {
                    html += `<h1>${line.substring(2)}</h1>\n`;
                }
                continue;
            }

            // Handle list items
            if (trimmedLine.startsWith('* ')) {
                if (!inList) {
                    html += '<ul>\n';
                    inList = true;
                }
                // Use original line substring to preserve indentation spaces in content
                html += `<li>${line.substring(line.indexOf('* ') + 2)}</li>\n`;
                continue;
            }

            // If we encounter a non-list item line, close the list
            if (inList) {
                html += '</ul>\n';
                inList = false;
            }
            
            // Render non-empty lines as paragraphs
            if (trimmedLine.length > 0) {
                 html += `<p>${line}</p>\n`;
            } else {
                 html += '<br />';
            }
        }

        // Close any open list at the end of the content
        if (inList) {
            html += '</ul>\n';
        }

        // Process inline elements on the whole block
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return html;
    };
    
    return (
        <div 
            className="prose dark:prose-invert max-w-none p-6" 
            dangerouslySetInnerHTML={{ __html: renderHtml() }} 
        />
    );
};

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
  const { showToast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
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
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<{ start: number, end: number }>({ start: 0, end: 0 });
  const aiActionsRef = useRef<HTMLDivElement>(null);

  const fetchCourseData = useCallback(async () => {
    if (!id) return null;
    
    const { data, error } = await supabase
        .from('courses')
        .select(`*, steps:course_steps(*)`)
        .eq('id', id)
        .single();
    
    if (error) {
        console.error("Error fetching course data:", error);
        showToast('Failed to load course data.', 'error');
        return null;
    }
    
    const sortedSteps = (data.steps || []).sort((a: CourseStep, b: CourseStep) => a.step_order - b.step_order);
    return { ...data, steps: sortedSteps };
  }, [id, showToast]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (aiActionsRef.current && !aiActionsRef.current.contains(event.target as Node)) {
            setIsAiActionsOpen(false);
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
        const firstIncompleteStep = courseData.steps.findIndex((s: CourseStep) => !s.is_completed);
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

    const stepUpdatePayload: { content: string, is_completed?: boolean } = { 
        content: editedContent 
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

    showToast('Changes saved successfully!', 'success');
    
    const updatedCourseData = await fetchCourseData();
    if (updatedCourseData) {
        setCourse(updatedCourseData);
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

  const handleFormat = (formatType: 'bold' | 'italic' | 'h1' | 'h2' | 'ul') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editedContent.substring(start, end);
    let newContent = editedContent;

    if (formatType === 'bold' || formatType === 'italic') {
        const syntax = formatType === 'bold' ? '**' : '*';
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
        }
        
        newContent = `${editedContent.substring(0, lineStartIdx)}${formatted}${editedContent.substring(effectiveEnd)}`;
    }
    setEditedContent(newContent);
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
    <div className="p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-1 flex-wrap">
        <button onClick={() => handleFormat('h1')} title={t('course.editor.toolbar.h1')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Heading1 size={18} /></button>
        <button onClick={() => handleFormat('h2')} title={t('course.editor.toolbar.h2')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Heading2 size={18} /></button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button onClick={() => handleFormat('bold')} title={t('course.editor.toolbar.bold')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Bold size={18} /></button>
        <button onClick={() => handleFormat('italic')} title={t('course.editor.toolbar.italic')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><Italic size={18} /></button>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button onClick={() => handleFormat('ul')} title={t('course.editor.toolbar.list')} disabled={!canEdit} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><List size={18} /></button>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {isHelpModalOpen && <HelpModal onClose={handleCloseHelpModal} />}
      {proposedContent !== null && originalForProposal !== null && (
          <ReviewChangesModal 
              originalContent={originalForProposal}
              proposedContent={proposedContent}
              onAccept={handleAcceptChanges}
              onReject={handleRejectChanges}
          />
      )}

      {/* Sidebar */}
      <aside className="w-1/4 max-w-sm p-6 bg-white dark:bg-gray-800/50 border-r dark:border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{course.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('course.workspace.title')}</p>
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
      <main className="flex-1 flex flex-col p-6 lg:p-10">
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t(currentStep.title_key)}</h1>
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
                                className="w-full h-full p-5 text-base bg-transparent border-none focus:ring-0 resize-none dark:placeholder-gray-500 disabled:opacity-50"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <SimpleMarkdownRenderer content={editedContent} />
                    </div>
                )}
            </div>

            <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
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
    </div>
  );
};

export default CourseWorkspacePage;