import React from 'react';
import { X, Monitor, Download, Terminal, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';

interface DesktopLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopLaunchModal: React.FC<DesktopLaunchModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleDownloadBatch = () => {
    const batchContent = `@echo off
cd /d "%~dp0"
title GameShrink Pro - Windows Launcher
color 0b
echo =================================================================
echo             GameShrink Pro - Extreme Optimization Engine
echo =================================================================
echo.
echo [1/3] Checking Node.js installation...

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not installed on this PC!
    echo Please install Node.js (LTS version) from: https://nodejs.org
    echo Once installed, double-click this run.bat file again.
    echo.
    pause
    exit /b
)

echo [OK] Node.js detected.
echo.

if not exist node_modules (
    echo [2/3] Installing dependencies for first-time launch...
    echo (This only takes a minute)...
    call npm install
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] npm install encountered an issue.
        pause
        exit /b
    )
) else (
    echo [2/3] Dependencies verified.
)

echo.
echo [3/3] Launching GameShrink Pro on http://localhost:3000 ...
echo Opening your default browser...
start http://localhost:3000

call npm run dev
pause
`;
    const blob = new Blob([batchContent], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'run.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                PC Launcher & Windows Setup Guide (.exe / Desktop)
              </h3>
              <p className="text-xs text-slate-400">
                How to run GameShrink Pro on Windows PC after download
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Quick Notice in Hindi & English */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/40 space-y-2">
            <div className="font-semibold text-sky-300 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Exe file kahan hai aur PC mein kaise on karein?</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              GameShrink Pro ek <strong>Modern Full-Stack Web & Desktop App</strong> hai (React + Vite + TypeScript). Isliye zip file me direct purana <code className="text-sky-300">.exe</code> nahi hota, balki isko PC par chalane ke <strong>3 aasan tareeqe</strong> hain:
            </p>
          </div>

          {/* Option 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">
                Tareeqa 1: 1-Click Desktop App Install (Sabse Aasan & Best)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-[11px] font-mono">
                Recommended
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Aapko alag se koi .exe run karne ki zaroorat nahi hai! Chrome ya Edge browser me direct install karke Desktop shortcut bana sakte hain:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>Apne Chrome ya Edge browser ke URL address bar me dekhein (right side me ek chhota <strong>Install App</strong> icon <code className="text-sky-300">⊕</code> dikhega).</li>
              <li>Ya browser ke 3 dots <code className="text-slate-200">⋮</code> par click karein → <strong>"Save and share"</strong> ya <strong>"Apps"</strong> → <strong>"Install GameShrink Pro"</strong> par click karein.</li>
              <li>Aapke PC ke Desktop aur Start Menu par GameShrink Pro ka icon aa jayega aur ye bilkul Windows .exe software ki tarah full screen me chalega!</li>
            </ol>
          </div>

          {/* Option 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">
                Tareeqa 2: Downloaded Folder me <code className="text-sky-400">run.bat</code> par Double Click karein
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Agar aapne project files (zip) download ki hain:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>
                Aapke PC mein <strong>Node.js</strong> hona chahiye (Free download:{' '}
                <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-sky-400 underline inline-flex items-center gap-1">
                  nodejs.org <ExternalLink className="w-3 h-3" />
                </a>).
              </li>
              <li>
                Downloaded folder ke andar humne <strong className="text-emerald-400">run.bat</strong> file add kar di hai.
              </li>
              <li>
                Bas <strong>run.bat</strong> par double-click karein! Ye automatically dependencies load karke aapke PC me app start kar dega.
              </li>
            </ol>
            <div className="pt-1">
              <button
                onClick={handleDownloadBatch}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download run.bat (Windows Launcher)</span>
              </button>
            </div>
          </div>

          {/* Option 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-bold text-white text-sm">
              Tareeqa 3: Single Standalone <code className="text-amber-400">GameShrink.exe</code> File Banana
            </span>
            <p className="text-slate-400 leading-relaxed">
              Agar aap khud ek single standalone installer <code className="text-slate-200">.exe</code> create karna chahte hain:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-slate-200 space-y-1">
              <div className="text-slate-500"># 1. Project folder me terminal kholein:</div>
              <div className="text-sky-300">npm install -D electron electron-builder</div>
              <div className="text-slate-500"># 2. Standalone Windows .exe generate karein:</div>
              <div className="text-emerald-400">npx electron-builder --windows</div>
            </div>
            <p className="text-slate-400">
              Isse aapke <code className="text-slate-200">dist/</code> folder me <strong className="text-white">GameShrink-Pro-Setup.exe</strong> ban jayega!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
          <span className="text-xs text-slate-500">
            GameShrink Pro Desktop Architecture
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer"
          >
            Samajh Gaya (Got it)
          </button>
        </div>
      </div>
    </div>
  );
};
