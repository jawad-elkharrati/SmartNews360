import React, { useEffect, useState, useRef, useCallback } from 'react';
import Skeleton from './ui/Skeleton';
import { fetchGNewsArticles } from '../utils/gnewsApi';
import { sanitize } from '../utils/sanitize';
import { shareTo } from '../utils/share';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import WordpressIcon from './icons/WordpressIcon';
import { useNavigate } from 'react-router-dom';

export default function InfiniteNewsFeed({ batchSize = 6 }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loader = useRef(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGNewsArticles(batchSize, 'fr', page);
      setArticles((prev) => [...prev, ...data]);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [batchSize, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((p) => p + 1);
      }
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((a, idx) => (
          <div
            key={idx}
            onClick={() => navigate('/titles', { state: { topic: sanitize(a.title) } })}
            className="group rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-900 cursor-pointer"
          >
            <img
              src={a.image || '/tek_logo.png'}
              alt=""
              className="w-full h-40 object-cover group-hover:scale-105 transition"
            />
            <div className="p-4 space-y-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 leading-snug">
                {sanitize(a.title)}
              </h3>
              {a.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {sanitize(a.description)}
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
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: batchSize }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}
      {error && <p className="text-danger text-sm">Impossible de charger les nouvelles.</p>}
      {/* Sentinel element */}
      <div ref={loader}></div>
    </div>
  );
}
