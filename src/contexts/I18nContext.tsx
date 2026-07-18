import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Translations = { [key: string]: any };

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const SUPPORTED_LANGS = ['en', 'ro', 'es', 'fr', 'de', 'it'];

const detectBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const raw of candidates) {
    if (!raw) continue;
    const base = raw.toLowerCase().split('-')[0];
    if (SUPPORTED_LANGS.includes(base)) return base;
  }
  return 'en';
};

export const I18nProvider: React.FC<{ children: React.ReactNode; initialTranslations?: { [key: string]: Translations } }> = ({ children, initialTranslations }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('language');
    if (saved) {
      // Existing users keep whatever they picked before, even 'en' explicitly.
      if (saved !== 'en') setLanguage(saved);
      return;
    }
    // First visit: sniff from the browser once, then persist so future loads
    // hit the branch above (no re-detection on every mount).
    const detected = detectBrowserLanguage();
    if (detected !== 'en') setLanguage(detected);
  }, []);

  const [translations, setTranslations] = useState<{ [key: string]: Translations } | null>(initialTranslations || null);

  useEffect(() => {
    if (translations) return;

    const loadTranslations = async () => {
      try {
        const langs = ['en', 'ro', 'es', 'fr', 'de', 'it'];
        const entries: { [key: string]: Translations } = {};
        for (const code of langs) {
          const res = await fetch(`/locales/${code}.json`);
          const json = await res.json();
          entries[code] = json;
        }
        setTranslations(entries);
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };
    loadTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): any => {
    // Lookup order: current locale → English fallback → caller-supplied
    // defaultValue → the raw key. defaultValue lives inside `replacements`
    // for backward compat with the existing t(key, {defaultValue}) call sites.
    const pickFrom = (dict: Translations | undefined): any =>
      dict && Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : undefined;

    let result: any =
      pickFrom(translations?.[language]) ??
      pickFrom(translations?.en);

    if (result === undefined && replacements && 'defaultValue' in replacements) {
      result = replacements.defaultValue;
    }
    if (result === undefined) result = key;

    if (typeof result === 'string' && replacements) {
      Object.keys(replacements).forEach(replacementKey => {
        if (replacementKey === 'defaultValue') return;
        const value = replacements[replacementKey];
        result = (result as string).replace(new RegExp(`\\{${replacementKey}\\}`, 'g'), String(value));
      });
    }

    return result;
  }, [language, translations]);

  if (!translations && typeof window === 'undefined' && !initialTranslations) {
     // On server without initialTranslations, we should still render children 
     // to avoid empty HTML, even if text is just keys.
     // But ideally, getStaticProps should provide them.
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
