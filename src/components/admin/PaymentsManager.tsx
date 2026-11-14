import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentRecord } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';

export const PaymentsManager: React.FC = () => {
  const { payments, recordPayment, verifyPayment, applications } = useApp();
  const { activeRole, currentUser } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [amount, setAmount] = useState('65000');
  const [method, setMethod] = useState<PaymentRecord['method']>('bank_transfer');
  const [transactionRef, setTransactionRef] = useState('HBL-TXN-');
  const [notes, setNotes] = useState('');
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<PaymentRecord | null>(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const createdPayment = await recordPayment({
      applicationId: selectedApp.id,
      trackingNumber: selectedApp.trackingNumber,
      clientId: selectedApp.clientId,
      clientName: selectedApp.clientName,
      amount: numAmount,
      currency: selectedApp.currency,
      method,
      transactionReference: transactionRef.trim(),
      status: 'verified', // Admin direct entry is verified
      recordedBy: currentUser?.fullName || 'Finance Officer',
      notes: notes.trim(),
    });

    setModalOpen(false);
    setSelectedReceiptPayment(createdPayment);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Accounts & Invoicing Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Fee Records & Payment Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track client consultancy deposits, audit bank transaction references, and generate verified tax invoices with official stamps.
            </p>
          </div>

          <button
            onClick={() => {
              setTransactionRef(`TXN-${Date.now().toString().slice(-6)}`);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Payment</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            All Payment Transactions ({payments.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Receipt No. & Date</th>
                <th className="px-4 py-3">Client & Tracking ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method & Ref</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => {
                const app = applications.find((a) => a.id === p.applicationId);
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-[#D4AF37]">{p.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{p.clientName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{p.trackingNumber}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-emerald-400 text-sm">
                        {p.currency} {p.amount.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="capitalize text-white font-medium">
                        {p.method.replace('_', ' ')}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{p.transactionReference}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {app && (
                        <button
                          onClick={() => setSelectedReceiptPayment(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Record Consultancy Fee Payment</h3>

            <form onSubmit={handleRecord} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Select Case / Applicant *</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.trackingNumber} – {app.clientName} ({app.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Amount Paid (PKR) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs font-mono font-bold text-emerald-400 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Payment Method *</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="bank_transfer">Bank Transfer (HBL / Standard Chartered / Meezan)</option>
                  <option value="cash">Cash (Islamabad Office Counter)</option>
                  <option value="online">Credit / Debit Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Transaction Ref / Cheque No. *</label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Internal Finance Remarks</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cleared via online banking transfer."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-black"
                >
                  Verify & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Receipt Modal */}
      {selectedReceiptPayment && (
        <ReceiptModal
          payment={selectedReceiptPayment}
          application={
            applications.find((a) => a.id === selectedReceiptPayment.applicationId) || applications[0]
          }
          onClose={() => setSelectedReceiptPayment(null)}
        />
      )}
    </div>
  );
};
