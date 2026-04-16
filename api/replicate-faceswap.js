import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  // Handle Polling (GET request with id)
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Prediction ID required' });

    try {
      const prediction = await replicate.predictions.get(id);
      return res.status(200).json(prediction);
    } catch (error) {
      console.error("Replicate Polling Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle Initial Request (POST)
  const { photo, bookCover, prompt } = req.body;

  if (!photo || !bookCover) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Model: lucataco/instantid
    // We use the book cover as the pose/reference and the photo as the face
    const prediction = await replicate.predictions.create({
      version: "09e7ef580bc9b3922f28a9947fd9c44d1885b542095874288b8d4c2ceb90c10a", 
      input: {
        face_image: photo,
        pose_image: bookCover,
        prompt: prompt || "Professional storybook illustration, high quality, consistent character",
        negative_prompt: "bad quality, blurry, distorted face, extra limbs",
        num_inference_steps: 30,
        guidance_scale: 5,
        identity_strength: 0.8,
        adapter_strength: 0.8
      }
    });

    return res.status(201).json(prediction);
  } catch (error) {
    console.error("Replicate Prediction Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
