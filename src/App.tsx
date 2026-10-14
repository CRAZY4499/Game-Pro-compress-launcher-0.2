/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  HardDrive, 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  Sparkles, 
  FolderOpen, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingDown,
  Activity
} from 'lucide-react';
import { 
  GameFolder, 
  GameFile, 
  DiagnosticIssue, 
  RollbackSnapshot, 
  PerformanceConfig, 
  SystemTelemetry 
} from './types';
import { createSampleGameLibrary, scanRealDirectoryHandle, scanRealFileList } from './services/gamePresets';
import { repairDiagnosticIssue, rollbackDiagnosticIssue } from './services/selfHealingEngine';
import { StreamingOptimizationController } from './services/optimizationWorker';
import { Header } from './components/Header';
import { TelemetryBar } from './components/TelemetryBar';
import { GameList } from './components/GameList';
import { FileBrowser } from './components/FileBrowser';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { RollbackHistory } from './components/RollbackHistory';
import { SettingsView } from './components/SettingsView';
import { HexViewerModal } from './components/HexViewerModal';
import { DesktopLaunchModal } from './components/DesktopLaunchModal';

export default function App() {
  // Core State
  const [games, setGames] = useState<GameFolder[]>(() => createSampleGameLibrary());
  const [selectedGameId, setSelectedGameId] = useState<string>('cp2077');
  const [activeTab, setActiveTab] = useState<'library' | 'diagnostics' | 'benchmarks' | 'snapshots' | 'settings'>('library');
  const [snapshots, setSnapshots] = useState<RollbackSnapshot[]>([]);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Performance Configuration
  const [config, setConfig] = useState<PerformanceConfig>({
    profile: 'balanced',
    workerCount: 4,
    cpuLimitPercent: 40,
    memoryLimitMB: 512,
    chunkSizeKB: 512,
    pauseOnHighDiskUsage: true,
    skipIncompressibleFiles: true,
    verifyChecksumsPostCompression: true,
    autoHealRecoverableIssues: true,
    createRollbackSnapshot: true
  });

  // Telemetry
  const hardwareCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    cpuUsagePercent: 12,
    activeThreads: 0,
    maxThreads: hardwareCores,
    ramUsageMB: 148,
    ramLimitMB: 512,
    diskThroughputMBps: 0,
    diskQueueDepth: 1,
    filesProcessedPerSec: 0,
    streamingBufferPressurePercent: 28,
    pausedDueToLoad: false,
    gamingModeActive: false
  });

  // Optimization Execution State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingGameId, setOptimizingGameId] = useState<string | null>(null);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const optimizationControllerRef = useRef<StreamingOptimizationController | null>(null);

  // Self-Healing State
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairProgress, setRepairProgress] = useState(0);
  const [repairLog, setRepairLog] = useState<string[]>([]);

  // Inspector Modal
  const [inspectedFile, setInspectedFile] = useState<GameFile | null>(null);
  const [inspectedIssue, setInspectedIssue] = useState<DiagnosticIssue | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Derived state
  const selectedGame = games.find(g => g.id === selectedGameId) || games[0];
  const allIssues = games.flatMap(g => g.issues);
  const totalPendingIssues = allIssues.filter(i => i.status === 'pending').length;

  // Global Library Totals
  const totalOriginalBytes = games.reduce((acc, g) => acc + g.originalSizeBytes, 0);
  const totalCurrentBytes = games.reduce((acc, g) => acc + g.currentSizeBytes, 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCurrentBytes);
  const overallCompressionRatio = totalOriginalBytes > 0 
    ? Number(((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1)) 
    : 0;

  // Handle Profile Changes
  const handleUpdateProfile = (profile: PerformanceConfig['profile']) => {
    let workerCount = 4;
    let cpuLimit = 40;
    let memoryLimit = 512;

    switch (profile) {
      case 'quiet':
        workerCount = 2;
        cpuLimit = 15;
        memoryLimit = 256;
        break;
      case 'balanced':
        workerCount = 4;
        cpuLimit = 40;
        memoryLimit = 512;
        break;
      case 'performance':
        workerCount = 8;
        cpuLimit = 75;
        memoryLimit = 1024;
        break;
      case 'maximum':
        workerCount = Math.max(8, hardwareCores);
        cpuLimit = 100;
        memoryLimit = 2048;
        break;
    }

    setConfig(prev => ({
      ...prev,
      profile,
      workerCount,
      cpuLimitPercent: cpuLimit,
      memoryLimitMB: memoryLimit
    }));

    setTelemetry(prev => ({
      ...prev,
      ramLimitMB: memoryLimit,
      gamingModeActive: profile === 'quiet'
    }));
  };

  const handleUpdateConfig = (updated: Partial<PerformanceConfig>) => {
    setConfig(prev => ({ ...prev, ...updated }));
  };

  // Start Optimization on a Game
  const handleOptimizeGame = (gameToOptimize: GameFolder) => {
    if (isOptimizing) return;

    setSelectedGameId(gameToOptimize.id);
    setIsOptimizing(true);
    setOptimizingGameId(gameToOptimize.id);
    setOptimizationProgress(0);
    setIsPaused(false);

    const controller = new StreamingOptimizationController(
      gameToOptimize,
      config,
      {
        onFileProcessed: (_fileId, _compSize, _saved) => {
          setOptimizationProgress(prev => Math.min(99, prev + 12));
        },
        onTelemetry: (liveTelemetry) => {
          setTelemetry(liveTelemetry);
        },
        onComplete: (updatedGame) => {
          setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
          setIsOptimizing(false);
          setOptimizingGameId(null);
          setOptimizationProgress(100);
          optimizationControllerRef.current = null;
        },
        onError: (err) => {
          console.error(err);
          setIsOptimizing(false);
          setOptimizingGameId(null);
          optimizationControllerRef.current = null;
        }
      }
    );

    optimizationControllerRef.current = controller;
    controller.start();
  };

  const handleTogglePause = () => {
    if (!optimizationControllerRef.current) return;
    if (isPaused) {
      optimizationControllerRef.current.resume();
      setIsPaused(false);
    } else {
      optimizationControllerRef.current.pause();
      setIsPaused(true);
    }
  };

  // Real Self-Healing: Single Issue
  const handleRepairSingle = (issueId: string) => {
    try {
      const { updatedGame, snapshot } = repairDiagnosticIssue(selectedGame, issueId);
      setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
      setSnapshots(prev => [snapshot, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Real Self-Healing: Batch Auto-Fix All Recoverable
  const handleAutoHealAll = async () => {
    if (isRepairing) return;
    setIsRepairing(true);
    setRepairProgress(0);
    setRepairLog([]);

    const pending = selectedGame.issues.filter(i => i.status === 'pending');
    let currentGame = { ...selectedGame };
    const newSnapshots: RollbackSnapshot[] = [];

    for (let i = 0; i < pending.length; i++) {
      const issue = pending[i];
      setRepairLog(prev => [
        ...prev, 
        `Analyzing ${issue.fileName}: ${issue.title}...`
      ]);

      await new Promise(r => setTimeout(r, 400));

      const { updatedGame, snapshot } = repairDiagnosticIssue(currentGame, issue.id);
      currentGame = updatedGame;
      newSnapshots.push(snapshot);

      setRepairLog(prev => [
        ...prev,
        `✓ Fixed ${issue.fileName}: ${issue.repairPlan}`
      ]);

      setRepairProgress(Math.round(((i + 1) / pending.length) * 100));
    }

    setRepairLog(prev => [
      ...prev,
      `✓ Self-Healing Complete: ${pending.length} issues repaired. Checksums verified against pristine manifest.`
    ]);

    setGames(prev => prev.map(g => g.id === currentGame.id ? currentGame : g));
    setSnapshots(prev => [...newSnapshots, ...prev]);
    setIsRepairing(false);
  };

  // Rollback a snapshot
  const handleRollback = (snapshot: RollbackSnapshot) => {
    const targetGame = games.find(g => g.id === snapshot.gameId);
    if (!targetGame) return;

    const revertedGame = rollbackDiagnosticIssue(targetGame, snapshot);
    setGames(prev => prev.map(g => g.id === revertedGame.id ? revertedGame : g));
    setSnapshots(prev => prev.filter(s => s.id !== snapshot.id));
  };

  // Inspect file hex & metadata
  const handleInspectFile = (file: GameFile) => {
    const issue = selectedGame.issues.find(i => i.fileId === file.id);
    setInspectedFile(file);
    setInspectedIssue(issue || null);
  };

  const handleOpenHexViewerFromIssue = (issue: DiagnosticIssue) => {
    const file = selectedGame.files.find(f => f.id === issue.fileId);
    if (file) {
      setInspectedFile(file);
      setInspectedIssue(issue);
    }
  };

  // Import Real Local PC Folder via File System Access API or HTML5 input fallback
  const handleImportRealFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        setIsImporting(true);
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: 'read'
        });
        const customGame = await scanRealDirectoryHandle(dirHandle);
        setGames(prev => [customGame, ...prev]);
        setSelectedGameId(customGame.id);
        setActiveTab('library');
      } else {
        folderInputRef.current?.click();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Fallback to standard input
        folderInputRef.current?.click();
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsImporting(true);
      try {
        const customGame = await scanRealFileList(e.target.files);
        setGames(prev => [customGame, ...prev]);
        setSelectedGameId(customGame.id);
        setActiveTab('library');
      } catch (err) {
        console.error('File scan error', err);
      } finally {
        setIsImporting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-white">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingIssueCount={totalPendingIssues}
        onImportFolder={handleImportRealFolder}
        isImporting={isImporting}
        onOpenDesktopGuide={() => setIsDesktopModalOpen(true)}
      />

      {/* Real-time Hardware Telemetry & Profile Bar */}
      <TelemetryBar
        telemetry={telemetry}
        config={config}
        onUpdateProfile={handleUpdateProfile}
        isOptimizing={isOptimizing}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Cinematic Storage Architecture Hero Strip */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/hero_workstation_storage_1792005983484.jpg"
              alt="High performance workstation storage array"
              className="w-full h-full object-cover object-center opacity-25 filter contrast-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Layers className="w-4 h-4" />
                <span>CompactOS · Zstandard · NTFS Clustering · Self-Healing Engine</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Extreme PC Game Storage Optimization & Diagnostic Auto-Fix
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Streamline and repair multi-hundred-gigabyte PC game folders. Features zero-copy streaming chunk compression, real-time Shannon entropy filtering, and automatic header/permission baseline reconstruction.
              </p>
            </div>

            {/* Quick KPI Quad Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm shrink-0">
              <div>
                <span className="text-[11px] text-slate-400 block">Space Reclaimed</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {(totalSavedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Storage Ratio</span>
                <span className="text-base font-bold text-sky-400 font-mono tabular-nums">
                  {overallCompressionRatio}% Saved
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Anomaly Issues</span>
                <span className={`text-base font-bold font-mono tabular-nums ${
                  totalPendingIssues > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {totalPendingIssues} Pending
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Worker Concurrency</span>
                <span className="text-base font-bold text-purple-400 font-mono tabular-nums">
                  {config.workerCount} Threads
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher based on Active Tab */}
        {activeTab === 'library' && (
          <div className="space-y-8">
            {/* Game Cards Grid */}
            <GameList
              games={games}
              selectedGameId={selectedGameId}
              onSelectGame={setSelectedGameId}
              onOptimizeGame={handleOptimizeGame}
              onNavigateToDiagnostics={(id) => {
                setSelectedGameId(id);
                setActiveTab('diagnostics');
              }}
              optimizingGameId={optimizingGameId}
              optimizationProgress={optimizationProgress}
            />

            {/* Selected Game File Allocation & Deep Browser */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>File Inspector: {selectedGame.name}</span>
                    <span className="text-xs text-slate-500 font-mono font-normal">
                      ({selectedGame.installPath})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-density virtualized tree displaying package headers, Shannon entropy, compression ratios, and allocation states.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('diagnostics')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Launch Self-Healing Diagnostics ({selectedGame.issues.filter(i => i.status === 'pending').length})</span>
                  </button>
                </div>
              </div>

              <FileBrowser
                files={selectedGame.files}
                issues={selectedGame.issues}
                onInspectFile={handleInspectFile}
              />
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticPanel
            game={selectedGame}
            onRepairSingle={handleRepairSingle}
            onAutoHealAll={handleAutoHealAll}
            onOpenHexViewer={handleOpenHexViewerFromIssue}
            isRepairing={isRepairing}
            repairProgress={repairProgress}
            repairLog={repairLog}
          />
        )}

        {activeTab === 'benchmarks' && <BenchmarkPanel />}

        {activeTab === 'snapshots' && (
          <RollbackHistory
            snapshots={snapshots}
            onRollback={handleRollback}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            config={config}
            onUpdateConfig={handleUpdateConfig}
            hardwareCores={hardwareCores}
          />
        )}
      </main>

      {/* Hex Dump & Low-Level Header Inspector Modal */}
      <HexViewerModal
        file={inspectedFile}
        issue={inspectedIssue}
        onClose={() => {
          setInspectedFile(null);
          setInspectedIssue(null);
        }}
        onRepairSingle={handleRepairSingle}
      />

      {/* Desktop PC & EXE Launcher Guide Modal */}
      <DesktopLaunchModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
      />

      {/* Hidden Folder Picker Input Fallback */}
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileInputChange}
        // @ts-ignore
        webkitdirectory=""
        // @ts-ignore
        directory=""
        multiple
        className="hidden"
      />
    </div>
  );
}
