import React from 'react';
import { X, CheckCircle, AlertTriangle, Shield, Binary } from 'lucide-react';
import { GameFile, DiagnosticIssue } from '../types';

interface HexViewerModalProps {
  file: GameFile | null;
  issue?: DiagnosticIssue | null;
  onClose: () => void;
  onRepairSingle?: (issueId: string) => void;
}

export const HexViewerModal: React.FC<HexViewerModalProps> = ({
  file,
  issue,
  onClose,
  onRepairSingle
}) => {
  if (!file) return null;

  // Generate simulated 16-row hex dump for inspector
  const rows = [];
  const headerBytes = file.magicHeaderHex.split(' ');
  for (let r = 0; r < 8; r++) {
    const offset = '0x' + (r * 16).toString(16).padStart(8, '0').toUpperCase();
    const bytes: string[] = [];
    const ascii: string[] = [];

    for (let c = 0; c < 16; c++) {
      let b = '00';
      if (r === 0 && c < headerBytes.length) {
        b = headerBytes[c];
      } else {
        // Deterministic realistic byte filler based on file id
        const val = ((file.name.charCodeAt(c % file.name.length) * (r + 1) * 37) + c * 17) & 0xff;
        b = val.toString(16).padStart(2, '0').toUpperCase();
      }
      bytes.push(b);
      const code = parseInt(b, 16);
      ascii.push(code >= 32 && code <= 126 ? String.fromCharCode(code) : '.');
    }
    rows.push({ offset, bytes, ascii: ascii.join('') });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-semibold text-white truncate max-w-md">
                Low-Level Header Inspector: {file.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate max-w-lg">
                {file.path}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Diagnostic Alert Box if issue exists */}
          {issue && (
            <div className={`p-4 rounded-lg border text-xs ${
              issue.status === 'fixed'
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                {issue.status === 'fixed' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-semibold text-white">
                    {issue.title} ({issue.status.toUpperCase()})
                  </div>
                  <div>{issue.description}</div>
                  <div className="text-slate-400">{issue.technicalDetails}</div>
                  {issue.expectedBytes && (
                    <div className="font-mono text-slate-300 pt-1">
                      Expected Magic: <span className="text-emerald-400 font-bold">{issue.expectedBytes}</span> · Detected: <span className="text-rose-400 font-bold">{issue.corruptedBytes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block">File Size</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {(file.originalSizeBytes / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Shannon Entropy</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {file.entropy} / 8.0
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Read-Only Attribute</span>
              <span className="font-mono text-slate-200">
                {file.readOnly ? 'LOCKED (READ-ONLY)' : 'UNRESTRICTED (RW)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Compression Status</span>
              <span className="font-mono text-slate-200">
                {file.isCompressed ? 'NTFS Compressed' : 'Raw Uncompressed'}
              </span>
            </div>
          </div>

          {/* Hex Dump Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>First 128 Bytes Raw Memory Alignment</span>
              <span className="font-mono text-slate-500">Offset: 0x00000000 - 0x0000007F</span>
            </div>
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-600 border-b border-slate-800/80">
                    <th className="py-1 pr-4">Offset</th>
                    <th className="py-1 pr-4">00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</th>
                    <th className="py-1">Decoded Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="py-1 pr-4 text-sky-400 select-none">{row.offset}</td>
                      <td className="py-1 pr-4 whitespace-nowrap">
                        {row.bytes.map((b, byteIdx) => {
                          const isDamaged = i === 0 && byteIdx < 4 && file.isCorrupt;
                          const isRepaired = i === 0 && byteIdx < 4 && file.isRepaired;
                          return (
                            <span
                              key={byteIdx}
                              className={`mr-1.5 ${
                                isDamaged
                                  ? 'text-rose-400 font-bold bg-rose-950/40 px-0.5 rounded'
                                  : isRepaired
                                  ? 'text-emerald-400 font-bold bg-emerald-950/40 px-0.5 rounded'
                                  : 'text-slate-300'
                              } ${byteIdx === 7 ? 'mr-3' : ''}`}
                            >
                              {b}
                            </span>
                          );
                        })}
                      </td>
                      <td className="py-1 text-slate-500 whitespace-nowrap">{row.ascii}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full SHA-256 Digest */}
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 block mb-0.5">SHA-256 Digest Verification:</span>
            <span className="font-mono text-slate-300 break-all">{file.checksumSha256}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
          <span className="text-xs text-slate-500">
            GameShrink Pro Binary Integrity Engine
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            {issue && issue.status !== 'fixed' && onRepairSingle && (
              <button
                onClick={() => {
                  onRepairSingle(issue.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Apply Real Repair & Verify
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
