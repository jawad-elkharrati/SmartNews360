
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateArticleTitles, improveTitle, suggestHashtags, translateTitle, analyzeTitle } from '../utils/groqNews';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';

/**
 * Page allowing users to generate catchy article titles via Groq’s Mixtral model.
 * Falls back gracefully when the API fails.
 */
export default function TitleGenerator() {
  const { setContext, setOnAction } = useChatContext();
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState('');
  const [toolLoading, setToolLoading] = useState(false);
  const [toolError, setToolError] = useState(null);
  const [toolResponse, setToolResponse] = useState('');
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

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
    setContext(titles.join('\n'));
    setOnAction(() => (cmd) => {
      if (cmd.startsWith('regenerate')) handleGenerate(topic);
    });
    return () => {
      setOnAction(null);
      setContext('');
    };
  }, [titles, topic]);

  const handleGenerate = async (forced) => {
    const q = (forced ?? topic).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateArticleTitles(q, 5, lang);
      if (!res || res.length === 0) {
        setError("Impossible de générer des titres pour le moment.");
      } else {
        setTitles(res);
        setSelected(res[0]);
      }
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l'appel API");
    } finally {
      setLoading(false);
    }
  };

  const runTool = async (fn) => {
    if (!selected) return;
    setToolLoading(true);
    setToolError(null);
    try {
      const res = await fn(selected, lang);
      const formatted =
        typeof res === 'string'
          ? res
          : res && typeof res === 'object'
          ? JSON.stringify(res, null, 2)
          : '';
      setTimeout(() => {
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
    { id: 'improve', label: 'Améliorer', action: () => runTool(improveTitle) },
    { id: 'hashtags', label: 'Hashtags', action: () => runTool(suggestHashtags) },
    { id: 'translate', label: 'Traduire', action: () => runTool(translateTitle) },
    { id: 'opinion', label: "Avis de l'IA", action: () => runTool(analyzeTitle) },
  ];

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Générateur de titres d'articles</h1>
      <div className="flex space-x-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Sujet de l'article..."
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <button
          disabled={loading}
          onClick={handleGenerate}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? '...':'Générer'}
        </button>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {titles.map((t) => (
          <li
            key={t}
            onClick={() => setSelected(t)}
            className={`p-3 rounded shadow cursor-pointer bg-white dark:bg-gray-900 dark:text-white ${selected === t ? 'ring-2 ring-brand-500' : ''}`}
          >
            {t}
          </li>
        ))}
      </motion.ul>

      {titles.length > 0 && (
        <>
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate(topic)}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            >
              Regénérer
            </button>
            <button
              onClick={() => navigate(`/content?topic=${encodeURIComponent(selected)}`)}
              className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-600 text-sm"
            >
              Valider
            </button>
          </div>

          <div className="magic-section">
            <h2 className="font-medium text-white">Outils IA</h2>
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={t.action}
                  className="btn-magic text-sm"
                >
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
    </div>
  );
}
