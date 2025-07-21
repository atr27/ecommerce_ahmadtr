# GameSphere Console Store

A modern e-commerce web application for selling console games, built with Next.js, Supabase, and Midtrans payment integration.

## Features

- 🎮 **Product Browsing**: Browse games by category (PS5, Xbox, Nintendo, PC)
- 🛒 **Shopping Cart**: Add/remove items with real-time updates
- ❤️ **Favorites**: Save favorite games for later
- 🔐 **Authentication**: Email/password and Google OAuth via Supabase
- 💳 **Secure Payments**: Midtrans payment gateway integration
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Gaming Theme**: Brand-specific colors and modern UI
- 👤 **User Dashboard**: Order history, profile management
- 🔄 **Real-time Updates**: Live cart and inventory updates

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI, Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand
- **Payments**: Midtrans
- **Deployment**: Vercel
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Midtrans account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamesphere-console-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Midtrans Configuration
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   MIDTRANS_SERVER_KEY=your_midtrans_server_key
   MIDTRANS_IS_PRODUCTION=false
   
   # App Configuration
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   Run the SQL schema in your Supabase SQL editor:
   ```bash
   # Copy the contents of supabase/schema.sql and run in Supabase SQL editor
   ```

5. **Configure Supabase Authentication**
   
   In your Supabase dashboard:
   - Go to Authentication > Settings
   - Add your site URL: `http://localhost:3000`
   - Enable Google OAuth (optional):
     - Add Google OAuth provider
     - Set redirect URL: `http://localhost:3000/auth/callback`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## Database Schema

The application uses the following main tables:

- **products**: Game catalog with categories, prices, stock
- **cart_items**: User shopping cart items
- **favorites**: User favorite games
- **orders**: Order records with status tracking
- **order_items**: Individual items within orders

All tables include Row Level Security (RLS) policies for data protection.

## API Routes

- `POST /api/checkout` - Create Midtrans payment transaction
- `PATCH /api/checkout` - Handle Midtrans webhook notifications

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── account/           # User dashboard
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout process
│   ├── payment/           # Payment result pages
│   └── products/          # Product catalog
├── components/            # Reusable UI components
│   ├── layout/           # Header, Footer
│   ├── products/         # Product-related components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
└── supabase/             # Database schema
```

## Key Components

### Authentication
- Supabase Auth with email/password and Google OAuth
- Protected routes and user session management
- Profile management in user dashboard

### Shopping Cart
- Zustand store for client-side state management
- Supabase integration for persistence
- Real-time updates across browser tabs

### Payment Processing
- Midtrans Snap integration
- Secure server-side transaction creation
- Webhook handling for payment status updates

### Product Management
- Category-based filtering and sorting
- Stock management and availability
- Image optimization with Next.js Image

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Update Supabase settings**:
   - Add your Vercel domain to allowed origins
   - Update OAuth redirect URLs
4. **Deploy**

### Environment Variables for Production

Update your production environment variables:
```env
NEXTAUTH_URL=https://your-domain.vercel.app
MIDTRANS_IS_PRODUCTION=true  # Use production Midtrans keys
```

## Development

### Adding New Features

1. **New Pages**: Add to `app/` directory following App Router conventions
2. **Components**: Create reusable components in `components/`
3. **API Routes**: Add server functions in `app/api/`
4. **Database Changes**: Update `supabase/schema.sql` and migrate

### Code Style

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Tailwind CSS for styling
- Component composition with ShadCN patterns

## Security

- Row Level Security (RLS) on all database tables
- Server-side authentication verification
- Input validation with Zod schemas
- Secure payment processing with Midtrans

## Performance

- Next.js App Router for optimal performance
- Image optimization with Next.js Image
- Static generation where possible
- Efficient database queries with proper indexing

## Support

For issues and questions:
- Check the documentation
- Review the code comments
- Open an issue in the repository

## License

This project is licensed under the MIT License.

---

Built with ❤️ for gamers by gamers
