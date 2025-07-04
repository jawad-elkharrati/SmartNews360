import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Articles', current: 32, previous: 28 },
  { name: 'Traffic', current: 15000, previous: 12000 },
  { name: 'Alerts', current: 3, previous: 4 },
];

/**
 * KPIComparisonCard
 * Shows key KPIs side‑by‑side (today vs last period).
 */
export default function KPIComparisonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">KPI Comparison</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Today vs Last Week</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Bar dataKey="previous" fill="#9ca3af" name="Last Week" />
          <Bar dataKey="current" fill="#0d6efd" name="Today" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}