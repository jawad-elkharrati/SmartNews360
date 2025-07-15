export async function fetchGoogleRssArticles(query, count = 6) {
  const url = `/api/googleNewsRss?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google RSS error ${res.status}`);
  const xml = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item'));
  return items.slice(0, count).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
    url: item.querySelector('link')?.textContent || '',
    image:
      item.querySelector('media\\:content')?.getAttribute('url') ||
      item.querySelector('enclosure')?.getAttribute('url') || '',
    publishedAt: item.querySelector('pubDate')?.textContent || '',
  }));
}
