import React from 'react';
import SimpleCarousel from '../components/SimpleCarousel';

export default function LessonPython() {
  const slides = [
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Structures de données</h2>
      <p>Python offre des listes, tuples et dictionnaires pour organiser vos informations.</p>
    </div>,
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Fonctions</h2>
      <p>Créez des fonctions pour réutiliser votre code et le garder lisible.</p>
    </div>,
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Conseil</h2>
      <p>Utilisez des noms clairs et des structures simples pour conseiller efficacement.</p>
    </div>,
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Leçon Python</h1>
      <SimpleCarousel slides={slides} auto={false} />
    </div>
  );
}
