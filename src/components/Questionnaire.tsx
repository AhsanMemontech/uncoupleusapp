'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'

interface Question {
  id: string
  text: string
  type: 'yes-no' | 'multiple-choice' | 'text' | 'date'
  options?: string[]
  required?: boolean
  validation?: (value: any) => boolean
}

interface QuestionnaireProps {
  questions: Question[]
  onComplete: (answers: Record<string, any>) => void
  title?: string
  subtitle?: string
}

export default function Questionnaire({ questions, onComplete, title, subtitle }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [completionProgress, setCompletionProgress] = useState(0)

  const currentQ = questions[currentQuestion]

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }))
    setErrors(prev => ({ ...prev, [currentQ.id]: '' }))
  }

  const validateCurrentQuestion = () => {
    if (currentQ.required && !answers[currentQ.id]) {
      setErrors(prev => ({ ...prev, [currentQ.id]: 'This question is required' }))
      return false
    }
    if (currentQ.validation && !currentQ.validation(answers[currentQ.id])) {
      setErrors(prev => ({ ...prev, [currentQ.id]: 'Please provide a valid answer' }))
      return false
    }
    return true
  }

  const simulateCompletion = async () => {
    setIsCompleting(true)
    setCompletionProgress(0)
    const steps = [
      'Analyzing your responses...',
      'Checking eligibility criteria...',
      'Generating personalized report...',
      'Preparing recommendations...',
      'Finalizing results...'
    ]
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setCompletionProgress(((i + 1) / steps.length) * 100)
    }
    await new Promise(resolve => setTimeout(resolve, 500))
    onComplete(answers)
  }

  const nextQuestion = () => {
    if (validateCurrentQuestion()) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        simulateCompletion()
      }
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'yes-no':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => handleAnswer('yes')}
                className={`p-6 rounded-2xl border-2 transition-all font-semibold text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  answers[currentQ.id] === 'yes'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md'
                    : 'border-gray-300 hover:border-cyan-400 bg-white text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className={`h-6 w-6 ${answers[currentQ.id] === 'yes' ? 'text-cyan-500' : 'text-gray-400'}`} />
                  <span className="text-lg">Yes</span>
                </div>
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className={`p-6 rounded-2xl border-2 transition-all font-semibold text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  answers[currentQ.id] === 'no'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md'
                    : 'border-gray-300 hover:border-cyan-400 bg-white text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <XCircle className={`h-6 w-6 ${answers[currentQ.id] === 'no' ? 'text-cyan-500' : 'text-gray-400'}`} />
                  <span className="text-lg">No</span>
                </div>
              </button>
            </div>
          </div>
        )
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {currentQ.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all font-semibold text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  answers[currentQ.id] === option
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md'
                    : 'border-gray-300 hover:border-cyan-400 bg-white text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === option 
                      ? 'border-cyan-500 bg-cyan-500' 
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQ.id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )
      case 'text':
        return (
          <input
            type="text"
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-6 border-2 border-gray-300 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors text-lg shadow-sm bg-white text-gray-900 placeholder-gray-500"
            placeholder="Type your answer here..."
          />
        )
      case 'date':
        return (
          <input
            type="date"
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-6 border-2 border-gray-300 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors text-lg shadow-sm bg-white text-gray-900"
          />
        )
      default:
        return null
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleting) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl mx-4 sm:mx-auto">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6 sm:p-10">
          <div className="text-center">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Processing Your Responses</h1>
            <p className="text-cyan-100 text-sm sm:text-base">We&apos;re analyzing your answers to provide personalized recommendations</p>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm text-gray-500">Processing...</span>
              <span className="text-xs sm:text-sm text-gray-500">{Math.round(completionProgress)}% complete</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 sm:h-3">
              <div 
                className="bg-cyan-500 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionProgress}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl mx-4 sm:mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6 sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">{title || 'Eligibility Check'}</h1>
          <p className="text-cyan-100 text-base sm:text-lg font-medium">{subtitle || 'Let&apos;s determine if uncontested divorce is right for you'}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-gray-100">
        <div className="h-2 bg-cyan-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      
      {/* Question */}
      <div className="p-6 sm:p-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              {Math.round(progress)}% complete
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-relaxed">
            {currentQ.text}
          </h2>
          {errors[currentQ.id] && (
            <p className="text-red-600 text-xs sm:text-sm mb-4 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
              {errors[currentQ.id]}
            </p>
          )}
        </div>
        
        {/* Answer Options */}
        <div className="mb-6 sm:mb-8">
          {renderQuestion()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center gap-3 sm:gap-4">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl transition-colors font-semibold text-sm sm:text-base shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white'
            }`}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Previous</span>
          </button>
          <button
            onClick={nextQuestion}
            className="flex items-center space-x-2 bg-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base shadow-md hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 