# Vercel Deployment Guide for GameSphere Console Store

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Your project built successfully (✅ completed)

## Step 1: Prepare Your Project for GitHub

### 1.1 Create .gitignore (if not exists)
```bash
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
out/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Vercel
.vercel
```

### 1.2 Update Environment Variables Template
Create `.env.example` with all required variables (without values):
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Xendit Payment Configuration
XENDIT_SECRET_KEY=your_xendit_secret_key
NEXT_PUBLIC_XENDIT_PUBLIC_KEY=your_xendit_public_key
XENDIT_WEBHOOK_TOKEN=your_xendit_webhook_token
```

## Step 2: Upload to GitHub

### 2.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: GameSphere Console Store"
```

### 2.2 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository" (+ icon)
3. Repository name: `gamosphere-console-store`
4. Description: "E-commerce platform for console games"
5. Set to Public or Private
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

### 2.3 Connect Local to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/gamosphere-console-store.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub account
3. Click "New Project"
4. Import your `gamosphere-console-store` repository
5. Click "Import"

### 3.2 Configure Project Settings
**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `./` (default)
**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)

### 3.3 Add Environment Variables
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL = your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_actual_service_role_key
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
XENDIT_SECRET_KEY = your_actual_xendit_secret
NEXT_PUBLIC_XENDIT_PUBLIC_KEY = your_actual_xendit_public
XENDIT_WEBHOOK_TOKEN = your_actual_webhook_token
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Get your live URL: `https://your-project-name.vercel.app`

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Settings
In Supabase Dashboard:
1. **Authentication → URL Configuration:**
   - Site URL: `https://your-project-name.vercel.app`
   - Redirect URLs: `https://your-project-name.vercel.app/auth/callback`

2. **Authentication → Auth Providers:**
   - Update Google OAuth redirect URI: `https://your-project-name.vercel.app/auth/callback`

### 4.2 Update Xendit Webhook
In Xendit Dashboard:
1. Go to Webhooks settings
2. Update webhook URL: `https://your-project-name.vercel.app/api/xendit/webhook`

### 4.3 Test Your Deployment
1. Visit your live URL
2. Test user registration/login
3. Test product browsing and cart
4. Test checkout flow (use Xendit test methods)
5. Test order management

## Step 5: Continuous Deployment

### 5.1 Automatic Deployments
- Every push to `main` branch automatically deploys
- Pull requests create preview deployments
- Vercel provides deployment status in GitHub

### 5.2 Future Updates
```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main
# Vercel automatically deploys the changes
```

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
1. In Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables with new domain

## Troubleshooting

### Critical Build Error Fix ✅
**Error:** `NEXT_PUBLIC_SUPABASE_URL is required in production` during build

**Cause:** Environment variables not available during Vercel build process

**Solution Applied:**
- Updated `lib/supabase-server.ts` with simplified fallback approach
- Uses placeholder values during build time, validates only at runtime
- Completely avoids validation during build process
- Build now passes without requiring environment variables

**Status:** ✅ RESOLVED - Build should now succeed

**Latest Fix (v2):**
- Simplified approach using direct fallback values
- No complex build-time detection logic
- Runtime validation only when clients are actually used

### Common Issues:
1. **Build Fails with "supabaseUrl is required":**
   - ✅ Fixed in latest code update
   - Ensure you have the latest `lib/supabase-server.ts` file

2. **Environment Variables Missing:**
   - Double-check all required env vars are set in Vercel dashboard
   - Ensure no typos in variable names
   - Redeploy after adding missing variables

3. **Auth Issues:** 
   - Verify Supabase redirect URLs match your domain
   - Check Site URL in Supabase dashboard

4. **Payment Issues:** 
   - Confirm Xendit webhook URL is updated
   - Test with Xendit sandbox credentials first

5. **Database Issues:** 
   - Ensure Supabase RLS policies allow public access where needed
   - Check database connection in Supabase dashboard

### Build Logs Analysis:
- Check Vercel deployment logs for specific error messages
- Look for missing dependencies in `package.json`
- Verify environment variables are properly set
- Check for TypeScript compilation errors

## Security Notes

- Never commit `.env.local` or real API keys to GitHub
- Use Vercel's environment variables for sensitive data
- Enable Vercel's security headers
- Consider enabling Vercel's DDoS protection for production

## Performance Optimization

- Vercel automatically optimizes Next.js builds
- Enable Vercel Analytics for performance monitoring
- Consider upgrading to Vercel Pro for better performance

Your GameSphere Console Store will be live at `https://your-project-name.vercel.app`!
