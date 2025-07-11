import Stripe from 'stripe'

// Initialize Stripe with environment variable
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
})

// Publishable key for client-side
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''

// Product configuration
export const PRODUCT_CONFIG = {
  name: 'Divorce Form Generation Service',
  price: 9900, // $99.00 in cents
  currency: 'usd',
  description: 'Complete NY uncontested divorce form generation service with filing instructions'
} 