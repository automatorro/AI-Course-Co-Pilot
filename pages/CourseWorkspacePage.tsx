
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';
import { Course, CourseStep, GenerationEnvironment } from '../types';
import { COURSE_STEPS_KEYS } from '../constants';
import { generateCourseContent } from '../services/geminiService';
import { CheckCircle, Circle, Loader2, Sparkles } from 'lucide-react';

const mockCourse: Course = {
  id: '1',
  title: 'Advanced React Patterns',
  subject: 'React',
  targetAudience: 'Senior Developers',
  environment: GenerationEnvironment.Corporate,
  language: 'en',
  progress: 0,
  steps: COURSE_STEPS_KEYS.map((key, index) => ({
    id: `${index + 1}`,
    titleKey: key,
    content: '',
    isCompleted: false,
  }))
};


const CourseWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    // In a real app, fetch course data from API using id
    setCourse(mockCourse);
    const firstIncompleteStep = mockCourse.steps.findIndex(s => !s.isCompleted);
    setActiveStepIndex(firstIncompleteStep >= 0 ? firstIncompleteStep : 0);
    setEditedContent(mockCourse.steps[firstIncompleteStep >= 0 ? firstIncompleteStep : 0]?.content || '');
  }, [id]);

  useEffect(() => {
    if (course) {
      setEditedContent(course.steps[activeStepIndex]?.content || '');
    }
  }, [activeStepIndex, course]);

  const handleGenerate = useCallback(async () => {
    if (!course) return;
    setIsLoading(true);
    const currentStep = course.steps[activeStepIndex];
    const generatedContent = await generateCourseContent(course, currentStep);
    setEditedContent(generatedContent);
    setIsLoading(false);
  }, [course, activeStepIndex]);

  const handleSaveAndContinue = () => {
    if (!course) return;

    const updatedSteps = [...course.steps];
    updatedSteps[activeStepIndex] = {
      ...updatedSteps[activeStepIndex],
      content: editedContent,
      isCompleted: true,
    };
    
    const completedCount = updatedSteps.filter(s => s.isCompleted).length;
    const newProgress = Math.round((completedCount / updatedSteps.length) * 100);

    setCourse({ ...course, steps: updatedSteps, progress: newProgress });

    if (activeStepIndex < course.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };
  
  if (!course) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" size={32}/></div>;
  }
  
  const currentStep = course.steps[activeStepIndex];
  const isLastStep = activeStepIndex === course.steps.length - 1;
  const isCourseComplete = course.steps.every(s => s.isCompleted);

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
                  disabled={index > 0 && !course.steps[index - 1].isCompleted}
                  className={`w-full text-left p-3 my-1 rounded-lg flex items-center gap-3 transition-colors ${
                    activeStepIndex === index 
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {step.isCompleted ? <CheckCircle className="text-green-500" size={20}/> : <Circle className="text-gray-400" size={20} />}
                  <span className="font-medium">{t(step.titleKey)}</span>
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
            <h1 className="text-2xl font-bold">{t(currentStep.titleKey)}</h1>
          </div>
          <div className="flex-1 p-1">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder={t('course.editor.placeholder')}
              className="w-full h-full p-5 text-base bg-transparent border-none focus:ring-0 resize-none dark:placeholder-gray-500"
            />
          </div>
          <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
             <button
              onClick={handleGenerate}
              disabled={isLoading || currentStep.isCompleted}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16}/>
                  {t('course.generating')}
                </>
              ) : (
                <>
                  <Sparkles size={16}/>
                  {t('course.generate')}
                </>
              )}
            </button>
            {isCourseComplete ? (
                 <div className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-md">
                    {t('course.completed')}
                </div>
            ) : (
                 <button
                  onClick={handleSaveAndContinue}
                  disabled={!editedContent || currentStep.isCompleted}
                  className="px-6 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
                >
                  {isLastStep && !currentStep.isCompleted ? t('course.saveAndContinue').replace(' & Continue', '') : t('course.saveAndContinue')}
                </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseWorkspacePage;
