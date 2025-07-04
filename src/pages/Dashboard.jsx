
import React from 'react';
import Stats from '../components/Stats';
import TrendingTopics from '../components/TrendingTopics';
import SportsHighlights from '../components/SportsHighlights';
import AIRecommendations from '../components/AIRecommendations';
import NewsFeed from '../components/NewsFeed';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Sujets tendance
      </h2>
      <TrendingTopics />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        AI Recommendations
      </h2>
      <AIRecommendations />
    </div>
  </div>
  <div className="space-y-6">
    <SportsHighlights />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Actualités Maroc
      </h2>
      <NewsFeed count={10} />
    </div>
  </div>
</section>
    </div>
  );
}
