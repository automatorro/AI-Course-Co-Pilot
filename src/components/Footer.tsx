import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-primary-600 dark:text-primary-400" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('header.title')}</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('footer.poweredBy')}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <NavLink to="/" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              {t('footer.home')}
            </NavLink>
            <NavLink to="/#pricing" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              {t('footer.pricing')}
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;