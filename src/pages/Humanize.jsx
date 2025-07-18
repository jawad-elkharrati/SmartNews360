import React, { useState } from 'react';
import { humanizeText } from '../utils/groqNews';
import { Brain, Loader2, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Humanize() {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState(location.state?.text || '');
  const [tone, setTone] = useState('conversation');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [compare, setCompare] = useState(false);

  const handle = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await humanizeText(input, tone);
      setResult(res);
      alert('Texte humanisé avec succès');
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'humanisation");
    } finally {
      setLoading(false);
    }
  };

  const replaceOriginal = () => setInput(result);
  const copyResult = () => navigator.clipboard.writeText(result).catch(() => {});
  const chooseImage = () => {
    const title = location.state?.title || '';
    const paragraphs = result
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    navigate('/images', {
      state: {
        keywords: title,
        title,
        paragraphs,
      },
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="bg-brand-100 text-brand-700 rounded-xl p-3 text-center text-sm">
        🚀 Nouveau : Boostez la qualité de vos contenus IA avec un style 100% humain.
      </div>
      <h1 className="text-2xl font-semibold flex items-center gap-2 dark:text-gray-100">
        <Brain className="h-6 w-6" /> Humaniser le texte généré
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Apportez une touche humaine à vos articles générés par IA — plus de fluidité, plus d’émotion, plus d’impact.</p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Insérez ici le texte à humaniser…"
        className="w-full h-[200px] p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="tone"
            value="soft"
            checked={tone === 'soft'}
            onChange={(e) => setTone(e.target.value)}
          />
          Titre doux
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="tone"
            value="professional"
            checked={tone === 'professional'}
            onChange={(e) => setTone(e.target.value)}
          />
          Ton professionnel
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="tone"
            value="conversation"
            checked={tone === 'conversation'}
            onChange={(e) => setTone(e.target.value)}
          />
          Ton conversationnel
        </label>
      </div>
      <button
        onClick={handle}
        disabled={loading}
        className="px-4 py-2 text-white rounded-xl flex items-center justify-center hover:bg-[#1c64d1] disabled:opacity-60"
        style={{ backgroundColor: '#2D7EF7' }}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Humanisation en cours...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" /> Humaniser le contenu ✨
          </>
        )}
      </button>
      {result && (
        <div className="space-y-2">
          <div className="bg-[#F9FAFB] border border-blue-200 p-4 rounded-xl relative">
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-100">{result}</p>
            <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 italic">Généré par notre moteur d’humanisation IA groq</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={replaceOriginal} className="px-3 py-1 border rounded text-sm">Remplacer le texte original</button>
            <button onClick={copyResult} className="px-3 py-1 border rounded text-sm">Copier le résultat</button>
            <button onClick={chooseImage} className="px-3 py-1 border rounded text-sm">Choisir une image</button>
            {result && (
              <label className="flex items-center gap-1 text-sm ml-auto">
                <input type="checkbox" checked={compare} onChange={() => setCompare(!compare)} /> Comparer Avant / Après
              </label>
            )}
          </div>
          {compare && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <h3 className="font-medium text-red-700 mb-1">Avant</h3>
                <p className="whitespace-pre-wrap text-sm text-red-700">{input}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                <h3 className="font-medium text-green-700 mb-1">Après</h3>
                <p className="whitespace-pre-wrap text-sm text-green-700">{result}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
