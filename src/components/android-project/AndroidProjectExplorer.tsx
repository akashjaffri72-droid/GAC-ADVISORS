import React, { useState } from 'react';
import {
  Code2,
  Download,
  FileCode,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Smartphone,
  Globe,
  CheckCircle2,
  Package,
  Rocket,
  Info,
} from 'lucide-react';
import { ANDROID_PROJECT_FILES, generateAndroidProjectZip } from '../../data/androidProjectFiles';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const PUBLISHED_APP_URL =
  'https://ais-pre-k72jqz4lmmhx67ikzz3i3b-930706811650.asia-east1.run.app';

export const AndroidProjectExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState(ANDROID_PROJECT_FILES[0].path);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [installNotice, setInstallNotice] = useState<string | null>(null);
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();

  const selectedFile =
    ANDROID_PROJECT_FILES.find((f) => f.path === selectedFilePath) || ANDROID_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(PUBLISHED_APP_URL);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleInstallAndroidApp = async () => {
    if (canInstall) {
      const accepted = await install();
      if (accepted) {
        setInstallNotice('GAC Advisors Android App installed on your device.');
      }
      return;
    }
    if (isIOS) {
      setInstallNotice(
        'On iPhone/iPad Safari: tap the Share button (↑) at the bottom and choose "Add to Home Screen".'
      );
      return;
    }
    setInstallNotice(
      'Open the Published App Link on Android Chrome, tap the menu (⋮) and select "Install app" or "Add to Home screen" to install GAC Advisors directly on your phone.'
    );
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gac-advisors-android-studio-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error creating project zip', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Published Live Link & Instant Android Install Hub */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101F42] via-[#162752] to-[#0A1128] border border-[#D4AF37]/40 p-5 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Rocket className="w-3.5 h-3.5" />
              <span>Published & Installable Android App (PWA + APK Ready)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Publish Link, Android Install & APK Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Share the published link below so clients and staff can install GAC Advisors directly onto any Android phone, or generate a standalone <span className="font-mono text-[#D4AF37]">.apk</span> file using the included GitHub Actions APK pipeline or PWABuilder.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleInstallAndroidApp}
              disabled={isInstalled}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-[#080D1A] font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {isInstalled
                  ? 'Installed on Device'
                  : canInstall
                  ? 'Install Android App Now'
                  : 'Install on Android Phone'}
              </span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#0A1128] font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Bundling ZIP...' : 'Download Android + APK Builder (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Published App Link Box */}
        <div className="rounded-2xl bg-[#080D1A]/90 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Live Published App Link (Share with Clients & Staff)
              </div>
              <div className="font-mono text-xs sm:text-sm text-[#F3E5AB] truncate">
                {PUBLISHED_APP_URL}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {linkCopied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={PUBLISHED_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open App</span>
            </a>
          </div>
        </div>

        {installNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{installNotice}</span>
          </div>
        )}

        {/* 3 Clear Paths to APK & Mobile Installation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#0A1128]/80 border border-white/10 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <Smartphone className="w-4 h-4" />
              <span>1. Instant Phone Install (PWA)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Open the Published Link above on any Android Chrome browser and tap <span className="text-white font-semibold">Install App</span>. Installs full-screen with home screen icon & offline support.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0A1128]/80 border border-white/10 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold">
              <Package className="w-4 h-4" />
              <span>2. PWABuilder APK (Public Host Required)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              AI Studio preview URLs return a <span className="font-mono text-rose-300">302 cookie check</span> which causes PWABuilder cloud workers to fail (<span className="font-mono">Error during package creation</span>). Deploy <span className="font-mono text-white">dist/</span> to Firebase Hosting first, then run <span className="font-mono text-[#F3E5AB]">pwabuilder.com</span>.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0A1128]/80 border border-white/10 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
              <Terminal className="w-4 h-4" />
              <span>3. Native Kotlin .APK Pipeline (Fixed)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              The ZIP now includes all XML resources, <span className="font-mono text-cyan-200">google-services.json</span>, <span className="font-mono text-cyan-200">GACApplication.kt</span>, all NavGraph screens, & <span className="font-mono text-cyan-200">.github/workflows/build-apk.yml</span> for automatic GitHub Release APK downloads or <span className="font-mono text-emerald-300">gradle assembleDebug</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-3xl bg-[#0F1B3B] border border-white/10 shadow-2xl overflow-hidden min-h-[580px]">
        {/* Left File Tree Directory */}
        <div className="lg:col-span-4 bg-[#0A1128]/90 border-b lg:border-b-0 lg:border-r border-white/10 p-4 overflow-y-auto max-h-[580px]">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center justify-between">
            <span>Native Android Project Tree</span>
            <span className="text-[#D4AF37] font-mono">{ANDROID_PROJECT_FILES.length} Files</span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#162752] text-[#D4AF37] font-bold border border-[#D4AF37]/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#080D1A] overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0A1128]/80">
            <div>
              <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                <span>{selectedFile.path}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-sans">
                  {selectedFile.language.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 overflow-x-auto flex-1 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed bg-[#060913]">
            <pre className="select-text whitespace-pre">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
