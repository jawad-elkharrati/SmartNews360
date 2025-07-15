import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { enhanceArticle } from '../utils/groqNews';

export default function ArticleEditor() {
  const location = useLocation();
  const { title = '', paragraphs = [], image } = location.state || {};
  const editorRef = useRef(null);
  const [html, setHtml] = useState('');
  const [installing, setInstalling] = useState(true);
  const [installProgress, setInstallProgress] = useState(0);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setInstallProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setInstalling(false);
        if (editorRef.current) editorRef.current.focus();
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const initial = `${title ? `<h1>${title}</h1>` : ''}` +
        `${image ? `<img src="${image}" alt="" style="max-width:100%;"/>` : ''}` +
        paragraphs.map(p => `<p>${p}</p>`).join('');
      editorRef.current.innerHTML = initial;
      setHtml(initial);
    }
  }, [title, paragraphs, image]);

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    setHtml(editorRef.current.innerHTML);
  };

  const updateHtml = () => {
    setHtml(editorRef.current.innerHTML);
  };

  const enhance = async () => {
    if (!editorRef.current || enhancing) return;
    setEnhancing(true);
    try {
      const improved = await enhanceArticle(editorRef.current.innerHTML, 'fr');
      editorRef.current.innerHTML = improved;
      setHtml(improved);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      <AnimatePresence>
        {installing && (
          <motion.div
            key="install"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-sm text-gray-800 dark:text-gray-100 space-y-2">
              <p>Installation des dépendances...</p>
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="text-2xl font-semibold dark:text-gray-100">Éditeur d'article</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <button onClick={() => exec('bold')} className="px-2 py-1 border rounded text-sm">B</button>
            <button onClick={() => exec('italic')} className="px-2 py-1 border rounded text-sm">I</button>
            <button onClick={() => exec('underline')} className="px-2 py-1 border rounded text-sm">U</button>
            <button onClick={() => exec('insertUnorderedList')} className="px-2 py-1 border rounded text-sm">• List</button>
            <button onClick={() => exec('insertOrderedList')} className="px-2 py-1 border rounded text-sm">1. List</button>
            <button onClick={enhance} disabled={enhancing} className="px-2 py-1 border rounded text-sm">
              {enhancing ? 'IA...' : 'Améliorer'}
            </button>
          </div>
          <div
            ref={editorRef}
            onInput={updateHtml}
            className="min-h-[300px] p-3 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            contentEditable
            suppressContentEditableWarning
          />
        </div>
        <div className="lg:w-1/2 bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-auto">
          <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-100">HTML</h2>
          <pre className="text-sm whitespace-pre-wrap break-all">{html}</pre>
        </div>
      </div>
    </div>
  );
}
