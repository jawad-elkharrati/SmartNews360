import React from 'react';
import { useFilterStore } from '../store';

export default function FilterPanel() {
  const { section, sentiment, toggleSection, togglePolarité } = useFilterStore();

  return (
    <aside className="w-72 bg-white dark:bg-gray-950 border-l dark:border-gray-800 hidden lg:block p-6 overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Filtres</h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Section</h3>
        {['Politique', 'Sport', 'Technologie'].map((sec) => (
          <label key={sec} className="flex items-center space-x-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={section.has(sec)}
              onChange={() => toggleSection(sec)}
              className="text-brand focus:ring-brand"
            />
            <span className="text-gray-700 dark:text-gray-300">{sec}</span>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Polarité</h3>
        {['Positif', 'Négatif'].map((sent) => (
          <label key={sent} className="flex items-center space-x-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={sentiment.has(sent)}
              onChange={() => togglePolarité(sent)}
              className="text-brand focus:ring-brand"
            />
            <span className="text-gray-700 dark:text-gray-300">{sent}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
