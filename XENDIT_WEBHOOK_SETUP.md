# Xendit Webhook Setup with ngrok

## Quick Setup Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Start ngrok Tunnel
```bash
# Install ngrok if not already installed
npm install -g ngrok

# Create HTTPS tunnel
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 3. Update Environment Variables
Replace `your-ngrok-url.ngrok.io` in `.env.local` with your actual ngrok URL:
```bash
NEXTAUTH_URL=https://your-actual-ngrok-url.ngrok.io
NEXT_PUBLIC_APP_URL=https://your-actual-ngrok-url.ngrok.io
```

### 4. Configure Xendit Dashboard

1. **Login**: Go to [dashboard.xendit.co](https://dashboard.xendit.co)
2. **Navigate**: Settings → Webhooks
3. **Add Webhook**:
   - **URL**: `https://your-ngrok-url.ngrok.io/api/xendit/webhook`
   - **Events**: Select these events:
     - `invoice.paid`
     - `invoice.expired` 
     - `invoice.failed`
4. **Copy Webhook Token**: Save the verification token
5. **Update `.env.local`**:
   ```bash
   XENDIT_WEBHOOK_TOKEN=your_new_webhook_token_here
   ```

### 5. Test Webhook

1. **Restart your dev server** after updating environment variables
2. **Make a test payment** through your app
3. **Check webhook logs** in Xendit Dashboard
4. **Verify webhook endpoint** is receiving events

### 6. Webhook Endpoint Details

Your webhook endpoint is already implemented at:
- **File**: `app/api/xendit/webhook/route.ts`
- **URL**: `https://your-ngrok-url.ngrok.io/api/xendit/webhook`
- **Method**: POST
- **Events Handled**:
  - `invoice.paid` → Updates order status to 'paid'
  - `invoice.expired` → Updates order status to 'expired'
  - `invoice.failed` → Updates order status to 'failed'

### 7. Security Notes

- Webhook signature verification is implemented
- Only accepts requests with valid Xendit webhook token
- HTTPS required for webhook URLs (hence ngrok)

### 8. Troubleshooting

**Common Issues:**
- **Webhook not receiving events**: Check ngrok URL is correct and accessible
- **Signature verification fails**: Ensure webhook token matches Xendit dashboard
- **HTTPS required error**: Make sure using ngrok HTTPS URL, not HTTP

**Testing Webhook:**
```bash
# Test webhook endpoint manually
curl -X POST https://your-ngrok-url.ngrok.io/api/xendit/webhook \
  -H "Content-Type: application/json" \
  -H "x-callback-token: your_webhook_token" \
  -d '{"event": "invoice.paid", "data": {"id": "test"}}'
```

### 9. Production Setup

For production, replace ngrok URL with your actual domain:
```bash
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

And update Xendit webhook URL to:
```
https://yourdomain.com/api/xendit/webhook
```
