import React, { useState, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';

export default function ContentPlanning() {
  const { setOnAction } = useChatContext();
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('planningEvents');
    return stored ? JSON.parse(stored) : [
      { id: 1, title: "Article sur l'IA", date: '2024-06-01' },
      { id: 2, title: 'Post réseaux sociaux', date: '2024-06-05' }
    ];
  });
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const addEvent = (t = title, d = date) => {
    if (t && d) {
      setEvents(prev => [...prev, { id: Date.now(), title: t, date: d }]);
      if (t === title) setTitle('');
      if (d === date) setDate('');
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const parseDateTime = (text) => {
    const t = text.toLowerCase();
    const now = new Date();
    let d = null;
    if (/(today|aujourd'hui)/.test(t)) {
      d = new Date(now);
    } else if (/(tomorrow|demain)/.test(t)) {
      d = new Date(now);
      d.setDate(now.getDate() + 1);
    } else {
      const rel = t.match(/(?:in|dans)\s+(\d+)\s+(?:days?|jours?)/);
      if (rel) {
        d = new Date(now);
        d.setDate(now.getDate() + parseInt(rel[1], 10));
      } else {
        const m = t.match(/(\d{4}[\/-]\d{1,2}[\/-]\d{1,2})/);
        if (m) {
          const parts = m[1].replace(/\//g, '-').split('-');
          const [y, mo, da] = parts.map(Number);
          d = new Date(y, mo - 1, da);
        }
      }
    }
    const time = t.match(/(\d{1,2})(?:[:h](\d{2}))?\s*(am|pm)?/);
    if (d && time) {
      let h = parseInt(time[1], 10);
      const min = parseInt(time[2] || '0', 10);
      const ap = time[3];
      if (ap === 'pm' && h < 12) h += 12;
      if (ap === 'am' && h === 12) h = 0;
      d.setHours(h, min, 0, 0);
    }
    return d;
  };

  const handleAction = (cmd) => {
    const low = cmd.toLowerCase();

    if (/list|affich|show/.test(low)) {
      if (!events.length) return 'Aucun évènement.';
      return events
        .map((e, i) => `${i + 1}. ${e.title} - ${e.date}`)
        .join('\n');
    }

    if (/clear|reset|vider/.test(low)) {
      setEvents([]);
      return 'Planning vidé.';
    }

    if (/delete|remove|supprim/.test(low)) {
      const m = low.match(/\d+/);
      if (!m) return "Précisez le numéro de l'évènement.";
      const idx = parseInt(m[0], 10) - 1;
      if (idx < 0 || idx >= events.length) return 'Numéro invalide.';
      const ev = events[idx];
      setEvents(events.filter((_, i) => i !== idx));
      return `Évènement "${ev.title}" supprimé.`;
    }

    if (/add|ajouter|schedul|planifier/.test(low)) {
      const dt = parseDateTime(low);
      if (!dt) return "Je n'ai pas compris la date";
      const dStr = dt.toISOString().slice(0, 10);
      const cleaned = cmd
        .replace(/\/action/i, '')
        .replace(/add|ajouter|schedule|schedul|planifier/gi, '')
        .replace(/today|tomorrow|aujourd'hui|demain/gi, '')
        .replace(/(?:in|dans)\s+\d+\s+(?:days?|jours?)/, '')
        .replace(/\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/, '')
        .replace(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/, '')
        .replace(/\bat\b|\bà\b/, '')
        .replace(/\s+/g, ' ')
        .trim();
      const t = cleaned || 'Évènement';
      addEvent(t, dStr);
      return `Évènement "${t}" ajouté pour le ${dStr}.`;
    }

    if (/help/i.test(low)) {
      return 'Commandes: add, list, delete <n>, clear';
    }

    return 'Commande inconnue.';
  };

  useEffect(() => {
    setOnAction(() => handleAction);
    return () => setOnAction(null);
  }, [events]);

  useEffect(() => {
    localStorage.setItem('planningEvents', JSON.stringify(events));
  }, [events]);

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
