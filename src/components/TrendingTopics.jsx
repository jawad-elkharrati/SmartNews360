
import React, { useEffect, useState } from 'react';
import TrendCard from './TrendCard';
import Skeleton from './ui/Skeleton';
import { fetchTrendingTopics } from '../utils/groqNews';
import { useLanguage } from '../context/LanguageContext';
import { useFilterStore } from '../store';
import { usePreferences } from '../context/PreferenceContext';

export default function TrendingTopics({ count = 6 }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { section } = useFilterStore();
  const { categories } = usePreferences();
  const { lang } = useLanguage();

  useEffect(() => {
    fetchTrendingTopics(count, lang)
      .then((data) => setTopics(data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [count, lang]);

  const filtered = topics.filter(
    (t) =>
      (section.size === 0 || section.has(t.category)) &&
      (categories.size === 0 || categories.has(t.category))
  );

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <Skeleton key={idx} className="h-24" />
        ))}
      </div>
    );
  if (error) return <p className="text-danger text-sm">Impossible de charger les tendances.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filtered.map((t, i) => (
        <TrendCard key={i} {...t} />
      ))}
      {filtered.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Aucun sujet pour ce filtre.
        </p>
      )}
    </div>
  );
}
