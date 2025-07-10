import React, { createContext, useContext, useEffect, useState } from 'react';

const PreferenceContext = createContext();
export const usePreferences = () => useContext(PreferenceContext);

const STORAGE_KEY = 'prefs.categories';

export function PreferenceProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return new Set(saved ?? []);
    } catch {
      return new Set();
    }
  });

  const toggleCategory = (cat) => {
    setCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(categories)));
  }, [categories]);

  return (
    <PreferenceContext.Provider value={{ categories, toggleCategory }}>
      {children}
    </PreferenceContext.Provider>
  );
}
