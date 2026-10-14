import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Binary, 
  Wrench, 
  Sparkles,
  FileCode,
  HardDrive,
  Info
} from 'lucide-react';
import { GameFolder, DiagnosticIssue, AnomalySeverity } from '../types';

interface DiagnosticPanelProps {
  game: GameFolder;
  onRepairSingle: (issueId: string) => void;
  onAutoHealAll: () => void;
  onOpenHexViewer: (issue: DiagnosticIssue) => void;
  isRepairing: boolean;
  repairProgress: number;
  repairLog: string[];
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  game,
  onRepairSingle,
  onAutoHealAll,
  onOpenHexViewer,
  isRepairing,
  repairProgress,
  repairLog
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'fixed'>('all');

  const pendingIssues = game.issues.filter(i => i.status === 'pending');
  const fixedIssues = game.issues.filter(i => i.status === 'fixed');

  const filteredIssues = game.issues.filter(i => {
    if (filter === 'pending') return i.status === 'pending';
    if (filter === 'fixed') return i.status === 'fixed';
    return true;
  });

  const getSeverityBadge = (sev: AnomalySeverity) => {
    switch (sev) {
      case 'critical':
        return <span className="text-xs font-semibold text-rose-400">Critical Anomaly</span>;
      case 'high':
        return <span className="text-xs font-semibold text-amber-400">High Impact</span>;
      case 'medium':
        return <span className="text-xs font-semibold text-sky-400">Medium</span>;
      case 'low':
        return <span className="text-xs text-slate-400">Maintenance</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Health Card & Auto-Fix Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                game.healthScore >= 95 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Self-Healing Diagnostic Engine — {game.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Installation Health:</span>
                  <span className={`font-mono font-bold tabular-nums ${
                    game.healthScore >= 95 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {game.healthScore}%
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{pendingIssues.length} issues requiring repair</span>
                  <span aria-hidden="true">·</span>
                  <span>{fixedIssues.length} resolved</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Detects container header bit-flips, 0-byte truncated packages, locked DACL permissions, stale DX12 shader cache state objects, and NTFS compression desynchronization with verifiable baseline reconstruction.
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {pendingIssues.length > 0 ? (
              <button
                onClick={onAutoHealAll}
                disabled={isRepairing}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isRepairing ? `Repairing (${repairProgress}%)` : `Auto-Fix All Recoverable (${pendingIssues.length})`}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-4 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>All files verified pristine & healthy</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Repair Progress Bar */}
        {isRepairing && (
          <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Running automated repair protocol & manifest checksum verification...</span>
              <span className="font-mono tabular-nums text-emerald-400">{repairProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${repairProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Repair Log Stream if active or recently run */}
      {repairLog.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
          <div className="text-slate-500 font-semibold mb-1 pb-1 border-b border-slate-800 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Real-time Self-Healing Execution Log:</span>
          </div>
          {repairLog.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-600 select-none">[{idx + 1}]</span>
              <span className={log.includes('Fixed') || log.includes('Verified') ? 'text-emerald-400' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Issue Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Issues ({game.issues.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Action ({pendingIssues.length})
          </button>
          <button
            onClick={() => setFilter('fixed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'fixed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({fixedIssues.length})
          </button>
        </div>

        <span className="text-xs text-slate-500">
          Showing {filteredIssues.length} anomalies
        </span>
      </div>

      {/* Issues Table / List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Issues Matching Filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Selected files in this category have passed all integrity, permission, and compression sanity checks.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isFixed = issue.status === 'fixed';
            return (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border transition-all ${
                  isFixed
                    ? 'bg-slate-900/50 border-slate-800/60 opacity-80'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      {isFixed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <h4 className="text-sm font-semibold text-white">{issue.title}</h4>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      {getSeverityBadge(issue.severity)}
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isFixed ? 'REPAIRED & VERIFIED' : 'ACTION REQUIRED'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 pl-7">
                      {issue.description}
                    </p>

                    <div className="pl-7 text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span className="text-sky-400">{issue.filePath}</span>
                    </div>

                    <div className="pl-7 pt-1 text-xs text-slate-400">
                      <span className="text-slate-500">Repair Plan:</span> {issue.repairPlan}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center pl-7 md:pl-0">
                    <button
                      onClick={() => onOpenHexViewer(issue)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Binary className="w-3.5 h-3.5 text-sky-400" />
                      <span>Inspect Raw Hex</span>
                    </button>

                    {!isFixed && (
                      <button
                        onClick={() => onRepairSingle(issue.id)}
                        disabled={isRepairing}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Repair Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
