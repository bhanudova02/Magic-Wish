export default async function handler(req, res) {
  // --- CORS Headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN is not configured on the server.' });
  }

  // ---- Handle Polling (GET ?id=...) ----
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Prediction ID required' });

    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: {
          Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Replicate polling error: ${response.status} - ${errBody}`);
      }

      const prediction = await response.json();
      return res.status(200).json(prediction);
    } catch (error) {
      console.error('Replicate Polling Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // ---- Handle Face Swap (POST) ----
  const { photo, bookCover } = req.body;

  if (!photo || !bookCover) {
    return res.status(400).json({ error: 'Missing required parameters: photo and bookCover' });
  }

  try {
    /**
     * Model: yan-ops/face-swap
     * This model works on BOTH real photos AND cartoon/stylized images.
     * It swaps the face from `swap_image` onto the target `target_image`.
     * Docs: https://replicate.com/yan-ops/face-swap
     */
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait=5',
      },
      body: JSON.stringify({
        version: 'cff87316e31787df0a317cd3f8dbb9ae516bcb903b8f06d3d872b93e9b5df83c',
        input: {
          // The child's real photo — this face will be transferred
          swap_image: photo,
          // The stylized book cover — this is the target canvas
          target_image: bookCover,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Replicate API error: ${response.status} - ${errBody}`);
    }

    const prediction = await response.json();
    return res.status(201).json(prediction);
  } catch (error) {
    console.error('Replicate Prediction Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
