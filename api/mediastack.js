export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.MEDIASTACK_KEY || process.env.VITE_MEDIASTACK_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'MEDIASTACK_KEY env variable not set' });
  }

  const { count = 6 } = req.query;
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=fr&categories=technology&sort=published_desc&limit=${count}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Mediastack proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
