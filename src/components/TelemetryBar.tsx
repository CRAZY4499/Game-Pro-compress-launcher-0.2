import React from 'react';
import { Cpu, HardDrive, Zap, Gauge, Pause, Play, Gamepad2 } from 'lucide-react';
import { PerformanceConfig, SystemTelemetry } from '../types';

interface TelemetryBarProps {
  telemetry: SystemTelemetry;
  config: PerformanceConfig;
  onUpdateProfile: (profile: PerformanceConfig['profile']) => void;
  isOptimizing: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  telemetry,
  config,
  onUpdateProfile,
  isOptimizing,
  isPaused,
  onTogglePause
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Profile Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Engine Profile:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            {(['quiet', 'balanced', 'performance', 'maximum'] as const).map((p) => {
              const active = config.profile === p;
              const labels = {
                quiet: 'Quiet (15% Cap)',
                balanced: 'Balanced (40%)',
                performance: 'Performance (75%)',
                maximum: 'Max (Uncapped)'
              };
              return (
                <button
                  key={p}
                  onClick={() => onUpdateProfile(p)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Hardware Telemetry Strip */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          {/* CPU & Threads */}
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>CPU</span>
            <span className="font-mono font-semibold text-slate-200 tabular-nums">
              {telemetry.cpuUsagePercent}%
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400 tabular-nums">
              {telemetry.activeThreads}/{telemetry.maxThreads} Cores
            </span>
          </div>

          {/* RAM Usage */}
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>RAM</span>
            <span className="font-mono font-semibold text-slate-200 tabular-nums">
              {telemetry.ramUsageMB} MB
            </span>
            <span className="text-slate-500 font-mono">/ {telemetry.ramLimitMB} MB</span>
          </div>

          {/* Disk Throughput */}
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>Disk I/O</span>
            <span className="font-mono font-semibold text-slate-200 tabular-nums">
              {telemetry.diskThroughputMBps} MB/s
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400 tabular-nums">
              QD {telemetry.diskQueueDepth}
            </span>
          </div>

          {/* Gaming Protection Mode */}
          {telemetry.gamingModeActive && (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Gaming Friendly</span>
            </div>
          )}

          {/* Pause / Resume Controls during active optimization */}
          {isOptimizing && (
            <button
              onClick={onTogglePause}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'Resume Optimization' : 'Pause Process'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
