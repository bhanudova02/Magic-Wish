const API_KEY = import.meta.env.VITE_MAGIC_HOUR_API_KEY;
const BASE_URL = 'https://api.magichour.ai/v1';

export const createFaceSwapJob = async (imageURL, coverURL) => {
    try {
        const response = await fetch(`${BASE_URL}/face-swap-photo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assets: {
                    source_file_path: imageURL, // Child photo (source of face)
                    target_file_path: coverURL   // Book cover (where to put the face)
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to start Magic Hour job');
        }

        return await response.json();
    } catch (error) {
        console.error('Magic Hour Job Creation Error:', error);
        throw error;
    }
};

export const getJobStatus = async (projectId) => {
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get job status');
        }

        return await response.json();
    } catch (error) {
        console.error('Magic Hour Status Error:', error);
        throw error;
    }
};
