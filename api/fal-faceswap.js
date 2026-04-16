export default async function handler(req, res) {
  // --- CORS Headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FAL_KEY = process.env.FAL_KEY;

  if (!FAL_KEY) {
    return res.status(500).json({ error: 'FAL_KEY is not configured on the server.' });
  }

  const { photo, bookCover, prompt } = req.body;

  if (!photo || !bookCover) {
    return res.status(400).json({ error: 'Missing required parameters: photo and bookCover' });
  }

  try {
    /**
     * Model: fal-ai/face-swap
     * This is Fal.ai's high-speed face swap that works exceptionally well with 
     * both real and stylized (cartoon) targets.
     */
    const response = await fetch('https://fal.run/fal-ai/face-swap', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_image_url: bookCover, // The original book cover
        swap_image_url: photo,     // The child's photo
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Fal.ai API error: ${response.status} - ${errBody}`);
    }

    const result = await response.json();
    
    // Fal.ai returns the result immediately (synchronous) or with a request_id
    // For face-swap it's usually immediate.
    return res.status(200).json(result);

  } catch (error) {
    console.error('Fal.ai Prediction Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
