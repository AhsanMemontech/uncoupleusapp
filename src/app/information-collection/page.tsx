'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Calendar, MapPin, FileText, CreditCard, ArrowRight, ArrowLeft, Save, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'
import { useChatbot } from '@/components/ChatbotContext'

interface FormData {
  // Section A - Basic Info
  yourFullName: string
  yourAddress: string
  yourEmail: string
  yourPhone: string
  spouseFullName: string
  spouseLastKnownAddress: string
  spousePhone: string
  password: string
  
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

export default function InformationCollectionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    // Section A
    yourFullName: '',
    yourAddress: '',
    yourEmail: '',
    yourPhone: '',
    spouseFullName: '',
    spouseLastKnownAddress: '',
    spousePhone: '',
    password: '',
    
    // Section B
    marriageDate: '',
    marriageCity: '',
    marriageState: '',
    ceremonyType: '',
    nameChange: false,
    whoChangedName: '',
    formerName: '',
    
    // Section C
    livedInNY2Years: false,
    alternativeRoute: '',
    marriageBreakdownDate: '',
    filingNoFault: false,
    
    // Section D
    hasSettlementAgreement: false,
    settlementAgreementFile: null,
    sharedBankAccounts: false,
    bankAccountDetails: '',
    sharedPropertyVehicles: false,
    propertyVehicleDetails: '',
    includeSpousalSupport: false,
    spousalSupportAmount: '',
    spousalSupportDuration: '',
    
    // Section E
    wantToRevertName: false,
    yourFormerName: '',
    spouseWantToRevert: false,
    spouseFormerName: '',
    
    // Section F
    canPayFilingFees: false,
    needFeeWaiver: false,
    hasPrinterScanner: false,
    wantLegalReview: false
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null);
  const { setChatbotOpen } = useChatbot();
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
      } else {
        setUserId(data.user.id);
        if (data.user.email) {
          setFormData(prev => ({ ...prev, yourEmail: data.user.email ?? '' }));
        }
      }
    });
  }, [router]);

  useEffect(() => {
    if (userId) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (data) {
            setFormData(prev => ({
              ...prev,
              yourFullName: data.yourfullname || '',
              yourAddress: data.youraddress || '',
              yourEmail: data.youremail || '',
              yourPhone: data.yourphone || '',
              spouseFullName: data.spousefullname || '',
              spouseLastKnownAddress: data.spouselastknownaddress || '',
              spousePhone: data.spousephone || '',
              marriageDate: data.marriagedate || '',
              marriageCity: data.marriagecity || '',
              marriageState: data.marriagestate || '',
              ceremonyType: data.ceremonytype || '',
              nameChange: data.namechange || false,
              whoChangedName: data.whochangedname || '',
              formerName: data.formername || '',
              livedInNY2Years: data.livedinny2years || false,
              alternativeRoute: data.alternativeroute || '',
              marriageBreakdownDate: data.marriagebreakdowndate || '',
              filingNoFault: data.filingnofault || false,
              hasSettlementAgreement: data.hassettlementagreement || false,
              // settlementAgreementFile: not loaded from DB
              sharedBankAccounts: data.sharedbankaccounts || false,
              bankAccountDetails: data.bankaccountdetails || '',
              sharedPropertyVehicles: data.sharedpropertyvehicles || false,
              propertyVehicleDetails: data.propertyvehicledetails || '',
              includeSpousalSupport: data.includespousalsupport || false,
              spousalSupportAmount: data.spousalsupportamount || '',
              spousalSupportDuration: data.spousalsupportduration || '',
              wantToRevertName: data.wanttorevertname || false,
              yourFormerName: data.yourformername || '',
              spouseWantToRevert: data.spousewanttorevert || false,
              spouseFormerName: data.spouseformername || '',
              canPayFilingFees: data.canpayfilingfees || false,
              needFeeWaiver: data.needfeewaiver || false,
              hasPrinterScanner: data.hasprinterscanner || false,
              wantLegalReview: data.wantlegalreview || false
            }));
          }
        });
    }
  }, [userId]);

  const steps = [
    { id: 1, title: 'Basic Information', icon: User, section: 'A' },
    { id: 2, title: 'Marriage Details', icon: Calendar, section: 'B' },
    { id: 3, title: 'Residency & Grounds', icon: MapPin, section: 'C' },
    { id: 4, title: 'Property & Support', icon: FileText, section: 'D' },
    { id: 5, title: 'Name Change', icon: User, section: 'E' },
    { id: 6, title: 'Filing & Support', icon: CreditCard, section: 'F' }
  ]

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    // Special handling for phone number
    if (field === 'yourPhone' || field === 'spousePhone') {
      // Remove all non-numeric characters
      const numericValue = value.toString().replace(/\D/g, '');
      // Limit to 10 digits (US phone number format)
      const limitedValue = numericValue.slice(0, 10);
      // Format as (XXX) XXX-XXXX
      let formattedValue = '';
      if (limitedValue.length > 0) {
        formattedValue = '(' + limitedValue.slice(0, 3);
        if (limitedValue.length > 3) {
          formattedValue += ') ' + limitedValue.slice(3, 6);
          if (limitedValue.length > 6) {
            formattedValue += '-' + limitedValue.slice(6);
          }
        }
      }
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleFileUpload = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }
    // Upsert profile data for the logged-in user
    const { error: profileError } = await supabase.from('profiles').upsert([
      {
        id: userId,
        yourfullname: formData.yourFullName,
        youraddress: formData.yourAddress,
        youremail: formData.yourEmail,
        yourphone: formData.yourPhone,
        spousefullname: formData.spouseFullName,
        spouselastknownaddress: formData.spouseLastKnownAddress,
        marriagedate: formData.marriageDate,
        marriagecity: formData.marriageCity,
        marriagestate: formData.marriageState,
        ceremonytype: formData.ceremonyType,
        namechange: formData.nameChange,
        whochangedname: formData.whoChangedName,
        formername: formData.formerName,
        livedinny2years: formData.livedInNY2Years,
        alternativeroute: formData.alternativeRoute,
        marriagebreakdowndate: formData.marriageBreakdownDate,
        filingnofault: formData.filingNoFault,
        hassettlementagreement: formData.hasSettlementAgreement,
        settlementagreementfile: formData.settlementAgreementFile,
        sharedbankaccounts: formData.sharedBankAccounts,
        bankaccountdetails: formData.bankAccountDetails,
        sharedpropertyvehicles: formData.sharedPropertyVehicles,
        propertyvehicledetails: formData.propertyVehicleDetails,
        includespousalsupport: formData.includeSpousalSupport,
        spousalsupportamount: formData.spousalSupportAmount,
        spousalsupportduration: formData.spousalSupportDuration,
        wanttorevertname: formData.wantToRevertName,
        yourformername: formData.yourFormerName,
        spousewanttorevert: formData.spouseWantToRevert,
        spouseformername: formData.spouseFormerName,
        canpayfilingfees: formData.canPayFilingFees,
        needfeewaiver: formData.needFeeWaiver,
        hasprinterscanner: formData.hasPrinterScanner,
        wantlegalreview: formData.wantLegalReview,
        updated_at: new Date().toISOString()
      }
    ])
    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }
    setSuccess('Profile information saved successfully!');
    setLoading(false)
    localStorage.setItem('divorceFormData', JSON.stringify(formData))
    router.push('/payment')
  }

  const requiredFields = ['yourFullName', 'yourAddress', 'yourEmail', 'yourPhone'];

  const handleSaveBasicInfo = async () => {
    setError(null);
    setSuccess(null);
    
    // Client-side validation for basic info fields
    const basicInfoFields = ['yourFullName', 'yourAddress', 'yourEmail', 'yourPhone', 'spouseFullName', 'spouseLastKnownAddress'];
    const missing = basicInfoFields.filter(field => !formData[field as keyof FormData]);
    
    if (missing.length > 0) {
      setError('Please fill in all required fields.');
      alert('Please fill in all required fields.');
      setTouched(prev => ({ ...prev, ...Object.fromEntries(missing.map(f => [f, true])) }));
      return;
    }
    
    setLoading(true);
    
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }
    
    try {
      const profileData = {
        id: userId,
        yourfullname: formData.yourFullName,
        youraddress: formData.yourAddress,
        youremail: formData.yourEmail,
        yourphone: formData.yourPhone,
        spousefullname: formData.spouseFullName,
        spouselastknownaddress: formData.spouseLastKnownAddress,
        updated_at: new Date().toISOString()
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([profileData]);
      
      if (profileError) {
        setError(`Failed to save information: ${profileError.message}`);
        setLoading(false);
        return;
      }
      
      setSuccess('Basic information saved successfully!');
      setLoading(false);
      setChatbotOpen(true);
      
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">Section A - Basic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Your Full Legal Name *</label>
                <input
                  type="text"
                  value={formData.yourFullName}
                  onChange={(e) => handleInputChange('yourFullName', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, yourFullName: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.yourFullName && !formData.yourFullName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full legal name"
                  required
                />
                {touched.yourFullName && !formData.yourFullName && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Your Address *</label>
                <input
                  type="text"
                  value={formData.yourAddress}
                  onChange={(e) => handleInputChange('yourAddress', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, yourAddress: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.yourAddress && !formData.yourAddress ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your current address"
                  required
                />
                {touched.yourAddress && !formData.yourAddress && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
              
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  value={formData.yourEmail}
                  onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, yourEmail: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.yourEmail && !formData.yourEmail ? 'border-red-500' : ''
                  }`}
                  readOnly
                  placeholder="your.email@example.com"
                  required
                />
                {touched.yourEmail && !formData.yourEmail && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Your Phone Number *</label>
                <input
                  type="tel"
                  value={formData.yourPhone}
                  onChange={(e) => handleInputChange('yourPhone', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, yourPhone: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.yourPhone && !formData.yourPhone ? 'border-red-500' : ''
                  }`}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                  required
                />
                {touched.yourPhone && !formData.yourPhone && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Spouse&apos;s Full Legal Name *</label>
                <input
                  type="text"
                  value={formData.spouseFullName}
                  onChange={(e) => handleInputChange('spouseFullName', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, spouseFullName: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.spouseFullName && !formData.spouseFullName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter spouse's full legal name"
                  required
                />
                {touched.spouseFullName && !formData.spouseFullName && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Spouse&apos;s Last Known Address</label>
                <input
                  type="text"
                  value={formData.spouseLastKnownAddress}
                  onChange={(e) => handleInputChange('spouseLastKnownAddress', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, spouseLastKnownAddress: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.spouseLastKnownAddress && !formData.spouseLastKnownAddress ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter spouse's last known address"
                />
                {touched.spouseLastKnownAddress && !formData.spouseLastKnownAddress && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Section B - Marriage Details</h3>
            
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Date of Marriage</label>
              <input
                type="date"
                value={formData.marriageDate}
                onChange={(e) => handleInputChange('marriageDate', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, marriageDate: true }))}
                className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white ${
                  touched.marriageDate && !formData.marriageDate ? 'border-red-500' : ''
                }`}
                required
              />
              {touched.marriageDate && !formData.marriageDate && (
                <p className="text-red-500 text-xs mt-1">This field is required.</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">City of Marriage</label>
                <input
                  type="text"
                  value={formData.marriageCity}
                  onChange={(e) => handleInputChange('marriageCity', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, marriageCity: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.marriageCity && !formData.marriageCity ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter city where you were married"
                  required
                />
                {touched.marriageCity && !formData.marriageCity && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">State of Marriage</label>
                <select
                  value={formData.marriageState}
                  onChange={(e) => handleInputChange('marriageState', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, marriageState: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white ${
                    touched.marriageState && !formData.marriageState ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Select State</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                </select>
                {touched.marriageState && !formData.marriageState && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Type of Ceremony</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('ceremonyType', 'Civil')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.ceremonyType === 'Civil'
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Civil Ceremony
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('ceremonyType', 'Religious')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.ceremonyType === 'Religious'
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Religious Ceremony
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Did either spouse change names after marriage?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('nameChange', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.nameChange === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('nameChange', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.nameChange === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {formData.nameChange && (
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">Who changed their name?</label>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => handleInputChange('whoChangedName', 'You')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.whoChangedName === 'You'
                          ? 'border-cyan-500 bg-cyan-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                      }`}
                    >
                      You
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('whoChangedName', 'Spouse')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.whoChangedName === 'Spouse'
                          ? 'border-cyan-500 bg-cyan-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                      }`}
                    >
                      Spouse
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">Former Name</label>
                  <input
                    type="text"
                    value={formData.formerName}
                    onChange={(e) => handleInputChange('formerName', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, formerName: true }))}
                    className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                      touched.formerName && !formData.formerName ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter the former name"
                  />
                  {touched.formerName && !formData.formerName && (
                    <p className="text-red-500 text-xs mt-1">This field is required.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Section C - Residency & Grounds</h3>

            {!formData.livedInNY2Years && (
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Which alternative route applies?</label>
                <select
                  value={formData.alternativeRoute}
                  onChange={(e) => handleInputChange('alternativeRoute', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, alternativeRoute: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white ${
                    touched.alternativeRoute && !formData.alternativeRoute ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select alternative route</option>
                  <option value="marriage_in_ny">Marriage took place in NY</option>
                  <option value="grounds_occurred_ny">Grounds for divorce occurred in NY</option>
                  <option value="both_parties_consent">Both parties consent to NY jurisdiction</option>
                </select>
                {touched.alternativeRoute && !formData.alternativeRoute && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Approximate date of marriage breakdown</label>
              <input
                type="date"
                value={formData.marriageBreakdownDate}
                onChange={(e) => handleInputChange('marriageBreakdownDate', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, marriageBreakdownDate: true }))}
                className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white ${
                  touched.marriageBreakdownDate && !formData.marriageBreakdownDate ? 'border-red-500' : ''
                }`}
              />
              {touched.marriageBreakdownDate && !formData.marriageBreakdownDate && (
                <p className="text-red-500 text-xs mt-1">This field is required.</p>
              )}
            </div>


            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Have you lived in New York State for at least 2 years?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('livedInNY2Years', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.livedInNY2Years === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('livedInNY2Years', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.livedInNY2Years === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Are you filing for no-fault divorce?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('filingNoFault', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.filingNoFault === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('filingNoFault', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.filingNoFault === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Section D - Property & Support</h3>
            
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Do you have a signed settlement agreement?</label>
              <div className="grid md:grid-cols-2 gap-12 text-sm">
                <button
                  type="button"
                  onClick={() => handleInputChange('hasSettlementAgreement', true)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.hasSettlementAgreement === true
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('hasSettlementAgreement', false)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.hasSettlementAgreement === false
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.hasSettlementAgreement && (
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Upload Settlement Agreement</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('settlementAgreementFile', e.target.files?.[0] || null)}
                    className="hidden"
                    id="settlement-upload"
                  />
                  <label htmlFor="settlement-upload" className="cursor-pointer text-cyan-400 hover:text-cyan-300">
                    Click to upload file
                  </label>
                  {formData.settlementAgreementFile && (
                    <p className="text-green-400 mt-2">{formData.settlementAgreementFile.name}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Do you have shared bank accounts?</label>
              <div className="grid md:grid-cols-2 gap-12 text-sm">
                <button
                  type="button"
                  onClick={() => handleInputChange('sharedBankAccounts', true)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.sharedBankAccounts === true
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('sharedBankAccounts', false)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.sharedBankAccounts === false
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.sharedBankAccounts && (
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Bank Account Details (who keeps which)</label>
                <textarea
                  value={formData.bankAccountDetails}
                  onChange={(e) => handleInputChange('bankAccountDetails', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, bankAccountDetails: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.bankAccountDetails && !formData.bankAccountDetails ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe how bank accounts will be divided..."
                  rows={4}
                />
                {touched.bankAccountDetails && !formData.bankAccountDetails && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Do you have shared property or vehicles?</label>
              <div className="grid md:grid-cols-2 gap-12 text-sm">
                <button
                  type="button"
                  onClick={() => handleInputChange('sharedPropertyVehicles', true)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.sharedPropertyVehicles === true
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('sharedPropertyVehicles', false)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.sharedPropertyVehicles === false
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.sharedPropertyVehicles && (
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Property/Vehicle Details (describe and assign)</label>
                <textarea
                  value={formData.propertyVehicleDetails}
                  onChange={(e) => handleInputChange('propertyVehicleDetails', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, propertyVehicleDetails: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.propertyVehicleDetails && !formData.propertyVehicleDetails ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe shared property and vehicles and how they will be divided..."
                  rows={4}
                />
                {touched.propertyVehicleDetails && !formData.propertyVehicleDetails && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Do you want to include spousal support?</label>
              <div className="grid md:grid-cols-2 gap-12 text-sm">
                <button
                  type="button"
                  onClick={() => handleInputChange('includeSpousalSupport', true)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.includeSpousalSupport === true
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('includeSpousalSupport', false)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.includeSpousalSupport === false
                      ? 'border-cyan-500 bg-cyan-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.includeSpousalSupport && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">Monthly Amount</label>
                  <input
                    type="text"
                    value={formData.spousalSupportAmount}
                    onChange={(e) => handleInputChange('spousalSupportAmount', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, spousalSupportAmount: true }))}
                    className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                      touched.spousalSupportAmount && !formData.spousalSupportAmount ? 'border-red-500' : ''
                    }`}
                    placeholder="$1,000"
                  />
                  {touched.spousalSupportAmount && !formData.spousalSupportAmount && (
                    <p className="text-red-500 text-xs mt-1">This field is required.</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.spousalSupportDuration}
                    onChange={(e) => handleInputChange('spousalSupportDuration', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, spousalSupportDuration: true }))}
                    className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                      touched.spousalSupportDuration && !formData.spousalSupportDuration ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., 2 years, until remarriage"
                  />
                  {touched.spousalSupportDuration && !formData.spousalSupportDuration && (
                    <p className="text-red-500 text-xs mt-1">This field is required.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Section E - Name Change</h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Do you want to revert to a former name?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('wantToRevertName', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.wantToRevertName === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('wantToRevertName', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.wantToRevertName === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Does your spouse want to revert to a former name?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('spouseWantToRevert', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.spouseWantToRevert === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('spouseWantToRevert', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.spouseWantToRevert === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">  

              {formData.wantToRevertName && (
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Your Former Name</label>
                <input
                  type="text"
                  value={formData.yourFormerName}
                  onChange={(e) => handleInputChange('yourFormerName', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, yourFormerName: true }))}
                  className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    touched.yourFormerName && !formData.yourFormerName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your former name"
                />
                {touched.yourFormerName && !formData.yourFormerName && (
                  <p className="text-red-500 text-xs mt-1">This field is required.</p>
                )}
              </div>
            )}
              {formData.spouseWantToRevert && (
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">Spouse&apos;s Former Name</label>
                  <input
                    type="text"
                    value={formData.spouseFormerName}
                    onChange={(e) => handleInputChange('spouseFormerName', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, spouseFormerName: true }))}
                    className={`text-sm w-full p-3 border-2 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                      touched.spouseFormerName && !formData.spouseFormerName ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter spouse's former name"
                  />
                  {touched.spouseFormerName && !formData.spouseFormerName && (
                    <p className="text-red-500 text-xs mt-1">This field is required.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Section F - Filing & Support</h3>
            
            <div className="grid md:grid-cols-2 gap-12">  
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Can you pay the filing fees (~$335)?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('canPayFilingFees', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.canPayFilingFees === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('canPayFilingFees', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.canPayFilingFees === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {!formData.canPayFilingFees && (
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">Do you need a fee waiver?</label>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => handleInputChange('needFeeWaiver', true)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.needFeeWaiver === true
                          ? 'border-cyan-500 bg-cyan-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('needFeeWaiver', false)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.needFeeWaiver === false
                          ? 'border-cyan-500 bg-cyan-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Do you have access to a printer and scanner?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasPrinterScanner', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.hasPrinterScanner === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasPrinterScanner', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.hasPrinterScanner === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">Would you like an optional legal review call?</label>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleInputChange('wantLegalReview', true)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.wantLegalReview === true
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('wantLegalReview', false)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.wantLegalReview === false
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2a3b' }}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Progress Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Information Collection</h1>
            <span className="text-gray-400 text-sm sm:text-base">Step {currentStep} of {steps.length}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-600 rounded-full h-2 mb-4">
            <div 
              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  step.id <= currentStep 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {step.id < currentStep ? '✓' : step.section}
                </div>
                <span className={`text-xs mt-2 text-center px-1 ${step.id <= currentStep ? 'text-cyan-400' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="rounded-lg border border-gray-600 p-6 sm:p-8 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.05)' }}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-4 sm:space-y-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg transition-colors font-semibold border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base ${
              currentStep === 1
                ? 'text-gray-500 cursor-not-allowed bg-gray-700'
                : 'text-gray-300 hover:text-white hover:bg-gray-700 bg-gray-700'
            }`}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Previous</span>
          </button>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {currentStep === 1 && (
              <button
                onClick={handleSaveBasicInfo}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                disabled={loading}
              >
                <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{loading ? 'Saving...' : 'Save Basic Information'}</span>
              </button>
            )}

            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm sm:text-base"
              >
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm sm:text-base"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 