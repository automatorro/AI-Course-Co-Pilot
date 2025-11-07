import React from 'react';
import { useTranslation } from '../contexts/I18nContext';
import { X, Check, GitPullRequestArrow } from 'lucide-react';

interface ReviewChangesModalProps {
  originalContent: string;
  proposedContent: string;
  onAccept: () => void;
  onReject: () => void;
}

const ReviewChangesModal: React.FC<ReviewChangesModalProps> = ({
  originalContent,
  proposedContent,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <GitPullRequestArrow className="text-primary-600 dark:text-primary-400" size={24} />
            <h2 className="text-xl font-bold">{t('course.reviewModal.title')}</h2>
          </div>
          <button onClick={onReject} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Content Comparison */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
          {/* Original Content */}
          <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">{t('course.reviewModal.original')}</h3>
            </div>
            <textarea
              readOnly
              value={originalContent}
              className="flex-1 w-full p-4 text-sm bg-transparent border-none focus:ring-0 resize-none font-mono"
            />
          </div>

          {/* Proposed Content */}
          <div className="flex flex-col border border-primary-300 dark:border-primary-700 rounded-lg overflow-hidden ring-1 ring-primary-500">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/50 border-b border-primary-200 dark:border-primary-800">
              <h3 className="font-semibold text-primary-800 dark:text-primary-200">{t('course.reviewModal.proposed')}</h3>
            </div>
            <textarea
              readOnly
              value={proposedContent}
              className="flex-1 w-full p-4 text-sm bg-transparent border-none focus:ring-0 resize-none font-mono"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onReject}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('course.reviewModal.reject')}
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
          >
            <Check size={18} />
            {t('course.reviewModal.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewChangesModal;