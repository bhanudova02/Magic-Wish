/**
 * Fal.ai API Utility
 * This utility calls our internal Vercel function to handle Fal.ai magic transforms.
 */

export const startFalSwap = async (photo, bookCover, prompt) => {
    try {
        const response = await fetch('/api/fal-faceswap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo, bookCover, prompt })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to start Fal.ai magic transformation');
        }

        const data = await response.json();
        
        // Fal.ai usually returns the final image in the 'image' field for synchronous calls
        // or inside an 'image' object with 'url'.
        if (data.image && data.image.url) {
            return data.image.url;
        } else if (data.url) {
            return data.url;
        }
        
        throw new Error('Could not retrieve generated image from Fal.ai');
    } catch (error) {
        console.error("Fal.ai Utility Error:", error);
        throw error;
    }
};
