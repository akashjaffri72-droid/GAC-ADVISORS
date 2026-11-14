import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  User,
  Eye,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DocumentItem } from '../../types';

export const DocumentsManager: React.FC = () => {
  const { documents, reviewDocument, applications, deleteDocument } = useApp();
  const { activeRole, currentUser } = useAuth();

  const [selectedDocForReview, setSelectedDocForReview] = useState<DocumentItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'reupload_requested'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');

  const scopedDocuments = documents.filter((doc) => {
    if (activeRole === 'super_admin') return true;
    if (activeRole === 'staff') {
      const app = applications.find((a) => a.id === doc.applicationId);
      return app?.assignedStaffId === currentUser?.uid;
    }
    return Boolean(currentUser?.uid) && doc.clientId === currentUser?.uid;
  });

  const handleOpenReview = (doc: DocumentItem) => {
    setSelectedDocForReview(doc);
    setReviewAction(doc.status === 'pending' ? 'approved' : (doc.status as any));
    setRejectionReason(doc.rejectionReason || '');
  };

  const handleSaveReview = async () => {
    if (!selectedDocForReview) return;
    await reviewDocument(selectedDocForReview.id, reviewAction, rejectionReason);
    setSelectedDocForReview(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-2">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Biometric & Legal Document Verification</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Client Documents Audit Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Review uploaded passport bio pages, bank statements, employment NOCs, and request revisions with audit notes.
        </p>
      </div>

      {/* Documents Grid / Table */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Document Title & File</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Application Case</th>
                <th className="px-4 py-3">Audit Status</th>
                <th className="px-4 py-3">Reviewed By</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scopedDocuments.map((doc) => {
                const app = applications.find((a) => a.id === doc.applicationId);
                return (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div>
                          <div className="font-bold text-white text-sm">{doc.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {doc.fileName} • {doc.fileSize}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-slate-300">
                        {doc.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-[#D4AF37]">{app?.trackingNumber || doc.applicationId}</div>
                      <div className="text-[10px] text-slate-400">{app?.clientName}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          doc.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : doc.status === 'reupload_requested'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {doc.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-slate-300">{doc.reviewedBy || 'Pending Review'}</span>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenReview(doc)}
                        className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-xs transition-all cursor-pointer shadow-sm"
                      >
                        Audit File
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDocForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Document Compliance Audit</h3>
            <div className="p-3 rounded-2xl bg-[#0A1128] border border-white/10 text-xs space-y-1">
              <div><strong>Title:</strong> {selectedDocForReview.title}</div>
              <div><strong>File:</strong> {selectedDocForReview.fileName} ({selectedDocForReview.fileSize})</div>
              <div><strong>Category:</strong> {selectedDocForReview.category.replace('_', ' ')}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Verification Decision *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewAction('approved')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    reviewAction === 'approved'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setReviewAction('reupload_requested')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    reviewAction === 'reupload_requested'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  Need Revision
                </button>
                <button
                  type="button"
                  onClick={() => setReviewAction('rejected')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    reviewAction === 'rejected'
                      ? 'bg-rose-500 text-slate-950 border-rose-500'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>

            {reviewAction !== 'approved' && (
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Reason / Revision Instructions for Client *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Bank statement is missing the branch manager authorization stamp or page 3 is truncated..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDocForReview(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-black shadow-md"
              >
                Submit Audit Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
