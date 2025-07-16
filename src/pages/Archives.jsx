import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatContext } from '../context/ChatContext';

const articles = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Article exemple ${i + 1}`,
  category: ['Politique', 'Sport', 'Technologie', 'Santé'][Math.floor(Math.random() * 4)],
  date: `2025-06-${(i % 30) + 1}`,
}));

export default function Archives() {
  const { setOnAction } = useChatContext();

  useEffect(() => {
    setOnAction(() => (cmd) => {
      if (/help/i.test(cmd)) return 'Commandes: /action help';
      return 'Commande inconnue.';
    });
    return () => setOnAction(null);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Archives</h1>
      <motion.table initial={{opacity:0}} animate={{opacity:1}} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow rounded bg-white dark:bg-gray-900">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {articles.map(a=>(
            <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.title}</td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.category}</td>
              <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{a.date}</td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
