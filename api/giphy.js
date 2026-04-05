export default async function handler(req, res) {
  const { endpoint, q, limit = 24, offset = 0 } = req.query;

  const API_KEY = process.env.GIPHY_API_KEY;

  let url = `https://api.giphy.com/v1/gifs/${endpoint}?api_key=${API_KEY}&limit=${limit}&offset=${offset}`;

  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GIFs' });
  }
}