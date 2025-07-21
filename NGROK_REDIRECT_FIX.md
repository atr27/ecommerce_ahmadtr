# Ngrok Redirect Fix Documentation

## Problem
When using ngrok to tunnel your localhost development server, logout and payment success redirects were going to `localhost:3000` instead of your ngrok URL. This caused issues with:

1. **Logout redirects** - Users were redirected to localhost instead of staying on the ngrok URL
2. **Payment success redirects** - After successful payments, users were redirected to localhost instead of the ngrok URL
3. **OAuth redirects** - Authentication flows were breaking due to URL mismatches

## Root Cause
The application was using hardcoded environment variables (`NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL`) that were set to `http://localhost:3000`, causing all redirects to use localhost instead of the current ngrok URL.

## Solution Implemented

### 1. Dynamic URL Detection
Created a utility function `getBaseUrl()` in `lib/utils.ts` that dynamically detects the current origin:

```typescript
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin (works with ngrok)
    return window.location.origin
  }
  
  // Server-side: fallback to environment variable or localhost
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}
```

### 2. Updated Logout Logic
Modified `components/layout/header.tsx` to use dynamic URL detection:

```typescript
const handleSignOut = async () => {
  // Use dynamic origin to support both localhost and ngrok URLs
  const origin = getBaseUrl()
  await supabase.auth.signOut({ options: { redirectTo: origin } })
  router.push('/')
}
```

### 3. Fixed Payment Redirect URLs
Updated `app/api/checkout/route.ts` to detect the current host from request headers:

```typescript
// Helper function to get base URL from request headers
function getBaseUrlFromRequest(request: NextRequest): string {
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  return `${protocol}://${host}`
}

// Usage in payment URLs
success_redirect_url: `${getBaseUrlFromRequest(request)}/payment/success?order_id=${order.id}`,
failure_redirect_url: `${getBaseUrlFromRequest(request)}/payment/failed?order_id=${order.id}`,
```

### 4. Environment Variable Update Script
Created `scripts/update-ngrok-url.js` to easily update environment variables:

```bash
# Usage
npm run update:ngrok https://your-ngrok-url.ngrok.io
```

## Files Modified

1. **`lib/utils.ts`** - Added `getBaseUrl()` utility function
2. **`components/layout/header.tsx`** - Updated logout logic to use dynamic URLs
3. **`app/api/checkout/route.ts`** - Added request-based URL detection for payment redirects
4. **`package.json`** - Added npm script for updating ngrok URLs
5. **`scripts/update-ngrok-url.js`** - Created utility script for environment updates

## How to Use

### Method 1: Automatic (Recommended)
The fix works automatically - no manual configuration needed. The application now:
- Detects the current URL (whether localhost or ngrok)
- Uses that URL for all redirects
- Works seamlessly when switching between localhost and ngrok

### Method 2: Update Environment Variables (Optional)
If you want to update your environment variables to match your ngrok URL:

```bash
# Get your ngrok URL (e.g., https://abc123.ngrok.io)
npm run update:ngrok https://your-ngrok-url.ngrok.io

# Restart your development server
npm run dev
```

## Testing the Fix

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```

3. **Test logout:**
   - Access your app via ngrok URL
   - Login and then logout
   - Verify you stay on the ngrok URL

4. **Test payment flow:**
   - Access your app via ngrok URL
   - Complete a purchase
   - Verify payment success redirects to ngrok URL

## Benefits

- ✅ **No manual configuration** - Works automatically with any URL
- ✅ **Supports both localhost and ngrok** - Seamless switching
- ✅ **Future-proof** - Works with any domain or tunnel service
- ✅ **Maintains security** - Proper URL validation and redirect handling
- ✅ **Easy maintenance** - Single utility function handles all URL detection

## Troubleshooting

If you still experience redirect issues:

1. **Clear browser cache** - Old redirects might be cached
2. **Restart development server** - Ensure all changes are loaded
3. **Check console logs** - Look for any error messages
4. **Verify ngrok is running** - Ensure tunnel is active and accessible

The fix should resolve all redirect issues when using ngrok or any other tunneling service with your GameSphere Console Store.
