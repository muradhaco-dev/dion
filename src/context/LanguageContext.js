'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext({
  language: 'ar',
  setLanguage: () => {},
  t: translations.ar,
  dir: 'rtl',
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('ar');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dion_preferred_language');
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem('dion_preferred_language', lang);
      } catch (e) {}
    }
  };

  const currentTranslations = translations[language] || translations.ar;
  const dir = currentTranslations.dir || 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
    }
  }, [dir, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
