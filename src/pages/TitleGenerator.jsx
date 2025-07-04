
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateArticleTitles } from '../utils/groqNews';

/**
 * Page allowing users to generate catchy article titles via Groq’s Mixtral model.
 * Falls back gracefully when the API fails.
 */
export default function TitleGenerator() {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const q = topic.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateArticleTitles(q);
      if (!res || res.length === 0) {
        setError("Impossible de générer des titres pour le moment.");
      } else {
        setTitles(res);
      }
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l'appel API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Générateur de titres d'articles</h1>
      <div className="flex space-x-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Sujet de l'article..."
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <button
          disabled={loading}
          onClick={handleGenerate}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? '...':'Générer'}
        </button>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {titles.map((t) => (
          <li key={t} className="bg-white dark:bg-gray-900 p-3 rounded shadow">
            {t}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
