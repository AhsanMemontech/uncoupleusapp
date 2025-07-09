'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Questionnaire from '@/components/Questionnaire'
import { CheckCircle, XCircle, AlertTriangle, Clock, FileText, Users, Shield, ArrowRight, Download, Printer } from 'lucide-react'
import { getAIQuestions, getAIReport } from '@/lib/ai'

interface Question {
  id: string
  text: string
  type: 'yes-no' | 'multiple-choice' | 'text' | 'date'
  options?: string[]
  required?: boolean
  validation?: (value: any) => boolean
}

const fallbackQuestions: Question[] = [
  {
    id: 'residency',
    text: 'Do you or your spouse currently live in New York State?',
    type: 'yes-no',
    required: true
  },
  {
    id: 'marriage_duration',
    text: 'How long have you been married?',
    type: 'multiple-choice',
    options: [
      'Less than 1 year',
      '1-5 years',
      '5-10 years',
      '10-20 years',
      'More than 20 years'
    ],
    required: true
  },
  {
    id: 'child_agreement',
    text: 'If you have children, do you both agree on custody and support arrangements?',
    type: 'yes-no',
    required: false,
    validation: (value) => true
  },
]

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [aiError, setAiError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getAIQuestions()
      .then((q) => {
        if (isMounted && Array.isArray(q) && q.length > 0) {
          setQuestions(q)
        } else {
          setQuestions(fallbackQuestions)
          setAiError(true)
        }
      })
      .catch(() => {
        setQuestions(fallbackQuestions)
        setAiError(true)
      })
      .finally(() => setLoading(false))
    return () => { isMounted = false }
  }, [])

  const handleComplete = async (answers: Record<string, any>) => {
    if (!questions) return
    // Use AI for analysis
    setLoading(true)
    try {
      const aiReport = await getAIReport(answers, questions)
      if (aiReport && typeof aiReport === 'object') {
        setResults({ answers, ...aiReport })
        setShowResults(true)
        setLoading(false)
        return
      }
    } catch (e) {
      // fallback below
    }
    // fallback to old analysis
    setResults({ answers, ...analyzeEligibility(answers) })
    setShowResults(true)
    setLoading(false)
  }

  // Fallback analysis (old logic)
  const analyzeEligibility = (answers: Record<string, any>) => {
    const criteria = {
      residency: answers.residency === 'yes',
      marriage_duration: answers.marriage_duration && answers.marriage_duration !== 'Less than 1 year',
      child_agreement: answers.child_agreement === 'yes' || answers.child_agreement === undefined
    }
    const isEligible = criteria.residency && criteria.marriage_duration
    const score = Object.values(criteria).filter(Boolean).length
    const totalCriteria = Object.keys(criteria).length
    const eligibilityPercentage = (score / totalCriteria) * 100
    const recommendations = []
    const warnings = []
    if (!criteria.residency) {
      warnings.push('You must be a resident of New York State to file for divorce here')
      recommendations.push('Consider filing in your current state of residence')
    }
    if (!criteria.marriage_duration) {
      warnings.push('You must be married for at least 1 year to file for divorce in New York')
      recommendations.push('Wait until you have been married for at least 1 year before proceeding')
    }
    if (answers.child_agreement === 'no') {
      warnings.push('Disagreements about child custody may require mediation or legal assistance')
      recommendations.push('Consider working with a mediator to resolve custody disagreements')
    }
    if (answers.marriage_duration === '10-20 years' || answers.marriage_duration === 'More than 20 years') {
      recommendations.push('Long-term marriages may have complex asset division - consider consulting with a financial advisor')
    }
    if (answers.marriage_duration === 'Less than 1 year') {
      recommendations.push('Very short marriages may be eligible for annulment instead of divorce')
    }
    return {
      isEligible,
      eligibilityPercentage,
      criteria,
      recommendations,
      warnings,
      score,
      totalCriteria
    }
  }

  const getRecommendation = () => {
    if (!results) return null
    // If AI report, use its fields
    if ('isEligible' in results) {
      if (results.isEligible) {
        return {
          type: 'success',
          title: 'You are eligible for uncontested divorce',
          message: results.summary || 'Based on your responses, you meet all the criteria for an uncontested divorce in New York State.',
          icon: CheckCircle,
          action: 'Continue to Process Overview',
          color: 'from-green-600 to-green-700'
        }
      } else if (results.eligibilityPercentage >= 75) {
        return {
          type: 'partial',
          title: 'You may be eligible with some considerations',
          message: results.summary || 'You meet most criteria but may need to address some issues before proceeding.',
          icon: AlertTriangle,
          action: 'Schedule Legal Consultation',
          color: 'from-yellow-600 to-yellow-700'
        }
      } else {
        return {
          type: 'warning',
          title: 'Contested divorce may be more appropriate',
          message: results.summary || 'Based on your answers, you may need to consider a contested divorce or consult with an attorney.',
          icon: XCircle,
          action: 'Schedule Legal Consultation',
          color: 'from-red-600 to-red-700'
        }
      }
    }
    // fallback
    if (results.isEligible) {
      return {
        type: 'success',
        title: 'You are eligible for uncontested divorce',
        message: 'Based on your responses, you meet all the criteria for an uncontested divorce in New York State.',
        icon: CheckCircle,
        action: 'Continue to Process Overview',
        color: 'from-green-600 to-green-700'
      }
    } else if (results.eligibilityPercentage >= 75) {
      return {
        type: 'partial',
        title: 'You may be eligible with some considerations',
        message: 'You meet most criteria but may need to address some issues before proceeding.',
        icon: AlertTriangle,
        action: 'Schedule Legal Consultation',
        color: 'from-yellow-600 to-yellow-700'
      }
    } else {
      return {
        type: 'warning',
        title: 'Contested divorce may be more appropriate',
        message: 'Based on your answers, you may need to consider a contested divorce or consult with an attorney.',
        icon: XCircle,
        action: 'Schedule Legal Consultation',
        color: 'from-red-600 to-red-700'
      }
    }
  }

  const handleContinue = () => {
    if (results?.isEligible) {
      router.push('/process-overview')
    } else {
      router.push('/legal-consultation')
    }
  }

  const handleDownloadReport = () => {
    // TODO: Implement AI-powered report download
    console.log('Downloading report...')
  }

  const handlePrintReport = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1e2a3b' }}>
        <div className="text-white text-lg">Loading questions...</div>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1e2a3b' }}>
        <div className="text-red-400 text-lg">Unable to load questions. Please try again later.</div>
      </div>
    )
  }

  if (showResults && results) {
    const recommendation = getRecommendation()
    const IconComponent = recommendation?.icon

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4">
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
            {/* Header */}
            <div className={`p-6 sm:p-8 text-center ${recommendation?.color} text-white`}>
              {IconComponent && <IconComponent className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />}
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{recommendation?.title}</h1>
              <p className="text-base sm:text-lg opacity-90">{recommendation?.message}</p>
            </div>

            {/* Eligibility Score */}
            <div className="px-4 sm:px-6 pt-6 pb-2 border-b border-gray-600">
              <div className="text-center mb-2">
                <h2 className="text-lg sm:text-xl font-bold mb-1 text-white">Eligibility Assessment</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{results.eligibilityPercentage}%</div>
                  <div className="text-gray-300 text-sm sm:text-base">
                    <div>Score: {results.score ?? results.eligibilityPercentage}/100</div>
                    <div className="text-xs">criteria met</div>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="bg-gray-600 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    results.eligibilityPercentage >= 100 ? 'bg-green-600' :
                    results.eligibilityPercentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${results.eligibilityPercentage}%` }}
                />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Criteria Analysis */}
              {results.criteria && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Criteria Analysis</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(results.criteria).map(([key, met]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                        <span className="text-gray-300 capitalize text-sm sm:text-base">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center space-x-2">
                          {met ? (
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                          )}
                          <span className={`text-xs sm:text-sm font-medium ${met ? 'text-green-400' : 'text-red-400'}`}>
                            {met ? 'Met' : 'Not Met'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {results.warnings && results.warnings.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-400">Important Considerations</h2>
                  <div className="space-y-3">
                    {results.warnings.map((warning: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 border border-red-400 rounded-lg" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-300 text-sm sm:text-base">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations && results.recommendations.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Recommendations</h2>
                  <div className="space-y-3">
                    {results.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 border border-cyan-400 rounded-lg" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-cyan-300 text-sm sm:text-base">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Next Steps</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1 text-white text-sm sm:text-base">Timeline</h3>
                    <p className="text-xs sm:text-sm text-gray-300">3-6 months to complete</p>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1 text-white text-sm sm:text-base">Forms</h3>
                    <p className="text-xs sm:text-sm text-gray-300">All required documents</p>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1 text-white text-sm sm:text-base">Support</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Guidance throughout</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowResults(false)}
                  className="flex-1 px-4 sm:px-6 py-3 border border-gray-400 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Retake Questionnaire
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 px-4 sm:px-6 py-3 border border-gray-400 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </button>
                <button
                  onClick={handlePrintReport}
                  className="flex-1 px-4 sm:px-6 py-3 border border-gray-400 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </button>
                <button
                  onClick={handleContinue}
                  className={`flex-1 px-4 sm:px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center text-sm sm:text-base ${
                    recommendation?.type === 'success'
                      ? 'bg-cyan-600 hover:bg-cyan-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {recommendation?.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
      <div className="py-8 sm:py-12">
        <Questionnaire
          questions={questions}
          onComplete={handleComplete}
          title="Divorce Eligibility Check"
          subtitle="Answer a few questions to see if uncontested divorce is right for you"
        />
      </div>
    </div>
  )
} 