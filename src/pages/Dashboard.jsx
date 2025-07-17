
import React, { useEffect } from 'react';
import NewsFeed from '../components/NewsFeed';
import GNewsFeed from '../components/GNewsFeed';
import AITechNewsFeed from '../components/AITechNewsFeed';
import TechnologyNews from '../components/TechnologyNews';
import { useChatContext } from '../context/ChatContext';
import SimpleCarousel from '../components/SimpleCarousel';

export default function Dashboard() {
  const { setOnAction } = useChatContext();

  useEffect(() => {
    setOnAction(() => (cmd) => {
      if (/help/i.test(cmd)) {
        return 'Commandes disponibles: /action help (affiche cette aide)';
      }
      return 'Commande inconnue.';
    });
    return () => setOnAction(null);
  }, []);

  return (
    <div className="space-y-6">
      <SimpleCarousel
        auto={false}
        slides={[
          <img
            src="/slides/YN-_FqrG0RM-HD.jpg"
            alt="Slide 1"
            className="w-full h-64 object-cover rounded-lg"
          />,
          <img
            src="/slides/aA2smy_1qnc-HD.jpg"
            alt="Slide 2"
            className="w-full h-64 object-cover rounded-lg"
          />,
          <img
            src="/slides/cmB4cKzPvJk-HD.jpg"
            alt="Slide 3"
            className="w-full h-64 object-cover rounded-lg"
          />,
        ]}
      />
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
