import React from 'react';
import { HardDrive, ShieldCheck, Zap, ArrowRight, CheckCircle2, AlertTriangle, Play, Pause } from 'lucide-react';
import { GameFolder } from '../types';

interface GameListProps {
  games: GameFolder[];
  selectedGameId: string;
  onSelectGame: (gameId: string) => void;
  onOptimizeGame: (game: GameFolder) => void;
  onNavigateToDiagnostics: (gameId: string) => void;
  optimizingGameId: string | null;
  optimizationProgress: number;
}

export const GameList: React.FC<GameListProps> = ({
  games,
  selectedGameId,
  onSelectGame,
  onOptimizeGame,
  onNavigateToDiagnostics,
  optimizingGameId,
  optimizationProgress
}) => {
  const formatGb = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Installed Game Libraries</h3>
          <p className="text-xs text-slate-400">
            Select a game to inspect file allocations, run streaming compression, or heal corrupted headers.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {games.length} Libraries Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => {
          const isSelected = game.id === selectedGameId;
          const isOptimizingThis = optimizingGameId === game.id;
          const pendingIssues = game.issues.filter(i => i.status === 'pending');

          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-sky-500/80 shadow-md ring-1 ring-sky-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{game.name}</h4>
                    {game.isCustomLoaded && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-sky-500/20 text-sky-300 rounded font-mono">
                        Local Folder
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{game.developer}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{game.driveLetter} ({game.driveType})</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{game.totalFiles} files</span>
                  </div>
                </div>

                {/* Health Badge */}
                <div className="shrink-0 text-right">
                  <div className={`text-xs font-mono font-bold flex items-center gap-1 ${
                    game.healthScore >= 90 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {game.healthScore >= 90 ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{game.healthScore}% Health</span>
                  </div>
                </div>
              </div>

              {/* Storage Stats Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <div className="text-slate-400">
                    Disk Footprint:{' '}
                    <span className="text-slate-200 font-mono font-semibold">
                      {formatGb(game.currentSizeBytes)}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] ml-1">
                      (from {formatGb(game.originalSizeBytes)})
                    </span>
                  </div>
                  <div className="text-emerald-400 font-mono font-bold">
                    Saved {formatGb(game.savedSizeBytes)} ({game.compressionPercentage}%)
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-sky-500"
                    style={{ width: `${Math.max(15, 100 - game.compressionPercentage)}%` }}
                    title="Allocated Disk Blocks"
                  />
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${game.compressionPercentage}%` }}
                    title="Storage Space Reclaimed"
                  />
                </div>
              </div>

              {/* Active Optimization Progress if running on this game */}
              {isOptimizingThis && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1 text-xs">
                  <div className="flex justify-between text-sky-400 font-mono">
                    <span>Streaming compression in progress...</span>
                    <span>{optimizationProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-400 transition-all duration-200"
                      style={{ width: `${optimizationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2">
                  {pendingIssues.length > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToDiagnostics(game.id);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{pendingIssues.length} Anomaly Flags</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Integrity Pristine</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOptimizeGame(game);
                    }}
                    disabled={isOptimizingThis}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>{isOptimizingThis ? 'Optimizing...' : 'Optimize'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
