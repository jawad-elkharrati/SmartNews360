
import React, { useMemo } from 'react';
import MediastackFeed from '../components/MediastackFeed';
import NewsFeed from '../components/NewsFeed';
import GNewsFeed from '../components/GNewsFeed';
import InfiniteNewsFeed from '../components/InfiniteNewsFeed';
import GoogleRssFeed from '../components/GoogleRssFeed';

export default function Dashboard() {
  const googleCount = useMemo(() => Math.floor(Math.random() * 5) + 6, []);
  return (
    <div className="space-y-6">

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Actualités technologie (Monde)
      </h2>
      <MediastackFeed count={10} />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Google News (RSS)
      </h2>
      <GoogleRssFeed count={googleCount} />
    </div>
  </div>
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
</section>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Flux infini (GNews)
        </h2>
        <InfiniteNewsFeed batchSize={20} />
      </div>
    </div>
  );
}
