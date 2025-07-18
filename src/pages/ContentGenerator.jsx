import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  generateArticleContent,
  extendParagraph,
  summarizeParagraph,
  translateParagraph,
  analyzeParagraph,
  generateImageKeywords,
  generateParagraphAxes,
  extractMainKeyword,
} from '../utils/groqNews';
import { useLanguage } from '../context/LanguageContext';
import { Loader2, Twitter, Facebook, Linkedin, Download, Copy as CopyIcon } from 'lucide-react';
import WordpressIcon from '../components/icons/WordpressIcon';
import { shareTo } from '../utils/share';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';

export default function ContentGenerator() {
  const { setContext, setOnAction } = useChatContext();
  const [topic, setTopic] = useState('');
  const [paragraphs, setParagraphs] = useState([]);
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [axes, setAxes] = useState([]);
  const [selected, setSelected] = useState(1);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolError, setToolError] = useState(null);
  const [toolResponse, setToolResponse] = useState('');
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGenerate = async (forcedTopic) => {
    const q = (forcedTopic ?? topic).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateArticleContent(q, count, lang);
      setParagraphs(res);
      setKeywords(extractKeywords(res.join(' ')));
      try {
        const ax = await generateParagraphAxes(res, lang);
        setAxes(ax);
      } catch (err) {
        console.error(err);
        setAxes([]);
      }
    } catch (e) {
      console.error(e);
      setError('Erreur lors de la génération. Vérifiez votre clé Groq.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stateTopic = location.state?.topic;
    const params = new URLSearchParams(location.search);
    const queryTopic = params.get('topic');
    const t = stateTopic || queryTopic;
    if (t) {
      setTopic(t);
      handleGenerate(t);
    }
  }, [location.state, location.search]);

  useEffect(() => {
    setContext(paragraphs.join('\n'));
    setOnAction(() => (cmd) => {
      if (cmd.startsWith('regenerate')) {
        handleGenerate(topic);
        return 'Contenu régénéré.';
      }
      if (/help/i.test(cmd)) {
        return 'Commandes: /action regenerate';
      }
      return 'Commande inconnue.';
    });
    return () => {
      setOnAction(null);
      setContext('');
    };
  }, [paragraphs, topic]);

  const handleCopy = () => {
    const text = paragraphs.join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleDownload = () => {
    const text = paragraphs.join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = topic.replace(/[^a-z0-9]+/gi, '_').toLowerCase() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleHumanize = () => {
    const text = paragraphs.join('\n\n');
    navigate('/humanize', { state: { text, title: topic } });
  };

  const handleChooseImage = () => {
    const q = topic.trim();
    if (!q) return;
    navigate('/images', {
      state: {
        keywords: q,
        title: topic,
        paragraphs,
      },
    });
  };

  const runTool = async (fn, update = false) => {
    const para = paragraphs[selected - 1];
    if (!para) return;
    setToolLoading(true);
    setToolError(null);
    try {
      const res = await fn(para, lang);
      const formatted =
        typeof res === 'string'
          ? res
          : res && typeof res === 'object'
          ? JSON.stringify(res, null, 2)
          : '';
      setTimeout(() => {
        if (update && typeof res === 'string') {
          setParagraphs((prev) =>
            prev.map((p, i) => (i === selected - 1 ? res : p))
          );
        }
        setToolResponse(formatted);
        setToolLoading(false);
      }, 20000);
    } catch (e) {
      console.error(e);
      setToolError("Erreur lors de l'appel IA");
      setToolLoading(false);
    }
  };

  const tools = [
    { id: 'extend', label: 'Étendre', action: () => runTool(extendParagraph, true) },
    { id: 'summary', label: 'Résumé', action: () => runTool(summarizeParagraph) },
    { id: 'translate', label: 'Traduire', action: () => runTool(translateParagraph) },
    { id: 'analyze', label: 'Analyse', action: () => runTool(analyzeParagraph) },
  ];

  const highlight = (text) => {
    return text.split(/(\s+)/).map((part, idx) => {
      const clean = part.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (keywords.includes(clean)) {
        return (
          <mark key={idx} className="bg-yellow-200">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold dark:text-gray-100">
        Générateur de contenu rédactionnel
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          placeholder="Sujet (ex. : impact de l’IA générative au Maroc)…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />

        <input
          type="number"
          min={3}
          max={8}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-20 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          title="Nombre de paragraphes"
        />

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Générer'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 list-decimal list-inside"
      >
        {paragraphs.map((p, i) => (
          <li
            key={i}
            onClick={() => setSelected(i + 1)}
            className={`bg-white dark:bg-gray-900 p-4 rounded shadow leading-relaxed dark:text-white cursor-pointer ${
              selected === i + 1 ? 'ring-2 ring-brand-500' : ''
            }`}
          >
            {axes[i] && (
              <p className="font-semibold mb-2">Axe {i + 1}: {axes[i]}</p>
            )}
            {highlight(p)}
          </li>
        ))}
      </motion.ol>

      {paragraphs.length > 0 && (
        <>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => shareTo('twitter', topic)}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur Twitter"
            >
              <Twitter size={16} />
            </button>
            <button
              onClick={() => shareTo('facebook', topic)}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur Facebook"
            >
              <Facebook size={16} />
            </button>
            <button
              onClick={() => shareTo('linkedin', topic)}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur LinkedIn"
            >
              <Linkedin size={16} />
            </button>
            <button
              onClick={() => shareTo('wordpress', topic)}
              className="text-gray-500 hover:text-brand-600"
              aria-label="Partager sur WordPress"
            >
              <WordpressIcon size={16} />
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-brand text-white hover:bg-brand-600 text-sm"
            >
              <CopyIcon size={16} /> Copier
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-brand text-white hover:bg-brand-600 text-sm"
            >
              <Download size={16} /> Télécharger
            </button>
          </div>
        </div>

        <div className="magic-section">
          <h2 className="font-medium text-white">Outils IA</h2>
          <div className="flex items-end gap-2 flex-wrap">
            <label htmlFor="paraIndex" className="text-white text-sm">Paragraphe #</label>
            <input
              id="paraIndex"
              type="number"
              min={1}
              max={paragraphs.length}
              value={selected}
              onChange={e => setSelected(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tools.map(t => (
              <button key={t.id} onClick={t.action} className="btn-magic text-sm">
                {t.label}
              </button>
            ))}
          </div>
          {toolLoading && (
            <div className="ai-magic-loader">
              <span>Analyse magique en cours...</span>
            </div>
          )}
          {toolError && <p className="text-danger text-sm">{toolError}</p>}
          {toolResponse && (
            <pre className="whitespace-pre-wrap text-sm bg-white bg-opacity-20 text-white p-3 rounded">
              {toolResponse}
            </pre>
          )}
        </div>
        </>
      )}

      {keywords.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium dark:text-gray-100">Mots-clés SEO</h3>
          <p className="text-sm dark:text-gray-300">{keywords.join(', ')}</p>
        </div>
      )}

      {paragraphs.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleHumanize}
            className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 text-sm"
          >
            Humaniser le texte
          </button>
          <button
            onClick={handleChooseImage}
            className="ml-2 px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 text-sm"
          >
            Choisir une image
          </button>
          <button
            onClick={() =>
              navigate(`/titles?topic=${encodeURIComponent(topic)}`)
            }
            className="ml-2 px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 text-sm"
          >
            Générer des titres
          </button>
        </div>
      )}
    </div>
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
