import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import NewCourseModal from '../components/NewCourseModal';
import { Course, GenerationEnvironment, Plan } from '../types';
import { PRICING_PLANS, COURSE_STEPS_KEYS } from '../constants';
import { supabase } from '../services/supabaseClient';
import { PlusCircle, Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const courseLimit = user ? PRICING_PLANS[user.plan].courseLimit : 0;
  const canCreateCourse = user ? courses.length < courseLimit : false;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data as Course[]);
      }
      setIsLoading(false);
    };

    fetchCourses();
  }, [user]);


  const handleCreateCourse = async (details: {
    title: string;
    subject: string;
    targetAudience: string;

    environment: GenerationEnvironment;
    language: string;
  }) => {
    if (!user) return;

    // 1. Insert the course
    const { data: newCourseData, error: courseError } = await supabase
      .from('courses')
      .insert({
        user_id: user.id,
        title: details.title,
        subject: details.subject,
        target_audience: details.targetAudience,
        environment: details.environment,
        language: details.language,
        progress: 0,
      })
      .select()
      .single();

    if (courseError) {
      console.error("Error creating course:", courseError);
      return;
    }

    // 2. Insert the course steps
    const stepsToInsert = COURSE_STEPS_KEYS.map((key, index) => ({
      course_id: newCourseData.id,
      user_id: user.id,
      title_key: key,
      content: '',
      is_completed: false,
      step_order: index,
    }));

    const { error: stepsError } = await supabase.from('course_steps').insert(stepsToInsert);

    if (stepsError) {
        console.error("Error creating course steps:", stepsError);
        // Here you might want to delete the course that was just created
        return;
    }

    setCourses(prev => [newCourseData as Course, ...prev]);
    setIsModalOpen(false);
    navigate(`/course/${newCourseData.id}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]"><Loader2 className="animate-spin text-primary-500" size={48}/></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!canCreateCourse}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          title={!canCreateCourse ? t('dashboard.limitReached') : ''}
        >
          <PlusCircle size={20} />
          {t('dashboard.newCourse')}
        </button>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-500">No courses yet.</h2>
            <p className="text-gray-400 mt-2">Click "New Course" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${course.environment === GenerationEnvironment.Corporate ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {t(`modal.newCourse.environment.${course.environment.toLowerCase()}`)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{course.subject}</p>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('dashboard.progress')}</span>
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewCourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCourse}
      />
    </div>
  );
};

export default DashboardPage;