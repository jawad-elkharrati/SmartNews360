export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GROQ_KEY || process.env.VITE_GROQ_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_KEY env variable not set' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Groq proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
