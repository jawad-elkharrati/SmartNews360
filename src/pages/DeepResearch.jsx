import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { summarizeArticle } from '../utils/groqNews';

const DOMAINS = [
  'techcrunch.com',
  'theverge.com',
  'wired.com',
  'arstechnica.com',
  'engadget.com',
  'mashable.com',
  'cnet.com',
  'zdnet.com',
  'venturebeat.com',
  'gizmodo.com',
  'digitaltrends.com',
  'slashdot.org',
  'makeuseof.com',
  'tomshardware.com',
  'pcmag.com',
  'androidauthority.com',
  'xda-developers.com',
  'bleepingcomputer.com',
  'techradar.com',
  'news.ycombinator.com',
  'medium.com',
];

const STATUS_MESSAGES = [
  'Recherche des sources...',
  'Analyse des liens...',
  'Lecture des articles...',
  'Extraction du texte...',
  'Synthèse en cours...',
  'Compilation des points clés...',
  'Finalisation des résultats...'
];

const randomStatus = () =>
  STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];

export default function DeepResearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [installing, setInstalling] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setInstalling(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setProgress(0);
    setStatus(randomStatus());
    try {
      const domains = DOMAINS.join(',');
      const res = await fetch(`/api/serper?q=${encodeURIComponent(q)}&domains=${encodeURIComponent(domains)}&num=10`);
      if (!res.ok) throw new Error('Serper error');
      const data = await res.json();
      const items = data.organic || [];
      if (items.length === 0) throw new Error('Aucun résultat trouvé');
      const step = 60000 / items.length;
      const resultsWithSummaries = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        try {
          const ex = await fetch(`/api/extract?url=${encodeURIComponent(it.link)}`);
          const { text } = await ex.json();
          const sum = await summarizeArticle(text, 'fr');
          resultsWithSummaries.push({ ...it, summary: sum.summary, points: sum.points || [] });
        } catch (err) {
          console.error('summarize', err);
          resultsWithSummaries.push({ ...it, summary: '', points: [] });
        }
        setProgress((i + 1) / items.length);
        setStatus(randomStatus());
        await new Promise(r => setTimeout(r, step));
      }
      setResults(resultsWithSummaries);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
      setStatus('');
      setProgress(0);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto relative">
      <AnimatePresence>
        {installing && (
          <motion.div
            key="install"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-sm text-gray-800 dark:text-gray-100">
              Installation des dépendances...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="text-2xl font-semibold dark:text-gray-100">Recherche approfondie</h1>
      <div className="flex space-x-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sujet de recherche..."
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="block"
            >
              <Search size={18} />
            </motion.span>
          ) : (
            'Chercher'
          )}
        </button>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map((r, idx) => (
            <li key={idx} className="space-y-2">
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline font-medium"
              >
                {r.title}
              </a>
              {r.summary && (
                <p className="text-sm text-gray-700 dark:text-gray-300">{r.summary}</p>
              )}
              {r.points && r.points.length > 0 && (
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {r.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-800/90 text-white p-6 rounded space-y-4 flex flex-col items-center">
              <p className="text-sm">{status}</p>
              <div className="w-64 h-2 bg-gray-600 rounded overflow-hidden">
                <div
                  className="h-full bg-brand-500"
                  style={{ width: `${Math.floor(progress * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
