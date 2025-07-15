import React, { useEffect, useState } from 'react';
import Skeleton from './ui/Skeleton';
import { fetchTechNews } from '../utils/mediastackApi';
import { sanitize } from '../utils/sanitize';
import { truncate } from '../utils/truncate';
import { shareTo } from '../utils/share';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import WordpressIcon from './icons/WordpressIcon';

export default function MediastackFeed({ count = 6 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTechNews(count)
      .then(setArticles)
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [count]);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );

  if (error) return <p className="text-danger text-sm">Impossible de charger les nouvelles.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {articles.map((a, idx) => (
        <a
          key={idx}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-900"
        >
          {a.image && (
            <img
              src={a.image}
              alt=""
              className="w-full h-40 object-cover group-hover:scale-105 transition"
            />
          )}
          <div className="p-4 space-y-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 leading-snug">
              {truncate(sanitize(a.title), 100)}
            </h3>
            {a.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {truncate(sanitize(a.description), 120)}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  shareTo('twitter', a.title, a.url);
                }}
                className="text-gray-500 hover:text-brand-600"
                aria-label="Partager sur Twitter"
              >
                <Twitter size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  shareTo('facebook', a.title, a.url);
                }}
                className="text-gray-500 hover:text-brand-600"
                aria-label="Partager sur Facebook"
              >
                <Facebook size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  shareTo('linkedin', a.title, a.url);
                }}
                className="text-gray-500 hover:text-brand-600"
                aria-label="Partager sur LinkedIn"
              >
                <Linkedin size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  shareTo('wordpress', a.title, a.url);
                }}
                className="text-gray-500 hover:text-brand-600"
                aria-label="Partager sur WordPress"
              >
                <WordpressIcon size={16} />
              </button>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
