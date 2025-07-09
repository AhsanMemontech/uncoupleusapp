'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, CheckCircle, Lock, ArrowRight, AlertCircle, XCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    // Load form data from localStorage
    const savedData = localStorage.getItem('divorceFormData')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handlePay = async () => {
    if (!formData) {
      setError('No form data found. Please complete the information collection first.')
      return
    }

    setIsPaying(true)
    setError(null)

    try {
      // Create payment session
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment session')
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          setError(error.message || 'Payment failed')
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError('Payment failed. Please try again.')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1e2a3b' }}>
      <div className="mt-5 max-w-lg w-full p-6 sm:p-8 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0,0%,100%,0.05)' }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Service Payment</h1>
        <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Pay our service fee to generate your divorce forms and get filing instructions. Court filing fees are paid separately when you file.</p>

        <div className="mb-4 sm:mb-6 p-4 rounded-lg border border-gray-600 bg-gray-800/60">
          <div className="flex items-center mb-2">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mr-2" />
            <span className="text-base sm:text-lg font-semibold text-white">Form Generation Service</span>
          </div>
          <ul className="text-gray-300 text-xs sm:text-sm ml-6 sm:ml-7 list-disc mb-2 space-y-1">
            <li>All required NY divorce forms, pre-filled with your information</li>
            <li>Step-by-step filing instructions</li>
            <li>Court fee information & payment guidance</li>
            <li>What to expect during the filing process</li>
            <li>Next steps after filing</li>
          </ul>
          <div className="flex items-center justify-between mt-3 sm:mt-4">
            <span className="text-gray-400 text-sm sm:text-base">Service Fee</span>
            <span className="text-xl sm:text-2xl font-bold text-cyan-400">$99</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            * Court filing fees (~$210) paid separately when you file
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-600 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={isPaying || !formData}
          className={`w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold transition-colors border border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base ${(isPaying || !formData) ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isPaying ? (
            <>
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              <span>Redirecting to Payment...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Pay $99</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </>
          )}
        </button>

        {!formData && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-900/50 border border-yellow-600 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm">Please complete the information collection first</span>
          </div>
        )}

        {/* Test Buttons - Remove in production */}
        <div className="mt-6 p-4 rounded-lg border border-gray-600 bg-gray-800/50">
          <h3 className="text-sm font-medium text-gray-300 mb-3">🧪 Test Buttons (Development Only)</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/payment-response?success=true&session_id=test_session')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border border-green-600 bg-green-600/20 text-green-400 hover:bg-green-600/30 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Test Success Response</span>
            </button>
            <button
              onClick={() => router.push('/payment-response?canceled=true')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border border-red-600 bg-red-600/20 text-red-400 hover:bg-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            >
              <XCircle className="h-4 w-4" />
              <span>Test Failure Response</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 