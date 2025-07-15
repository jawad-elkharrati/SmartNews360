import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { searchPexelsImages } from '../utils/pexelsApi';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ImageSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.keywords) {
      const k = location.state.keywords;
      setQuery(k);
      handleSearch(k);
    }
  }, [location.state]);

  const handleSearch = async (forced) => {
    const q = (forced ?? query).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchPexelsImages(q, 16);
      setImages(res);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la recherche d'images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Banque d'images Pexels</h1>
      <div className="flex space-x-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mots-clés..."
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <button
          disabled={loading}
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Rechercher'}
        </button>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() =>
              navigate('/editor', {
                state: {
                  image: img.src,
                  title: location.state?.title,
                  paragraphs: location.state?.paragraphs,
                },
              })
            }
            className="focus:outline-none"
          >
            <img src={img.src} alt={img.alt} className="w-full h-40 object-cover rounded" />
          </button>
        ))}
      </motion.div>
    </div>
  );
}
