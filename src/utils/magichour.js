const API_KEY = import.meta.env.VITE_MAGIC_HOUR_API_KEY;
const BASE_URL = 'https://api.magichour.ai/v1';

export const createFaceSwapJob = async (imageURL, coverURL) => {
    try {
        // 1. Generate upload URLs for both assets
        const uploadUrlsRes = await fetch(`${BASE_URL}/files/upload-urls`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    { type: 'image', extension: 'jpg' }, // source child face
                    { type: 'image', extension: 'jpg' }  // target book cover
                ]
            })
        });

        if (!uploadUrlsRes.ok) {
            throw new Error('Failed to generate upload URLs');
        }

        const uploadUrlsData = await uploadUrlsRes.json();
        const sourceAsset = uploadUrlsData.items[0];
        const targetAsset = uploadUrlsData.items[1];
        
        // 2. Fetch the external images as blobs
        const sourceBlobRes = await fetch(imageURL);
        const sourceBlob = await sourceBlobRes.blob();
        
        const targetBlobRes = await fetch(coverURL);
        const targetBlob = await targetBlobRes.blob();
        
        // 3. Upload them to Magic Hour using the presigned URLs
        await fetch(sourceAsset.upload_url, { method: 'PUT', body: sourceBlob });
        await fetch(targetAsset.upload_url, { method: 'PUT', body: targetBlob });

        // 4. Create face-swap job
        const response = await fetch(`${BASE_URL}/face-swap-photo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assets: {
                    source_file_path: sourceAsset.file_path,
                    target_file_path: targetAsset.file_path
                }
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to start Magic Hour job');
        }

        return await response.json();
    } catch (error) {
        console.error("Magic Hour Error:", error);
        throw error;
    }
};

export const getJobStatus = async (projectId) => {
    try {
        const response = await fetch(`${BASE_URL}/image-projects/${projectId}`, {
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
