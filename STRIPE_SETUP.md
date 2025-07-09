# Stripe Payment Integration Setup

## Getting Started

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Complete the account setup process

2. **Get Your API Keys**
   - Log into your Stripe Dashboard
   - Go to Developers → API Keys
   - Copy your publishable key and secret key

3. **Configure Environment Variables**
   Create a `.env.local` file in your project root with:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

4. **Update the Configuration**
   - Open `src/lib/stripe.ts`
   - Replace the placeholder keys with your actual test keys
   - Update the product configuration if needed

## Test Cards

Use these test card numbers for testing:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Features

- ✅ Secure payment processing with Stripe Checkout
- ✅ Test mode for development (no real charges)
- ✅ Automatic form data preservation
- ✅ Success/failure handling
- ✅ Mobile-responsive design

## Production Deployment

When ready for production:
1. Switch to live keys in your Stripe dashboard
2. Update environment variables with live keys
3. Test with real cards in test mode first
4. Monitor payments in Stripe dashboard

## Security Notes

- Never commit your secret keys to version control
- Use environment variables for all sensitive data
- Test thoroughly before going live
- Monitor for suspicious activity 