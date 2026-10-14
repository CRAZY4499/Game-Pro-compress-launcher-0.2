import { GameFolder, GameFile, FileCategory } from '../types';
import { diagnoseGameFolder } from './selfHealingEngine';
import { calculateEntropy } from './compressionEngine';

function formatBytesToGb(bytes: number): string {
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

/**
 * Creates realistic game file structures with accurate extensions, directories, and anomalies
 */
export function createSampleGameLibrary(): GameFolder[] {
  const games: GameFolder[] = [
    // 1. CYBERPUNK 2077
    {
      id: 'cp2077',
      name: 'Cyberpunk 2077: Phantom Liberty',
      developer: 'CD PROJEKT RED',
      installPath: 'C:\\Games\\SteamLibrary\\steamapps\\common\\Cyberpunk 2077',
      driveLetter: 'C:',
      driveType: 'NVMe SSD',
      totalFiles: 1420,
      originalSizeBytes: 78_400_000_000, // 78.4 GB
      currentSizeBytes: 52_100_000_000,
      savedSizeBytes: 26_300_000_000,
      compressionPercentage: 33.5,
      status: 'idle',
      healthScore: 78,
      issues: [],
      files: [
        {
          id: 'cp-01',
          path: 'archive/pc/content/basegame_4_gamedata.archive',
          name: 'basegame_4_gamedata.archive',
          extension: 'pak',
          category: 'archive',
          originalSizeBytes: 4_200_000_000,
          compressedSizeBytes: 2_600_000_000,
          isCompressed: false,
          compressionRatio: 0.62,
          entropy: 6.42,
          checksumSha256: '9a4f78c187b2e4d9f10928a471b059388c9f5e4d2a1b0c9e8f7a6b5c4d3e2f1a',
          isCorrupt: true,
          corruptionType: 'CORRUPT_ARCHIVE_HEADER',
          corruptionDetails: 'TOC signature bit-flipped (0x00000000) during unclean system shutdown.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 4,
          magicHeaderHex: '00 00 00 00'
        },
        {
          id: 'cp-02',
          path: 'bin/x64/Cyberpunk2077.exe',
          name: 'Cyberpunk2077.exe',
          extension: 'exe',
          category: 'executable',
          originalSizeBytes: 68_400_000,
          compressedSizeBytes: 39_200_000,
          isCompressed: true,
          compressionAlgorithm: 'compact_xpress16k',
          compressionRatio: 0.57,
          entropy: 6.12,
          checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 12,
          magicHeaderHex: '4D 5A 90 00'
        },
        {
          id: 'cp-03',
          path: 'r6/cache/modded/final.redscripts',
          name: 'final.redscripts',
          extension: 'ini',
          category: 'config',
          originalSizeBytes: 0,
          compressedSizeBytes: 0,
          isCompressed: false,
          compressionRatio: 1.0,
          entropy: 0.0,
          checksumSha256: '0000000000000000000000000000000000000000000000000000000000000000',
          isCorrupt: true,
          corruptionType: 'TRUNCATED_OR_ZERO_BYTE_ASSET',
          corruptionDetails: 'Zero-byte truncated script cache. Game crashes during intro REDengine initialization.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 1,
          magicHeaderHex: '00'
        },
        {
          id: 'cp-04',
          path: 'engine/config/platform/pc/rendering.ini',
          name: 'rendering.ini',
          extension: 'ini',
          category: 'config',
          originalSizeBytes: 142_000,
          compressedSizeBytes: 52_000,
          isCompressed: false,
          compressionRatio: 0.36,
          entropy: 4.88,
          checksumSha256: '4a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
          isCorrupt: true,
          corruptionType: 'PERMISSION_LOCKOUT_READONLY',
          corruptionDetails: 'Locked with read-only flag; cannot modify render distance or ray tracing denoiser settings.',
          isRepaired: false,
          readOnly: true,
          lastModified: Date.now() - 86400000 * 30,
          magicHeaderHex: '5B 47 65 6E'
        },
        {
          id: 'cp-05',
          path: 'r6/cache/pso_pipeline_dx12.cache',
          name: 'pso_pipeline_dx12.cache',
          extension: 'pso',
          category: 'shader_cache',
          originalSizeBytes: 380_000_000,
          compressedSizeBytes: 190_000_000,
          isCompressed: false,
          compressionRatio: 0.50,
          entropy: 5.92,
          checksumSha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
          isCorrupt: true,
          corruptionType: 'STALE_SHADER_CACHE_CORRUPTION',
          corruptionDetails: 'Pre-compiled shader cache out of sync with current NVIDIA/AMD display driver.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 45,
          magicHeaderHex: 'FF FF FF FF'
        },
        {
          id: 'cp-06',
          path: 'archive/pc/content/lang_en_text.archive',
          name: 'lang_en_text.archive',
          extension: 'pak',
          category: 'archive',
          originalSizeBytes: 890_000_000,
          compressedSizeBytes: 390_000_000,
          isCompressed: true,
          compressionAlgorithm: 'compact_lzx',
          compressionRatio: 0.43,
          entropy: 5.12,
          checksumSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 20,
          magicHeaderHex: '5A 6F 12 E1'
        },
        {
          id: 'cp-07',
          path: 'crash_dumps/Cyberpunk2077-20261012-143022.dmp',
          name: 'Cyberpunk2077-20261012-143022.dmp',
          extension: 'dmp',
          category: 'dump_temp',
          originalSizeBytes: 2_150_000_000,
          compressedSizeBytes: 2_150_000_000,
          isCompressed: false,
          compressionRatio: 1.0,
          entropy: 7.21,
          checksumSha256: '9f8e7d6c5b4a39281706f5e4d3c2b1a0987654321fedcba0987654321fedcba0',
          isCorrupt: true,
          corruptionType: 'ORPHANED_CRASH_DUMP',
          corruptionDetails: 'Stale full-memory kernel crash dump consuming 2.15 GB.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 2,
          magicHeaderHex: '4D 44 4D 50'
        },
        {
          id: 'cp-08',
          path: 'archive/pc/content/textures_high_04.archive',
          name: 'textures_high_04.archive',
          extension: 'pak',
          category: 'texture',
          originalSizeBytes: 6_800_000_000,
          compressedSizeBytes: 4_900_000_000,
          isCompressed: false,
          compressionRatio: 0.72,
          entropy: 7.64,
          checksumSha256: '887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 15,
          magicHeaderHex: '5A 6F 12 E1'
        }
      ]
    },

    // 2. BALDUR'S GATE 3
    {
      id: 'bg3',
      name: "Baldur's Gate 3",
      developer: 'Larian Studios',
      installPath: "D:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3",
      driveLetter: 'D:',
      driveType: 'NVMe SSD',
      totalFiles: 3840,
      originalSizeBytes: 122_500_000_000, // 122.5 GB
      currentSizeBytes: 89_200_000_000,
      savedSizeBytes: 33_300_000_000,
      compressionPercentage: 27.2,
      status: 'idle',
      healthScore: 82,
      issues: [],
      files: [
        {
          id: 'bg-01',
          path: 'Data/Shared.pak',
          name: 'Shared.pak',
          extension: 'pak',
          category: 'archive',
          originalSizeBytes: 14_800_000_000,
          compressedSizeBytes: 10_200_000_000,
          isCompressed: false,
          compressionRatio: 0.68,
          entropy: 6.88,
          checksumSha256: 'bcde7890123456789abcdef0123456789abcdef0123456789abcdef012345678',
          isCorrupt: true,
          corruptionType: 'COMPRESSION_DESYNC_FLAG',
          corruptionDetails: 'Cluster compression flag mismatch in Master File Table causing slow zone loading.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 8,
          magicHeaderHex: '4C 53 50 4B'
        },
        {
          id: 'bg-02',
          path: 'bin/bg3_dx11.exe',
          name: 'bg3_dx11.exe',
          extension: 'exe',
          category: 'executable',
          originalSizeBytes: 54_200_000,
          compressedSizeBytes: 31_000_000,
          isCompressed: true,
          compressionAlgorithm: 'compact_xpress16k',
          compressionRatio: 0.57,
          entropy: 6.22,
          checksumSha256: '3456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 18,
          magicHeaderHex: '4D 5A 90 00'
        },
        {
          id: 'bg-03',
          path: 'Data/Textures_01.pak',
          name: 'Textures_01.pak',
          extension: 'pak',
          category: 'texture',
          originalSizeBytes: 18_400_000_000,
          compressedSizeBytes: 14_900_000_000,
          isCompressed: false,
          compressionRatio: 0.81,
          entropy: 7.78, // High entropy, already heavily compressed BC7/ASTC
          checksumSha256: '56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 14,
          magicHeaderHex: '4C 53 50 4B'
        },
        {
          id: 'bg-04',
          path: 'Data/Sound/English(US)/voice_act3.pak',
          name: 'voice_act3.pak',
          extension: 'pak',
          category: 'audio',
          originalSizeBytes: 8_200_000_000,
          compressedSizeBytes: 4_600_000_000,
          isCompressed: false,
          compressionRatio: 0.56,
          entropy: 5.95,
          checksumSha256: '789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456',
          isCorrupt: true,
          corruptionType: 'PERMISSION_LOCKOUT_READONLY',
          corruptionDetails: 'Read-only access flag denies streaming block defragmentation.',
          isRepaired: false,
          readOnly: true,
          lastModified: Date.now() - 86400000 * 9,
          magicHeaderHex: '42 4B 48 44'
        }
      ]
    },

    // 3. STARFIELD
    {
      id: 'starfield',
      name: 'Starfield',
      developer: 'Bethesda Game Studios',
      installPath: 'E:\\Games\\Starfield',
      driveLetter: 'E:',
      driveType: 'SATA SSD',
      totalFiles: 2150,
      originalSizeBytes: 125_000_000_000, // 125.0 GB
      currentSizeBytes: 98_000_000_000,
      savedSizeBytes: 27_000_000_000,
      compressionPercentage: 21.6,
      status: 'idle',
      healthScore: 75,
      issues: [],
      files: [
        {
          id: 'sf-01',
          path: 'Data/Starfield - Textures01.ba2',
          name: 'Starfield - Textures01.ba2',
          extension: 'ba2',
          category: 'texture',
          originalSizeBytes: 16_500_000_000,
          compressedSizeBytes: 12_800_000_000,
          isCompressed: false,
          compressionRatio: 0.77,
          entropy: 7.45,
          checksumSha256: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 25,
          magicHeaderHex: '42 54 44 58'
        },
        {
          id: 'sf-02',
          path: 'Data/Starfield - Shaders.ba2',
          name: 'Starfield - Shaders.ba2',
          extension: 'ba2',
          category: 'shader_cache',
          originalSizeBytes: 1_850_000_000,
          compressedSizeBytes: 720_000_000,
          isCompressed: false,
          compressionRatio: 0.38,
          entropy: 5.21,
          checksumSha256: 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab',
          isCorrupt: true,
          corruptionType: 'CORRUPT_ARCHIVE_HEADER',
          corruptionDetails: 'BA2 header signature corrupted (BA00 instead of BTDX). Game fails to load planetary shaders.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 11,
          magicHeaderHex: '42 41 00 00'
        },
        {
          id: 'sf-03',
          path: 'Starfield.exe',
          name: 'Starfield.exe',
          extension: 'exe',
          category: 'executable',
          originalSizeBytes: 79_000_000,
          compressedSizeBytes: 42_000_000,
          isCompressed: true,
          compressionAlgorithm: 'compact_xpress16k',
          compressionRatio: 0.53,
          entropy: 6.34,
          checksumSha256: 'ef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 35,
          magicHeaderHex: '4D 5A 90 00'
        }
      ]
    },

    // 4. ELDEN RING
    {
      id: 'eldenring',
      name: 'Elden Ring: Shadow of the Erdtree',
      developer: 'FromSoftware',
      installPath: 'C:\\Games\\SteamLibrary\\steamapps\\common\\ELDEN RING\\Game',
      driveLetter: 'C:',
      driveType: 'NVMe SSD',
      totalFiles: 820,
      originalSizeBytes: 48_200_000_000, // 48.2 GB
      currentSizeBytes: 31_500_000_000,
      savedSizeBytes: 16_700_000_000,
      compressionPercentage: 34.6,
      status: 'idle',
      healthScore: 92,
      issues: [],
      files: [
        {
          id: 'er-01',
          path: 'regulation.bin',
          name: 'regulation.bin',
          extension: 'bin',
          category: 'config',
          originalSizeBytes: 18_400_000,
          compressedSizeBytes: 7_200_000,
          isCompressed: true,
          compressionAlgorithm: 'compact_lzx',
          compressionRatio: 0.39,
          entropy: 4.62,
          checksumSha256: 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 5,
          magicHeaderHex: '42 4E 44 34'
        },
        {
          id: 'er-02',
          path: 'eldenring.exe',
          name: 'eldenring.exe',
          extension: 'exe',
          category: 'executable',
          originalSizeBytes: 84_000_000,
          compressedSizeBytes: 49_000_000,
          isCompressed: true,
          compressionAlgorithm: 'compact_xpress16k',
          compressionRatio: 0.58,
          entropy: 6.45,
          checksumSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
          isCorrupt: false,
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 15,
          magicHeaderHex: '4D 5A 90 00'
        },
        {
          id: 'er-03',
          path: 'GameCrashLogs/crash_20261010.dmp',
          name: 'crash_20261010.dmp',
          extension: 'dmp',
          category: 'dump_temp',
          originalSizeBytes: 1_400_000_000,
          compressedSizeBytes: 1_400_000_000,
          isCompressed: false,
          compressionRatio: 1.0,
          entropy: 7.15,
          checksumSha256: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
          isCorrupt: true,
          corruptionType: 'ORPHANED_CRASH_DUMP',
          corruptionDetails: 'Residual memory crash trace after graphics driver timeout.',
          isRepaired: false,
          readOnly: false,
          lastModified: Date.now() - 86400000 * 4,
          magicHeaderHex: '4D 44 4D 50'
        }
      ]
    }
  ];

  // Diagnose initial issues and calculate health scores
  return games.map(g => {
    const issues = diagnoseGameFolder(g);
    const unhealthCount = issues.filter(i => i.status === 'pending').length;
    const healthScore = Math.max(20, Math.round(100 - unhealthCount * 14));
    return {
      ...g,
      issues,
      healthScore
    };
  });
}

/**
 * Real recursive scanner for local PC folders via HTML5 File System Access API
 */
export async function scanRealDirectoryHandle(
  directoryHandle: any,
  onProgress?: (scannedFiles: number, currentPath: string) => void
): Promise<GameFolder> {
  const files: GameFile[] = [];
  let totalOriginalSize = 0;
  let fileCount = 0;

  async function walk(dirHandle: any, currentPath: string) {
    for await (const [name, handle] of dirHandle.entries()) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;
      if (handle.kind === 'directory') {
        await walk(handle, fullPath);
      } else if (handle.kind === 'file') {
        fileCount++;
        const fileObj = await handle.getFile();
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const size = fileObj.size;
        totalOriginalSize += size;

        let category: FileCategory = 'unknown';
        if (['exe', 'com', 'bat', 'cmd'].includes(ext)) category = 'executable';
        else if (['dll', 'so', 'dylib'].includes(ext)) category = 'executable';
        else if (['pak', 'ba2', 'bundle', 'vpk', 'zip', 'rar', '7z', 'cab'].includes(ext)) category = 'archive';
        else if (['dds', 'tga', 'png', 'jpg', 'texture', 'bmp'].includes(ext)) category = 'texture';
        else if (['bnk', 'wem', 'ogg', 'wav', 'mp3', 'flac'].includes(ext)) category = 'audio';
        else if (['bik', 'bk2', 'mp4', 'webm', 'mkv'].includes(ext)) category = 'video';
        else if (['pso', 'dxbc', 'spv', 'cache'].includes(ext)) category = 'shader_cache';
        else if (['ini', 'cfg', 'json', 'xml', 'yaml', 'toml'].includes(ext)) category = 'config';
        else if (['dmp', 'tmp', 'log', 'bak'].includes(ext)) category = 'dump_temp';

        // Read first 64 bytes to sample magic header and test entropy
        let headerHex = '00 00 00 00';
        let entropy = 5.0;
        try {
          const slice = fileObj.slice(0, Math.min(size, 2048));
          const arrayBuffer = await slice.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          entropy = calculateEntropy(bytes);
          if (bytes.length >= 4) {
            headerHex = Array.from(bytes.slice(0, 4))
              .map(b => b.toString(16).padStart(2, '0').toUpperCase())
              .join(' ');
          }
        } catch {
          // Fallback if read restricted
        }

        // Test anomaly
        let isCorrupt = false;
        let corruptionType = undefined;
        let corruptionDetails = undefined;

        if (size === 0 && !name.endsWith('.keep')) {
          isCorrupt = true;
          corruptionType = 'TRUNCATED_OR_ZERO_BYTE_ASSET' as const;
          corruptionDetails = 'File is 0 bytes on disk.';
        } else if (ext === 'dmp' || ext === 'tmp') {
          isCorrupt = true;
          corruptionType = 'ORPHANED_CRASH_DUMP' as const;
          corruptionDetails = 'Orphaned crash or unpack temp file.';
        }

        const compressedSize = Math.round(size * (entropy > 7.4 ? 0.95 : 0.60));

        files.push({
          id: `file-${fileCount}-${Date.now().toString(36)}`,
          path: fullPath,
          name,
          extension: ext,
          category,
          originalSizeBytes: size,
          compressedSizeBytes: compressedSize,
          isCompressed: false,
          compressionRatio: size > 0 ? Number((compressedSize / size).toFixed(2)) : 1.0,
          entropy,
          checksumSha256: 'local_' + Math.random().toString(36).substring(2, 10),
          isCorrupt,
          corruptionType,
          corruptionDetails,
          isRepaired: false,
          readOnly: false,
          lastModified: fileObj.lastModified || Date.now(),
          magicHeaderHex: headerHex
        });

        if (fileCount % 10 === 0) {
          onProgress?.(fileCount, fullPath);
        }
      }
    }
  }

  await walk(directoryHandle, '');

  const rootName = directoryHandle.name || 'Local Game Directory';
  const customGame: GameFolder = {
    id: `local-${Date.now()}`,
    name: rootName,
    developer: 'Local PC Installation',
    installPath: `C:\\Games\\${rootName}`,
    driveLetter: 'C:',
    driveType: 'NVMe SSD',
    totalFiles: files.length,
    originalSizeBytes: totalOriginalSize,
    currentSizeBytes: totalOriginalSize,
    savedSizeBytes: 0,
    compressionPercentage: 0,
    status: 'idle',
    healthScore: 100,
    files,
    issues: [],
    isCustomLoaded: true
  };

  const issues = diagnoseGameFolder(customGame);
  const unhealthCount = issues.filter(i => i.status === 'pending').length;
  customGame.issues = issues;
  customGame.healthScore = Math.max(25, Math.round(100 - unhealthCount * 12));

  return customGame;
}

/**
 * Fallback scanner for standard webkitdirectory FileList input
 */
export async function scanRealFileList(
  fileList: FileList,
  onProgress?: (scannedFiles: number, currentPath: string) => void
): Promise<GameFolder> {
  const files: GameFile[] = [];
  let totalOriginalSize = 0;
  const count = fileList.length;

  for (let i = 0; i < count; i++) {
    const fileObj = fileList[i];
    const fullPath = fileObj.webkitRelativePath || fileObj.name;
    const name = fileObj.name;
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const size = fileObj.size;
    totalOriginalSize += size;

    let category: FileCategory = 'unknown';
    if (['exe', 'com', 'bat', 'cmd', 'dll'].includes(ext)) category = 'executable';
    else if (['pak', 'ba2', 'bundle', 'vpk', 'zip', 'rar', '7z'].includes(ext)) category = 'archive';
    else if (['dds', 'tga', 'png', 'jpg', 'texture', 'bmp'].includes(ext)) category = 'texture';
    else if (['bnk', 'wem', 'ogg', 'wav', 'mp3', 'flac'].includes(ext)) category = 'audio';
    else if (['bik', 'bk2', 'mp4', 'webm'].includes(ext)) category = 'video';
    else if (['pso', 'dxbc', 'spv', 'cache'].includes(ext)) category = 'shader_cache';
    else if (['ini', 'cfg', 'json', 'xml'].includes(ext)) category = 'config';
    else if (['dmp', 'tmp', 'log'].includes(ext)) category = 'dump_temp';

    let headerHex = '00 00 00 00';
    let entropy = 5.0;
    try {
      const slice = fileObj.slice(0, Math.min(size, 2048));
      const arrayBuffer = await slice.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      entropy = calculateEntropy(bytes);
      if (bytes.length >= 4) {
        headerHex = Array.from(bytes.slice(0, 4))
          .map(b => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
      }
    } catch {
      // safe fallback
    }

    let isCorrupt = false;
    let corruptionType = undefined;
    let corruptionDetails = undefined;

    if (size === 0 && !name.endsWith('.keep')) {
      isCorrupt = true;
      corruptionType = 'TRUNCATED_OR_ZERO_BYTE_ASSET' as const;
      corruptionDetails = 'File is 0 bytes on disk.';
    } else if (ext === 'dmp' || ext === 'tmp') {
      isCorrupt = true;
      corruptionType = 'ORPHANED_CRASH_DUMP' as const;
      corruptionDetails = 'Orphaned crash or unpack temp file.';
    }

    const compressedSize = Math.round(size * (entropy > 7.4 ? 0.95 : 0.60));

    files.push({
      id: `file-${i + 1}-${Date.now().toString(36)}`,
      path: fullPath,
      name,
      extension: ext,
      category,
      originalSizeBytes: size,
      compressedSizeBytes: compressedSize,
      isCompressed: false,
      compressionRatio: size > 0 ? Number((compressedSize / size).toFixed(2)) : 1.0,
      entropy,
      checksumSha256: 'local_' + Math.random().toString(36).substring(2, 10),
      isCorrupt,
      corruptionType,
      corruptionDetails,
      isRepaired: false,
      readOnly: false,
      lastModified: fileObj.lastModified || Date.now(),
      magicHeaderHex: headerHex
    });

    if (i % 10 === 0) {
      onProgress?.(i, fullPath);
    }
  }

  const rootName = files[0]?.path.split('/')[0] || 'Imported Game Folder';
  const customGame: GameFolder = {
    id: `local-${Date.now()}`,
    name: rootName,
    developer: 'Local PC Installation',
    installPath: `C:\\Games\\${rootName}`,
    driveLetter: 'C:',
    driveType: 'NVMe SSD',
    totalFiles: files.length,
    originalSizeBytes: totalOriginalSize,
    currentSizeBytes: totalOriginalSize,
    savedSizeBytes: 0,
    compressionPercentage: 0,
    status: 'idle',
    healthScore: 100,
    files,
    issues: [],
    isCustomLoaded: true
  };

  const issues = diagnoseGameFolder(customGame);
  const unhealthCount = issues.filter(i => i.status === 'pending').length;
  customGame.issues = issues;
  customGame.healthScore = Math.max(25, Math.round(100 - unhealthCount * 12));

  return customGame;
}
