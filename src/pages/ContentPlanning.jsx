import React, { useState } from 'react';

export default function ContentPlanning() {
  const [events, setEvents] = useState([
    { id: 1, title: 'Article sur l\'IA', date: '2024-06-01' },
    { id: 2, title: 'Post réseaux sociaux', date: '2024-06-05' }
  ]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const addEvent = () => {
    if (title && date) {
      setEvents([...events, { id: Date.now(), title, date }]);
      setTitle('');
      setDate('');
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Planification de contenu</h1>
      <div className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={addEvent}
            className="bg-brand text-white px-3 py-1 rounded"
          >
            Ajouter
          </button>
        </div>
        <ul className="divide-y dark:divide-gray-700">
          {events.map(e => (
            <li key={e.id} className="flex justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">{e.title} - {e.date}</span>
              <button
                onClick={() => deleteEvent(e.id)}
                className="text-red-500 hover:underline"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
