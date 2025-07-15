export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const apiKey = process.env.SERPER_KEY || process.env.VITE_SERPER_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'SERPER_KEY env variable not set' });
  }
  const { q = '' } = req.query;
  const body = JSON.stringify({ q: `${q} site:medium.com`, gl: 'fr', num: 5 });
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Serper proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
