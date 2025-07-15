import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ArticleEditor() {
  const location = useLocation();
  const { title = '', paragraphs = [], image } = location.state || {};
  const editorRef = useRef(null);
  const [html, setHtml] = useState('');

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Éditeur d'article</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <button onClick={() => exec('bold')} className="px-2 py-1 border rounded text-sm">B</button>
            <button onClick={() => exec('italic')} className="px-2 py-1 border rounded text-sm">I</button>
            <button onClick={() => exec('underline')} className="px-2 py-1 border rounded text-sm">U</button>
            <button onClick={() => exec('insertUnorderedList')} className="px-2 py-1 border rounded text-sm">• List</button>
            <button onClick={() => exec('insertOrderedList')} className="px-2 py-1 border rounded text-sm">1. List</button>
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
