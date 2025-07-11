
import React, { useEffect, useState } from 'react';
import { fetchNewsCards } from '../utils/groqNews';
import { useLanguage } from '../context/LanguageContext';
import { shareText } from '../utils/share';
import { Share2 } from 'lucide-react';
import ArticleDialog from './ArticleDialog';
import Skeleton from './ui/Skeleton';

/**
 * Simple list of Moroccan news cards fetched from Groq API.
 * @param {number} count number of news entries to display (default 10)
 */
export default function NewsFeed({ count = 10 }) {
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { lang } = useLanguage();

  useEffect(() => {
    fetchNewsCards(count, lang)
      .then((data) => setNews(data))
      .catch((err) => {
        console.error(err);
        setError(err);
      })
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
  if (error) return <p className="text-danger">Impossible de charger les actualités.</p>;

  return (
    <>
      <ul className="space-y-4">
        {news.map((item, idx) => (
          <li
            key={idx}
            onClick={() => setSelected(item)}
            className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 transition hover:shadow-lg cursor-pointer"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
            {item.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.summary}</p>
            )}
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); shareText(item.title); }}
                className="text-gray-500 hover:text-brand-600"
                aria-label="Partager"
              >
                <Share2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ArticleDialog open={!!selected} item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
