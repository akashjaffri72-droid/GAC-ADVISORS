import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Phone,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AppointmentRecord } from '../../types';

export const AppointmentBooking: React.FC = () => {
  const { appointments, bookAppointment, updateAppointmentStatus, staffMembers, companySettings } = useApp();
  const { currentUser, activeRole } = useAuth();

  const [appointmentType, setAppointmentType] = useState<AppointmentRecord['appointmentType']>('in_person');
  const [selectedVisaCategory, setSelectedVisaCategory] = useState('USA Visit Visa');
  const [selectedDate, setSelectedDate] = useState('2026-03-22');
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM – 12:15 PM');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const timeSlots = [
    '09:30 AM – 10:15 AM',
    '10:30 AM – 11:15 AM',
    '11:30 AM – 12:15 PM',
    '02:00 PM – 02:45 PM',
    '03:00 PM – 03:45 PM',
    '04:00 PM – 04:45 PM',
    '05:00 PM – 05:45 PM',
  ];

  // Strict privacy: Clients only see their own appointments; Staff see assigned; Admin sees all
  const isPrivileged = activeRole === 'staff' || activeRole === 'super_admin';
  const displayedAppointments =
    activeRole === 'super_admin'
      ? appointments
      : activeRole === 'staff'
      ? appointments.filter((a) => a.assignedStaffId === currentUser?.uid || !a.assignedStaffId)
      : appointments.filter((a) => Boolean(currentUser?.uid) && a.clientId === currentUser?.uid);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    const result = await bookAppointment({
      clientId: currentUser?.uid || 'client-demo-01',
      clientName: currentUser?.fullName || 'Muhammad Bilal Khan',
      clientPhone: currentUser?.phone || '+92 300 1234567',
      appointmentType,
      visaCategory: selectedVisaCategory,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes: notes.trim(),
    });

    if (result.success) {
      setBookingSuccess(true);
      setNotes('');
    } else {
      setBookingError(result.error || 'Failed to book slot.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Consultation Scheduling</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Book 1-on-1 Legal Visa Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Meet in-person at our Islamabad executive office or connect remotely via private encrypted video session.
        </p>

        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{companySettings.officeAddress}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#D4AF37]">
            <Clock className="w-3.5 h-3.5" />
            <span>{companySettings.workingDays} ({companySettings.workingHours})</span>
          </span>
        </div>
      </div>

      {/* Booking Form (Client or Admin) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Reserve New Appointment Slot
          </h2>

          {bookingSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Appointment request submitted successfully! An advisor will confirm shortly.</span>
            </div>
          )}

          {bookingError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bookingError}</span>
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-4">
            {/* Appointment Mode Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Consultation Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAppointmentType('in_person')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    appointmentType === 'in_person'
                      ? 'bg-[#162752] border-[#D4AF37] text-white shadow-md'
                      : 'bg-[#0A1128]/70 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold">In-Person (Office)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAppointmentType('virtual_video')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    appointmentType === 'virtual_video'
                      ? 'bg-[#162752] border-[#D4AF37] text-white shadow-md'
                      : 'bg-[#0A1128]/70 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold">Encrypted Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAppointmentType('phone')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    appointmentType === 'phone'
                      ? 'bg-[#162752] border-[#D4AF37] text-white shadow-md'
                      : 'bg-[#0A1128]/70 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Phone Call</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Visa Category / Subject *
                </label>
                <select
                  value={selectedVisaCategory}
                  onChange={(e) => setSelectedVisaCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="USA Visit Visa (B1/B2)">USA Visit Visa (B1/B2)</option>
                  <option value="UK Standard Visitor Visa">UK Standard Visitor Visa</option>
                  <option value="Canada Visitor TRV">Canada Visitor TRV</option>
                  <option value="Australia Subclass 600">Australia Subclass 600</option>
                  <option value="Schengen Visa">Schengen Europe Visa</option>
                  <option value="Sweden Job Seeker">Sweden Job Seeker</option>
                  <option value="Global Study Visa">Global Study Visa</option>
                  <option value="Visa Refusal Audit">Visa Refusal Case Audit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Desired Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Available Time Slot *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#0A1128] font-black border-[#D4AF37]'
                          : 'bg-[#0A1128] border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Specific Case Details / Refusal Background (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention previous refusals, urgent travel dates, or special queries..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#0A1128] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Request Consultation Slot
            </button>
          </form>
        </div>

        {/* Existing Appointments List */}
        <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Your Schedule ({displayedAppointments.length})
          </h2>

          <div className="space-y-3">
            {displayedAppointments.length === 0 ? (
              <p className="text-xs text-slate-400">No appointments scheduled.</p>
            ) : (
              displayedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-2xl bg-[#0A1128]/80 border border-white/10 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-white">{apt.visaCategory}</h4>
                      <p className="text-[11px] text-[#D4AF37] font-medium">{apt.date} • {apt.timeSlot}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        apt.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : apt.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : apt.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {apt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Consultant: <strong>{apt.assignedStaffName || 'Pending Assignment'}</strong></span>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-300 p-2 rounded-lg bg-white/5">
                      {apt.notes}
                    </p>
                  )}

                  {/* Privileged Staff/Admin Controls */}
                  {isPrivileged && apt.status === 'pending' && (
                    <div className="pt-2 border-t border-white/10 flex gap-2">
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'approved', 'Confirmed by GAC scheduling desk.')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'cancelled', 'Slot cancelled due to schedule conflict.')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-[10px] cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
