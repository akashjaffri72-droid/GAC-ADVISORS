import React, { useState } from 'react';
import {
  X,
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
        onClose();
      } else if (mode === 'register') {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        await signUp(
          email.trim(),
          password,
          fullName.trim(),
          phone.trim(),
          countryCode
        );
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please provide your account email.');
          setLoading(false);
          return;
        }
        await resetPassword(email.trim());
        setSuccessMsg(`Password reset link sent to ${email.trim()}`);
      }
    } catch (err: any) {
      console.error('Auth error', err);
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 text-white my-8 animate-in zoom-in-95 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/25">
            <Shield className="w-6 h-6 text-[#0A1128] fill-[#0A1128]" />
          </div>
          <h2 className="text-xl font-black tracking-wider text-[#F3E5AB]">
            GAC ADVISORS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {mode === 'login' && 'Sign in to access your visa portfolio'}
            {mode === 'register' && 'Register client consultation profile'}
            {mode === 'forgot' && 'Reset account security credentials'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Muhammad Bilal Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Phone Number with Country Code *
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-2 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="+92">🇵🇰 +92 (PK)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+1">🇺🇸 +1 (US)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+1">🇨🇦 +1 (CA)</option>
                  <option value="+61">🇦🇺 +61 (AU)</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="335 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#D4AF37] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="p-3 rounded-xl bg-[#0A1128] border border-white/10 text-[11px] text-slate-400">
              Note: New accounts receive the verified <strong>Client</strong> role by default. Staff accounts are governed exclusively by Super Admin authorization.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#0A1128] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Account' : mode === 'register' ? 'Create Client Profile' : 'Send Reset Link'}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="pt-3 border-t border-white/10 text-center text-xs text-slate-400 space-y-1">
          {mode === 'login' && (
            <div>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-bold text-[#D4AF37] hover:underline"
              >
                Register as Client
              </button>
            </div>
          )}
          {mode === 'register' && (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-[#D4AF37] hover:underline"
              >
                Sign In
              </button>
            </div>
          )}
          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="font-bold text-[#D4AF37] hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
