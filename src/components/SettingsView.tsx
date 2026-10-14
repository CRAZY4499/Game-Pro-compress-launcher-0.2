import React from 'react';
import { Cpu, Gauge, HardDrive, Shield, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { PerformanceConfig } from '../types';

interface SettingsViewProps {
  config: PerformanceConfig;
  onUpdateConfig: (updated: Partial<PerformanceConfig>) => void;
  hardwareCores: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  hardwareCores
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Extreme Optimization & Resource Throttling Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Configure fine-grained CPU worker caps, memory buffer ceilings, sequential I/O boundaries, and intelligent entropy thresholds.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Optimization Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">CPU & Worker Pool Throttling</h3>
          </div>

          {/* Worker Thread Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Active Worker Threads</span>
              <span className="font-mono text-sky-400 font-bold tabular-nums">
                {config.workerCount} Threads (Hardware detected: {hardwareCores})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={Math.max(8, hardwareCores * 2)}
              value={config.workerCount}
              onChange={(e) => onUpdateConfig({ workerCount: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <p className="text-[11px] text-slate-500">
              Automatically paces concurrency to prevent context switching, thread starvation, and deadlocks.
            </p>
          </div>

          {/* CPU Limit Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Background CPU Utilization Ceiling</span>
              <span className="font-mono text-sky-400 font-bold tabular-nums">
                {config.cpuLimitPercent}% Max
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={config.cpuLimitPercent}
              onChange={(e) => onUpdateConfig({ cpuLimitPercent: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <p className="text-[11px] text-slate-500">
              Pauses or scales down background worker compression when total system load approaches this ceiling.
            </p>
          </div>

          {/* Skip Incompressible High-Entropy Files */}
          <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-200 block">
                Shannon Entropy Filter (Skip Incompressible Files)
              </span>
              <p className="text-[11px] text-slate-500">
                Calculates block entropy (H &gt; 7.4). Bypasses pre-compressed audio/video packages to save up to 80% CPU time.
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.skipIncompressibleFiles}
              onChange={(e) => onUpdateConfig({ skipIncompressibleFiles: e.target.checked })}
              className="mt-1 h-4 w-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {/* RAM & Memory Streaming Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">RAM & Streaming Memory Optimization</h3>
          </div>

          {/* Memory Buffer Cap */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Bounded Stream Buffer Cap</span>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {config.memoryLimitMB} MB
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[256, 512, 1024, 2048].map((mb) => (
                <button
                  key={mb}
                  onClick={() => onUpdateConfig({ memoryLimitMB: mb })}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                    config.memoryLimitMB === mb
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mb} MB
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Streams large game files in bounded sequential chunks instead of buffering whole 50 GB archives in system memory.
            </p>
          </div>

          {/* Sequential Chunk Size */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Chunk Pipeline Granularity</span>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {config.chunkSizeKB} KB Chunks
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[256, 512, 1024].map((kb) => (
                <button
                  key={kb}
                  onClick={() => onUpdateConfig({ chunkSizeKB: kb })}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                    config.chunkSizeKB === kb
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {kb} KB
                </button>
              ))}
            </div>
          </div>

          {/* Memory Backpressure */}
          <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-200 block">
                Automatic Memory Pressure Backpressure
              </span>
              <p className="text-[11px] text-slate-500">
                Immediately drops active concurrent workers if heap memory approaches the configured limit.
              </p>
            </div>
            <input
              type="checkbox"
              checked={true}
              disabled
              className="mt-1 h-4 w-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 opacity-70 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Disk & I/O Protection Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Disk & Storage Safeguards</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-medium text-slate-200 block">
                  Non-Destructive Storage Invariant
                </span>
                <p className="text-[11px] text-slate-500">
                  GameShrink Pro strictly never deletes active game binaries or source archives. Only orphaned dumps and temporary unpack residue are cleaned.
                </p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            </div>

            <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <span className="font-medium text-slate-200 block">
                  Throttle on High Disk Queue Depth
                </span>
                <p className="text-[11px] text-slate-500">
                  Slows background reads when NVMe or SATA SSD queue depth exceeds 32 to prevent system sluggishness.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.pauseOnHighDiskUsage}
                onChange={(e) => onUpdateConfig({ pauseOnHighDiskUsage: e.target.checked })}
                className="mt-1 h-4 w-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Self-Healing & Verification Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Shield className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Integrity & Self-Healing Safety</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-medium text-slate-200 block">
                  Automatic Pre-Repair Rollback Snapshots
                </span>
                <p className="text-[11px] text-slate-500">
                  Always saves the original byte headers and permission descriptors so any repair can be undone in 1 click.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.createRollbackSnapshot}
                onChange={(e) => onUpdateConfig({ createRollbackSnapshot: e.target.checked })}
                className="mt-1 h-4 w-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <span className="font-medium text-slate-200 block">
                  Post-Compression SHA-256 Checksum Verification
                </span>
                <p className="text-[11px] text-slate-500">
                  Runs WebCrypto SHA-256 integrity verification against decompressed stream blocks before finalizing file state.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.verifyChecksumsPostCompression}
                onChange={(e) => onUpdateConfig({ verifyChecksumsPostCompression: e.target.checked })}
                className="mt-1 h-4 w-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Protection & Zero-Risk PC Safety Guarantee */}
      <div className="p-5 rounded-xl bg-slate-900 border border-emerald-800/40 space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
          <Shield className="w-4 h-4" />
          <span>PC Hardware Safety & Thermal Protection Guarantees</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          GameShrink Pro is engineered with strict hardware protection standards to ensure no PC component (CPU, RAM, GPU, or SSD) is ever stressed or damaged:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-0.5">CPU Thermal Guard</span>
            <span className="text-[11px] text-slate-400">
              Automatic breathing pauses prevent 100% continuous core pegging, keeping CPU temperatures cool.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-0.5">RAM Leak Isolation</span>
            <span className="text-[11px] text-slate-400">
              Streamed in bounded 512KB chunks. Buffers are dereferenced immediately to prevent out-of-memory errors.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-0.5">SSD Wear Minimizer</span>
            <span className="text-[11px] text-slate-400">
              Entropy filters skip incompressible files, preventing needless disk rewrite cycles on your drive.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-0.5">Zero File Loss Guarantee</span>
            <span className="text-[11px] text-slate-400">
              Source game binaries are 100% read-only protected. Never deletes or corrupts active game files.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
