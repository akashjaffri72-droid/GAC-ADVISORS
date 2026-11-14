import React from 'react';
import { X, Printer, Shield, CheckCircle2, Download, Building2, Phone } from 'lucide-react';
import { PaymentRecord, Application } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReceiptModalProps {
  payment: PaymentRecord;
  application: Application;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, application, onClose }) => {
  const { companySettings } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const remaining = Math.max(0, application.consultancyFee - application.amountPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0D152F] border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 text-white my-8 animate-in zoom-in-95 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header with Luxury Branding */}
        <div className="text-center pb-6 border-b border-white/15">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25">
            <Shield className="w-8 h-8 text-[#0A1128] fill-[#0A1128]" />
          </div>
          <h2 className="text-xl font-black tracking-widest text-[#F3E5AB] uppercase">
            GAC ADVISORS
          </h2>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Visa Consultancy & Immigration Advisory
          </p>
          <p className="text-[11px] text-slate-300 mt-1 max-w-sm mx-auto">
            {companySettings.officeAddress}
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-emerald-400 font-mono mt-1">
            <span>PK: {companySettings.pakistanWhatsApp}</span>
            <span>•</span>
            <span>UAE: {companySettings.uaeWhatsApp}</span>
          </div>
        </div>

        {/* Receipt Meta */}
        <div className="py-4 border-b border-white/10 flex justify-between items-center text-xs">
          <div>
            <div className="text-slate-400">Official Receipt No:</div>
            <div className="font-mono font-bold text-[#D4AF37] text-sm">{payment.receiptNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">Date Issued:</div>
            <div className="font-medium text-slate-200">{new Date(payment.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Client & Case Details */}
        <div className="py-4 space-y-2 text-xs border-b border-white/10">
          <div className="flex justify-between">
            <span className="text-slate-400">Received From:</span>
            <strong className="text-white">{payment.clientName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Case Tracking Number:</span>
            <strong className="font-mono text-[#D4AF37]">{application.trackingNumber}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Target Visa:</span>
            <strong className="text-white">{application.country} – {application.visaCategory}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Channel:</span>
            <strong className="capitalize text-slate-200">{payment.method.replace('_', ' ')}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Transaction Reference:</span>
            <strong className="font-mono text-slate-200">{payment.transactionReference}</strong>
          </div>
        </div>

        {/* Breakdown of Amounts */}
        <div className="py-4 space-y-2 text-xs border-b border-white/10">
          <div className="flex justify-between text-slate-400">
            <span>Agreed Consultancy Fee:</span>
            <span>PKR {application.consultancyFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-black text-emerald-400 pt-1">
            <span>Amount Paid This Receipt:</span>
            <span>PKR {payment.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-amber-400 font-semibold">
            <span>Remaining Case Balance:</span>
            <span>PKR {remaining.toLocaleString()}</span>
          </div>
        </div>

        {/* Official GAC Stamp / Seal Representation */}
        <div className="pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-dashed flex items-center justify-center text-[8px] font-black text-[#D4AF37] text-center p-1 uppercase leading-tight select-none">
              GAC Advisors Verified Seal
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">Authorized Signatory</div>
              <div className="text-[10px] text-slate-400">{payment.recordedBy || 'Finance Dept.'}</div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED PAYMENT</span>
            </span>
          </div>
        </div>

        {/* Action Buttons (Print / Download) */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
