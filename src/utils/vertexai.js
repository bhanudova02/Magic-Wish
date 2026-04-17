/**
 * Utility to communicate with Vertex AI API for personalized book features.
 */

export const generateWithVertexAI = async (photoUrl, bookCoverUrl, prompt) => {
    try {
        const response = await fetch('/api/vertex-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                photo: photoUrl,
                bookCover: bookCoverUrl,
                prompt: prompt
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to call Vertex AI');
        }

        return await response.json();
    } catch (error) {
        console.error('Vertex AI Utility Error:', error);
        throw error;
    }
};
