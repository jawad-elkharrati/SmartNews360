
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Small card showing a trending topic.
 * Props: {category, title, timeAgo, change}
 */
export default function TrendCard({ category, title, timeAgo, change }) {
  const positive = change.startsWith('+');
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:shadow-md transition space-y-1">
      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        {category}
      </span>
      <h3 className="font-medium text-gray-900 dark:text-gray-100 leading-snug">{title}</h3>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{timeAgo}</span>
        <span className={`flex items-center gap-0.5 ${color}`}>
          <Icon size={12} />
          {change}
        </span>
      </div>
    </div>
  );
}
