export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { q = '' } = req.query;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=fr&gl=FR&ceid=FR:fr`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SmartNews360/1.0)',
        Accept: 'application/rss+xml',
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Google RSS proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
