import React from 'react';
import SimpleCarousel from '../components/SimpleCarousel';

export default function LaureataResources() {
  const slides = [
    <div className="p-6 text-center">Ressource 1</div>,
    <div className="p-6 text-center">Ressource 2</div>,
    <div className="p-6 text-center">Ressource 3</div>,
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Ressources pour Laureata</h1>
      <SimpleCarousel slides={slides} />
    </div>
  );
}
