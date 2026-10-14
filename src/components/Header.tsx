import React from 'react';
import { Cpu, HardDrive, ShieldCheck, Zap, FolderOpen, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'library' | 'diagnostics' | 'benchmarks' | 'snapshots' | 'settings';
  setActiveTab: (tab: 'library' | 'diagnostics' | 'benchmarks' | 'snapshots' | 'settings') => void;
  pendingIssueCount: number;
  onImportFolder: () => void;
  isImporting: boolean;
  onOpenDesktopGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingIssueCount,
  onImportFolder,
  isImporting,
  onOpenDesktopGuide
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <Zap className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          GameShrink Pro
        </span>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('library')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer pb-1 ${
            activeTab === 'library' ? 'text-sky-400 border-b-2 border-sky-400 font-semibold' : ''
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Game Library
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer pb-1 ${
            activeTab === 'diagnostics' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Self-Healing</span>
          {pendingIssueCount > 0 && (
            <span className="text-xs px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono">
              {pendingIssueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer pb-1 ${
            activeTab === 'benchmarks' ? 'text-sky-400 border-b-2 border-sky-400 font-semibold' : ''
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Benchmarks
        </button>

        <button
          onClick={() => setActiveTab('snapshots')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer pb-1 ${
            activeTab === 'snapshots' ? 'text-sky-400 border-b-2 border-sky-400 font-semibold' : ''
          }`}
        >
          Rollback Snapshots
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer pb-1 ${
            activeTab === 'settings' ? 'text-sky-400 border-b-2 border-sky-400 font-semibold' : ''
          }`}
        >
          <Cpu className="w-4 h-4" />
          Resource Throttling
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenDesktopGuide}
          className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>PC / .EXE Launcher</span>
        </button>

        <button
          onClick={onImportFolder}
          disabled={isImporting}
          className="px-4 py-2 text-xs font-semibold text-slate-100 bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {isImporting ? 'Reading Directory...' : 'Import PC Game Folder'}
        </button>
      </div>
    </header>
  );
};
