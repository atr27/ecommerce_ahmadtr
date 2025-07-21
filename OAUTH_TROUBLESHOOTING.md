# OAuth Troubleshooting Guide - GameSphere Console Store

## Current Error Analysis

**Error**: `OAuth state parameter missing` with `ERR_TOO_MANY_REDIRECTS`

**Root Cause**: This error typically occurs when there's a mismatch between your OAuth configuration in Google Cloud Console and Supabase settings.

## Immediate Fix Steps

### Step 1: Clear Browser Data
1. Open Chrome DevTools (F12)
2. Go to **Application** tab → **Storage** → **Clear storage**
3. Check all boxes and click "Clear site data"
4. Or manually delete cookies for `dcgbiduuhupaqqutxuqg.supabase.co`

### Step 2: Verify Your Current URLs
Your current configuration:
- **ngrok URL**: `https://dcad5f22cc2c.ngrok-free.app`
- **Supabase URL**: `https://dcgbiduuhupaqqutxuqg.supabase.co`

### Step 3: Update Google Cloud Console

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth 2.0 Client IDs**:
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID

3. **Update Authorized Redirect URIs**:
   ```
   https://dcgbiduuhupaqqutxuqg.supabase.co/auth/v1/callback
   ```
   
   **IMPORTANT**: Make sure this is the ONLY redirect URI. Remove any localhost or other URLs.

4. **Update Authorized JavaScript Origins**:
   ```
   https://dcad5f22cc2c.ngrok-free.app
   https://dcgbiduuhupaqqutxuqg.supabase.co
   ```

### Step 4: Update Supabase Configuration

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/dcgbiduuhupaqqutxuqg

2. **Navigate to Authentication Settings**:
   - Go to **Authentication** → **Providers**
   - Find **Google** provider

3. **Update Google Provider Settings**:
   ```
   Enable Google: ✅ ON
   Client ID: [Your Google OAuth Client ID]
   Client Secret: [Your Google OAuth Client Secret]
   ```

4. **Update URL Configuration**:
   - Go to **Authentication** → **URL Configuration**
   - **Site URL**: `https://dcad5f22cc2c.ngrok-free.app`
   - **Redirect URLs**: 
     ```
     https://dcad5f22cc2c.ngrok-free.app/auth/callback
     https://dcad5f22cc2c.ngrok-free.app/**
     ```

### Step 5: Test the Fixed Flow

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test OAuth flow**:
   - Go to: `https://dcad5f22cc2c.ngrok-free.app/auth/login`
   - Click "Continue with Google"
   - Complete Google authentication
   - Should redirect to dashboard

## Common Issues and Solutions

### Issue 1: "Redirect URI Mismatch"
**Solution**: Ensure Google Cloud Console redirect URI exactly matches:
```
https://dcgbiduuhupaqqutxuqg.supabase.co/auth/v1/callback
```

### Issue 2: "Invalid Request"
**Solution**: 
- Clear browser cookies
- Check that Site URL in Supabase matches your ngrok URL
- Ensure Google Client ID/Secret are correctly configured

### Issue 3: "Too Many Redirects"
**Solution**:
- Remove duplicate redirect URIs from Google Cloud Console
- Ensure only one callback URL is configured
- Clear browser cache and cookies

### Issue 4: ngrok URL Changes
When your ngrok URL changes (e.g., from `dcad5f22cc2c` to a new subdomain):

1. **Update .env.local**:
   ```env
   NEXTAUTH_URL=https://your-new-ngrok-url.ngrok-free.app
   NEXT_PUBLIC_APP_URL=https://your-new-ngrok-url.ngrok-free.app
   ```

2. **Update Supabase Site URL**:
   - Authentication → URL Configuration → Site URL

3. **Update Google Cloud Console**:
   - Add new ngrok URL to Authorized JavaScript Origins

## Verification Checklist

- [ ] Browser cookies cleared for Supabase domain
- [ ] Google Cloud Console redirect URI: `https://dcgbiduuhupaqqutxuqg.supabase.co/auth/v1/callback`
- [ ] Google Cloud Console JavaScript origins include your ngrok URL
- [ ] Supabase Site URL matches your ngrok URL
- [ ] Supabase Google provider enabled with correct Client ID/Secret
- [ ] Development server restarted after configuration changes

## Testing Commands

```bash
# Start development server
npm run dev

# Check current environment variables
echo $NEXTAUTH_URL
echo $NEXT_PUBLIC_APP_URL

# Test OAuth callback endpoint directly
curl -I https://dcad5f22cc2c.ngrok-free.app/auth/callback
```

## Debug Information

If issues persist, check the browser console and server logs for:
- OAuth callback parameters
- Supabase authentication errors
- Network request failures
- Cookie/session issues

The enhanced callback handler now provides detailed logging to help identify the exact issue.

## Support

If you continue experiencing issues:
1. Check browser console for detailed error messages
2. Review server logs for OAuth callback debugging info
3. Verify all URLs match exactly between services
4. Test with a fresh browser session (incognito mode)
