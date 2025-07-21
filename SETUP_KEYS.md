# 🔑 API Keys Setup Guide

Your GameSphere Console Store is missing environment variables. Follow these steps to get your app running:

## 🚨 **IMMEDIATE FIX**
The Stripe initialization error occurs because `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is undefined.

## 📋 **Required API Keys**

### 1. **Supabase Keys** (Database & Auth)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `dcgbiduuhupaqqutxuqg`
3. Go to **Settings** → **API**
4. Copy these values to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://dcgbiduuhupaqqutxuqg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (your anon key)
   SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service role key)
   ```

### 2. **Stripe Keys** (Payment Processing)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top-left)
3. Go to **Developers** → **API keys**
4. Copy these values to `.env.local`:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (Publishable key)
   STRIPE_SECRET_KEY=sk_test_... (Secret key)
   ```

### 3. **Stripe Webhook Secret** (Optional for now)
1. Go to **Developers** → **Webhooks**
2. Create endpoint: `http://localhost:3000/api/stripe/webhook`
3. Copy webhook secret to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_... (Webhook signing secret)
   ```

## 🚀 **Quick Start**
1. Update `.env.local` with your actual keys
2. Restart your development server: `npm run dev`
3. The Stripe errors should be resolved!

## 🔧 **Test Your Setup**
- Visit: http://localhost:3000
- Try adding items to cart
- Test checkout flow (use Stripe test cards)

## 📞 **Need Help?**
- Stripe Test Cards: https://stripe.com/docs/testing
- Supabase Docs: https://supabase.com/docs
