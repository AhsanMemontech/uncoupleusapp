'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const loginDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { listener?.subscription.unsubscribe() }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setShowLoginDropdown(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleStartDivorce = () => {
    router.push('/information-collection')
    setIsMenuOpen(false)
  }

  const handleHome = () => {
    router.push('/')
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowUserDropdown(false)
    router.refresh()
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Account for fixed header height (approximately 80px)
      const headerHeight = 100
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  const handleHomeClick = () => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      router.push('/')
    } else {
      // If we're already on home page, just scroll to hero section
      scrollToSection('hero')
    }
    setIsMenuOpen(false)
  }

  const handleHowItWorksClick = () => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      router.push('/')
    } else {
      // If we're already on home page, just scroll to how-it-works section
      scrollToSection('how-it-works')
    }
    setIsMenuOpen(false)
  }

  const handleFAQClick = () => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      router.push('/')
    } else {
      // If we're already on home page, just scroll to FAQ section
      scrollToSection('faq')
    }
    setIsMenuOpen(false)
  }

  const getInitials = (email: string) => {
    if (!email) return 'U'
    const [name] = email.split('@')
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={handleHomeClick}
              className="flex items-center space-x-2 group"
            >
              {/* <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div> */}
              <div>
                <div className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Uncouple
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">AI-Powered Divorce</div>
              </div>
            </button>
          </div>
          
          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </button>
            <button 
              onClick={handleHowItWorksClick}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              How it works
            </button>
            <button 
              onClick={handleFAQClick}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </button>
            <button 
              onClick={handleStartDivorce}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Get Started
            </button>
          </div>
          
          {/* Right Side - User/Login */}
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(v => !v)}
                  onMouseEnter={() => setShowUserDropdown(true)}
                  className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 hover:bg-white/40 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{getInitials(user.email)}</span>
                  </div>
                </button>
                {showUserDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl z-50 overflow-hidden"
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/30 bg-gradient-to-r from-cyan-600/40 to-blue-600/40">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{getInitials(user.email)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-xs">Signed in as</div>
                          <div className="text-cyan-300 text-xs truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <a 
                        href="/information-collection" 
                        className="flex items-center px-4 py-2.5 text-gray-200 hover:bg-white/30 transition-colors text-sm group"
                      >
                        <div className="w-4 h-4 mr-3 text-cyan-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        Profile
                      </a>
                      
                      <a 
                        href="/" 
                        className="flex items-center px-4 py-2.5 text-gray-200 hover:bg-white/30 transition-colors text-sm group"
                      >
                        <div className="w-4 h-4 mr-3 text-cyan-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        Home
                      </a>
                      
                      <div className="border-t border-white/30 my-1"></div>
                      
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-4 py-2.5 text-gray-200 hover:bg-red-500/40 hover:text-red-300 transition-colors text-sm group"
                      >
                        <div className="w-4 h-4 mr-3 text-red-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={loginDropdownRef}>
                <button
                  onClick={() => setShowLoginDropdown(v => !v)}
                  onMouseEnter={() => setShowLoginDropdown(true)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/30 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span>Sign In</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showLoginDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showLoginDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl z-50 overflow-hidden"
                    onMouseEnter={() => setShowLoginDropdown(true)}
                    onMouseLeave={() => setShowLoginDropdown(false)}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/30 bg-gradient-to-r from-cyan-600/40 to-blue-600/40">
                      <div className="text-white font-semibold text-xs mb-1">Welcome to Uncouple</div>
                      <div className="text-cyan-300 text-xs">Sign in to access your account</div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <a 
                        href="/login" 
                        className="flex items-center px-4 py-2.5 text-gray-200 hover:bg-white/30 transition-colors text-sm group"
                      >
                        <div className="w-4 h-4 mr-3 text-cyan-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        Log In
                      </a>
                      
                      <a 
                        href="/signup" 
                        className="flex items-center px-4 py-2.5 text-gray-200 hover:bg-white/30 transition-colors text-sm group"
                      >
                        <div className="w-4 h-4 mr-3 text-cyan-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        Create Account
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 bg-white/5 backdrop-blur-sm rounded-lg mt-2">
            <div className="flex flex-col space-y-3 px-4">
              <button 
                onClick={handleHomeClick}
                className="text-gray-300 hover:text-white transition-colors text-sm text-left py-2 rounded-lg hover:bg-white/10 px-3"
              >
                Home
              </button>
              <button 
                onClick={handleHowItWorksClick}
                className="text-gray-300 hover:text-white transition-colors text-sm text-left py-2 rounded-lg hover:bg-white/10 px-3"
              >
                How it works
              </button>
              <button 
                onClick={handleFAQClick}
                className="text-gray-300 hover:text-white transition-colors text-sm text-left py-2 rounded-lg hover:bg-white/10 px-3"
              >
                FAQ
              </button>
              <button 
                onClick={handleStartDivorce}
                className="text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 transition-all duration-200 text-sm font-semibold text-left"
              >
                Get Started
              </button>
              
              {user ? (
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{getInitials(user.email)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{user.email}</div>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-white/10">
                  <a 
                    href="/login" 
                    className="block text-gray-300 hover:text-white transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    Log In
                  </a>
                  <a 
                    href="/signup" 
                    className="block text-gray-300 hover:text-white transition-colors text-sm py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 