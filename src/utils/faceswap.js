/**
 * Storybook face swap utility.
 * Calls the server API that runs the Google Vertex AI Gemini image editor.
 */

export const startFaceSwap = async ({ photo, bookCover, prompt, aspectRatio = '4:3' }) => {
    try {
        const response = await fetch('/api/faceswap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo, bookCover, prompt, aspectRatio })
        });

        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || 'Failed to generate personalized cover');
        }

        return payload;
    } catch (error) {
        console.error("FaceSwap Utility Error:", error);
        throw error;
    }
};
