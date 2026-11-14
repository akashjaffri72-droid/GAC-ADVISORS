import React from 'react';
import { Wifi, Signal, Battery, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useApp();

  if (deviceMode === 'desktop') {
    return (
      <div className="w-full min-h-[calc(100vh-65px)] bg-[#080D1A] text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</div>
      </div>
    );
  }

  const isPhone = deviceMode === 'phone';

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#050811] py-4 sm:py-8 px-2 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Device switch tabs indicator above frame */}
      <div className="mb-3 flex items-center gap-2 bg-[#101F42] px-3 py-1 rounded-full border border-white/10 text-xs text-slate-400">
        <span>Device Simulation Mode:</span>
        <button
          onClick={() => setDeviceMode('phone')}
          className={`flex items-center gap-1 font-semibold ${isPhone ? 'text-[#D4AF37]' : 'hover:text-white'}`}
        >
          <Smartphone className="w-3 h-3" />
          <span>Phone (Pixel 8)</span>
        </button>
        <span>•</span>
        <button
          onClick={() => setDeviceMode('tablet')}
          className={`flex items-center gap-1 font-semibold ${!isPhone ? 'text-[#D4AF37]' : 'hover:text-white'}`}
        >
          <Tablet className="w-3 h-3" />
          <span>Tablet</span>
        </button>
        <span>•</span>
        <button
          onClick={() => setDeviceMode('desktop')}
          className="flex items-center gap-1 font-semibold hover:text-white"
        >
          <Monitor className="w-3 h-3" />
          <span>Full Window</span>
        </button>
      </div>

      {/* Frame Container */}
      <div
        className={`relative transition-all duration-300 shadow-2xl ${
          isPhone
            ? 'w-full max-w-[420px] rounded-[48px] border-[10px] border-[#1C2541] bg-[#0A1128] ring-1 ring-white/20'
            : 'w-full max-w-[860px] rounded-[36px] border-[12px] border-[#1C2541] bg-[#0A1128] ring-1 ring-white/20'
        } overflow-hidden flex flex-col shadow-amber-500/10`}
        style={{
          height: isPhone ? '840px' : '780px',
        }}
      >
        {/* Android Status Bar */}
        <div className="h-8 bg-[#0F1B3B] px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none border-b border-white/5 z-20 shrink-0">
          <span>09:41</span>

          {/* Camera Notch / Punch Hole on Phone */}
          {isPhone && (
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1C2541]" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
        </div>

        {/* Scrollable Viewport inside Android Device */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-[#080D1A] text-slate-100 flex flex-col">
          {children}
        </div>

        {/* Android Navigation / Gesture Bar at Bottom */}
        <div className="h-6 bg-[#0F1B3B] flex items-center justify-center border-t border-white/5 shrink-0 select-none">
          <div className="w-32 h-1 rounded-full bg-slate-500/60" />
        </div>
      </div>
    </div>
  );
};
