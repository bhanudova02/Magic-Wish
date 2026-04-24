import Replicate from 'replicate';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { photo, bookCover } = req.body;

  if (!photo || !bookCover) {
    return res.status(400).json({ error: 'Missing required parameters: photo and bookCover' });
  }

  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN is not configured.' });
  }

  try {
    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    });

    console.log('Starting FaceSwap on MagicWish...');
    
    // Using the same high-quality model from the previous project
    const output = await replicate.run(
      "fofr/face-swap-with-ideogram",
      {
        input: {
          cleanup: false,
          target_image: bookCover,
          character_image: photo,
        }
      }
    );

    console.log('FaceSwap complete:', output);

    // Some models return an array of strings, others a single string
    const resultUrl = Array.isArray(output) ? output[0] : output;

    return res.status(200).json({ result: resultUrl });
  } catch (error) {
    console.error('Replicate Error:', error);
    return res.status(500).json({ error: error.message || 'Face swap failed' });
  }
}
