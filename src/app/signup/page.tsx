'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)
    if (signUpError) {
      setError(signUpError.message)
      return
    }
    router.push('/information-collection')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e2a3b] px-4">
      <form onSubmit={handleSignup} className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign Up</h2>
        {error && <div className="text-red-400 font-semibold text-center">{error}</div>}
        <div>
          <label className="block text-gray-300 text-xs font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="text-sm w-full p-3 border-2 border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-xs font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="text-sm w-full p-3 border-2 border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
            placeholder="Create a password"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm sm:text-base w-full"
          disabled={loading}
        >
          <span>{loading ? 'Signing up...' : 'Sign Up'}</span>
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div className="text-center mt-4">
          <a href="/login" className="text-cyan-400 hover:underline text-sm">Already have an account? Log in</a>
        </div>
      </form>
    </div>
  )
} 