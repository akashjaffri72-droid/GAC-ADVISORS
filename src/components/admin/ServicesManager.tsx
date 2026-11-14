import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  DollarSign,
  Clock,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VisaService } from '../../types';

export const ServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService, toggleServiceStatus } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<VisaService | null>(null);

  const [country, setCountry] = useState('United States');
  const [category, setCategory] = useState('Visit Visa');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('75000');
  const [processing, setProcessing] = useState('3 to 6 weeks');
  const [eligibility, setEligibility] = useState('Valid passport with 6 months validity\nProof of financial solvency\nGenuine visitor intent');
  const [docs, setDocs] = useState('Original Passport\n6 Months Bank Statement\nEmployment NOC & Salary Certificate');
  const [instructions, setInstructions] = useState('Original bank statement must have official branch manager signature.');

  const handleOpenAdd = () => {
    setEditingService(null);
    setCountry('United States');
    setCategory('Visit Visa');
    setTitle('');
    setDescription('');
    setFee('75000');
    setProcessing('3 to 6 weeks');
    setEligibility('Valid passport with 6 months validity\nProof of financial solvency\nGenuine visitor intent');
    setDocs('Original Passport\n6 Months Bank Statement\nEmployment NOC & Salary Certificate');
    setInstructions('Original bank statement must have official branch manager signature.');
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: VisaService) => {
    setEditingService(srv);
    setCountry(srv.country);
    setCategory(srv.category);
    setTitle(srv.title);
    setDescription(srv.description);
    setFee(srv.consultancyFee.toString());
    setProcessing(srv.estimatedProcessing);
    setEligibility(srv.eligibilityCriteria.join('\n'));
    setDocs(srv.requiredDocuments.join('\n'));
    setInstructions(srv.importantInstructions || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !country.trim()) return;

    const numFee = parseFloat(fee) || 50000;
    const eligibilityList = eligibility.split('\n').filter((l) => l.trim().length > 0);
    const docsList = docs.split('\n').filter((l) => l.trim().length > 0);

    if (editingService) {
      await updateService(editingService.id, {
        country,
        category,
        title: title.trim(),
        description: description.trim(),
        consultancyFee: numFee,
        estimatedProcessing: processing.trim(),
        eligibilityCriteria: eligibilityList,
        requiredDocuments: docsList,
        importantInstructions: instructions.trim(),
      });
    } else {
      await addService({
        country,
        category,
        title: title.trim(),
        description: description.trim(),
        consultancyFee: numFee,
        currency: 'PKR',
        estimatedProcessing: processing.trim(),
        eligibilityCriteria: eligibilityList,
        requiredDocuments: docsList,
        importantInstructions: instructions.trim(),
        isActive: true,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this visa service from the live catalog?')) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Service Inventory Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Visa Services & Fee Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Add new territorial categories, edit consultancy fees, update mandatory document checklists, and toggle active statuses.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Visa Service</span>
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Configured Visa Programs ({services.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Country & Program</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Fee (PKR)</th>
                <th className="px-4 py-3">Processing Timeline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{srv.flagEmoji || '🌐'}</span>
                      <span>{srv.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{srv.country}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-slate-300">
                      {srv.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-[#D4AF37] text-sm">
                      PKR {srv.consultancyFee.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-slate-300">{srv.estimatedProcessing}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleServiceStatus(srv.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        srv.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-700/50 text-slate-400 border-slate-600'
                      }`}
                    >
                      {srv.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingService ? 'Edit Visa Program' : 'Configure New Visa Service'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. USA Visit Visa (B1/B2)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Service Description *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Consultancy Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs font-mono font-bold text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Estimated Processing Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 to 6 weeks"
                    value={processing}
                    onChange={(e) => setProcessing(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Eligibility Criteria (One per line)
                </label>
                <textarea
                  rows={3}
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Required Documents Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={docs}
                  onChange={(e) => setDocs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Special Instructions & Disclaimers</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
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
                  Save Visa Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
