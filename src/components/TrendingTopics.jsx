
import React, { useEffect, useState } from 'react';
import TrendCard from './TrendCard';
import { fetchTrendingTopics } from '../utils/groqNews';
import { useFilterStore } from '../store';

export default function TrendingTopics({ count = 6 }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { section } = useFilterStore();

  useEffect(() => {
    fetchTrendingTopics(count)
      .then((data) => setTopics(data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [count]);

  const filtered = topics.filter(
    (t) => section.size === 0 || section.has(t.category)
  );

  if (loading) return <p>Chargement…</p>;
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
