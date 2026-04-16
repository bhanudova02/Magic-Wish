/**
 * Replicate API Utility
 * This utility calls our internal Vercel function to handle Replicate predictions.
 */

export const startReplicateSwap = async (photo, bookCover, prompt) => {
    try {
        const response = await fetch('/api/replicate-faceswap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo, bookCover, prompt })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to start Replicate job');
        }

        return await response.json();
    } catch (error) {
        console.error("Replicate Utility Error:", error);
        throw error;
    }
};

export const checkReplicateStatus = async (predictionId) => {
    try {
        const response = await fetch(`/api/replicate-faceswap?id=${predictionId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to check Replicate status');
        }

        return await response.json();
    } catch (error) {
        console.error("Replicate Status Error:", error);
        throw error;
    }
};
