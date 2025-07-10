import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

const STORAGE_KEY = 'lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'fr');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
