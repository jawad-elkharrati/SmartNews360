import React, { useEffect, useState } from 'react';
import Skeleton from './ui/Skeleton';
import { fetchTechKeywords } from '../utils/groqNews';
import { fetchGoogleRssArticles } from '../utils/googleRss';
import { sanitize } from '../utils/sanitize';
import { shareTo } from '../utils/share';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import WordpressIcon from './icons/WordpressIcon';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function GoogleRssFeed({ count = 6 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const keywords = await fetchTechKeywords(5, lang);
        const query = keywords.join(' OR ');
        const data = await fetchGoogleRssArticles(query, count);
        const filtered = data.filter(
          (a) =>
            !a.title
              .toLowerCase()
              .includes('les 10 meilleurs logiciels de gestion de mots de passe')
        );
        if (!cancelled) setArticles(filtered);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [count, lang]);

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
        <div
          key={idx}
          onClick={() => navigate(`/titles?topic=${encodeURIComponent(sanitize(a.title))}`)}
          className="group rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-900 cursor-pointer"
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
              {sanitize(a.title)}
            </h3>
            {a.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {sanitize(a.description)}
              </p>
            )}
            {a.publishedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(a.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareTo('twitter', a.title, a.url);
              }}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur Twitter"
            >
              <Twitter size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareTo('facebook', a.title, a.url);
              }}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur Facebook"
            >
              <Facebook size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareTo('linkedin', a.title, a.url);
              }}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur LinkedIn"
            >
              <Linkedin size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareTo('wordpress', a.title, a.url);
              }}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur WordPress"
            >
              <WordpressIcon size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
