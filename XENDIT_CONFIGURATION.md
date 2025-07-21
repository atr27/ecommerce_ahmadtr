7# Xendit Payment Integration Configuration

This guide covers the complete setup and configuration of Xendit payment integration for GameSphere Console Store.

## Overview

GameSphere Console Store now uses **Xendit** as the payment gateway, replacing the previous Stripe integration. Xendit provides comprehensive payment solutions for Southeast Asian markets, supporting multiple payment methods including credit cards, bank transfers, and e-wallets.

## Features

- **Multiple Payment Methods**: Credit cards, debit cards, bank transfers, e-wallets (GoPay, OVO, DANA, etc.)
- **Invoice-based Payments**: Secure invoice generation with automatic expiration
- **Webhook Integration**: Real-time payment status updates
- **Redirect Flow**: Secure payment processing on Xendit's hosted pages
- **Multi-currency Support**: IDR (Indonesian Rupiah) primary support

## Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Xendit Configuration
XENDIT_SECRET_KEY=your_xendit_secret_key_here
XENDIT_PUBLIC_KEY=your_xendit_public_key_here
XENDIT_WEBHOOK_TOKEN=your_xendit_webhook_token_here
```

### Getting Xendit API Keys

1. **Sign up for Xendit Account**:
   - Visit [Xendit Dashboard](https://dashboard.xendit.co/)
   - Create an account or log in
   - Complete business verification

2. **Get API Keys**:
   - Navigate to Settings → API Keys
   - Copy your **Secret Key** (starts with `xnd_development_` for test mode)
   - Copy your **Public Key** (starts with `xnd_public_test_` for test mode)

3. **Set up Webhook**:
   - Go to Settings → Webhooks
   - **For Development**: Use ngrok or similar tunnel service (see Development Setup below)
   - **For Production**: Add webhook URL: `https://yourdomain.com/api/xendit/webhook`
   - Generate and copy the **Webhook Token**
   - Select events: `invoice.paid`, `invoice.expired`, `invoice.failed`

### Development Webhook Setup

**Problem**: Xendit requires publicly accessible HTTPS URLs for webhooks. Localhost URLs will be rejected with:
> "This webhook URL can not be saved because the URL may contain private or local IPs."

**Solution**: Use ngrok to create a secure tunnel to your local development server.

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   # OR download from https://ngrok.com/download
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **Create ngrok tunnel** (in a new terminal):
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** from ngrok output:
   ```
   Forwarding    https://abc123.ngrok.io -> http://localhost:3000
   ```

5. **Configure Xendit webhook**:
   - Webhook URL: `https://abc123.ngrok.io/api/xendit/webhook`
   - Select events: `invoice.paid`, `invoice.expired`, `invoice.failed`
   - Save and copy the Webhook Token

6. **Update your environment variables**:
   ```env
   XENDIT_WEBHOOK_TOKEN=your_webhook_token_here
   ```

**Alternative Solutions**:
- **localhost.run**: `ssh -R 80:localhost:3000 localhost.run`
- **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:3000`
- **VS Code Port Forwarding**: If using GitHub Codespaces or similar

## Architecture

### Payment Flow

1. **Checkout Process**:
   ```
   User fills checkout form → API creates Xendit invoice → User redirected to Xendit payment page
   ```

2. **Payment Completion**:
   ```
   User completes payment → Xendit webhook notifies our server → Order status updated → User redirected to success page
   ```

3. **Payment Failure**:
   ```
   Payment fails/expires → Xendit webhook notifies our server → Order marked as failed → User redirected to failure page
   ```

### API Endpoints

- **`POST /api/checkout`**: Creates Xendit invoice and order
- **`POST /api/xendit/webhook`**: Handles Xendit webhook events
- **`GET /payment/success`**: Payment success page
- **`GET /payment/failed`**: Payment failure page

## File Structure

```
app/
├── api/
│   ├── checkout/
│   │   └── route.ts              # Xendit invoice creation
│   └── xendit/
│       └── webhook/
│           └── route.ts          # Webhook handler
├── checkout/
│   └── page.tsx                  # Checkout form and payment redirect
└── payment/
    ├── success/
    │   └── page.tsx              # Payment success page
    └── failed/
        └── page.tsx              # Payment failure page

lib/
└── xendit.ts                     # Xendit client configuration

middleware.ts                     # CSP headers for Xendit
```

## Implementation Details

### 1. Xendit Client Setup (`lib/xendit.ts`)

```typescript
import { Xendit } from 'xendit-node'

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
})

export default xendit
export const { Invoice, PaymentRequest, Customer, PaymentMethod } = xendit
```

### 2. Invoice Creation (`app/api/checkout/route.ts`)

```typescript
// Create Xendit Invoice using direct API call
const invoiceData = {
  external_id: `order-${order.id}-${Date.now()}`,
  amount: orderData.total_amount,
  description: `GameSphere Console Store - Order #${order.id}`,
  invoice_duration: 86400, // 24 hours
  customer: {
    given_names: customerDetails.first_name,
    surname: customerDetails.last_name,
    email: customerDetails.email,
    mobile_number: customerDetails.phone,
  },
  success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id=${order.id}`,
  failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?order_id=${order.id}`,
  currency: 'IDR',
}
```

### 3. Webhook Handler (`app/api/xendit/webhook/route.ts`)

Handles these events:
- `invoice.paid`: Updates order status to 'paid', clears user cart
- `invoice.expired`: Updates order status to 'expired'
- `invoice.failed`: Updates order status to 'failed'

### 4. Security (CSP Headers)

Updated `middleware.ts` to allow Xendit domains:
```typescript
connect-src 'self' 
  https://api.xendit.co
  https://checkout.xendit.co
  https://dcgbiduuhupaqqutxuqg.supabase.co;
frame-src 'self' 
  https://checkout.xendit.co;
```

## Testing

### Test Mode

1. Use test API keys (starting with `xnd_development_`)
2. Test payment methods:
   - **Credit Card**: Use test card numbers from [Xendit Test Cards](https://developers.xendit.co/api-reference/#test-credit-card-numbers)
   - **Bank Transfer**: Use test bank codes
   - **E-wallets**: Use test phone numbers

### Test Card Numbers

```
Successful Payment:
- Visa: 4000000000000002
- Mastercard: 5200000000000007

Failed Payment:
- Visa: 4000000000000010
- Mastercard: 5200000000000015
```

## Production Setup

1. **Switch to Live Mode**:
   - Get production API keys from Xendit Dashboard
   - Update environment variables with live keys
   - Configure production webhook URL

2. **Webhook Security**:
   - Ensure webhook URL is HTTPS
   - Verify webhook token in production
   - Monitor webhook delivery in Xendit Dashboard

3. **Monitoring**:
   - Monitor payments in Xendit Dashboard
   - Set up alerts for failed payments
   - Review transaction reports regularly

## Supported Payment Methods

### Credit/Debit Cards
- Visa, Mastercard, JCB
- 3D Secure authentication
- Installment options (for eligible cards)

### Bank Transfers
- BCA, Mandiri, BNI, BRI
- Virtual account numbers
- Real-time confirmation

### E-Wallets
- GoPay, OVO, DANA, LinkAja
- QR code and deep link payments
- Instant confirmation

### Retail Outlets
- Alfamart, Indomaret
- Cash payment with reference codes
- 24-hour availability

## Error Handling

### Common Issues

1. **Invalid API Keys**:
   - Verify keys are correct and active
   - Check test vs production mode

2. **Webhook Not Received**:
   - Verify webhook URL is accessible
   - Check webhook token configuration
   - Review Xendit webhook logs

3. **Payment Failures**:
   - Check customer payment method
   - Verify invoice amount and currency
   - Review payment method availability

### Debugging

1. **Enable Logging**:
   ```typescript
   console.log('Xendit invoice created:', invoice)
   console.log('Webhook received:', event)
   ```

2. **Check Xendit Dashboard**:
   - Review invoice status
   - Check webhook delivery logs
   - Monitor payment attempts

## Migration from Stripe

### Completed Changes

✅ **Dependencies**:
- Removed: `@stripe/stripe-js`, `@stripe/react-stripe-js`, `stripe`
- Added: `xendit-node`

✅ **Environment Variables**:
- Removed: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Added: `XENDIT_SECRET_KEY`, `XENDIT_PUBLIC_KEY`, `XENDIT_WEBHOOK_TOKEN`

✅ **API Routes**:
- Updated: `/api/checkout` (Stripe Payment Intent → Xendit Invoice)
- Removed: `/api/stripe/webhook`
- Added: `/api/xendit/webhook`

✅ **Frontend Components**:
- Updated: Checkout page (Stripe Elements → Xendit redirect)
- Removed: Stripe checkout form component
- Updated: Payment success/failure pages

✅ **Security**:
- Updated: CSP headers (Stripe domains → Xendit domains)
- Updated: Webhook signature verification

✅ **Documentation**:
- Removed: `STRIPE_CONFIGURATION.md`
- Added: `XENDIT_CONFIGURATION.md`

## Support

- **Xendit Documentation**: https://developers.xendit.co/
- **API Reference**: https://developers.xendit.co/api-reference/
- **Support**: https://help.xendit.co/
- **Status Page**: https://status.xendit.co/

## Next Steps

1. **Get Xendit Account**: Sign up and complete verification
2. **Configure Environment**: Add API keys to `.env.local`
3. **Set up Webhooks**: Configure webhook URL and token
4. **Test Integration**: Use test cards and payment methods
5. **Go Live**: Switch to production keys when ready

The Xendit integration is now complete and ready for testing!
