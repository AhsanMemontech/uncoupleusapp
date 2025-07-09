'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Download, Phone, Mail, ExternalLink, Building, User, DollarSign } from 'lucide-react'

export default function NextStepsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('filing')

  useEffect(() => {
    // Check if payment was completed
    const paymentCompleted = localStorage.getItem('paymentCompleted')
    
    if (paymentCompleted !== 'true') {
      // Check if we're coming from successful payment
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get('success')
      const sessionId = urlParams.get('session_id')
      
      if (success && sessionId) {
        // Payment was successful, set payment status
        localStorage.setItem('paymentCompleted', 'true')
        // Clean up URL
        window.history.replaceState({}, '', '/next-steps')
      } else {
        // Redirect to payment if not paid
        router.push('/payment')
        return
      }
    }
  }, [router])

  const steps = [
    {
      id: 'filing',
      title: 'Filing Process',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">Important Notice</h3>
                <p className="text-gray-300 text-sm">
                  We cannot file your divorce forms for you. You must file them yourself in courthouse. This guide will walk you through the process step by step.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Step-by-Step Filing Instructions</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium text-white mb-2">Find Your County Courthouse</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Locate the Supreme Court in your county. You can find this information on the New York State Courts website.
                  </p>
                  <a 
                    href="https://iapps.courts.state.ny.us/webcivil/ecourtsMain" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Find Your County Court</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium text-white mb-2">Make Copies of Your Forms</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Print multiple copies of each form. You&apos;ll need:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• 1 original for the court</li>
                    <li>• 1 copy for your spouse</li>
                    <li>• 1 copy for your records</li>
                    <li>• Additional copies if you have children</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium text-white mb-2">File Your Forms</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Take your forms to the courthouse during business hours. You&apos;ll need to:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• Pay the filing fee (typically $210-$335)</li>
                    <li>• Present valid photo ID</li>
                    <li>• Submit all required forms</li>
                    <li>• Get a case number and court date</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-medium text-white mb-2">Serve Your Spouse</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Your spouse must be properly served with the divorce papers. You can:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• Use a process server (recommended)</li>
                    <li>• Have someone over 18 serve them</li>
                    <li>• Use certified mail (if spouse agrees)</li>
                    <li>• File an Affidavit of Service with the court</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <h4 className="font-medium text-white mb-2">Attend Your Court Hearing</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    On your scheduled court date, bring:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• All original forms</li>
                    <li>• Proof of service</li>
                    <li>• Any additional required documents</li>
                    <li>• Your spouse (if uncontested)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'requirements',
      title: 'Requirements',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">What You&apos;ll Need</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-cyan-400 font-medium flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Documents
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Valid photo ID (driver&apos;s license or passport)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Social Security card</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Marriage certificate</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Birth certificates (if you have children)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-cyan-400 font-medium flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial Requirements
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Filing fee: $210-$335 (varies by county)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Process server fee: $50-$150</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Copy fees: $0.25-$1.00 per page</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Certified mail fees (if applicable)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-cyan-400 font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timeline Requirements
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Residency: At least 2 years in NY (or 1 year if married in NY)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Separation: At least 6 months (if using separation as grounds)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Service: Spouse must be served within 120 days of filing</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: Building,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Helpful Resources</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-cyan-400 font-medium">Official Resources</h4>
              <div className="space-y-3">
                <a 
                  href="https://www.nycourts.gov/divorce/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors" 
                  style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}
                >
                  <Building className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h5 className="font-medium text-white">NY Courts Divorce Information</h5>
                    <p className="text-sm text-gray-400">Official divorce information and forms</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </a>

                <a 
                  href="https://iapps.courts.state.ny.us/webcivil/ecourtsMain" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors" 
                  style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}
                >
                  <FileText className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h5 className="font-medium text-white">eCourts</h5>
                    <p className="text-sm text-gray-400">Electronic court filing system</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </a>

                <a 
                  href="https://www.nycourts.gov/courts/nyc/family/forms.shtml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors" 
                  style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}
                >
                  <FileText className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h5 className="font-medium text-white">Family Court Forms</h5>
                    <p className="text-sm text-gray-400">Additional forms and instructions</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-cyan-400 font-medium">Support Services</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <h5 className="font-medium text-white mb-2">Legal Aid Services</h5>
                  <p className="text-sm text-gray-400 mb-3">Free or low-cost legal assistance for qualifying individuals</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>1-800-342-3661</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>info@legalaidnyc.org</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <h5 className="font-medium text-white mb-2">Court Help Centers</h5>
                  <p className="text-sm text-gray-400 mb-3">In-person assistance with court procedures</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Available at most courthouses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Mon-Fri, 9AM-5PM</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-600" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <h5 className="font-medium text-white mb-2">Process Servers</h5>
                  <p className="text-sm text-gray-400 mb-3">Professional service of legal documents</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Typical cost: $50-$150</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Search online for local providers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Next Steps</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm sm:text-base">What to do with your generated divorce forms</p>
            {/* <button
                onClick={() => router.push('/form-generation')}
                className="flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm sm:text-base"
              >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Generate Forms</span>
            </button> */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap space-x-1 mb-6 sm:mb-8 p-1 rounded-lg bg-gray-700 overflow-x-auto">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === step.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <step.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{step.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg border border-gray-600 p-6 sm:p-8 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
          {steps.find(step => step.id === activeTab)?.content}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-4 sm:space-y-0">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => {
                // Open Calendly for lawyer scheduling
                // TODO: Replace with your actual Calendly link
                window.open('https://calendly.com/uncouple-divorce/consultation', '_blank')
              }}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Schedule with a Lawyer</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm sm:text-base"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Print Instructions</span>
            </button>

            {/* <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              <span>Back to Home</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button> */}
          </div>
        </div>
      </main>
    </div>
  )
} 