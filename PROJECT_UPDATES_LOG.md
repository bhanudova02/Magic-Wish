# Project Updates Log - MagicWish

## Date: 2026-04-12 | Time: 22:10 (IST)

### 1. Shopify Store Migration & Auth Fixes
- **New Store Config**: Successfully migrated to `storytimekid.myshopify.com` (Shop ID: `65892843582`).
- **Client ID Fix**: Corrected the Headless Client ID to `8fecbaf3-403f-4216-b023-a82802af662e`.
- **Scope Restriction**: Fixed "Invalid Scope" error by limiting OAuth scopes strictly to `openid email`.

### 2. User Experience & Login Flow (Headless)
- **Direct Login**: Removed the intermediary `LoginPage.jsx` to reduce user friction.
- **Navbar Integration**: Updated the User Icon in `Navbar.jsx` to trigger Shopify's OAuth flow directly using `getAuthorizeUrl`.
- **Security**: Handled the "Security state mismatch" error in `AuthCallback.jsx` to manage React Strict Mode double-runs and page refreshes gracefully.

### 3. Session & Cart Management
- **Server-Side Logout**: Integrated Shopify's `/logout` endpoint in `AuthContext.jsx` using `id_token_hint` to ensure the session is destroyed on Shopify's servers as well.
- **Cart Privacy**: Automated cart clearing on logout by removing `magicwish_cart` from localStorage.
- **State Reset**: Added a hard redirect on logout to ensure all React context states are completely reset.

### 4. Advanced Profile & Orders Integration
- **Direct API Link**: Created `customerAccountFetch` to interact with Shopify's New Customer Account GraphQL API.
- **Extended Scopes**: Added `customer-account-api:full` to OAuth scopes for secure access to personal data and order history.
- **Premium UI**: Redesigned `ProfilePage.jsx` with a modern sidebar and tabs for Account, Orders, and Addresses.
- **Real-Time Data**: Implemented live fetching of Order History and Shipping Addresses directly from Shopify's servers.

### 5. Code Cleanup
- Deleted `src/pages/LoginPage.jsx`.
- Updated `App.jsx` to remove unused routes.
- Updated `ProfilePage.jsx` and `AuthCallback.jsx` to redirect to home (`/`) instead of the deleted login page.

---
**Status**: Authentication is fully functional and optimized.
