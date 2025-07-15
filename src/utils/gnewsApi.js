export async function fetchGNewsArticles(count = 20, lang = 'fr', page = 1) {
  const apiKey = import.meta.env.VITE_GNEWS_KEY;
  if (!apiKey) throw new Error('VITE_GNEWS_KEY not set');
  const url = `https://gnews.io/api/v4/top-headlines?lang=${lang}&token=${apiKey}&max=${count}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GNews error ${res.status}`);
  const json = await res.json();
  const articles = json.articles || [];
  return articles.slice(0, count).map((a) => ({
    title: a.title,
    description: a.description,
    image: a.image,
    url: a.url,
    publishedAt: a.publishedAt,
    source: a.source?.name || ''
  }));
}
