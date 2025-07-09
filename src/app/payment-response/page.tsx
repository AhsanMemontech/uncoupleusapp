'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, FileText } from 'lucide-react'

export default function PaymentResponsePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading')

  useEffect(() => {
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')
    const canceled = searchParams.get('canceled')

    if (success === 'true' && sessionId) {
      setStatus('success')
      // Set payment completed in localStorage
      localStorage.setItem('paymentCompleted', 'true')
    } else if (canceled === 'true') {
      setStatus('failed')
    } else {
      setStatus('failed')
    }
  }, [searchParams])

  const handleNextSteps = () => {
    router.push('/form-generation')
  }

  const handleTryAgain = () => {
    router.push('/payment')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Processing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-900/20 border border-green-600/30 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
              <p className="text-gray-300 text-sm">
                Thank you for your payment. Your divorce forms are ready to be generated.
              </p>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-400" />
                <div className="text-left">
                  <p className="text-green-400 font-medium text-sm">What's Next?</p>
                  <p className="text-gray-300 text-xs">
                    Get your completed forms and filing instructions
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextSteps}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors border border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <span>Get Your Forms</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-red-900/20 border border-red-600/30 rounded-full p-4">
                <XCircle className="h-12 w-12 text-red-400" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
              <p className="text-gray-300 text-sm">
                We couldn't process your payment. Please try again or contact support if the problem persists.
              </p>
            </div>

            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-400" />
                <div className="text-left">
                  <p className="text-red-400 font-medium text-sm">Common Issues</p>
                  <p className="text-gray-300 text-xs">
                    • Check your card details<br/>
                    • Ensure sufficient funds<br/>
                    • Try a different payment method
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors border border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span>Try Again</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-600 text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 