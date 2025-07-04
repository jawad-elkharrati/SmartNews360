
/**
 * Helpers to call Groq API safely from the browser using the Vite dev‑proxy (/api/groq).
 * Production build still needs a backend (or serverless function) that forwards the
 * request to https://api.groq.com/openai/v1/chat/completions and injects the secret key.
 *
 * All helpers below return clean JS structures (array / object) ready for UI consumption.
 *
 *  ▸ Requires VITE_GROQ_KEY in your .env  (only used in dev thanks to vite.config.js proxy)
 */

const ENDPOINT = '/api/groq'; // Vite proxy rewrites this in dev

async function groqRequest({ messages, temperature = 0.8, max_tokens = 512 }) {
  const apiKey = import.meta.env.VITE_GROQ_KEY;
  /* In production on Vercel, the API key is injected by the /api/groq
   serverless function, so it's optional on the client side. */

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq error ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Return N ≤10 short Moroccan news headlines (≤80 chars each)
 * @param {number} count
 * @returns {Promise<string[]>}
 */
export async function fetchHeadlines(count = 10) {
  const json = await groqRequest({
    messages: [
      {
        role: 'system',
        content: `You are a Moroccan news bot. Reply with exactly ${count} concise French headlines (≤80 char each), one per line, no numbering.`,
      },
      {
        role: 'user',
        content: 'Donne-moi les toutes dernières actualités au Maroc.',
      },
    ],
    max_tokens: 300,
  });

  const raw = json.choices?.[0]?.message?.content ?? '';
  return raw
    .split('\n')
    .map((h) => h.replace(/^[-*\d\.\)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, count);
}

/**
 * Returns an array of objects: [{title, summary}]
 * @param {number} count
 * @returns {Promise<Array<{title:string, summary:string}>>}
 */

export async function fetchNewsCards(count = 10) {
  const json = await groqRequest({
    messages: [
      {
        role: 'system',
        content: `You are a Moroccan news bot. Provide a JSON array of ${count} objects with keys 'title' (≤80 char) and 'summary' (≤180 char).`,
      },
      { role: 'user', content: 'Donne-moi les dernières nouvelles au Maroc avec un résumé.' },
    ],
    max_tokens: 1200,
  });

  const raw = json.choices?.[0]?.message?.content ?? '[]';
  let arr = [];
  try {
    // Extract the JSON block even if preceded by text
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      arr = JSON.parse(raw.slice(start, end + 1));
    } else {
      arr = JSON.parse(raw);
    }
  } catch (e) {
    console.error('parse news cards', e);
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    // fallback to headlines
    return (await fetchHeadlines(count)).map((title) => ({ title, summary: '' }));
  }
  return arr.slice(0, count);
}


export const fetchRandomMoroccoNews = async () => (await fetchHeadlines(1))[0];

/**
 * Fetch trending topics
 * @param {number} count
 * @returns {Promise<Array<{category:string,title:string,timeAgo:string,change:string}>>}
 */
export async function fetchTrendingTopics(count = 6) {
  const json = await groqRequest({
    messages: [
      {
        role: 'system',
        content: `Generate a JSON array of ${count} objects with keys 'category', 'title', 'timeAgo', 'change'. Categories in French (Sport, Politique, Technologie, etc.). 'change' with + or - percentage.`,
      },
      { role: 'user', content: 'Donne-moi les tendances actuelles.' },
    ],
    max_tokens: 800,
  });
  const raw = json.choices?.[0]?.message?.content ?? '[]';
  try {
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      return JSON.parse(raw.slice(start, end + 1)).slice(0, count);
    }
    return JSON.parse(raw).slice(0, count);
  } catch (e) {
    console.error('parse trending topics', e);
    return [];
  }
}

/**
 * Fetch AI article recommendations
 * @param {number} count
 * @returns {Promise<string[]>}
 */
export async function fetchAIRecommendations(count = 3) {
  const json = await groqRequest({
    messages: [
      {
        role: 'system',
        content: `Return exactly ${count} catchy French article headlines, one per line.`,
      },
      { role: 'user', content: "Génère des recommandations d'articles." },
    ],
    max_tokens: 400,
  });
  const raw = json.choices?.[0]?.message?.content ?? '';
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, count);
}

/**
 * Generate catchy French article titles about a given topic.
 * @param {string} topic  Sujet demandé par l'utilisateur
 * @param {number} count  Nombre de titres souhaités (<=10)
 * @returns {Promise<string[]>}
 */
export async function generateArticleTitles(topic, count = 6) {
  if (!topic || topic.trim().length === 0) return [];
  const q = topic.trim();
  const json = await groqRequest({
    messages: [
      {
        role: 'system',
        content: `You are a seasoned French copywriter specialized in punchy news headlines. Return exactly ${count} catchy French article titles (≤80 char), one per line, no numbering, about the topic below.`,
      },
      { role: 'user', content: q },
    ],
    max_tokens: 400,
  });
  const raw = json.choices?.[0]?.message?.content ?? '';
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, count);
}

/**
 * Génère un article complet (paragraphes en français) à partir d’un sujet.
 * @param {string} topic    Sujet de l’article
 * @param {number} sections Nombre de paragraphes (3–8 max pour limiter le coût)
 * @returns {Promise<string[]>}  Tableau de paragraphes, ordre conservé
 */
export async function generateArticleContent(topic, sections = 4) {
  if (!topic?.trim()) return [];

  const json = await groqRequest({
    messages: [
      {
        role: 'system',
        content: `Tu es un journaliste marocain expérimenté. Rédige exactement ${sections} paragraphes cohérents (100–140 mots chacun), riches en faits et style magazine, sans titres ni puces, en français.`,
      },
      { role: 'user', content: topic.trim() },
    ],
    temperature: 0.85,
    max_tokens: sections * 160,
  });

  const raw = json.choices?.[0]?.message?.content ?? '';
  return raw
    .split(/\n{2,}/)         // coupe sur les doubles retours
    .map(p => p.trim())
    .filter(Boolean)
    .slice(0, sections);
}
