
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import NewCourseModal from '../components/NewCourseModal';
import { Course, GenerationEnvironment, Plan } from '../types';
import { PRICING_PLANS } from '../constants';
import { PlusCircle } from 'lucide-react';

const mockCourses: Course[] = [
  { id: '1', title: 'Advanced React Patterns', subject: 'React', targetAudience: 'Senior Developers', environment: GenerationEnvironment.Corporate, language: 'en', progress: 75, steps: [] },
  { id: '2', title: 'Introduction to Quantum Physics', subject: 'Physics', targetAudience: 'University Students', environment: GenerationEnvironment.Academic, language: 'en', progress: 40, steps: [] },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const courseLimit = user ? PRICING_PLANS[user.plan].courseLimit : 0;
  const canCreateCourse = user ? courses.length < courseLimit : false;

  const handleCreateCourse = (details: {
    title: string;
    subject: string;
    targetAudience: string;
    environment: GenerationEnvironment;
    language: string;
  }) => {
    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      progress: 0,
      steps: [],
      ...details
    };
    setCourses(prev => [...prev, newCourse]);
    setIsModalOpen(false);
    navigate(`/course/${newCourse.id}`);
  };

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
