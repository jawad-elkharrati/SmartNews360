export async function searchPexelsImages(query, perPage = 20) {
  const apiKey = import.meta.env.VITE_PEXELS_KEY;
  if (!apiKey) throw new Error('VITE_PEXELS_KEY not set');
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`Pexels error ${res.status}`);
  const json = await res.json();
  const photos = json.photos || [];
  return photos.map(p => ({ id: p.id, src: p.src.medium, alt: p.alt || '', url: p.url }));
}
