# App Blueprint: GameSphere Console Store  

## 1. Project Breakdown  

**App Name:** GameSphere Console Store  
**Platform:** Web  
**Summary:** GameSphere is a simple e-commerce web app for selling console games. It features product browsing, cart management, user accounts, and checkout via Midtrans. The focus is on clean navigation, fast performance (SSR via Next.js), and seamless integration with Supabase for data persistence.  

**Primary Use Case:**  
- Users browse games by category/search, add items to cart/favorites, and checkout.  
- Admins manage product listings (via direct DB access in this MVP).  
- No complex auth flows—basic email/password + Google OAuth via Supabase.  

**Authentication Requirements:**  
- Supabase Auth for email/password signup/login.  
- Google OAuth via Supabase’s built-in provider.  
- Session persistence via Next.js middleware.  

---  

## 2. Tech Stack Overview  

| **Category**       | **Technology**              | **Purpose**                                  |  
|--------------------|----------------------------|---------------------------------------------|  
| Frontend Framework | Next.js (App Router)        | SSR, routing, API routes                    |  
| UI Library         | Tailwind CSS + ShadCN       | Styled components (buttons, cards, modals)  |  
| Backend (BaaS)     | Supabase                   | PostgreSQL DB, auth, real-time cart updates |  
| Payment           | Midtrans                   | Checkout processing                         |  
| Deployment        | Vercel                     | Hosting, CI/CD                              |  

---  

## 3. Core Features  

### **Homepage**  
- Hero banner (dynamic content from Supabase).  
- Category menu (e.g., "PS5", "Xbox", "Nintendo") filters product cards.  
- Product cards with "Add to Cart" (Supabase mutation) and "Favorite" (user-specific DB table).  

### **All Products Page**  
- Search bar (filters by name via Supabase `ilike`).  
- Sidebar filters (price range, brand, category) using Supabase query modifiers.  
- Pagination (Next.js `fetch` + Supabase `range`).  

### **Product Detail Page**  
- Dynamic route `/products/[id]` with full product information.  
- High-quality product images with zoom functionality.  
- Quantity selector and stock status display.  
- Add to cart and favorites functionality with toast notifications.  
- Related products section based on category.  
- Product features (shipping, warranty, returns) display.  
- SEO-optimized with dynamic metadata generation.  

### **Cart Page**  
- Real-time updates via Supabase `subscriptions`.  
- Quantity adjust/delete items (Supabase mutations).  
- Checkout button redirects to Midtrans payment flow.  

### **User Account Dashboard**  
- Edit name/password (Supabase Auth API).  
- Order history (Supabase query by `user_id`).  
- Delete account (cascades to orders/favorites via DB RLS).  

### **Auth Pages**  
- Login/register forms with Google OAuth button (ShadCN).  
- Form validation via React Hook Form + Zod.  

---  

## 4. User Flow  

1. **Landing**: Homepage → Browse categories or search.  
2. **Product Interaction**: Click card → Add to cart/favorites (requires login if not authed).  
3. **Checkout**: Cart page → Midtrans redirect → Order confirmation (stored in Supabase).  
4. **Post-Purchase**: View order status in account dashboard.  

---  

## 5. Design & UI/UX Guidelines  

- **Layout**: Left-nav (fixed) with collapsible user menu (ShadCN `Dropdown`).  
- **Theming**: Tailwind `slate` palette + game-branded accents (e.g., PlayStation blue).  
- **Responsive**: Mobile-first grid (Tailwind `md:grid-cols-3` for product cards).  
- **Micro-interactions**:  
  - Cart icon badge (animated with Framer Motion).  
  - Hover effects on cards (`scale-105` transition).  

---  

## 6. Technical Implementation  

### **Frontend (Next.js)**  
- **Routing**: App Router with protected routes (e.g., `/account` uses Supabase auth check).  
- **Data Fetching**:  
  - Products: `server components` + Supabase `select()` (SSR).  
  - Cart: Client-side `useEffect` + Supabase subscription.  
- **State**: Zustand for client-side cart (synced with Supabase).  

### **Backend (Supabase)**  
- **Tables**:  
  - `products`: id, name, price, category, image_url.  
  - `cart_items`: id, user_id (FK), product_id (FK), quantity.  
  - `favorites`: user_id (FK), product_id (FK).  
- **RLS**: Enable for all tables (e.g., users can only CRUD their own cart).  

### **Payment Flow**  
1. Client: Collect shipping info (form).  
2. API Route: Create Midtrans transaction (server-side `fetch`).  
3. Redirect: Midtrans-hosted payment page.  

---  

## 7. Development Setup  

### **Tools Required**  
- Node.js v18+.  
- Supabase CLI (`npm install -g supabase`).  
- Vercel CLI (optional).  

### **Steps**  
1. Clone repo + `npm install`.  
2. Set up Supabase:  
   - `supabase init` → Link local project.  
   - Import schema from `supabase/migrations/`.  
   - Enable Google OAuth in Supabase Dashboard.  
3. Configure `.env`:  
   ```env  
   NEXT_PUBLIC_SUPABASE_URL=...  
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...  
   MIDTRANS_SERVER_KEY=...  
   ```  
4. Run dev: `npm run dev`.  

---  

**Strict Adherence**: This blueprint uses only the specified stack. No alternatives (e.g., Firebase, Material UI) are permitted.