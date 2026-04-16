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
     * Model: codeplugtech/face-swap
     * Verified working model that swaps faces on both real and cartoon images.
     * input_image = target (book cover), swap_image = face source (child's photo)
     * Docs: https://replicate.com/codeplugtech/face-swap
     */
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait=5',
      },
      body: JSON.stringify({
        version: '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34',
        input: {
          // The stylized book cover — the target canvas
          input_image: bookCover,
          // The child's real photo — this face will be swapped onto the cover
          swap_image: photo,
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
