import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  AlertCircle,
  Save,
  Send,
  Sparkles,
  ShieldAlert,
  Info,
  Calendar,
  User,
  Plane,
  Briefcase,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Application, DocumentItem } from '../../types';

export const ApplicationWizard: React.FC = () => {
  const { services, createApplication, uploadDocument, setActiveTab, setSelectedApplicationId } = useApp();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedServiceId, setSelectedServiceId] = useState('usa-visit-b1-b2');

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: currentUser?.fullName || 'Muhammad Bilal Khan',
    dateOfBirth: '1992-06-14',
    gender: 'male' as const,
    nationality: 'Pakistani',
    passportNumber: 'AB8921401',
    passportExpiryDate: '2031-08-20',
    contactNumber: currentUser?.phone || '+92 300 1234567',
    email: currentUser?.email || 'bilal.khan@example.com',
    residentialAddress: 'House 42, Sector F-8/2, Islamabad',
    city: 'Islamabad',
    country: 'Pakistan',
  });

  // Travel Info State
  const [travelInfo, setTravelInfo] = useState({
    purposeOfVisit: 'Tourism, cultural exploration, and visiting historical landmarks.',
    intendedTravelDate: '2026-07-20',
    durationOfStay: '15 Days',
    previousTravelHistory: 'UAE (Dubai 2024), Turkey (Istanbul 2023), Malaysia (2022)',
    previousVisaRefusals: 'None. Clean immigration record.',
    destinationCity: 'New York & Washington DC',
  });

  // Financial Info State
  const [financialInfo, setFinancialInfo] = useState({
    employmentStatus: 'employed' as const,
    employerOrBusinessName: 'Apex Cloud Solutions Pvt Ltd',
    jobTitleOrProfession: 'Principal Solutions Architect',
    monthlyIncome: 'PKR 650,000',
    estimatedBankBalance: 'PKR 4,800,000',
    fundingSource: 'self' as const,
    sponsorDetails: '',
  });

  // Staged Uploaded Documents
  interface TempDoc {
    id: string;
    category: DocumentItem['category'];
    title: string;
    fileName: string;
    fileSize: string;
  }

  const [uploadedDocs, setUploadedDocs] = useState<TempDoc[]>([
    {
      id: 'tmp-1',
      category: 'passport',
      title: 'Valid Passport Bio-Data Scan',
      fileName: 'Passport_Scan_Bilal.pdf',
      fileSize: '1.8 MB',
    },
    {
      id: 'tmp-2',
      category: 'bank_statement',
      title: '6 Months Bank Statement',
      fileName: 'Bank_Statement_HBL.pdf',
      fileSize: '3.4 MB',
    },
  ]);

  const [newDocCategory, setNewDocCategory] = useState<DocumentItem['category']>('employment_letter');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const countries = Array.from(new Set(services.map((s) => s.country)));
  const availableServicesForCountry = services.filter((s) => s.country === selectedCountry);

  const steps = [
    { number: 1, label: t('apply.step1'), icon: Plane },
    { number: 2, label: t('apply.step2'), icon: FileText },
    { number: 3, label: t('apply.step3'), icon: User },
    { number: 4, label: t('apply.step4'), icon: Calendar },
    { number: 5, label: t('apply.step5'), icon: Briefcase },
    { number: 6, label: t('apply.step6'), icon: Upload },
    { number: 7, label: t('apply.step7'), icon: Sparkles },
  ];

  const handleAddDocumentMock = () => {
    if (!newDocTitle.trim()) {
      setErrorMessage('Please enter a document title.');
      return;
    }
    setErrorMessage('');
    const docItem: TempDoc = {
      id: `doc-tmp-${Date.now()}`,
      category: newDocCategory,
      title: newDocTitle.trim(),
      fileName: `${newDocTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '2.1 MB',
    };
    setUploadedDocs((prev) => [...prev, docItem]);
    setNewDocTitle('');
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    try {
      const app = await createApplication({
        clientId: currentUser?.uid || 'client-demo-01',
        clientName: personalInfo.fullName,
        clientEmail: personalInfo.email,
        clientPhone: personalInfo.contactNumber,
        country: selectedCountry,
        visaCategory: selectedService.category,
        serviceId: selectedService.id,
        status: 'draft',
        currentStep,
        personalInfo,
        travelInfo,
        financialInfo,
        clientRemarks: 'Application saved as draft by client.',
        consultancyFee: selectedService.consultancyFee,
        amountPaid: 0,
        currency: selectedService.currency,
        paymentStatus: 'unpaid',
      });
      setSelectedApplicationId(app.id);
      setActiveTab('tracking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!acceptedTerms) {
      setErrorMessage('You must review and accept the official GAC Advisors consultation terms and embassy disclaimer.');
      return;
    }
    setErrorMessage('');
    setSubmitting(true);
    try {
      const app = await createApplication({
        clientId: currentUser?.uid || 'client-demo-01',
        clientName: personalInfo.fullName,
        clientEmail: personalInfo.email,
        clientPhone: personalInfo.contactNumber,
        country: selectedCountry,
        visaCategory: selectedService.category,
        serviceId: selectedService.id,
        status: 'submitted',
        currentStep: 7,
        personalInfo,
        travelInfo,
        financialInfo,
        clientRemarks: 'Application submitted online with required documents for preliminary audit.',
        consultancyFee: selectedService.consultancyFee,
        amountPaid: 0,
        currency: selectedService.currency,
        paymentStatus: 'unpaid',
      });

      // Upload linked documents
      for (const d of uploadedDocs) {
        await uploadDocument({
          applicationId: app.id,
          clientId: currentUser?.uid || 'client-demo-01',
          category: d.category,
          title: d.title,
          fileName: d.fileName,
          fileSize: d.fileSize,
          fileType: 'application/pdf',
        });
      }

      setSubmittedApp(app);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#AA820A', '#FFFFFF'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedApp) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-[#101F42] border border-[#D4AF37]/40 p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <Check className="w-10 h-10 text-[#0A1128] stroke-[3]" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37]">
            Application Registered
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {t('apply.success')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Your visa application for <strong className="text-white">{submittedApp.country}</strong> has been logged in our secure case registry.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A1128] border border-white/10 space-y-2">
          <div className="text-xs text-slate-400">Tracking Reference Number</div>
          <div className="text-lg sm:text-xl font-mono font-black text-[#D4AF37] tracking-wider select-all">
            {submittedApp.trackingNumber}
          </div>
          <div className="text-[11px] text-slate-400">
            Keep this number handy when contacting your assigned case officer or WhatsApp support.
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              setSelectedApplicationId(submittedApp.id);
              setActiveTab('tracking');
            }}
            className="w-full py-3 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Track Application Progress
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span className="text-[#D4AF37]">Step {currentStep} of 7:</span> {steps[currentStep - 1].label}
          </h1>
          <p className="text-xs text-slate-400">
            Complete the official questionnaire for your visa application
          </p>
        </div>
        <button
          onClick={handleSaveDraft}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16254F] hover:bg-[#1E3066] border border-white/10 text-xs font-bold text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{t('apply.saveDraft')}</span>
        </button>
      </div>

      {/* Step Indicator Bar */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {steps.map((s) => {
          const isDone = s.number < currentStep;
          const isCurrent = s.number === currentStep;
          return (
            <button
              key={s.number}
              onClick={() => setCurrentStep(s.number)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl border text-center transition-all ${
                isCurrent
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : isDone
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#101F42]/50 border-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="text-xs font-black">0{s.number}</div>
              <span className="text-[9px] font-medium hidden sm:block truncate max-w-full">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Select Country */}
      {currentStep === 1 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Destination Country
          </h2>
          <p className="text-xs text-slate-300">
            Select the foreign country you are planning to travel to:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {countries.map((c) => {
              const service = services.find((s) => s.country === c);
              const isSelected = selectedCountry === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCountry(c);
                    const matching = services.find((s) => s.country === c);
                    if (matching) setSelectedServiceId(matching.id);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#162752] border-[#D4AF37] shadow-lg shadow-amber-500/10'
                      : 'bg-[#0A1128]/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl mb-2">{service?.flagEmoji || '🌐'}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm">{c}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {service?.category || 'Visa Options'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Select Visa Category & Service */}
      {currentStep === 2 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Visa Category for {selectedCountry}
          </h2>
          <div className="space-y-3">
            {availableServicesForCountry.map((srv) => {
              const isSelected = selectedServiceId === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#162752] border-[#D4AF37] shadow-lg shadow-amber-500/15'
                      : 'bg-[#0A1128]/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{srv.flagEmoji}</span>
                        <h3 className="font-bold text-white text-base">{srv.title}</h3>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5">{srv.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-[#D4AF37]">
                        PKR {srv.consultancyFee.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Consultancy Fee</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Est. Processing: <strong className="text-slate-200">{srv.estimatedProcessing}</strong></span>
                    {isSelected && (
                      <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Personal Information */}
      {currentStep === 3 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Applicant Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name (as in Passport) *</label>
              <input
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Date of Birth *</label>
              <input
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Gender *</label>
              <select
                value={personalInfo.gender}
                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Nationality *</label>
              <input
                type="text"
                value={personalInfo.nationality}
                onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Passport Number *</label>
              <input
                type="text"
                value={personalInfo.passportNumber}
                onChange={(e) => setPersonalInfo({ ...personalInfo, passportNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs font-mono uppercase focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Passport Expiry Date *</label>
              <input
                type="date"
                value={personalInfo.passportExpiryDate}
                onChange={(e) => setPersonalInfo({ ...personalInfo, passportExpiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                value={personalInfo.contactNumber}
                onChange={(e) => setPersonalInfo({ ...personalInfo, contactNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Residential Street Address *</label>
              <input
                type="text"
                value={personalInfo.residentialAddress}
                onChange={(e) => setPersonalInfo({ ...personalInfo, residentialAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Travel Information */}
      {currentStep === 4 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Travel & Itinerary Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Purpose of Visit *</label>
              <textarea
                rows={2}
                value={travelInfo.purposeOfVisit}
                onChange={(e) => setTravelInfo({ ...travelInfo, purposeOfVisit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Intended Travel Date *</label>
                <input
                  type="date"
                  value={travelInfo.intendedTravelDate}
                  onChange={(e) => setTravelInfo({ ...travelInfo, intendedTravelDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Expected Duration of Stay *</label>
                <input
                  type="text"
                  value={travelInfo.durationOfStay}
                  placeholder="e.g. 14 Days"
                  onChange={(e) => setTravelInfo({ ...travelInfo, durationOfStay: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Previous International Travel History</label>
              <textarea
                rows={2}
                value={travelInfo.previousTravelHistory}
                placeholder="List countries visited in the past 5 years with approximate years"
                onChange={(e) => setTravelInfo({ ...travelInfo, previousTravelHistory: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Previous Visa Refusals (Any Country) *</label>
              <textarea
                rows={2}
                value={travelInfo.previousVisaRefusals}
                placeholder="State 'None' or describe country, year, and stated grounds of refusal"
                onChange={(e) => setTravelInfo({ ...travelInfo, previousVisaRefusals: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Financial & Employment Information */}
      {currentStep === 5 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Employment & Financial Standing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Employment Status *</label>
              <select
                value={financialInfo.employmentStatus}
                onChange={(e) => setFinancialInfo({ ...financialInfo, employmentStatus: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="employed">Employed (Salaried)</option>
                <option value="business_owner">Business Owner / Partner</option>
                <option value="self_employed">Self Employed / Freelancer</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Employer or Business Name *</label>
              <input
                type="text"
                value={financialInfo.employerOrBusinessName}
                onChange={(e) => setFinancialInfo({ ...financialInfo, employerOrBusinessName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Job Title / Designation *</label>
              <input
                type="text"
                value={financialInfo.jobTitleOrProfession}
                onChange={(e) => setFinancialInfo({ ...financialInfo, jobTitleOrProfession: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Income (PKR) *</label>
              <input
                type="text"
                value={financialInfo.monthlyIncome}
                onChange={(e) => setFinancialInfo({ ...financialInfo, monthlyIncome: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Closing Bank Balance (PKR) *</label>
              <input
                type="text"
                value={financialInfo.estimatedBankBalance}
                onChange={(e) => setFinancialInfo({ ...financialInfo, estimatedBankBalance: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Trip Funding Source *</label>
              <select
                value={financialInfo.fundingSource}
                onChange={(e) => setFinancialInfo({ ...financialInfo, fundingSource: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="self">Self Funded</option>
                <option value="sponsor">Family / Relative Sponsor</option>
                <option value="company">Employer / Company Sponsored</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Document Upload */}
      {currentStep === 6 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
              Verification Documents Upload
            </h2>
            <span className="text-xs text-slate-400">PDF, JPG, PNG accepted</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A1128] border border-dashed border-white/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Document Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F42] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="passport">Passport Bio-Data</option>
                  <option value="photograph">Passport Size Photograph</option>
                  <option value="bank_statement">Bank Statement (6 Months)</option>
                  <option value="employment_letter">Employment Letter / NOC</option>
                  <option value="invitation_letter">Invitation Letter / Sponsor Proof</option>
                  <option value="travel_history">Previous Visa & Entry Stamps</option>
                  <option value="accommodation_evidence">Hotel / Accommodation Booking</option>
                  <option value="other">Other Supporting Evidence</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Salary Slip Jan-Mar 2026"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F42] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddDocumentMock}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Attach Document</span>
              </button>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase">
              Attached Files ({uploadedDocs.length})
            </h3>
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A1128]/70 border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold text-white">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {doc.fileName} • {doc.fileSize} • Category: {doc.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 7: Review and Final Submission */}
      {currentStep === 7 && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Review Information & Submit
          </h2>

          <div className="p-4 rounded-2xl bg-[#0A1128] border border-white/10 space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Target Country & Visa:</span>
              <strong className="text-[#D4AF37]">{selectedCountry} – {selectedService.title}</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Applicant:</span>
              <strong className="text-white">{personalInfo.fullName} (DOB: {personalInfo.dateOfBirth})</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Passport Number:</span>
              <strong className="font-mono text-white">{personalInfo.passportNumber} (Expires: {personalInfo.passportExpiryDate})</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Employment:</span>
              <strong className="text-white">{financialInfo.jobTitleOrProfession} at {financialInfo.employerOrBusinessName}</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Declared Bank Balance:</span>
              <strong className="text-emerald-400">{financialInfo.estimatedBankBalance}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consultancy Fee Payable:</span>
              <strong className="text-[#D4AF37] text-sm">PKR {selectedService.consultancyFee.toLocaleString()}</strong>
            </div>
          </div>

          {/* Mandatory Disclaimers Checkbox */}
          <div className="p-4 rounded-2xl bg-[#0A1128]/80 border border-amber-500/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="disclaimer-check"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="disclaimer-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
              I certify that all information provided is true and accurate to the best of my knowledge. I understand and accept that <strong>visa approvals, granting decisions, and processing turnaround times are solely within the jurisdiction of the respective foreign consular authorities</strong>, and GAC Advisors provides professional legal representation, auditing, and filing assistance.
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#101F42] hover:bg-[#162752] border border-white/10 text-xs font-bold text-slate-300 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('apply.prev')}</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 7 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span>{t('apply.next')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitFinal}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#0A1128] text-sm font-extrabold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : t('apply.submit')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
