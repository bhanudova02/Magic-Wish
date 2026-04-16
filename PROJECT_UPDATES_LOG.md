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

### 5. Bug Fixes & API Stability
- **Icon Import Fix**: Resolved a `ReferenceError` by properly importing the `LogOut` icon in `Navbar.jsx`, fixing the blank page issue.
- **API Endpoint Correction**: Updated the Customer Account API GraphQL URL to the official versioned path, resolving connection timeout errors.
- **Address Management**: Implemented a fully functional "Add New Address" form with live Shopify database synchronization.

### 6. Code Cleanup
- Deleted `src/pages/LoginPage.jsx`.
- Updated `App.jsx` to remove unused routes.
- Updated `ProfilePage.jsx` and `AuthCallback.jsx` to redirect to home (`/`) instead of the deleted login page.

### 7. AI Engine Migration (Magic Hour -> Replicate)
- **New API Integration**: Replaced Magic Hour with Replicate API for superior face swap and character preservation.
- **Model Used**: `lucataco/instantid` (Handles identity preservation while maintaining the book's art style).
- **Backend Proxy**: Created `api/replicate-faceswap.js` to handle secure API calls and bypass CORS.
- **Frontend Utility**: Added `src/utils/replicate.js` for clean integration in pages.
- **Improved Blending**: The new logic ensures only the character on the cover changes, keeping the original background and composition intact.

---
**Status**: Ready for testing with Replicate API Token.













Segmind API (InstantID / FaceSwap Comic v1):

Idi asalu meeru chesthunna custom storybooks lantivatike famous. Real faces ni cartoon style lo blend cheyadaniki idi chala baga use avuthundi. Node.js/React integration chaala simple ga untundi.
Replicate API (InstantID leda PuLID Models):

Idi AI developers chala ekuvaga vadutharu. "InstantID" model lo meeru aa book cover pampi, pillodi photo pampithe.. exactly aa disney/pixar style lo aa kotha face ni geesi peduthundi. Asalu adhi graphics ah nijam face ah antha perfect ga untundi.
Facemint API:

Idi kuda educational cartoon storybooks lo real kids faces create chese valla kosame ekuva focus chesthunnaru.
LightX API leda Prospolabs:

Veetilo "Cartoon Face Swap" models separate ga unnai. General face swap vadakunda, specific cartoon mode select cheskoni integrate cheyochu.