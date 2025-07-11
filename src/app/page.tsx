'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Shield, Clock, FileText, Users, MessageCircle, Folder, FileText as FileTextIcon, Share2, Lock, DollarSign, Smartphone, HelpCircle, X, Check, Star, Quote, TrendingUp, Zap, Award, ChevronDown } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const handleGetStarted = () => {
    router.push('/information-collection')
  }

  const handleSeeHowItWorks = () => {
    // Scroll to how it works section with header offset
    const element = document.getElementById('how-it-works')
    if (element) {
      // Account for fixed header height (approximately 100px)
      const headerHeight = 100
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqData = [
    {
      question: "Is Uncouple a legal service?",
      answer: "Uncouple is not a law firm, but everything is reviewed by licensed attorneys and based on real court workflows."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. All data is encrypted, private, and under your control. Nothing is shared without your permission."
    },
    {
      question: "Can I use Uncouple with my lawyer?",
      answer: "Yes. Your lawyer can access your info so you don't have to repeat anything. Uncouple saves you time and money."
    },
    {
      question: "What if I'm not ready yet?",
      answer: "No problem. Use the free tools, ask questions, and start when you're ready."
    },
    {
      question: "Does this work for uncontested divorces?",
      answer: "Yes. That's what it's designed for — simple, peaceful separations."
    },
    {
      question: "What if my spouse doesn't agree?",
      answer: "We can still help you prepare, understand your rights, and get support."
    },
    {
      question: "Which states are supported?",
      answer: "Right now: New York. More coming soon."
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
      {/* Hero Section */}
      <main id="hero" className="mt-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-1xl sm:text-1xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Your 24-Hour Divorce System
          </h1>
          <p className="text-md sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            Start, manage, and finalize your divorce — without the stress, delays, or high legal fees.
            Support when you need it. No pressure. No judgment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button 
              onClick={handleGetStarted}
              className="bg-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button 
              onClick={handleSeeHowItWorks}
              className="border border-gray-400 text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-700 hover:border-gray-300 transition-colors"
            >
              See how it works
            </button>
          </div>
        </div>

        <hr className='mb-10' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></hr>
        {/* The Problem Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              The Divorce System Fails You on Every Front
            </h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              It&apos;s not just expensive — it&apos;s scattered, slow, and stacked against you. Even if you want a simple, peaceful outcome, the system fights you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Information Problem */}
            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-white">The Information Problem</h3>
              </div>
              <p className="text-gray-300 mb-4 italic">&quot;Everything you need is out there — but good luck finding it.&quot;</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Guidance is fragmented across Reddit threads, outdated legal blogs, and government PDFs.</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Free support is opinion-based, inconsistent, or unavailable when you need it.</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Official phone lines are open for a few hours — with limited, low-level help.</span>
                </li>
              </ul>
            </div>

            {/* Lawyer Problem */}
            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-white">The Lawyer Problem</h3>
              </div>
              <p className="text-gray-300 mb-4 italic">&quot;They make money by taking time — not by solving your problem quickly.&quot;</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Every question or email adds to your bill.</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No lawyer is available 24/7 — no matter how good they are.</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You&apos;re constantly asked to resend info you&apos;ve already given.</span>
                </li>
              </ul>
            </div>

            {/* Court System Problem */}
            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-white">The Court System Problem</h3>
              </div>
              <p className="text-gray-300 mb-4 italic">&quot;The courts are built to slow you down — not help you move forward.&quot;</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You wait weeks, only to be told you filed incorrectly.</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>The system still relies on postage, faxes, and in-person paperwork.</span>
                </li>
                <li className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No one explains how it works — you&apos;re expected to just figure it out.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className='mb-10' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></hr>
        {/* The Solution Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              One Simple System. Built to Save You Time, Money, and Stress.
            </h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              Whether you&apos;re filing alone, working with a lawyer, or still figuring it out — Uncouple gives you the tools, clarity, and support to move forward fast.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <h3 className="text-xl font-semibold text-white mb-4">1. Get Help When You Need It</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>24/7 answers from AI or a lawyer</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No hourly billing for simple questions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Support when panic hits — not just during office hours</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <h3 className="text-xl font-semibold text-white mb-4">2. Streamlined, Not Scattered</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You enter your information once</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>It&apos;s reused across all forms and shared automatically</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No more repeating yourself or chasing lost files</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <h3 className="text-xl font-semibold text-white mb-4">3. Works With the System, Not Against It</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Pre-filled forms, court instructions, and real-time status tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Shareable case summaries for any lawyer or judge</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Cut through the red tape — without missing anything</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Callout Box */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">Simple. Peaceful. Done.</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Whether you&apos;re filing alone, working with a lawyer, or just getting started — 
              Uncouple gives you the tools and support to move forward with confidence.
            </p>
          </div>
        </div>
        
        <hr className='mb-10' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></hr>

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Free. Move at Your Own Pace. Get Divorced Without the Drama.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="bg-cyan-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Set Up a Free Account</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ask questions anytime</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Save your answers and history automatically</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Stay organized and in control from Day 1</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="bg-cyan-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Everything You Need — In One Place</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>We guide you step-by-step</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Forms are pre-filled and ready to go</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Filing instructions are included — no guesswork</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="bg-cyan-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Loop in a Lawyer — Or Use the One You Already Have</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your lawyer can access your full case and history</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You avoid repeating yourself or paying for unnecessary back-and-forth</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>You stay supported 24/7, even when your lawyer&apos;s offline</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pullout Highlight */}
          <div className="bg-cyan-600/20 border border-cyan-600 rounded-lg p-6 text-center">
            <p className="text-xl font-semibold text-white">
              Most users can prepare and download their full divorce filing in under 15 minutes.
            </p>
          </div>
        </div>

        <hr className='mb-10' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></hr>
        {/* What You Get Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What You Get with Uncouple
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <MessageCircle className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">24/7 Smart Q&A</h3>
              <p className="text-gray-300 text-sm">Ask anything, anytime</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <Folder className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Smart Case Timeline</h3>
              <p className="text-gray-300 text-sm">Keep everything in one secure place</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <FileTextIcon className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Pre-Filled Court Forms</h3>
              <p className="text-gray-300 text-sm">Ready in minutes</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <Share2 className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Secure Lawyer Sharing</h3>
              <p className="text-gray-300 text-sm">Loop them in, instantly</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <ArrowRight className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Step-by-Step Filing Guidance</h3>
              <p className="text-gray-300 text-sm">No guesswork</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <Lock className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Private & Encrypted</h3>
              <p className="text-gray-300 text-sm">Total confidentiality</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <DollarSign className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Transparent Pricing</h3>
              <p className="text-gray-300 text-sm">Only pay if you need a lawyer</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-600 backdrop-blur-sm text-center" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <Smartphone className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Mobile-Ready</h3>
              <p className="text-gray-300 text-sm">Use it wherever and whenever</p>
            </div>
          </div>
        </div>

        <hr className='mb-10' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></hr>
        {/* FAQ Section */}
        <div id="faq" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

         <div className="max-w-4xl mx-auto">
           <div className="space-y-4">
             {faqData.map((item, index) => (
               <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                 <button
                   onClick={() => toggleFAQ(index)}
                   className="flex justify-between items-center w-full text-left text-white"
                 >
                   <h4 className="font-semibold text-lg">{item.question}</h4>
                   <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`} />
                 </button>
                 {openFAQ === index && (
                   <p className="text-gray-300 mt-4 text-sm">{item.answer}</p>
                 )}
               </div>
             ))}
           </div>
         </div>
        </div>

        <hr className='mb-10' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></hr>
        {/* Final CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Make Progress — Without the Pressure?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            You don&apos;t need to pay a lawyer just to ask a question.
            You don&apos;t need to stay stuck because the system is confusing.
            You can start right now — for free.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center mx-auto"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <p className="text-gray-400 mt-4">No credit card. No commitment. Just clarity.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-black text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Uncouple</h3>
                  <p className="text-cyan-400 text-sm">AI-Powered Divorce</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Making uncontested divorce simple, affordable, and accessible for New York residents. 
                Get the support you need, when you need it.
              </p>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Uncontested Divorce
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Form Generation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Process Guidance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Legal Consultation
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8 flex justify-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm">
                  © 2024 Uncouple. All rights reserved.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    Privacy Policy
                  </a>
                </div>
              </div>
              
              {/* <div className="text-gray-500 text-xs max-w-md">
                This service is not a substitute for legal advice. 
                We recommend consulting with an attorney for complex legal matters.
              </div> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 