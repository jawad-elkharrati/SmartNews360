export async function fetchTechNews(count = 6) {
  const url = `/api/mediastack?count=${count}`;
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
