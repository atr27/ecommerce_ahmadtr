# Running GameSphere Console Store

## ✅ Quick Start Guide

### 1. Prerequisites Check
- ✅ Node.js installed
- ✅ Dependencies installed (`npm install`)
- ✅ Database migrated (`npm run db:migrate`)
- ✅ Environment variables configured (`.env.local`)

### 2. Start the Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 3. Verify Everything Works
- ✅ Homepage loads with featured products
- ✅ Product browsing works
- ✅ User authentication (sign up/login)
- ✅ Cart functionality
- ✅ Search functionality

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **Supabase Client/Server Error**
**Error:** `ReactServerComponentsError: You're importing a component that needs next/headers`

**Solution:** ✅ **FIXED** - Separated client and server Supabase configurations:
- Client components use: `import { createSupabaseClient } from '@/lib/supabase'`
- Server components use: `import { createSupabaseServerClient } from '@/lib/supabase-server'`

#### 2. **Database Connection Issues**
**Error:** Database queries fail or return empty results

**Solutions:**
```bash
# Check if migrations ran successfully
npm run db:status

# Re-run migrations if needed
npm run db:migrate

# Reset database (development only)
npm run db:reset
```

#### 3. **Environment Variables Missing**
**Error:** Supabase client initialization fails

**Solution:** Verify `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

#### 4. **Port Already in Use**
**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Use different port
npm run dev -- --port 3001

# Or kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### 5. **Build Errors**
**Error:** TypeScript or build compilation errors

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

## 📱 Features to Test

### 🏠 Homepage
- [ ] Featured products display
- [ ] Category navigation
- [ ] Search functionality
- [ ] Responsive design

### 🛍️ Product Features
- [ ] Product grid/list view
- [ ] Product details page
- [ ] Add to cart
- [ ] Add to favorites
- [ ] Category filtering

### 👤 User Authentication
- [ ] Sign up with email
- [ ] Login with email
- [ ] Google OAuth (if configured)
- [ ] User profile/account page
- [ ] Logout functionality

### 🛒 Shopping Cart
- [ ] Add/remove items
- [ ] Update quantities
- [ ] Cart persistence
- [ ] Checkout process

### 💳 Payment (Midtrans)
- [ ] Payment form
- [ ] Payment processing
- [ ] Order confirmation
- [ ] Payment status updates

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Setup
1. Set production environment variables
2. Configure Supabase production database
3. Set up Midtrans production keys
4. Deploy to your hosting platform

## 📊 Performance Monitoring

### Key Metrics to Monitor
- Page load times
- Database query performance
- Authentication flow
- Payment processing
- Error rates

### Useful Commands
```bash
# Check bundle size
npm run build -- --analyze

# Run performance audit
npx lighthouse http://localhost:3000

# Monitor database performance
# (Check Supabase dashboard)
```

## 🆘 Getting Help

If you encounter issues:

1. **Check the console** for error messages
2. **Verify environment variables** are set correctly
3. **Check database connection** and migrations
4. **Review Supabase dashboard** for RLS policy issues
5. **Check network requests** in browser dev tools

## 📝 Development Workflow

### Making Changes
1. Make code changes
2. Test locally (`npm run dev`)
3. Run migrations if database changes (`npm run db:migrate`)
4. Build and test (`npm run build`)
5. Deploy to production

### Database Changes
1. Create new migration file
2. Test migration locally
3. Push to production database
4. Verify data integrity

---

**🎮 Happy Gaming with GameSphere! 🎮**
