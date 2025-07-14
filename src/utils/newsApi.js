export async function fetchTrendingTopicsNewsApi(count = 6) {
  const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
  if (!apiKey) throw new Error('VITE_NEWSAPI_KEY not set');
  const url = `https://newsapi.org/v2/top-headlines?country=ma&pageSize=${count}&apiKey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NewsAPI error ${res.status}`);
  const json = await res.json();
  const articles = json.articles || [];

  return articles.slice(0, count).map((a) => {
    const published = a.publishedAt ? new Date(a.publishedAt) : new Date();
    const mins = Math.round((Date.now() - published.getTime()) / 60000);
    const timeAgo = mins < 60
      ? `${mins} min`
      : `${Math.round(mins / 60)} h`;
    const change = Math.random() > 0.5 ? `+${Math.floor(Math.random()*50)}%` : `-${Math.floor(Math.random()*50)}%`;
    return {
      category: a.source?.name || 'Général',
      title: a.title,
      timeAgo,
      change,
    };
  });
}
