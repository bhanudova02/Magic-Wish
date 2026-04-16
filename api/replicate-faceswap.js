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

  // ---- Handle Character Swap (POST) - InstantID Implementation ----
  const { photo, bookCover, prompt, name } = req.body;

  if (!photo || !bookCover) {
    return res.status(400).json({ error: 'Missing required parameters: photo and bookCover' });
  }

  try {
    /**
     * Model: lucataco/instantid
     * This is an Identity-Preserving Generation model.
     * It uses the child's photo for identity and the book cover for structure (pose/background).
     */
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // InstantID version that supports high-quality blending
        version: "f2c418641bc3c60b540134421b476e3da8f80f9cb650a31633513a962a66f00f",
        input: {
          image: bookCover,      // Reference for background and pose
          face_image: photo,     // Identity source
          prompt: prompt || `A professional cinematic storybook character for ${name || 'the child'}, high resolution, 8k, magical lighting, matching the book cover style`,
          negative_prompt: "(lowres, low quality, worst quality:1.2), (text:1.2), watermark, deformed face, ugly, cartoonish features, distorted, blurry",
          identity_strength: 0.8,
          adapter_strength: 0.8,
          cfg: 4.5,
          steps: 30,
          enhance_face: true,
          scheduler: "EulerDiscreteScheduler"
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
