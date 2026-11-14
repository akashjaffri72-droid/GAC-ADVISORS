import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Briefcase,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Edit,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';

export const StaffManagement: React.FC = () => {
  const { staffMembers, createStaffMember, updateStaffMember, applications } = useApp();
  const { activeRole } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserProfile | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('USA & Canada Visas');

  const isSuperAdmin = activeRole === 'super_admin';

  const handleOpenCreate = () => {
    setEditingStaff(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('+92 335 ');
    setFormSpecialty('USA & Canada Visas');
    setModalOpen(true);
  };

  const handleOpenEdit = (staff: UserProfile) => {
    setEditingStaff(staff);
    setFormName(staff.fullName);
    setFormEmail(staff.email);
    setFormPhone(staff.phone);
    setFormSpecialty(staff.assignedSpecialty || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (editingStaff) {
      await updateStaffMember(editingStaff.uid, {
        fullName: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        assignedSpecialty: formSpecialty.trim(),
      });
    } else {
      await createStaffMember({
        fullName: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        countryCode: '+92',
        role: 'staff',
        language: 'en',
        assignedSpecialty: formSpecialty.trim(),
        isActive: true,
      });
    }

    setModalOpen(false);
  };

  const handleToggleActive = async (staff: UserProfile) => {
    await updateStaffMember(staff.uid, { isActive: !staff.isActive });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Human Resources & Case Assignment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Staff & Consultant Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Administer visa counselors, legal auditors, and assign specialized territorial portfolios.
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Consultant</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffMembers.map((staff) => {
          const assignedApps = applications.filter((a) => a.assignedStaffId === staff.uid);
          const activeCases = assignedApps.filter((a) => !['completed', 'cancelled'].includes(a.status)).length;
          const isSuper = staff.role === 'super_admin';

          return (
            <div
              key={staff.uid}
              className="rounded-3xl bg-[#101F42] border border-white/10 hover:border-[#D4AF37]/40 p-5 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center font-bold text-[#0A1128] text-lg">
                      {staff.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{staff.fullName}</h3>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isSuper
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {isSuper ? 'SUPER ADMIN' : 'STAFF CONSULTANT'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-2 ${
                      staff.isActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'
                    }`}
                    title={staff.isActive ? 'Active' : 'Deactivated'}
                  />
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Specialty: <strong className="text-white">{staff.assignedSpecialty || 'General Visa Services'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.phone}</span>
                  </div>
                </div>

                {/* Caseload Metrics */}
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#0A1128]">
                    <div className="text-slate-400 text-[10px]">Active Cases</div>
                    <div className="text-base font-bold text-[#D4AF37]">{activeCases}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0A1128]">
                    <div className="text-slate-400 text-[10px]">Total Handled</div>
                    <div className="text-base font-bold text-white">{assignedApps.length}</div>
                  </div>
                </div>
              </div>

              {/* Super Admin Control Actions */}
              {isSuperAdmin && !isSuper && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenEdit(staff)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => handleToggleActive(staff)}
                    className={`font-semibold ${
                      staff.isActive ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    {staff.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingStaff ? 'Edit Staff Consultant' : 'Register New Staff Member'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Assigned Visa Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. UK & Schengen Work Visas"
                  value={formSpecialty}
                  onChange={(e) => setFormSpecialty(e.target.value)}
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
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
