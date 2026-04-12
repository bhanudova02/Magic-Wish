# 📘 Shopify Google OAuth Integration - Status Report

This document records the progress, architecture, and current status of the Shopify "New Customer Accounts" (Google OAuth) integration for the MagicWish project.

## 🎯 Goal
Implement a seamless, passwordless login flow using Shopify's native Google OAuth (Customer Account API) for a headless React storefront.

## 🛠️ Implementation Details

### 1. Security Logic (`src/utils/auth.js`)
- Implemented **PKCE (Proof Key for Code Exchange)** using SHA-256 for secure OAuth 2.0 flow.
- Added helper functions for generating random strings and code challenges.
- Configured authorization and token endpoints pointing to `shopify.com/authentication/{SHOP_ID}/...`.

### 2. State Management (`src/context/AuthContext.jsx`)
- Created a global `AuthProvider` to manage `user`, `accessToken`, and `isAuthenticated` status.
- Session persistence implemented via `localStorage`.
- Automatic profile fetching using the Customer Account GraphQL API.

### 3. UI Components
- **`src/pages/LoginPage.jsx`**: Premium "Continue with Google" entry point.
- **`src/pages/AuthCallback.jsx`**: Logic to handle the redirect from Shopify, exchange the code for a token, and redirect to the profile.
- **`src/pages/ProfilePage.jsx`**: Secure page displaying user info and "Logout" button.
- **`src/components/Navbar.jsx`**: Dynamic user icon that changes based on auth state (shows initials when logged in).

### 4. Routing (`src/App.jsx`)
- Added `/login`, `/callback`, and `/profile` routes.
- Wrapped the entire app in `AuthProvider`.

## 🚧 Current Status & Blockers

### Old Store (`cwytui-ah.myshopify.com`)
- **Blocker**: The "New Customer Accounts" feature showed as **"Unavailable on your plan"** in Shopify Settings.
- **Result**: Redirected users to a "Domain Setup" page or 404 instead of the Google Login screen.

### New Store Migration (`t1pz2e-mg.myshopify.com`)
- **Status**: The user created a new store where the feature **IS AVAILABLE**.
- **Shop ID**: `77750665316`
- **Domain**: `t1pz2e-mg.myshopify.com`

## ⏭️ Next Steps (Action Items)

1.  **Configure Headless Channel**:
    - Add "Headless" sales channel in the NEW store.
    - Set up **Customer Account API** (Public type).
    - Add Callback URIs: `https://magic-wish.vercel.app/callback` and `http://localhost:5173/callback`.
    - Add Javascript Origins: `https://magic-wish.vercel.app` and `http://localhost:5173`.
2.  **Update `.env`**:
    - `VITE_SHOPIFY_STORE_DOMAIN` -> `t1pz2e-mg.myshopify.com`
    - `VITE_SHOPIFY_SHOP_ID` -> `77750665316`
    - `VITE_SHOPIFY_STOREFRONT_TOKEN` -> **(ACTION REQUIRED: New token needed)**
    - `VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` -> **(ACTION REQUIRED: New Client ID needed)**
3.  **Deployment**: Push updated `.env` to Vercel and test the login flow.

---
**Last Updated**: 2026-04-12
**Status**: Ready for Store Migration
