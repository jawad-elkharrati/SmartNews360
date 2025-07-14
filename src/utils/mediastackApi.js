export async function fetchTechNews(count = 6) {
  const apiKey = import.meta.env.VITE_MEDIASTACK_KEY;
  if (!apiKey) throw new Error('VITE_MEDIASTACK_KEY not set');
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=fr&categories=technology&sort=published_desc&limit=${count}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mediastack error ${res.status}`);
  const json = await res.json();
  const articles = json.data || [];
  return articles.map((a) => ({
    title: a.title,
    description: a.description,
    image: a.image,
    url: a.url,
    source: a.source,
    published_at: a.published_at,
  }));
}
