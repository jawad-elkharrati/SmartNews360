
import React, { useEffect, useState } from 'react';
import { fetchNewsCards } from '../utils/groqNews';

/**
 * Simple list of Moroccan news cards fetched from Groq API.
 * @param {number} count number of news entries to display (default 10)
 */
export default function NewsFeed({ count = 10 }) {
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsCards(count)
      .then((data) => setNews(data))
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [count]);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="text-danger">Impossible de charger les actualités.</p>;

  return (
    <ul className="space-y-4">
      {news.map((item, idx) => (
        <li
          key={idx}
          className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 transition hover:shadow-lg"
        >
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
          {item.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.summary}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
