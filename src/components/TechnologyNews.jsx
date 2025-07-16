import React from 'react';
import { useNavigate } from 'react-router-dom';
import { technologyNews } from '../data/technologyNews';

export default function TechnologyNews() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {technologyNews.map((section) => (
        <div key={section.category} className="space-y-3">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
            {section.category}
          </h3>
          <ul className="space-y-4">
            {section.items.map((item, idx) => (
              <li
                key={idx}
                onClick={() =>
                  navigate(`/titles?topic=${encodeURIComponent(item.title)}`)
                }
                className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 cursor-pointer hover:shadow-lg transition"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {item.title}
                </h4>
                {item.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {item.summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
