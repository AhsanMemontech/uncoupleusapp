'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Download, CheckCircle, AlertCircle, Clock, User, Calendar, MapPin, Building, ArrowRight, ArrowLeft, Eye, EyeOff, FileDown } from 'lucide-react'
import { generateAllDocxFiles, createDocumentsZip } from '@/lib/docxProcessor'

interface FormData {
  // Section A - Basic Info
  yourFullName: string
  yourAddress: string
  yourEmail: string
  yourPhone: string
  spouseFullName: string
  spouseLastKnownAddress: string
  
  // Section B - Marriage Details
  marriageDate: string
  marriageCity: string
  marriageState: string
  ceremonyType: 'Civil' | 'Religious' | ''
  nameChange: boolean
  whoChangedName: string
  formerName: string
  
  // Section C - Residency & Grounds
  livedInNY2Years: boolean
  alternativeRoute: string
  marriageBreakdownDate: string
  filingNoFault: boolean
  
  // Section D - Property & Support
  hasSettlementAgreement: boolean
  settlementAgreementFile: File | null
  sharedBankAccounts: boolean
  bankAccountDetails: string
  sharedPropertyVehicles: boolean
  propertyVehicleDetails: string
  includeSpousalSupport: boolean
  spousalSupportAmount: string
  spousalSupportDuration: string
  
  // Section E - Name Change
  wantToRevertName: boolean
  yourFormerName: string
  spouseWantToRevert: boolean
  spouseFormerName: string
  
  // Section F - Filing & Support
  canPayFilingFees: boolean
  needFeeWaiver: boolean
  hasPrinterScanner: boolean
  wantLegalReview: boolean
}

interface GeneratedForm {
  id: string
  name: string
  description: string
  formNumber: string
  status: 'generating' | 'completed' | 'error'
  downloadUrl?: string
  preview?: string
}

export default function FormGenerationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [generatedForms, setGeneratedForms] = useState<GeneratedForm[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'review' | 'generating' | 'completed'>('review')
  const [showSSN, setShowSSN] = useState(false)

  // Required forms for uncontested divorce in NY
  const requiredForms = [
    {
      id: 'UD-1',
      name: 'Summons with Notice',
      description: 'Official notice to your spouse about the divorce proceedings',
      formNumber: 'UD-1'
    },
    {
      id: 'UD-2',
      name: 'Verified Complaint for Divorce',
      description: 'The main divorce petition explaining the grounds for divorce',
      formNumber: 'UD-2'
    },
    {
      id: 'UD-6',
      name: 'Affidavit of Service',
      description: 'Proof that your spouse was properly served with the divorce papers',
      formNumber: 'UD-6'
    },
    {
      id: 'UD-9',
      name: 'Financial Disclosure Affidavit',
      description: 'Financial disclosure form showing assets and liabilities',
      formNumber: 'UD-9'
    },
    {
      id: 'UD-10',
      name: 'Settlement Agreement',
      description: 'Agreement between spouses on property division and other matters',
      formNumber: 'UD-10'
    },
    {
      id: 'UD-11',
      name: 'Judgment of Divorce',
      description: 'Final court order granting the divorce',
      formNumber: 'UD-11'
    }
  ]

  useEffect(() => {
    // Check if payment was completed
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const sessionId = urlParams.get('session_id')
    
    if (success && sessionId) {
      // Payment was successful, set payment status
      localStorage.setItem('paymentCompleted', 'true')
      // Clean up URL
      window.history.replaceState({}, '', '/form-generation')
    }
    
    // Load form data from localStorage
    const savedData = localStorage.getItem('divorceFormData')
    
    if (savedData) {
      setFormData(JSON.parse(savedData))
    } else {
      // Redirect to information collection if no data
      router.push('/information-collection')
      return
    }
  }, [router])

  const generateForms = async () => {
    setIsGenerating(true)
    setCurrentStep('generating')

    // Initialize forms with generating status
    const forms: GeneratedForm[] = requiredForms.map(form => ({
      id: form.id,
      name: form.name,
      description: form.description,
      formNumber: form.formNumber,
      status: 'generating' as const
    }))

    setGeneratedForms(forms)

    try {
      // Generate all DOCX documents using client-side processing
      const documents = await generateAllDocxFiles(formData!)
      
      // Update all forms to completed status
      setGeneratedForms(prev => prev.map(form => ({
        ...form,
        status: 'completed' as const,
        preview: generateFormPreview(form.id, formData!)
      })))

      // Create and download ZIP file
      const zipBlob = await createDocumentsZip(documents)
      const url = window.URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'divorce_forms.docx.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (error) {
      console.error('Error generating forms:', error)
      setGeneratedForms(prev => prev.map(form => ({
        ...form,
        status: 'error' as const
      })))
    }

    setIsGenerating(false)
    setCurrentStep('completed')
  }

  const generateFormPreview = (formId: string, data: FormData): string => {
    const previews: { [key: string]: string } = {
      'UD-1': `SUMMONS WITH NOTICE\n\nTO: ${data.spouseFullName}\n\nYou are hereby summoned to answer the complaint in this action and to serve a copy of your answer, or, if the complaint is not served with this summons, to serve a notice of appearance, on the plaintiff's attorney within 20 days after the service of this summons...`,
      'UD-2': `VERIFIED COMPLAINT FOR DIVORCE\n\nPlaintiff: ${data.yourFullName}\nDefendant: ${data.spouseFullName}\n\n1. Plaintiff resides at ${data.yourAddress}.\n2. Defendant resides at ${data.spouseLastKnownAddress || 'Unknown'}.\n3. The parties were married on ${data.marriageDate} in ${data.marriageCity}, ${data.marriageState}.\n4. The marriage has broken down irretrievably for a period of at least six months.`,
      'UD-6': `AFFIDAVIT OF SERVICE\n\nI, ${data.yourFullName}, being duly sworn, depose and say:\n\n1. I am the plaintiff in this action.\n2. On ${data.marriageBreakdownDate}, I served the Summons with Notice and Verified Complaint for Divorce upon ${data.spouseFullName}...`,
      'UD-9': `FINANCIAL DISCLOSURE AFFIDAVIT\n\nName: ${data.yourFullName}\nAddress: ${data.yourAddress}\n\nASSETS:\n- Shared Bank Accounts: ${data.sharedBankAccounts ? 'Yes' : 'No'}\n- Bank Account Details: ${data.bankAccountDetails}\n- Shared Property/Vehicles: ${data.sharedPropertyVehicles ? 'Yes' : 'No'}\n- Property/Vehicle Details: ${data.propertyVehicleDetails}\n\nSPOUSAL SUPPORT:\n- Include Spousal Support: ${data.includeSpousalSupport ? 'Yes' : 'No'}\n- Amount: ${data.spousalSupportAmount}\n- Duration: ${data.spousalSupportDuration}`,
      'UD-10': `SETTLEMENT AGREEMENT\n\nThis agreement is made between ${data.yourFullName} ("Plaintiff") and ${data.spouseFullName} ("Defendant") on ${data.marriageBreakdownDate}.\n\n1. PROPERTY DIVISION:\n   - Shared Bank Accounts: ${data.sharedBankAccounts ? 'Yes' : 'No'}\n   - Bank Account Details: ${data.bankAccountDetails}\n   - Shared Property/Vehicles: ${data.sharedPropertyVehicles ? 'Yes' : 'No'}\n   - Property/Vehicle Details: ${data.propertyVehicleDetails}\n\n2. SPOUSAL SUPPORT:\n   - Include Spousal Support: ${data.includeSpousalSupport ? 'Yes' : 'No'}\n   - Amount: ${data.spousalSupportAmount}\n   - Duration: ${data.spousalSupportDuration}`,
      'UD-11': `JUDGMENT OF DIVORCE\n\nIT IS ORDERED AND ADJUDGED that:\n\n1. The marriage between ${data.yourFullName} and ${data.spouseFullName} is hereby dissolved.\n\n2. The parties were married on ${data.marriageDate} in ${data.marriageCity}, ${data.marriageState}.\n\n3. The grounds for divorce are irretrievable breakdown of the marriage.\n\n4. All other relief requested is granted as set forth in the Settlement Agreement.`
    }

    return previews[formId] || 'Form preview not available'
  }

  const downloadForm = async (formId: string) => {
    try {
      const { processDocxFile } = await import('@/lib/docxProcessor')
      const processedDoc = await processDocxFile(formId, formData!)
      
      if (processedDoc.docxBuffer) {
        const blob = new Blob([processedDoc.docxBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = processedDoc.fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading form:', error)
    }
  }

  const viewAsPDF = async (formId: string) => {
    try {
      const { processDocxFile } = await import('@/lib/docxProcessor')
      const processedDoc = await processDocxFile(formId, formData!)
      
      if (processedDoc.docxBuffer) {
        const blob = new Blob([processedDoc.docxBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        })
        const url = window.URL.createObjectURL(blob)
        
        // Open in new tab - browser will handle PDF conversion if supported
        window.open(url, '_blank')
        
        // Clean up URL after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
        }, 1000)
      }
    } catch (error) {
      console.error('Error viewing form as PDF:', error)
    }
  }

  const downloadAllForms = async () => {
    try {
      const documents = await generateAllDocxFiles(formData!)
      const zipBlob = await createDocumentsZip(documents)
      const url = window.URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'divorce_forms.docx.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading all forms:', error)
    }
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1e2a3b' }}>
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
      <main className="mx-12 px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Form Generation</h1>
          <p className="text-gray-400">Review your information and generate the required divorce forms</p>
        </div>

        {/* Information Review */}
        <div className="mb-8">
          <div className="rounded-xl border border-gray-600/50 p-6 backdrop-blur-sm shadow-2xl" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.03)' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Information Review</h2>
                <p className="text-gray-400 text-xs">Please verify all information before generating your forms</p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-600/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400">Your Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Name</span>
                      <span className="text-white font-bold text-sm">{formData.yourFullName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Address</span>
                      <span className="text-white text-right max-w-xs font-medium text-sm">{formData.yourAddress}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Email</span>
                      <span className="text-cyan-400 font-bold text-sm">{formData.yourEmail}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Phone</span>
                      <span className="text-white font-bold text-sm">{formData.yourPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-600/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400">Spouse Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Name</span>
                      <span className="text-white font-bold text-sm">{formData.spouseFullName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Address</span>
                      <span className="text-white text-right max-w-xs font-medium text-sm">{formData.spouseLastKnownAddress || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marriage & Legal Details */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-600/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400">Marriage Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Date</span>
                      <span className="text-white font-bold text-sm">{new Date(formData.marriageDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Location</span>
                      <span className="text-white font-bold text-sm">{formData.marriageCity}, {formData.marriageState}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <span className="text-gray-300 font-medium text-xs">Type</span>
                      <span className="text-white font-bold text-sm">{formData.ceremonyType}</span>
                    </div>
                    {formData.nameChange && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-cyan-900/30 to-cyan-800/30 border border-cyan-500/30 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-400 font-bold text-xs">Name Change</span>
                          <span className="text-white font-medium text-xs">{formData.whoChangedName} - {formData.formerName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-cyan-400">Residency & Grounds</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400 text-sm font-medium">NY Residency</span>
                      <span className={`font-semibold text-sm ${formData.livedInNY2Years ? 'text-green-400' : 'text-yellow-400'}`}>
                        {formData.livedInNY2Years ? '✓ Yes (2+ years)' : '✗ No'}
                      </span>
                    </div>
                    {!formData.livedInNY2Years && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400 text-sm font-medium">Alternative Route</span>
                        <span className="text-white text-sm  font-semibold text-right max-w-xs">
                          {formData.alternativeRoute.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400 text-smfont-medium">Breakdown Date</span>
                      <span className="text-white font-semibold text-sm">{new Date(formData.marriageBreakdownDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 text-sm font-medium">Filing Type</span>
                      <span className={`font-semibold text-sm ${formData.filingNoFault ? 'text-green-400' : 'text-yellow-400'}`}>
                        {formData.filingNoFault ? 'No-Fault' : 'Fault-Based'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Sections */}
            <div className="grid lg:grid-cols-3 gap-4 mt-4">
                              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-600/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400">Property & Support</h3>
                  </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">Settlement Agreement</span>
                    <span className={`font-semibold text-sm ${formData.hasSettlementAgreement ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.hasSettlementAgreement ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">Shared Bank Accounts</span>
                    <span className={`font-semibold text-sm ${formData.sharedBankAccounts ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.sharedBankAccounts ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">Shared Property/Vehicles</span>
                    <span className={`font-semibold text-sm ${formData.sharedPropertyVehicles ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.sharedPropertyVehicles ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm font-medium">Spousal Support</span>
                    <span className={`font-semibold text-sm ${formData.includeSpousalSupport ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.includeSpousalSupport ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  {formData.includeSpousalSupport && (
                    <div className="mt-3 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 text-sm font-medium">Amount</span>
                          <span className="text-white font-semibold text-sm">${formData.spousalSupportAmount}/month</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 text-sm font-medium">Duration</span>
                          <span className="text-white font-semibold text-sm">{formData.spousalSupportDuration}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-400">Name Changes</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">You Revert Name</span>
                    <span className={`font-semibold text-sm ${formData.wantToRevertName ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.wantToRevertName ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  {formData.wantToRevertName && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400 text-sm font-medium">Your Former Name</span>
                      <span className="text-white font-semibold text-sm">{formData.yourFormerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">Spouse Reverts Name</span>
                    <span className={`font-semibold text-sm ${formData.spouseWantToRevert ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.spouseWantToRevert ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  {formData.spouseWantToRevert && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 text-sm font-medium">Spouse Former Name</span>
                      <span className="text-white font-semibold text-sm">{formData.spouseFormerName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-400">Filing & Support</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">Can Pay Filing Fees</span>
                    <span className={`font-semibold text-sm ${formData.canPayFilingFees ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formData.canPayFilingFees ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  {!formData.canPayFilingFees && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400 text-sm font-medium">Fee Waiver</span>
                      <span className={`font-semibold text-sm ${formData.needFeeWaiver ? 'text-green-400' : 'text-gray-400'}`}>
                        {formData.needFeeWaiver ? '✓ Requested' : '✗ Not requested'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-medium">Has Printer/Scanner</span>
                    <span className={`font-semibold text-sm ${formData.hasPrinterScanner ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formData.hasPrinterScanner ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm font-medium">Legal Review</span>
                    <span className={`font-semibold text-sm ${formData.wantLegalReview ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.wantLegalReview ? '✓ Requested' : '✗ Not requested'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Generation */}
        {(currentStep === 'review' || currentStep === 'completed') && (
          <div className="mb-8">
            <div className="rounded-lg border border-gray-600 p-6 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <h2 className="text-xl font-semibold text-white mb-4">Required Forms</h2>
              <p className="text-gray-400 mb-6">The following forms will be generated with your information:</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {requiredForms.map((form) => (
                  <div key={form.id} className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-medium text-white">{form.name}</h3>
                      <p className="text-xs text-gray-400">{form.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {currentStep === 'completed' && (
                <button
                  onClick={generateForms}
                  className="mt-6 w-half flex ml-auto bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-600"
                  disabled={true}
                >
                  Form Generated !
                </button>
              )}

              {currentStep === 'review' && (
                <button
                  onClick={generateForms}
                  className="mt-6 w-half flex ml-auto bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                >
                  Generate All Forms
                </button>
              )}
            </div>
          </div>
        )}

        {/* Generation Progress */}
        {currentStep === 'generating' && (
          <div className="mb-8">
            <div className="rounded-lg border border-gray-600 p-6 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <h2 className="text-xl font-semibold text-white mb-4">Generating Forms</h2>
              <p className="text-gray-400 mb-6">Please wait while we process your documents...</p>
              
              <div className="space-y-4">
                {generatedForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {form.status === 'generating' && <Clock className="h-5 w-5 text-yellow-400 animate-spin" />}
                      {form.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                      {form.status === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
                      
                      <div>
                        <h3 className="text-sm font-medium text-white">{form.name}</h3>
                        <p className="text-xs text-gray-400">{form.description}</p>
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-400">
                      {form.status === 'generating' && 'Processing...'}
                      {form.status === 'completed' && 'Completed'}
                      {form.status === 'error' && 'Error'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completed Forms */}
        {/* {currentStep === 'completed' && (
          <div className="mb-8">
            <div className="rounded-lg border border-gray-600 p-6 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Generated Forms</h2>
                <button
                  onClick={downloadAllForms}
                  className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Download All</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {generatedForms.map((form) => (
                  <div key={form.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <div>
                          <h3 className="text-sm font-medium text-white">{form.name}</h3>
                          <p className="text-xs text-gray-400">{form.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadForm(form.id)}
                          className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-xs">Download</span>
                        </button>
                      </div>
                    </div>
                    
                    {form.preview && (
                      <div className="mt-3 p-3 bg-gray-800 rounded text-xs text-gray-300 max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{form.preview}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => router.push('/information-collection')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Information</span>
          </button>
          
          <button
            onClick={() => router.push('/next-steps')}
            className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
          >
            <span>Next Steps</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
} 