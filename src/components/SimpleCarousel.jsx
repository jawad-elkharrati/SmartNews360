import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimpleCarousel({ slides, auto = true, interval = 5000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [auto, interval, slides.length]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg"
        >
          {slides[index]}
        </motion.div>
      </AnimatePresence>
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 dark:bg-gray-900/70 rounded-full"
          >
            &#9664;
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 dark:bg-gray-900/70 rounded-full"
          >
            &#9654;
          </button>
        </>
      )}
    </div>
  );
}
