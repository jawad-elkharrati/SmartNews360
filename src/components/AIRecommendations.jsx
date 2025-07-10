
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAIRecommendations } from '../utils/groqNews';
import { useLanguage } from '../context/LanguageContext';
import Skeleton from './ui/Skeleton';

export default function AIRecommendations({ count = 3 }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  useEffect(() => {
    fetchAIRecommendations(count, lang)
      .then((data) => setRecs(data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [count, lang]);

  if (loading)
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <Skeleton key={idx} className="h-12" />
        ))}
      </div>
    );
  if (error) return <p className="text-danger text-sm">Impossible de charger les recommandations.</p>;

  return (
    <div className="space-y-3">
      {recs.map((r, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow text-gray-800 dark:text-gray-100 hover:shadow-md transition text-sm"
        >
          {r}
        </motion.div>
      ))}
    </div>
  );
}