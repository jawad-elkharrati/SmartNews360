import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { enhanceArticle } from '../utils/groqNews';
import { searchPexelsImages } from '../utils/pexelsApi';
import { useChatContext } from '../context/ChatContext';

export default function ArticleEditor() {
  const location = useLocation();
  const { title = '', paragraphs = [], image } = location.state || {};
  const editorRef = useRef(null);
  const [html, setHtml] = useState('');
  const [installing, setInstalling] = useState(true);
  const [installProgress, setInstallProgress] = useState(0);
  const [enhancing, setEnhancing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const { setContext, setOnAction } = useChatContext();

  useEffect(() => {
    if (editorRef.current) editorRef.current.focus();
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
    const saved = localStorage.getItem('articleDraft');
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
      setHtml(saved);
    }
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

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setHtml(editorRef.current.innerHTML);
  };

  const updateHtml = () => {
    const content = editorRef.current.innerHTML;
    setHtml(content);
  };

  useEffect(() => {
    if (editorRef.current) {
      setContext(editorRef.current.innerText);
      const text = editorRef.current.innerText || '';
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setCharCount(text.length);
    } else {
      setContext('');
      setWordCount(0);
      setCharCount(0);
    }
    setOnAction(null);
    const id = setTimeout(() => {
      if (editorRef.current) {
        localStorage.setItem('articleDraft', editorRef.current.innerHTML);
        setLastSaved(new Date());
      }
    }, 1000);
    return () => {
      clearTimeout(id);
      setContext('');
      setOnAction(null);
    };
  }, [html]);

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

  const fullEnhance = async () => {
    if (!editorRef.current || aiLoading) return;
    setAiLoading(true);
    setAiProgress(0);
    setAiStatus('Optimisation du contenu...');
    try {
      const improved = await enhanceArticle(editorRef.current.innerHTML, 'fr');
      setAiProgress(0.6);
      let imgHtml = '';
      try {
        const q = title || editorRef.current.innerText.slice(0, 80);
        const imgs = await searchPexelsImages(q, 1);
        if (imgs.length > 0) {
          const img = imgs[0];
          imgHtml = `<img src="${img.src}" alt="${img.alt}" style="max-width:100%;"/>`;
        }
      } catch (err) {
        console.error('pexels', err);
      }
      setAiProgress(0.9);
      const finalHtml = imgHtml + improved;
      editorRef.current.innerHTML = finalHtml;
      setHtml(finalHtml);
      setAiProgress(1);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setAiLoading(false);
        setAiProgress(0);
        setAiStatus('');
      }, 500);
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
      <AnimatePresence>
        {aiLoading && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-800/90 text-white p-6 rounded space-y-4 flex flex-col items-center">
              <p className="text-sm">{aiStatus}</p>
              <div className="w-64 h-2 bg-gray-600 rounded overflow-hidden">
                <div className="h-full bg-brand-500" style={{ width: `${Math.floor(aiProgress * 100)}%` }} />
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
            <button onClick={() => exec('strikeThrough')} className="px-2 py-1 border rounded text-sm">S</button>
            <button onClick={() => exec('formatBlock','<h1>')} className="px-2 py-1 border rounded text-sm">H1</button>
            <button onClick={() => exec('formatBlock','<h2>')} className="px-2 py-1 border rounded text-sm">H2</button>
            <button onClick={() => exec('formatBlock','<h3>')} className="px-2 py-1 border rounded text-sm">H3</button>
            <button onClick={() => exec('formatBlock','<blockquote>')} className="px-2 py-1 border rounded text-sm">❝</button>
            <button onClick={() => { const url = prompt('Lien ?'); if(url) exec('createLink', url); }} className="px-2 py-1 border rounded text-sm">🔗</button>
            <button onClick={() => { const url = prompt('Image URL ?'); if(url) exec('insertImage', url); }} className="px-2 py-1 border rounded text-sm">🖼️</button>
            <button onClick={() => { const url = prompt('Vidéo URL ?'); if(url) document.execCommand('insertHTML', false, `<video src="${url}" controls style="max-width:100%;"></video>`); setHtml(editorRef.current.innerHTML); }} className="px-2 py-1 border rounded text-sm">📹</button>
            <button onClick={() => { document.execCommand('insertHTML', false, '<table class="table-auto"><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>'); setHtml(editorRef.current.innerHTML); }} className="px-2 py-1 border rounded text-sm">Tbl</button>
            <button onClick={() => exec('insertUnorderedList')} className="px-2 py-1 border rounded text-sm">• List</button>
            <button onClick={() => exec('insertOrderedList')} className="px-2 py-1 border rounded text-sm">1. List</button>
            <button onClick={() => exec('formatBlock','<pre>')} className="px-2 py-1 border rounded text-sm">Code</button>
            <button onClick={enhance} disabled={enhancing} className="px-2 py-1 border rounded text-sm">
              {enhancing ? 'IA...' : 'Améliorer'}
            </button>
            <button onClick={fullEnhance} disabled={aiLoading} className="px-2 py-1 border rounded text-sm">
              {aiLoading ? 'Optimisation...' : 'IA complète'}
            </button>
          </div>
          <div
            ref={editorRef}
            onInput={updateHtml}
            className="min-h-[300px] p-3 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            contentEditable
            suppressContentEditableWarning
            spellCheck
          />
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between mt-1">
            <span>Mots : {wordCount} | Caractères : {charCount}</span>
            {lastSaved && <span>Enregistré à {new Date(lastSaved).toLocaleTimeString()}</span>}
          </div>
        </div>
        <div className="lg:w-1/2 bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-auto">
          <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-100">HTML</h2>
          <pre className="text-sm whitespace-pre-wrap break-all">{html}</pre>
        </div>
      </div>
    </div>
  );
}
