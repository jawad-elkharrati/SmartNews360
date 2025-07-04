import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateArticleContent } from '../utils/groqNews';
import { Loader2 } from 'lucide-react';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [paragraphs, setParagraphs] = useState([]);
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateArticleContent(topic, count);
      setParagraphs(res);
    } catch (e) {
      console.error(e);
      setError('Erreur lors de la génération. Vérifiez votre clé Groq.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold dark:text-gray-100">
        Générateur de contenu rédactionnel
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          placeholder="Sujet (ex. : impact de l’IA générative au Maroc)…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />

        <input
          type="number"
          min={3}
          max={8}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-20 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          title="Nombre de paragraphes"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Générer'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 list-decimal list-inside"
      >
        {paragraphs.map((p, i) => (
          <li
            key={i}
            className="bg-white dark:bg-gray-900 p-4 rounded shadow leading-relaxed"
          >
            {p}
          </li>
        ))}
      </motion.ol>
    </div>
  );
}
