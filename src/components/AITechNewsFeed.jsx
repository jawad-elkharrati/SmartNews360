import React, { useEffect, useState } from 'react';
import { fetchAITechNews } from '../utils/groqNews';
import Skeleton from './ui/Skeleton';
import { useLanguage } from '../context/LanguageContext';

export default function AITechNewsFeed({ count = 10 }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  useEffect(() => {
    fetchAITechNews(count, lang)
      .then(setNews)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [count, lang]);

  if (loading)
    return (
      <ul className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <li key={idx}>
            <Skeleton className="h-20 w-full" />
          </li>
        ))}
      </ul>
    );

  if (error)
    return <p className="text-danger text-sm">Impossible de charger les nouvelles.</p>;

  return (
    <ul className="space-y-4">
      {news.map((item, idx) => (
        <li key={idx} className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
          {item.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.summary}</p>
          )}
          {item.date && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(item.date).toLocaleDateString()}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
