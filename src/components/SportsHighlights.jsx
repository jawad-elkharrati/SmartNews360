import React from 'react';
import { motion } from 'framer-motion';

const games = [
  { league: 'La Liga', home: 'Real Madrid', away: 'Barcelona', score: '2 – 1', status: 'FT' },
  { league: 'Premier League', home: 'Liverpool', away: 'Man City', score: '1 – 1', status: 'FT' },
  { league: 'NBA Finals', home: 'Lakers', away: 'Celtics', score: '98 – 95', status: 'FT' },
];

export default function SportHighlights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition p-4"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Dernières nouvelles (GNews)
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {games.map((g, idx) => (
          <div key={idx} className="py-2 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {g.home} <span className="text-gray-500">vs</span> {g.away}
              </p>
              <p className="text-xs text-gray-500">{g.league}</p>
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {g.score} <span className="ml-1 text-xs text-gray-500">{g.status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}