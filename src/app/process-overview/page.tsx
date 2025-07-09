'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, FileText, Users, CheckCircle, ArrowRight, Calendar, DollarSign, Shield } from 'lucide-react'

export default function ProcessOverviewPage() {
  const router = useRouter()

  const processSteps = [
    {
      step: 1,
      title: "Information Collection",
      description: "Provide your personal details, marriage information, and financial data",
      duration: "10-15 minutes",
      icon: Users
    },
    {
      step: 2,
      title: "Form Generation",
      description: "Our AI fills out all required New York State divorce forms with your information",
      duration: "Instant",
      icon: FileText
    },
    {
      step: 3,
      title: "Review & Payment",
      description: "Review your completed forms and make secure payment",
      duration: "5-10 minutes",
      icon: DollarSign
    },
    {
      step: 4,
      title: "File with Court",
      description: "Submit your forms to the appropriate New York court",
      duration: "1-2 hours",
      icon: CheckCircle
    },
    {
      step: 5,
      title: "Wait for Processing",
      description: "Court processes your divorce petition",
      duration: "3-6 months",
      icon: Clock
    }
  ]

  const timeline = [
    {
      phase: "Preparation",
      duration: "1-2 weeks",
      description: "Complete forms and gather required documents"
    },
    {
      phase: "Filing",
      duration: "1 day",
      description: "Submit forms to court and pay filing fees"
    },
    {
      phase: "Service",
      duration: "1-2 weeks",
      description: "Serve divorce papers to your spouse"
    },
    {
      phase: "Waiting Period",
      duration: "3-6 months",
      description: "Court processes and finalizes divorce"
    }
  ]

  const costs = [
    {
      item: "Court Filing Fee",
      amount: "$210",
      description: "Standard fee for divorce filing in NY"
    },
    {
      item: "Service of Process",
      amount: "$50-100",
      description: "Cost to serve papers to spouse"
    },
    {
      item: "Uncouple Service",
      amount: "$99",
      description: "Form preparation and guidance"
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Your Divorce Process
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Heres exactly what to expect during your uncontested divorce in New York State. 
            Well guide you through each step to make the process as smooth as possible.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">How It Works</h2>
          <div className="space-y-6 sm:space-y-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="rounded-lg border border-gray-600 p-6 sm:p-8 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="bg-cyan-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                      <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium w-fit">
                        Step {step.step}
                      </span>
                      <span className="text-gray-400 text-sm">{step.duration}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-300 text-sm sm:text-base">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">Timeline</h2>
          <div className="rounded-lg border border-gray-600 p-6 sm:p-8 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {timeline.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-cyan-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">{item.phase}</h3>
                  <p className="text-cyan-400 font-medium mb-2 text-sm sm:text-base">{item.duration}</p>
                  <p className="text-xs sm:text-sm text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Costs */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">Estimated Costs</h2>
          <div className="rounded-lg border border-gray-600 p-6 sm:p-8 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
            <div className="space-y-4 sm:space-y-6">
              {costs.map((cost, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded-lg space-y-2 sm:space-y-0" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">{cost.item}</h3>
                    <p className="text-xs sm:text-sm text-gray-300">{cost.description}</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-cyan-400">{cost.amount}</span>
                </div>
              ))}
              <div className="border-t border-gray-600 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Total Estimated Cost</h3>
                  <span className="text-2xl sm:text-3xl font-bold text-cyan-400">$359-409</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">Important Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="rounded-lg border border-gray-600 p-6 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">Legal Disclaimer</h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    This service is not a substitute for legal advice. We recommend consulting with an attorney for complex legal matters.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-600 p-6 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">Processing Time</h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Court processing times vary by county. Most uncontested divorces are finalized within 3-6 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/information-collection')}
            className="bg-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center mx-auto"
          >
            Continue to Information Collection
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
            You can save your progress and return later
          </p>
        </div>
      </main>
    </div>
  )
} 