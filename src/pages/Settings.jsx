import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferenceContext';
import { useLanguage } from '../context/LanguageContext';

export default function Settings() {
  const { dark, toggle: toggleDark } = useTheme();
  const [emailNotif, setCourrielNotif] = useState(true);
  const { categories, toggleCategory } = usePreferences();
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex justify-center pt-10 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow p-8 space-y-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Paramètres</h1>

        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Mode sombre</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={dark}
              onChange={toggleDark}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand rounded-full peer peer-checked:bg-brand peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>

        {/* Language selector */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Langue</span>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
        </div>

        {/* Courriel notifications */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Notifications e‑mail</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setCourrielNotif(!emailNotif)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand rounded-full peer peer-checked:bg-brand peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>

        {/* Preferred categories */}
        <div>
          <span className="text-gray-700 dark:text-gray-300 block mb-2">Centres d'intérêt</span>
          <div className="space-y-1">
            {['Politique', 'Sport', 'Technologie'].map((cat) => (
              <label key={cat} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={categories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="text-brand focus:ring-brand"
                />
                <span className="text-gray-700 dark:text-gray-300">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
