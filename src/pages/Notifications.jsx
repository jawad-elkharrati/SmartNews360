import { motion } from 'framer-motion';
import React from 'react';

const randomUsers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fatima'];
const randomMsgs = [
  'a commenté votre publication',
  'a aimé votre article',
  'a partagé votre sujet',
  'a commencé à vous suivre',
  'vous a mentionné dans un commentaire',
];

function randomNotif(i) {
  const user = randomUsers[Math.floor(Math.random()*randomUsers.length)];
  const msg = randomMsgs[Math.floor(Math.random()*randomMsgs.length)];
  return { id: i, text: `${user} ${msg}`, time: `il y a ${Math.floor(Math.random()*59)+1} min` };
}

const notifications = Array.from({length:15}, (_,i)=> randomNotif(i));

export default function Notifications() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Notifications</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow divide-y dark:divide-gray-700">
        {notifications.map(n=>(
          <motion.div
            key={n.id}
            initial={{ opacity:0, y:10}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.2, delay:n.id*0.03}}
            className="p-4 flex justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="text-gray-700 dark:text-gray-300">{n.text}</span>
            <span className="text-xs text-gray-400">{n.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
