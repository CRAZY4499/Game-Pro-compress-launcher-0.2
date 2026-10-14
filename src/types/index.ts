export type CompressionAlgorithm = 
  | 'compact_xpress8k'
  | 'compact_xpress16k'
  | 'compact_lzx'
  | 'zstd_fast'
  | 'zstd_ultra'
  | 'deflate_stream'
  | 'dedup_hardlink';

export type PerformanceProfile = 'quiet' | 'balanced' | 'performance' | 'maximum';

export interface PerformanceConfig {
  profile: PerformanceProfile;
  workerCount: number;
  cpuLimitPercent: number; // e.g. 15, 40, 75, 100
  memoryLimitMB: number; // e.g. 256, 512, 1024, 2048
  chunkSizeKB: number; // 256, 512, 1024
  pauseOnHighDiskUsage: boolean;
  skipIncompressibleFiles: boolean; // Using entropy analysis
  verifyChecksumsPostCompression: boolean;
  autoHealRecoverableIssues: boolean;
  createRollbackSnapshot: boolean;
}

export type FileCategory = 
  | 'executable'
  | 'archive'
  | 'texture'
  | 'audio'
  | 'video'
  | 'shader_cache'
  | 'config'
  | 'dump_temp'
  | 'unknown';

export interface GameFile {
  id: string;
  path: string;
  name: string;
  extension: string;
  category: FileCategory;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  isCompressed: boolean;
  compressionAlgorithm?: CompressionAlgorithm;
  compressionRatio: number; // e.g. 0.62 means compressed is 62% of original
  entropy: number; // 0.0 to 8.0 (>= 7.5 usually already compressed)
  checksumSha256: string;
  isCorrupt: boolean;
  corruptionType?: AnomalyType;
  corruptionDetails?: string;
  isRepaired: boolean;
  repairMethod?: string;
  readOnly: boolean;
  lastModified: number;
  magicHeaderHex: string;
}

export type AnomalyType = 
  | 'CORRUPT_ARCHIVE_HEADER'
  | 'TRUNCATED_OR_ZERO_BYTE_ASSET'
  | 'PERMISSION_LOCKOUT_READONLY'
  | 'BROKEN_JUNCTION_SYMLINK'
  | 'COMPRESSION_DESYNC_FLAG'
  | 'ORPHANED_CRASH_DUMP'
  | 'STALE_SHADER_CACHE_CORRUPTION'
  | 'DUPLICATE_CHUNKS';

export type AnomalySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DiagnosticIssue {
  id: string;
  fileId: string;
  filePath: string;
  fileName: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  technicalDetails: string;
  offsetHex?: string;
  corruptedBytes?: string;
  expectedBytes?: string;
  repairPlan: string;
  status: 'pending' | 'repairing' | 'fixed' | 'rolled_back' | 'unrecoverable';
  timestamp: number;
  snapshotId?: string;
}

export interface RollbackSnapshot {
  id: string;
  timestamp: number;
  gameId: string;
  gameName: string;
  issueId: string;
  filePath: string;
  originalState: {
    sizeBytes: number;
    magicHeaderHex: string;
    readOnly: boolean;
    isCompressed: boolean;
    compressedSizeBytes: number;
    checksumSha256: string;
  };
  repairedState: {
    sizeBytes: number;
    magicHeaderHex: string;
    readOnly: boolean;
    isCompressed: boolean;
    compressedSizeBytes: number;
    checksumSha256: string;
  };
}

export interface GameFolder {
  id: string;
  name: string;
  developer: string;
  installPath: string;
  driveLetter: string;
  driveType: 'NVMe SSD' | 'SATA SSD' | 'Mechanical HDD';
  totalFiles: number;
  originalSizeBytes: number;
  currentSizeBytes: number;
  savedSizeBytes: number;
  compressionPercentage: number;
  status: 'idle' | 'scanning' | 'optimizing' | 'diagnosing' | 'repairing' | 'optimized';
  healthScore: number; // 0 - 100
  files: GameFile[];
  issues: DiagnosticIssue[];
  isCustomLoaded?: boolean;
}

export interface SystemTelemetry {
  cpuUsagePercent: number;
  activeThreads: number;
  maxThreads: number;
  ramUsageMB: number;
  ramLimitMB: number;
  diskThroughputMBps: number;
  diskQueueDepth: number;
  filesProcessedPerSec: number;
  streamingBufferPressurePercent: number;
  pausedDueToLoad: boolean;
  gamingModeActive: boolean;
}

export interface BenchmarkResult {
  algorithm: CompressionAlgorithm;
  algorithmName: string;
  dataSizeMB: number;
  compressedSizeMB: number;
  ratioPercent: number;
  compressionSpeedMBps: number;
  decompressionSpeedMBps: number;
  cpuOverheadScore: number; // 1-10 (lower is better)
  testedAt: number;
}
