import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-paper-alt border-t border-hairline">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo — identical markup to Header and landing page nav */}
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-gold" />
            <span className="font-display text-lg tracking-tight text-graphite">{t('header.title')}</span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm text-stone">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="text-sm text-stone mt-1">
              {t('footer.poweredBy')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="font-mono text-[11px] uppercase tracking-eyebrow-tight text-graphite hover:text-gold transition-colors"
            >
              {t('footer.home')}
            </NavLink>
            <NavLink
              to="/#pricing"
              className="font-mono text-[11px] uppercase tracking-eyebrow-tight text-graphite hover:text-gold transition-colors"
            >
              {t('footer.pricing')}
            </NavLink>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
