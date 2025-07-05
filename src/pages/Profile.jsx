import React from 'react';

export default function Profile() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Profil</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
        <p className="text-gray-700 dark:text-gray-300"><strong>Nom d'utilisateur :</strong> admin</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Courriel:</strong> admin@example.com</p>
      </div>
    </div>
  );
}
