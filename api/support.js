export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, category, message } = req.body;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    const shopDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'storytimekid.myshopify.com';

    if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Shopify Credentials not configured' });
    }

    try {
        // 1. Get Access Token using Client Credentials (2026 Modern Method)
        const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            throw new Error('Failed to obtain access token');
        }

        // 2. Search for customer by email
        const searchResponse = await fetch(`https://${shopDomain}/admin/api/2026-04/customers/search.json?query=email:${email}`, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json'
            }
        });
        
        const searchData = await searchResponse.json();
        const customers = searchData.customers;

        if (customers && customers.length > 0) {
            const customer = customers[0];
            const currentNote = customer.note || "";
            const newNote = `${currentNote}\n\n--- Support Request (${new Date().toLocaleDateString()}) ---\nCategory: ${category}\nMessage: ${message}\n-----------------------------------`.trim();

            // 3. Update customer note
            await fetch(`https://${shopDomain}/admin/api/2026-04/customers/${customer.id}.json`, {
                method: 'PUT',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer: {
                        id: customer.id,
                        note: newNote
                    }
                })
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Support API 2026 Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
