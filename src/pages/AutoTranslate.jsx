import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { translateArticle } from '../utils/groqNews';
import { technologyNews } from '../data/technologyNews';

export default function AutoTranslate() {
  const articles = technologyNews.flatMap(section =>
    section.items.map(item => ({ title: item.title, text: item.summary || '' }))
  );

  const [selected, setSelected] = useState('');
  const [url, setUrl] = useState('');
  const [target, setTarget] = useState('en');
  const [result, setResult] = useState('');
  const [original, setOriginal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      let text = '';
      if (url) {
        const ex = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
        const data = await ex.json();
        if (!ex.ok) throw new Error(data.error || 'Extraction failed');
        text = data.text;
      } else {
        const art = articles.find(a => a.title === selected);
        if (!art) throw new Error('Aucun article s\u00e9lectionn\u00e9');
        text = art.text;
      }
      setOriginal(text);
      const res = await translateArticle(text, target);
      setResult(res);
      alert('Traduction r\u00e9ussie !');
    } catch (e) {
      console.error(e);
      setError(e.message || "\u00c9chec de la traduction. Veuillez r\u00e9essayer.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (selected || url)
      .replace(/[^a-z0-9]+/gi, '_')
      .toLowerCase();
    a.download = (name || 'translation') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Traduction automatique d'articles</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Vous pouvez choisir un article ou fournir l'URL d'une page web. Le texte sera extrait puis traduit.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-100 mb-1">Sélectionnez l'article à traduire :</label>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="" disabled>Choisissez un article...</option>
            {articles.map(a => (
              <option key={a.title} value={a.title}>{a.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-100 mb-1">Ou saisissez l'URL d'une page :</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://exemple.com/article"
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm dark:text-gray-100">Langue cible :</label>
          <select
            value={target}
            onChange={e => setTarget(e.target.value)}
            className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="en">Anglais</option>
            <option value="ar">Arabe</option>
            <option value="sw">Swahili</option>
            <option value="pt">Portugais</option>
            <option value="fr">Français</option>
          </select>
          <button
            onClick={() => setTarget(t => (t === 'fr' ? 'en' : 'fr'))}
            className="px-2 py-2 border rounded"
            title="Basculer la langue"
          >
            ⇄
          </button>
          <button
            onClick={handleTranslate}
            disabled={loading || (!selected && !url)}
            className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? '...' : 'Traduire'}
          </button>
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        {result && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-2">
            <button
              onClick={() => setShowPreview(p => !p)}
              className="text-sm underline text-brand"
            >
              {showPreview ? 'Masquer la comparaison' : 'Show side-by-side comparison (Original | Translated)'}
            </button>
            {showPreview && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-gray-100 dark:bg-gray-800">
                  <h3 className="font-medium mb-2 dark:text-gray-100">Original</h3>
                  <p className="text-sm dark:text-gray-300">{original}</p>
                </div>
                <div className="p-3 rounded bg-gray-100 dark:bg-gray-800">
                  <h3 className="font-medium mb-2 dark:text-gray-100">Traduit</h3>
                  <p className="text-sm dark:text-gray-300">{result}</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium dark:text-gray-100 mb-1">Article traduit :</label>
              {editing ? (
                <textarea
                  value={result}
                  onChange={e => setResult(e.target.value)}
                  className="w-full h-40 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              ) : (
                <p className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm dark:text-gray-300">{result}</p>
              )}
              <div className="flex gap-2 mt-2">
                <button onClick={() => setEditing(e => !e)} className="px-3 py-1.5 text-sm bg-brand text-white rounded">
                  {editing ? 'Fermer' : 'Modifier'}
                </button>
                <button onClick={download} className="px-3 py-1.5 text-sm bg-brand text-white rounded">Télécharger la traduction</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

