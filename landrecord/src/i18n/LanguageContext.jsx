import React, { createContext, useState, useContext } from 'react';
import { translations } from './index';
import { languages } from './languages';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('bhoomi-lang') || null;
    } catch {
      return null;
    }
  });

  const setLanguage = (lang) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('bhoomi-lang', lang);
      sessionStorage.setItem('bhoomi-lang-selected', 'true');
    } catch {
      // Ignore private browsing storage restrictions
    }
  };

  const t = (key) => {
    // If language is not set, default to english
    const lang = currentLang || 'en';
    
    // Look for key in current language
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    
    // Fallback to english
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Fallback to key itself
    return key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
