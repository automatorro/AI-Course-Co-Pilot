import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Translations = { [key: string]: any };

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [translations, setTranslations] = useState<{ [key: string]: Translations } | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const enResponse = await fetch('./locales/en.json');
        const en = await enResponse.json();
        const roResponse = await fetch('./locales/ro.json');
        const ro = await roResponse.json();
        setTranslations({ en, ro });
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };
    loadTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string): any => {
    if (!translations) {
      return key;
    }
    const langTranslations = translations[language];
    if (!langTranslations) {
      return key;
    }
    const result = langTranslations[key];
    
    // If the key is not found, return the key itself as a fallback.
    // Otherwise, return the found value (which could be a string or an array).
    return result !== undefined ? result : key;
  }, [language, translations]);

  if (!translations) {
    return null; // Or a loading indicator
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