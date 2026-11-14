import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, X, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppButtonProps {
  customMessage?: string;
  variant?: 'floating' | 'card' | 'inline';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  customMessage = 'Hello GAC Advisors, I would like to inquire about visa consultancy services.',
  variant = 'floating',
}) => {
  const { companySettings } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const pakNumber = companySettings.pakistanWhatsApp.replace(/[^0-9]/g, '');
  const uaeNumber = companySettings.uaeWhatsApp.replace(/[^0-9]/g, '');

  const openWhatsApp = (number: string) => {
    const encoded = encodeURIComponent(customMessage);
    const url = `https://wa.me/${number}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-all shadow-md shadow-emerald-600/20"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>Chat on WhatsApp</span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-[#101F42] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Direct WhatsApp Consultation</h4>
            <p className="text-xs text-slate-400">Speak directly with our senior visa advisors in Pakistan or UAE</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openWhatsApp(pakNumber)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all"
          >
            <span>🇵🇰 Pakistan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openWhatsApp(uaeNumber)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all"
          >
            <span>🇦🇪 UAE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-4 sm:right-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline">WhatsApp Advisors</span>
      </button>

      {/* Office Selector Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0F1B3B] border border-white/15 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-[#25D366] fill-[#25D366]" />
              </div>
              <h3 className="text-lg font-bold text-white">GAC Advisors WhatsApp</h3>
              <p className="text-xs text-slate-400 mt-1">Select your preferred regional office:</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openWhatsApp(pakNumber)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16254F] hover:bg-[#1E3066] border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇵🇰</span>
                  <div>
                    <div className="font-bold text-white text-sm">Pakistan Office (Islamabad)</div>
                    <div className="text-xs text-emerald-400 font-mono">{companySettings.pakistanWhatsApp}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => openWhatsApp(uaeNumber)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16254F] hover:bg-[#1E3066] border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇦🇪</span>
                  <div>
                    <div className="font-bold text-white text-sm">UAE Office (Dubai / Abu Dhabi)</div>
                    <div className="text-xs text-emerald-400 font-mono">{companySettings.uaeWhatsApp}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-400">
                {companySettings.officeAddress}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
