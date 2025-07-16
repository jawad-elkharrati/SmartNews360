
import React from 'react';
import NewsFeed from '../components/NewsFeed';
import GNewsFeed from '../components/GNewsFeed';
import AITechNewsFeed from '../components/AITechNewsFeed';
import TechnologyNews from '../components/TechnologyNews';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Dernières nouvelles (GNews)
            </h2>
            <GNewsFeed count={6} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Actualités Maroc
            </h2>
            <NewsFeed count={10} />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Technologie News
            </h2>
            <TechnologyNews />
          </div>
        </div>
      </section>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Actualités IA Technologie
        </h2>
        <AITechNewsFeed count={10} />
      </div>
    </div>
  );
}
