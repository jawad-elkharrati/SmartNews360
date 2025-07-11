import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

export default function ArticleDialog({ open, item, onClose }) {
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (item && open) {
      const keys = extractKeywords(item.title + ' ' + (item.summary || ''));
      setKeywords(keys.join(', '));
    }
  }, [item, open]);

  if (typeof document === 'undefined') return null;

  const handleDownload = () => {
    if (!item) return;
    const content = `Title: ${item.title}\n\n${item.summary}\n\nKeywords: ${keywords}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="dialog"
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-center justify-between">
                <h3 className="text-lg font-semibold dark:text-gray-100">
                  {item?.title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Fermer"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-100" />
                </button>
              </header>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {item?.summary}
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mots-clés SEO
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-brand-600 text-white hover:bg-brand-700 text-sm"
                >
                  <Download size={16} /> Télécharger
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function extractKeywords(text) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, '')
        .split(/\s+/)
        .filter((w) => w.length > 4)
    )
  ).slice(0, 8);
}
