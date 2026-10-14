import React, { useState } from 'react';
import { Play, Activity, Cpu, HardDrive, CheckCircle2, Zap } from 'lucide-react';
import { BenchmarkResult } from '../types';
import { runRealBenchmark } from '../services/compressionEngine';

export const BenchmarkPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [sampleSizeMB, setSampleSizeMB] = useState<number>(4);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setProgressPct(5);
    setProgressMsg('Generating test payload...');

    try {
      const benchmarkResults = await runRealBenchmark(sampleSizeMB, (alg, pct) => {
        setProgressMsg(`Benchmarking ${alg}...`);
        setProgressPct(pct);
      });
      setResults(benchmarkResults);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Benchmark Setup Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Live Compression & Throughput Benchmark Lab
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Executes real streaming compression pipelines on synthetic game blocks</span>
                  <span aria-hidden="true">·</span>
                  <span>Measures real MB/s throughput & ratio on current hardware</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Test how fast your CPU and memory subsystem can compress game data streams. Compares CompactOS XPRESS8K (fast real-time gaming), XPRESS16K (balanced), LZX (maximum archive ratio), and modern streaming algorithms.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Payload Size:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                {[2, 4, 8, 16].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSampleSizeMB(sz)}
                    disabled={isRunning}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      sampleSizeMB === sz
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz} MB
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Running...' : 'Execute Live Benchmark'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mt-5 pt-5 border-t border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{progressMsg}</span>
              <span className="text-sky-400">{progressPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-200 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Table & Comparative Grid */}
      {results.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Benchmark Results ({sampleSizeMB} MB Live Block Tested)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Tested at {new Date(results[0]?.testedAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 select-none">
                  <th className="py-3 px-4 font-medium">Algorithm Engine</th>
                  <th className="py-3 px-4 font-medium text-right">Compression Speed</th>
                  <th className="py-3 px-4 font-medium text-right">Decompression Speed</th>
                  <th className="py-3 px-4 font-medium text-right">Compressed Size</th>
                  <th className="py-3 px-4 font-medium text-right">Ratio (% of Original)</th>
                  <th className="py-3 px-4 font-medium text-center">CPU Overhead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {results.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-200">{r.algorithmName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.algorithm}</div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span className="text-emerald-400 font-bold">{r.compressionSpeedMBps} MB/s</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span className="text-sky-400 font-bold">{r.decompressionSpeedMBps} MB/s</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {r.compressedSizeMB} MB
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span className="text-purple-400 font-semibold">{r.ratioPercent}%</span>
                      <div className="w-24 ml-auto h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${r.ratioPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                        r.cpuOverheadScore <= 2
                          ? 'bg-emerald-950/40 text-emerald-300'
                          : r.cpuOverheadScore <= 4
                          ? 'bg-sky-950/40 text-sky-300'
                          : 'bg-amber-950/40 text-amber-300'
                      }`}>
                        Score {r.cpuOverheadScore}/10
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Architecture Insights */}
          <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Algorithm Recommendation:</div>
            <p>
              • <strong className="text-slate-200">CompactOS XPRESS8K / 16K:</strong> Best for games in active play. Near-zero CPU overhead allows instant asset streaming without in-game framerate hitches.
            </p>
            <p>
              • <strong className="text-slate-200">CompactOS LZX:</strong> Best for archival games or limited SSD capacity where maximizing disk space is the top priority.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Zap className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Benchmark Run Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click 'Execute Live Benchmark' above to run real streaming compression blocks directly on this device and discover peak throughput rates.
          </p>
        </div>
      )}
    </div>
  );
};
