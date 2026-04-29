import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { GoogleGenAI, Modality } from '@google/genai';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || 'gen-lang-client-0355152847';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || process.env.GCP_LOCATION || 'global';
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview';

const DEFAULT_PROMPT = `Use the child reference image ONLY as the identity source.

IMPORTANT:
- Preserve facial identity as closely as possible
- Do NOT create a new face or reinterpret facial structure
- Keep eyes, nose, lips, jawline consistent with reference image

Expression:
- Adapt expression to match the storybook character scene
- Do NOT copy expression from reference image

Style:
- Soft illustrated children's book style
- Natural integration into scene

Scene:
- Preserve the original storybook cover composition, background, props, lighting, text placement, and overall art direction
- Replace only the main child character identity using the child reference image

Goal:
The same child must be clearly recognizable across the image.`;

function normalizeCredentialsJson(value) {
  if (!value) return null;

  const trimmed = value.trim();

  try {
    const parsed = JSON.parse(trimmed);

    if (typeof parsed === 'string') {
      return parsed;
    }

    return JSON.stringify(parsed);
  } catch {
    return trimmed;
  }
}

async function configureGoogleCredentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return;
  }

  const credentialsJson = normalizeCredentialsJson(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  try {
    JSON.parse(credentialsJson);
  } catch {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON. Paste the full service account JSON value in Vercel.');
  }

  const credentialsPath = path.join(os.tmpdir(), 'google-application-credentials.json');
  await fs.writeFile(credentialsPath, credentialsJson);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
}

async function fetchImageAsInlineData(imageUrl, label) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Could not fetch ${label} image.`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  return {
    inlineData: {
      mimeType: contentType.split(';')[0],
      data: Buffer.from(arrayBuffer).toString('base64')
    }
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { photo, bookCover, prompt, aspectRatio = '4:3' } = req.body;

  if (!photo || !bookCover) {
    return res.status(400).json({ error: 'Missing required parameters: photo and bookCover' });
  }

  try {
    await configureGoogleCredentials();

    const [childImage, storybookImage] = await Promise.all([
      fetchImageAsInlineData(photo, 'child reference'),
      fetchImageAsInlineData(bookCover, 'storybook cover')
    ]);

    const ai = new GoogleGenAI({
      vertexai: true,
      project: PROJECT_ID,
      location: LOCATION
    });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'This is the reference face.' },
            childImage,
            { text: 'This is the base storybook cover image to modify.' },
            storybookImage,
            { text: String(prompt || DEFAULT_PROMPT).trim() }
          ]
        }
      ],
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          aspectRatio
        }
      }
    });

    const generatedPart = response.candidates
      ?.flatMap((candidate) => candidate.content?.parts || [])
      .find((part) => part.inlineData?.data);

    if (!generatedPart?.inlineData?.data) {
      return res.status(502).json({
        error: 'No image was returned. It may have been blocked by a safety filter.'
      });
    }

    const mimeType = generatedPart.inlineData.mimeType || 'image/png';
    const result = `data:${mimeType};base64,${generatedPart.inlineData.data}`;

    return res.status(200).json({
      result,
      mimeType,
      model: MODEL
    });
  } catch (error) {
    console.error('FaceSwap Error:', error);
    return res.status(500).json({ error: error.message || 'Image generation failed.' });
  }
}
