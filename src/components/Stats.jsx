import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const stats = [
  { label: 'Articles', value: 32, change: '+15%', icon: TrendingUp, variant: 'success' },
  { label: 'Traffic', value: '+15%', change: '+15%', icon: TrendingUp, variant: 'success' },
  { label: 'Alerts', value: 3, change: '-5%', icon: AlertTriangle, variant: 'danger' },
];

export default function Statistiques() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map(({ label, value, change, icon: Icon, variant }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 px-4 py-5 rounded-lg shadow hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-danger' : 'bg-success'} bg-opacity-10`}>
                <Icon className={`h-5 w-5 ${variant === 'danger' ? 'text-danger' : 'text-success'}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{value}</p>
              </div>
            </div>
            <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
              {change}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
