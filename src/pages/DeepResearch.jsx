import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function DeepResearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const domains = DOMAINS.join(',');
      const res = await fetch(`/api/serper?q=${encodeURIComponent(q)}&domains=${encodeURIComponent(domains)}&num=10`);
      if (!res.ok) throw new Error('Serper error');
      const data = await res.json();
      const items = data.organic || [];
      if (items.length === 0) throw new Error('Aucun résultat trouvé');
      setResults(items);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
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
            <li key={idx} className="space-y-1">
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline font-medium"
              >
                {r.title}
              </a>
              {r.snippet && (
                <p className="text-sm text-gray-700 dark:text-gray-300">{r.snippet}</p>
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
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="text-white"
            >
              <Loader2 size={24} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
