import React from 'react';
import {
  FilePlus2,
  CalendarDays,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  ChevronRight,
  PhoneCall,
  Users,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { ApplicationStatus } from '../../types';

export const ClientDashboard: React.FC = () => {
  const { applications, clients, setActiveTab, setSelectedApplicationId, companySettings } = useApp();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  // Strictly filter applications for the currently logged-in client ONLY
  const clientApps = applications.filter(
    (app) => Boolean(currentUser?.uid) && app.clientId === currentUser?.uid
  );

  const total = clientApps.length;
  const inReview = clientApps.filter((a) =>
    ['submitted', 'under_initial_review', 'documents_under_review'].includes(a.status)
  ).length;
  const inProcessing = clientApps.filter((a) =>
    ['processing', 'ready_for_submission', 'submitted_to_embassy', 'documents_required'].includes(a.status)
  ).length;
  const completed = clientApps.filter((a) => a.status === 'completed' || a.status === 'decision_received').length;

  const getStatusBadge = (status: ApplicationStatus) => {
    const config: Record<ApplicationStatus, { label: string; bg: string; text: string }> = {
      draft: { label: 'Draft', bg: 'bg-slate-700/50', text: 'text-slate-300' },
      submitted: { label: 'Submitted', bg: 'bg-blue-500/20', text: 'text-blue-400' },
      under_initial_review: { label: 'Under Review', bg: 'bg-amber-500/20', text: 'text-amber-400' },
      documents_required: { label: 'Docs Required', bg: 'bg-rose-500/20', text: 'text-rose-400' },
      documents_under_review: { label: 'Reviewing Docs', bg: 'bg-purple-500/20', text: 'text-purple-400' },
      processing: { label: 'In Processing', bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
      ready_for_submission: { label: 'Ready for Embassy', bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
      submitted_to_embassy: { label: 'At Embassy', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
      decision_received: { label: 'Decision Received', bg: 'bg-teal-500/20', text: 'text-teal-400' },
      completed: { label: 'Completed', bg: 'bg-emerald-500/25', text: 'text-emerald-300' },
      on_hold: { label: 'On Hold', bg: 'bg-orange-500/20', text: 'text-orange-400' },
      cancelled: { label: 'Cancelled', bg: 'bg-slate-800', text: 'text-slate-400' },
    };
    const c = config[status] || { label: status, bg: 'bg-slate-700', text: 'text-slate-300' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border border-white/10 ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const handleOpenTracking = (appId: string) => {
    setSelectedApplicationId(appId);
    setActiveTab('tracking');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Client Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101F42] via-[#16254F] to-[#0A1128] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GAC Verified Client Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('dashboard.welcome')} {currentUser?.fullName || 'Muhammad Bilal'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your visa files, download official receipts, upload missing documents, and consult with authorized immigration advisors.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('apply')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#0A1128] font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>{t('dashboard.quickApply')}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{companySettings.officeAddress}</span>
          </div>
          <div className="font-medium text-[#D4AF37]">
            Operating Hours: {companySettings.workingHours}
          </div>
        </div>
      </div>

      {/* Portfolio Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-[#101F42]/80 border border-white/10 p-4 transition-all hover:border-[#D4AF37]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{t('dashboard.totalApps')}</span>
            <FileText className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{total}</div>
          <div className="text-[10px] text-slate-400 mt-1">Submitted files</div>
        </div>

        <div className="rounded-2xl bg-[#101F42]/80 border border-white/10 p-4 transition-all hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{t('dashboard.pending')}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{inReview}</div>
          <div className="text-[10px] text-slate-400 mt-1">Document audit stage</div>
        </div>

        <div className="rounded-2xl bg-[#101F42]/80 border border-white/10 p-4 transition-all hover:border-cyan-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{t('dashboard.processing')}</span>
            <AlertCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-2">{inProcessing}</div>
          <div className="text-[10px] text-slate-400 mt-1">Embassy / filing prep</div>
        </div>

        <div className="rounded-2xl bg-[#101F42]/80 border border-white/10 p-4 transition-all hover:border-emerald-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{t('dashboard.completed')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{completed}</div>
          <div className="text-[10px] text-slate-400 mt-1">Decisions delivered</div>
        </div>
      </div>

      {/* Active Visa Applications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Active Applications
          </h2>
          <button
            onClick={() => setActiveTab('apply')}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>+ Apply for Another Country</span>
          </button>
        </div>

        {clientApps.length === 0 ? (
          <div className="rounded-2xl bg-[#101F42]/60 border border-white/10 p-8 text-center">
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">{t('dashboard.noApps')}</p>
            <button
              onClick={() => setActiveTab('apply')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0A1128] font-bold text-xs"
            >
              {t('dashboard.quickApply')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {clientApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleOpenTracking(app.id)}
                className="rounded-2xl bg-[#101F42] hover:bg-[#152754] border border-white/10 hover:border-[#D4AF37]/50 p-4 sm:p-5 transition-all cursor-pointer shadow-lg group relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base group-hover:text-[#D4AF37] transition-colors">
                        {app.country}
                      </h3>
                      <span className="text-xs text-slate-400">• {app.visaCategory}</span>
                    </div>
                    <div className="font-mono text-xs text-[#D4AF37] font-semibold mt-0.5">
                      {app.trackingNumber}
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="mt-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Assigned Officer:</span>
                    <span className="text-slate-200 font-medium">
                      {app.assignedStaffName || 'Pending Assignment'}
                    </span>
                  </div>

                  {app.clientRemarks && (
                    <div className="p-2.5 rounded-xl bg-[#0A1128]/70 border border-white/5 text-xs text-slate-300">
                      <span className="font-semibold text-[#D4AF37]">Remark: </span>
                      {app.clientRemarks}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-slate-400">
                      Fee: PKR {app.consultancyFee.toLocaleString()} ({app.paymentStatus.toUpperCase()})
                    </span>
                    <span className="text-[#D4AF37] font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {t('dashboard.viewTracking')}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registered Clients Directory — STRICT PRIVACY (Names & Count Only) */}
      <div className="rounded-3xl bg-[#101F42]/90 border border-white/10 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Registered Clients Directory
              </h2>
              <p className="text-[11px] text-slate-400">
                Total {clients.length} verified {clients.length === 1 ? 'client' : 'clients'} registered with GAC Advisors
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold self-start sm:self-auto">
            <Lock className="w-3 h-3" />
            <span>{clients.length} Clients • Names Only</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {clients.map((client, idx) => {
            const isSelf = client.uid === currentUser?.uid;
            return (
              <div
                key={client.uid}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${
                  isSelf
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40'
                    : 'bg-[#0A1128]/70 border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#16254F] border border-white/10 flex items-center justify-center text-[11px] font-bold text-[#D4AF37] shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-white truncate">
                    {client.fullName}
                  </span>
                </div>
                {isSelf ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                    You
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    Private
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-[#0A1128]/80 border border-white/10 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-bold text-white">Strict Client Privacy Active:</span> Other clients&apos; applications, documents, passports, emails, phone numbers, appointments, and payment records are completely hidden and accessible only to authorized Admin.
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => setActiveTab('catalog')}
          className="rounded-2xl bg-[#101F42] hover:bg-[#162752] border border-white/10 p-4 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Explore All Visa Categories</h4>
              <p className="text-xs text-slate-400">USA, UK, Canada, Australia, Schengen, Sweden</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
        </div>

        <div
          onClick={() => setActiveTab('appointments')}
          className="rounded-2xl bg-[#101F42] hover:bg-[#162752] border border-white/10 p-4 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Book 1-on-1 Consultation</h4>
              <p className="text-xs text-slate-400">In-person at Islamabad or encrypted video call</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
        </div>
      </div>

      {/* WhatsApp Support Direct Banner */}
      <WhatsAppButton variant="card" />

      {/* Mandatory Official Disclaimer Notice */}
      <div className="rounded-2xl bg-[#0F1B3B]/60 border border-white/10 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          {companySettings.consultationDisclaimers}
        </p>
      </div>
    </div>
  );
};
