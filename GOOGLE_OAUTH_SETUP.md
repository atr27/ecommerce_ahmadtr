# Google OAuth Setup Guide for GameSphere Console Store

## Overview
Google OAuth is already implemented in your GameSphere Console Store! This guide will help you configure it properly in your Supabase project.

## Current Implementation Status ✅

### ✅ Frontend Implementation Complete
- **Login Page**: `app/auth/login/page.tsx` - Google OAuth button implemented
- **Register Page**: `app/auth/register/page.tsx` - Google OAuth button implemented  
- **Auth Callback**: `app/auth/callback/route.ts` - OAuth callback handler created
- **UI Components**: Google branding and proper OAuth flow

### ✅ Code Features
- Proper OAuth redirect handling
- Error handling and loading states
- Consistent UI with email/password authentication
- Automatic redirect to dashboard after successful login
- User session management in header component

## Setup Instructions

### Step 1: Configure Google OAuth in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing project

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "GameSphere Console Store"

4. **Configure Authorized URLs**
   ```
   Authorized JavaScript origins:
   - http://localhost:3000 (for development)
   - https://your-ngrok-url.ngrok.io (if using ngrok)
   - https://your-production-domain.com (for production)

   Authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://your-ngrok-url.ngrok.io/auth/callback
   - https://your-production-domain.com/auth/callback
   ```

5. **Save Credentials**
   - Copy the Client ID and Client Secret

### Step 2: Configure Google OAuth in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/
   - Select your GameSphere project

2. **Navigate to Authentication Settings**
   - Go to "Authentication" > "Providers"
   - Find "Google" in the list

3. **Enable and Configure Google Provider**
   ```
   Enable Google: ✅ ON
   Client ID: [Your Google OAuth Client ID]
   Client Secret: [Your Google OAuth Client Secret]
   ```

4. **Configure Redirect URLs in Supabase**
   - Go to "Authentication" > "URL Configuration"
   - Site URL: `http://localhost:3000` (development) or your production URL
   - Redirect URLs: Add all your callback URLs:
     ```
     http://localhost:3000/auth/callback
     https://your-ngrok-url.ngrok.io/auth/callback
     https://your-production-domain.com/auth/callback
     ```

### Step 3: Test the Implementation

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test Google OAuth**
   - Go to `http://localhost:3000/auth/login`
   - Click "Continue with Google"
   - Complete Google authentication
   - Should redirect to dashboard after successful login

3. **Test Registration**
   - Go to `http://localhost:3000/auth/register`
   - Click "Continue with Google"
   - Should create new account and redirect to dashboard

## Troubleshooting

### Common Issues and Solutions

#### 1. "Redirect URI Mismatch" Error
**Problem**: Google OAuth redirect URI doesn't match configured URIs
**Solution**: 
- Check that your callback URL matches exactly in both Google Console and Supabase
- Ensure no trailing slashes or extra parameters
- Verify the domain matches (localhost vs ngrok vs production)

#### 2. "OAuth Configuration Error" 
**Problem**: Supabase Google provider not properly configured
**Solution**:
- Double-check Client ID and Client Secret in Supabase
- Ensure Google+ API is enabled in Google Cloud Console
- Verify the OAuth consent screen is configured

#### 3. "Failed to Exchange Code" Error
**Problem**: Auth callback handler issues
**Solution**:
- Check that `app/auth/callback/route.ts` exists and is properly configured
- Verify Supabase auth helpers are properly installed
- Check browser console for detailed error messages

#### 4. HTTPS Required Error (Development)
**Problem**: Google OAuth requires HTTPS in some cases
**Solution**: Use ngrok for HTTPS tunnel:
```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run dev

# In another terminal, create HTTPS tunnel
ngrok http 3000

# Update your OAuth URLs to use the ngrok HTTPS URL
```

## Environment Variables

No additional environment variables are needed for Google OAuth! The configuration is handled entirely through:
- Google Cloud Console (OAuth credentials)
- Supabase Dashboard (provider configuration)

## Security Best Practices

1. **Restrict OAuth Origins**: Only add necessary domains to authorized origins
2. **Use HTTPS in Production**: Always use HTTPS for production OAuth flows
3. **Verify Redirect URLs**: Ensure redirect URLs are exactly as configured
4. **Monitor OAuth Usage**: Check Google Cloud Console for OAuth usage and errors

## User Experience Features

### ✅ Current Implementation Includes:
- **Visual Google Branding**: Official Google logo and colors
- **Loading States**: Button shows "loading" during OAuth flow
- **Error Handling**: Displays OAuth errors to users
- **Seamless Integration**: Works alongside email/password authentication
- **Automatic Redirects**: Users go to dashboard after successful login
- **Session Management**: Proper user session handling in header

### User Flow:
1. User clicks "Continue with Google" on login/register page
2. Redirected to Google OAuth consent screen
3. User authorizes GameSphere Console Store
4. Redirected back to `/auth/callback`
5. Auth callback exchanges code for session
6. User redirected to dashboard
7. Header shows user as logged in with cart/favorites loaded

## Testing Checklist

- [ ] Google OAuth button appears on login page
- [ ] Google OAuth button appears on register page  
- [ ] Clicking button redirects to Google OAuth
- [ ] Google OAuth consent screen shows correct app name
- [ ] After authorization, user is redirected back to app
- [ ] User session is properly established
- [ ] Header shows user as logged in
- [ ] Cart and favorites are loaded for authenticated user
- [ ] User can sign out properly

## Next Steps

1. **Configure Google Cloud Console** with your OAuth credentials
2. **Enable Google provider** in Supabase Dashboard
3. **Test the OAuth flow** in development
4. **Update URLs** for production deployment
5. **Monitor usage** and user feedback

Your Google OAuth implementation is complete and ready to use once you configure the credentials! 🎮
