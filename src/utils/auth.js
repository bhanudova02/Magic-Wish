const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const SHOP_ID = import.meta.env.VITE_SHOPIFY_SHOP_ID;

// Helper to generate a random string for state and verifier
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// SHA-256 hashing for PKCE
const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
};

// Base64Url encoding
const base64urlencode = (a) => {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const generateCodeVerifier = () => generateRandomString(128);

export const generateCodeChallenge = async (codeVerifier) => {
    const hashed = await sha256(codeVerifier);
    return base64urlencode(hashed);
};

export const getAuthorizeUrl = async () => {
    const codeVerifier = generateCodeVerifier();
    const state = generateRandomString(32);
    const nonce = generateRandomString(32);
    
    // Save these to use in the callback
    localStorage.setItem('shopify_code_verifier', codeVerifier);
    localStorage.setItem('shopify_auth_state', state);
    localStorage.setItem('shopify_auth_nonce', nonce);

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Use the current origin for the redirect URI
    const redirectUri = `${window.location.origin}/callback`;
    
    const scope = 'openid email customer_read_customers customer_read_orders';
    
    const url = new URL(`https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`);
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('scope', scope);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');

    return url.toString();
};

export const exchangeCodeForToken = async (code) => {
    const codeVerifier = localStorage.getItem('shopify_code_verifier');
    const redirectUri = `${window.location.origin}/callback`;

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', CLIENT_ID);
    body.append('redirect_uri', redirectUri);
    body.append('code', code);
    body.append('code_verifier', codeVerifier);

    const response = await fetch(`https://shopify.com/authentication/${SHOP_ID}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to exchange code for token');
    }

    const data = await response.json();
    return data; // contains access_token, id_token, expires_in
};

export const logout = () => {
    localStorage.removeItem('shopify_access_token');
    localStorage.removeItem('shopify_id_token');
    localStorage.removeItem('shopify_user');
    window.location.href = '/';
};
