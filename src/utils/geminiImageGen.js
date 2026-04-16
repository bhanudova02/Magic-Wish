const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateImageWithGemini = async (prompt, imageURL, coverURL) => {
    try {
        console.log("Generating with Google Imagen API using prompt:", prompt);
        
        // Google Imagen API requires instances with a prompt for image generation.
        // Direct face-swapping via reference image might be limited by safety/API constraints,
        // so we incorporate the prompt to guide the image generation as closely as possible.
        const requestBody = {
            instances: [
                {
                    prompt: "Highly detailed illustration: " + prompt + ". The character should perfectly blend into the scene with consistent art style."
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "1:1" // Or "3:4" depending on book cover size
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Failed to generate via Google Imagen API");
        }

        const data = await response.json();
        console.log("Imagen API Response status:", data.predictions ? "Success" : "Failed");
        
        // Extract the base64 image from the predictions array
        if (data.predictions && data.predictions.length > 0) {
            const base64Image = data.predictions[0].bytesBase64Encoded;
            const mimeType = data.predictions[0].mimeType || 'image/png';
            const dataUrl = `data:${mimeType};base64,${base64Image}`;
            
            return {
                status: 'completed',
                output_url: dataUrl
            };
        } else {
             throw new Error("No predictions returned from Google Imagen API");
        }
    } catch (error) {
        console.error('Imagen API Error:', error);
        throw error;
    }
};
