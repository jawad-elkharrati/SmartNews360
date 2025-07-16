import React, { useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';

export default function Profile() {
  const { setOnAction } = useChatContext();

  useEffect(() => {
    setOnAction(() => (cmd) => {
      if (/help/i.test(cmd)) {
        return 'Commandes disponibles: /action help';
      }
      return 'Commande inconnue.';
    });
    return () => setOnAction(null);
  }, []);

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
