import React, { useState } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import { GenerationEnvironment } from '../types';
import { CONTENT_LANGUAGES } from '../constants';
import { X } from 'lucide-react';

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (details: {
    title: string;
    subject: string;
    targetAudience: string;
    environment: GenerationEnvironment;
    language: string;
  }) => void;
}

const NewCourseModal: React.FC<NewCourseModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [environment, setEnvironment] = useState<GenerationEnvironment>(GenerationEnvironment.Corporate);
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, subject, targetAudience, environment, language });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card-premium w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b dark:border-ink-700">
            <h2 className="text-2xl font-bold font-display tracking-tight">{t('modal.newCourse.title')}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 interactive-soft">
                <X size={24} />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink-600 dark:text-ink-300">{t('modal.newCourse.courseTitle')}</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 input-premium" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink-600 dark:text-ink-300">{t('modal.newCourse.subject')}</label>
            <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 input-premium" />
          </div>
          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-ink-600 dark:text-ink-300">{t('modal.newCourse.targetAudience')}</label>
            <input type="text" id="audience" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} required className="mt-1 input-premium" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-ink-600 dark:text-ink-300">{t('modal.newCourse.environment')}</label>
              <select id="environment" value={environment} onChange={e => setEnvironment(e.target.value as GenerationEnvironment)} className="mt-1 input-premium">
                <option value={GenerationEnvironment.Corporate}>{t('modal.newCourse.environment.corporate')}</option>
                <option value={GenerationEnvironment.Academic}>{t('modal.newCourse.environment.academic')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-ink-600 dark:text-ink-300">{t('modal.newCourse.language')}</label>
              <select id="language" value={language} onChange={e => setLanguage(e.target.value)} className="mt-1 input-premium">
                {CONTENT_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-premium--secondary">{t('modal.newCourse.cancel')}</button>
            <button type="submit" className="btn-premium">{t('modal.newCourse.create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourseModal;