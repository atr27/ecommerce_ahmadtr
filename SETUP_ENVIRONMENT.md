# Environment Setup Guide

## Quick Setup for Steam Seeder

Your Steam seeder is failing because the Supabase credentials are not configured. Here's how to fix it:

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your GameSphere Console Store project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)
   - **service_role key** (starts with `eyJ`) - **Keep this secret!**

### Step 2: Update Your .env File

Open the `.env` file I just created and replace the placeholder values:

```bash
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Run the Steam Seeder

Once you've updated the `.env` file with your actual credentials:

```bash
npm run seed:steam
```

## Alternative: Use .env.local (Recommended for Next.js)

Next.js projects typically use `.env.local` for local development. You can:

1. Rename `.env` to `.env.local`
2. Or copy the content to a new `.env.local` file

## Troubleshooting

### If you don't have a Supabase project yet:

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for it to be ready (takes 1-2 minutes)
4. Follow Step 1 above to get your credentials

### If you're still getting errors:

1. Make sure your `.env` file is in the project root
2. Restart your terminal/command prompt
3. Check that there are no extra spaces in your environment variables
4. Ensure your Supabase project is active and not paused

## Security Note

- Never commit `.env` or `.env.local` to version control
- The `service_role` key has admin privileges - keep it secret
- Use `.env.example` as a template for team members
