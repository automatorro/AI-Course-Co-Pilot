

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';
import { Course, CourseStep } from '../types';
import { generateCourseContent, improveCourseContent } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { CheckCircle, Circle, Loader2, Sparkles, Wand } from 'lucide-react';


const CourseWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [hasBeenImproved, setHasBeenImproved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourseData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
        .from('courses')
        .select(`*, steps:course_steps(*)`)
        .eq('id', id)
        .single();
    
    if (error) {
        console.error("Error fetching course data:", error);
    } else {
        data.steps.sort((a: CourseStep, b: CourseStep) => a.step_order - b.step_order);
        setCourse(data as Course);
        const firstIncompleteStep = data.steps.findIndex((s: CourseStep) => !s.is_completed);
        const initialStepIndex = firstIncompleteStep >= 0 ? firstIncompleteStep : 0;
        setActiveStepIndex(initialStepIndex);
        setEditedContent(data.steps[initialStepIndex]?.content || '');
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    if (course) {
      setEditedContent(course.steps?.[activeStepIndex]?.content || '');
      setHasBeenImproved(false); // Reset improve state when step changes
    }
  }, [activeStepIndex, course]);

  const handleGenerate = useCallback(async () => {
    if (!course || !course.steps) return;
    setIsGenerating(true);
    setHasBeenImproved(false); // Reset improvement state on new generation
    const currentStep = course.steps[activeStepIndex];
    
    const generatedContent = await generateCourseContent(course, currentStep);
    setEditedContent(generatedContent);
    setIsGenerating(false);
  }, [course, activeStepIndex]);

  const handleImprove = useCallback(async () => {
    if (!course || !course.steps || !editedContent) return;
    setIsImproving(true);
    const currentStep = course.steps[activeStepIndex];

    const improvedContent = await improveCourseContent(course, currentStep, editedContent);
    setEditedContent(improvedContent);
    setHasBeenImproved(true);
    setIsImproving(false);
  }, [course, activeStepIndex, editedContent]);

  const handleSaveAndContinue = async () => {
    if (!course || !course.steps) return;
    setIsSaving(true);
    
    const currentStep = course.steps[activeStepIndex];

    const { error: stepError } = await supabase
      .from('course_steps')
      .update({ content: editedContent, is_completed: true })
      .eq('id', currentStep.id);
      
    if (stepError) {
      console.error("Error updating step:", stepError);
      setIsSaving(false);
      return;
    }

    const updatedSteps = course.steps.map(step => 
        step.id === currentStep.id ? { ...step, content: editedContent, is_completed: true } : step
    );
    const completedCount = updatedSteps.filter(s => s.is_completed).length;
    const newProgress = Math.round((completedCount / updatedSteps.length) * 100);

    const { error: courseError } = await supabase
        .from('courses')
        .update({ progress: newProgress })
        .eq('id', course.id);
    
    if(courseError) {
        console.error("Error updating course progress:", courseError);
    }
    
    setCourse({ ...course, steps: updatedSteps, progress: newProgress });

    if (activeStepIndex < course.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
    setIsSaving(false);
  };
  
  if (isLoading || !course || !course.steps) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" size={32}/></div>;
  }
  
  const currentStep = course.steps[activeStepIndex];
  const isLastStep = activeStepIndex === course.steps.length - 1;
  const isCourseComplete = course.steps.every(s => s.is_completed);
  const isBusy = isGenerating || isImproving;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-1/4 max-w-sm p-6 bg-white dark:bg-gray-800/50 border-r dark:border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{course.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('course.workspace.title')}</p>
        <nav>
          <ul>
            {course.steps.map((step, index) => (
              <li key={step.id}>
                <button 
                  onClick={() => setActiveStepIndex(index)}
                  disabled={index > 0 && !course.steps![index - 1].is_completed}
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
          <div className="p-6 border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold">{t(currentStep.title_key)}</h1>
          </div>
          <div className="flex-1 p-1 relative">
            {isBusy && (
                <div className="absolute inset-1 bg-gray-100/50 dark:bg-gray-900/50 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
                        <Loader2 className="animate-spin text-primary-500 mx-auto" size={40} />
                        <p className="mt-3 text-lg font-semibold">{isGenerating ? t('course.generating') : t('course.improving')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('course.generating.waitMessage')}</p>
                    </div>
                </div>
            )}
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder={t('course.editor.placeholder')}
              disabled={isBusy}
              className="w-full h-full p-5 text-base bg-transparent border-none focus:ring-0 resize-none dark:placeholder-gray-500 disabled:opacity-50"
            />
          </div>
          <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
             <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isBusy || currentStep.is_completed}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                  {t(isGenerating ? 'course.generating' : 'course.generate')}
                </button>
                <button
                  onClick={handleImprove}
                  disabled={isBusy || currentStep.is_completed || !editedContent || hasBeenImproved}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 disabled:opacity-50"
                  title={hasBeenImproved ? t('course.improve.used') : ''}
                >
                  {isImproving ? <Loader2 className="animate-spin" size={16}/> : <Wand size={16}/>}
                  {t(isImproving ? 'course.improving' : 'course.improve')}
                </button>
             </div>
            {isCourseComplete ? (
                 <div className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-md">
                    {t('course.completed')}
                </div>
            ) : (
                 <button
                  onClick={handleSaveAndContinue}
                  disabled={!editedContent || currentStep.is_completed || isSaving || isBusy}
                  className="px-6 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
                >
                  {isSaving && <Loader2 className="animate-spin inline-block mr-2" size={16}/>}
                  {isLastStep && !currentStep.is_completed ? t('course.saveAndContinue').replace(' & Continue', '') : t('course.saveAndContinue')}
                </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseWorkspacePage;
