
import React from 'react';
import MediastackFeed from '../components/MediastackFeed';
import SportsHighlights from '../components/SportsHighlights';
import AIRecommendations from '../components/AIRecommendations';
import NewsFeed from '../components/NewsFeed';
import GNewsFeed from '../components/GNewsFeed';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Actualités technologie (Monde)
      </h2>
      <MediastackFeed />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Recommandations IA
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
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Dernières nouvelles (GNews)
      </h2>
      <GNewsFeed count={6} />
    </div>
  </div>
</section>
    </div>
  );
}
