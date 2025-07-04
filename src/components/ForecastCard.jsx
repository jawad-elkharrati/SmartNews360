import React from 'react';
import ForecastChart from './ForecastChart';
import { motion } from 'framer-motion';

export default function ForecastCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Forecast (72h)</h2>
        <button className="text-sm text-brand hover:underline">3 targets</button>
      </div>
      <ForecastChart />
    </motion.div>
  );
}
