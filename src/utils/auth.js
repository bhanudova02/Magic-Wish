const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const SHOP_ID = import.meta.env.VITE_SHOPIFY_SHOP_ID;
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

const TOKEN_STORAGE_KEYS = [
    'shopify_access_token',
    'shopify_id_token',
    'shopify_refresh_token',
    'shopify_token_expires_at',
    'shopify_user',
];

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
    
    const scope = 'openid email customer-account-api:full';
    
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

export const getStoredTokenExpiry = () => {
    const expiresAt = Number(localStorage.getItem('shopify_token_expires_at'));
    return Number.isFinite(expiresAt) ? expiresAt : 0;
};

export const isAccessTokenExpired = () => {
    const token = localStorage.getItem('shopify_access_token');
    const expiresAt = getStoredTokenExpiry();

    if (!token) return true;
    if (!expiresAt) return false;

    return Date.now() + TOKEN_EXPIRY_BUFFER_MS >= expiresAt;
};

export const persistAuthTokens = (tokens) => {
    if (tokens.access_token) {
        localStorage.setItem('shopify_access_token', tokens.access_token);
    }

    if (tokens.id_token) {
        localStorage.setItem('shopify_id_token', tokens.id_token);
    }

    if (tokens.refresh_token) {
        localStorage.setItem('shopify_refresh_token', tokens.refresh_token);
    }

    if (tokens.expires_in) {
        localStorage.setItem('shopify_token_expires_at', String(Date.now() + tokens.expires_in * 1000));
    }
};

export const clearAuthStorage = () => {
    TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('shopify_refresh_token');

    if (!refreshToken) {
        const error = new Error('No refresh token available');
        error.name = 'AuthRefreshError';
        throw error;
    }

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', CLIENT_ID);
    body.append('refresh_token', refreshToken);

    const response = await fetch(`https://shopify.com/authentication/${SHOP_ID}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        let message = 'Failed to refresh access token';

        try {
            const error = await response.json();
            message = error.error_description || error.error || message;
        } catch {
            // Keep the generic message when Shopify does not return JSON.
        }

        const error = new Error(message);
        error.name = 'AuthRefreshError';
        throw error;
    }

    const data = await response.json();
    persistAuthTokens(data);

    return data;
};

export const getValidCustomerAccessToken = async () => {
    if (!isAccessTokenExpired()) {
        return localStorage.getItem('shopify_access_token')?.trim() || '';
    }

    const tokens = await refreshAccessToken();
    return tokens.access_token?.trim() || localStorage.getItem('shopify_access_token')?.trim() || '';
};

export const logout = () => {
    clearAuthStorage();
    localStorage.removeItem('magicwish_cart'); // Clear cart on logout
    window.location.href = '/';
};
