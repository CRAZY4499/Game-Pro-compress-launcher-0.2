import React from 'react';
import { RotateCcw, ShieldCheck, History, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RollbackSnapshot } from '../types';

interface RollbackHistoryProps {
  snapshots: RollbackSnapshot[];
  onRollback: (snapshot: RollbackSnapshot) => void;
}

export const RollbackHistory: React.FC<RollbackHistoryProps> = ({
  snapshots,
  onRollback
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Rollback Snapshots & Safety Manifests
            </h2>
            <p className="text-xs text-slate-400">
              Before any file header, permission, or asset is altered, GameShrink Pro takes an immutable byte-level snapshot. You can cleanly revert any change at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Snapshots List */}
      {snapshots.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Snapshots Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When you run Self-Healing repairs or auto-fix operations on damaged game files, snapshots will automatically appear here with 1-click rollback guarantees.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{snap.gameName}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(snap.timestamp).toLocaleString()}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-xs text-emerald-400 font-mono">Verified Baseline Snapshot</span>
                </div>

                <div className="text-xs text-slate-300 font-mono truncate max-w-xl">
                  {snap.filePath}
                </div>

                {/* State Diff */}
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  <div className="font-mono text-slate-400">
                    Header: <span className="text-rose-400">{snap.originalState.magicHeaderHex}</span>
                    <span className="mx-1">→</span>
                    <span className="text-emerald-400">{snap.repairedState.magicHeaderHex}</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <div className="font-mono text-slate-400">
                    DACL: {snap.originalState.readOnly ? 'Locked' : 'RW'} → {snap.repairedState.readOnly ? 'Locked' : 'RW'}
                  </div>
                </div>
              </div>

              {/* Rollback Trigger */}
              <div className="shrink-0">
                <button
                  onClick={() => onRollback(snap)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Revert to Prior State</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
