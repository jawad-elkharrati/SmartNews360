import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeepResearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/serper?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Serper error');
      const data = await res.json();
      const item = (data.organic || []).find((r) => r.link && r.link.includes('medium.com'));
      if (!item) throw new Error('Aucun article Medium trouvé');
      const ext = await fetch(`/api/extract?url=${encodeURIComponent(item.link)}`);
      if (!ext.ok) throw new Error('Erreur extraction');
      const { text } = await ext.json();
      const groqRes = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: 'Résume le texte suivant en français en trois points.' },
            { role: 'user', content: text }
          ]
        })
      });
      const gjson = await groqRes.json();
      const summary = gjson.choices?.[0]?.message?.content || '';
      setResult({ title: item.title, link: item.link, summary });
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
      {result && (
        <div className="space-y-2">
          <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-medium">
            {result.title}
          </a>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
