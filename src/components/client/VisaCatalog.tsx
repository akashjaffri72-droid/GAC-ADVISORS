import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VisaService } from '../../types';

export const VisaCatalog: React.FC = () => {
  const { services, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [viewServiceModal, setViewServiceModal] = useState<VisaService | null>(null);

  const categories = ['all', ...Array.from(new Set(services.map((s) => s.category)))];
  const countries = ['all', ...Array.from(new Set(services.map((s) => s.country)))];

  const filtered = services.filter((s) => {
    if (!s.isActive) return false;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesCountry = selectedCountry === 'all' || s.country === selectedCountry;
    return matchesSearch && matchesCat && matchesCountry;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-2">
          <span>Official Catalog</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Global Visa & Immigration Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Explore complete legal requirements, processing timelines, and checklist of documents for all supported countries.
        </p>

        {/* Search & Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search visa, country, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Visa Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Countries' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="rounded-3xl bg-[#101F42] hover:bg-[#152754] border border-white/10 hover:border-[#D4AF37]/50 p-5 transition-all flex flex-col justify-between shadow-lg group relative"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl">{service.flagEmoji || '🌐'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {service.category}
                </span>
              </div>

              <h3 className="font-black text-white text-base mt-3 group-hover:text-[#D4AF37] transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 line-clamp-3 leading-relaxed">
                {service.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Processing Time:</span>
                  <span className="text-slate-200 font-semibold">{service.estimatedProcessing}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Consultancy Fee:</span>
                  <span className="text-[#D4AF37] font-black text-sm">
                    {service.currency} {service.consultancyFee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => setViewServiceModal(service)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                View Checklist
              </button>
              <button
                onClick={() => setActiveTab('apply')}
                className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-black transition-all cursor-pointer shadow-md"
              >
                <span>Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {viewServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-7 text-white my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <button
              onClick={() => setViewServiceModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{viewServiceModal.flagEmoji || '🌐'}</span>
              <div>
                <span className="text-xs uppercase font-extrabold text-[#D4AF37]">
                  {viewServiceModal.country} • {viewServiceModal.category}
                </span>
                <h2 className="text-xl font-black text-white">{viewServiceModal.title}</h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {viewServiceModal.description}
            </p>

            <div className="grid grid-cols-2 gap-3 my-4 p-3.5 rounded-2xl bg-[#0A1128] border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block">Consultancy Fee:</span>
                <strong className="text-sm font-black text-[#D4AF37]">
                  {viewServiceModal.currency} {viewServiceModal.consultancyFee.toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Processing:</span>
                <strong className="text-xs text-white">{viewServiceModal.estimatedProcessing}</strong>
              </div>
            </div>

            {/* Eligibility Checklist */}
            <div className="space-y-2 mb-4">
              <h3 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
                Eligibility Criteria
              </h3>
              <div className="space-y-1.5">
                {viewServiceModal.eligibilityCriteria.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2 mb-4">
              <h3 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
                Required Document Checklist
              </h3>
              <div className="space-y-1.5">
                {viewServiceModal.requiredDocuments.map((doc, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Instructions */}
            {viewServiceModal.importantInstructions && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-5">
                <strong>Important Instructions:</strong> {viewServiceModal.importantInstructions}
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setViewServiceModal(null);
                  setActiveTab('apply');
                }}
                className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Apply for this Visa Now
              </button>
              <button
                onClick={() => setViewServiceModal(null)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
