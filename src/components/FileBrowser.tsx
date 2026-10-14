import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Archive, 
  Image, 
  Music, 
  Video, 
  Cpu, 
  Settings, 
  Trash2, 
  Search, 
  Binary, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { GameFile, FileCategory, DiagnosticIssue } from '../types';

interface FileBrowserProps {
  files: GameFile[];
  issues: DiagnosticIssue[];
  onInspectFile: (file: GameFile) => void;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  files,
  issues,
  onInspectFile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'size' | 'entropy' | 'name'>('size');
  const [sortDesc, setSortDesc] = useState(true);

  const getCategoryIcon = (cat: FileCategory) => {
    switch (cat) {
      case 'archive':
        return <Archive className="w-3.5 h-3.5 text-amber-400" />;
      case 'texture':
        return <Image className="w-3.5 h-3.5 text-purple-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-pink-400" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-indigo-400" />;
      case 'shader_cache':
        return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      case 'executable':
        return <Settings className="w-3.5 h-3.5 text-sky-400" />;
      case 'dump_temp':
        return <Trash2 className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const filteredFiles = useMemo(() => {
    return files
      .filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              f.path.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'size') diff = a.originalSizeBytes - b.originalSizeBytes;
        else if (sortBy === 'entropy') diff = a.entropy - b.entropy;
        else diff = a.name.localeCompare(b.name);
        return sortDesc ? -diff : diff;
      });
  }, [files, searchTerm, selectedCategory, sortBy, sortDesc]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search game assets by name or path..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'archive', label: 'Archives' },
            { id: 'texture', label: 'Textures' },
            { id: 'shader_cache', label: 'Shaders' },
            { id: 'executable', label: 'Executables' },
            { id: 'audio', label: 'Audio' },
            { id: 'dump_temp', label: 'Dumps/Temp' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-slate-800 text-sky-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 select-none">
              <th className="py-2.5 px-4 font-medium">
                <button
                  onClick={() => {
                    if (sortBy === 'name') setSortDesc(!sortDesc);
                    else { setSortBy('name'); setSortDesc(false); }
                  }}
                  className="flex items-center gap-1 hover:text-white cursor-pointer"
                >
                  <span>File & Relative Directory</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 font-medium">Format</th>
              <th className="py-2.5 px-3 font-medium text-right">
                <button
                  onClick={() => {
                    if (sortBy === 'size') setSortDesc(!sortDesc);
                    else { setSortBy('size'); setSortDesc(true); }
                  }}
                  className="flex items-center gap-1 ml-auto hover:text-white cursor-pointer"
                >
                  <span>Original</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 font-medium text-right">Compressed</th>
              <th className="py-2.5 px-3 font-medium text-right">
                <button
                  onClick={() => {
                    if (sortBy === 'entropy') setSortDesc(!sortDesc);
                    else { setSortBy('entropy'); setSortDesc(true); }
                  }}
                  className="flex items-center gap-1 ml-auto hover:text-white cursor-pointer"
                >
                  <span>Entropy (0-8)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 font-medium font-mono text-center">Header Magic</th>
              <th className="py-2.5 px-3 font-medium text-center">Integrity</th>
              <th className="py-2.5 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredFiles.map((file) => {
              const issue = issues.find(i => i.fileId === file.id);
              return (
                <tr
                  key={file.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* File & Path */}
                  <td className="py-2.5 px-4 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-slate-800/80 shrink-0">
                        {getCategoryIcon(file.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-200 truncate max-w-xs md:max-w-md group-hover:text-sky-300">
                          {file.name}
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono truncate max-w-xs md:max-w-md">
                          {file.path}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Format */}
                  <td className="py-2.5 px-3 uppercase text-slate-400">
                    {file.extension}
                  </td>

                  {/* Original Size */}
                  <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                    {formatBytes(file.originalSizeBytes)}
                  </td>

                  {/* Compressed Size */}
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {file.isCompressed ? (
                      <span className="text-emerald-400">
                        {formatBytes(file.compressedSizeBytes)}{' '}
                        <span className="text-slate-500 text-[11px]">
                          ({Math.round(file.compressionRatio * 100)}%)
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Uncompressed</span>
                    )}
                  </td>

                  {/* Shannon Entropy */}
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] ${
                        file.entropy > 7.4
                          ? 'text-amber-400 bg-amber-950/40'
                          : file.entropy < 4.0
                          ? 'text-emerald-400 bg-emerald-950/40'
                          : 'text-slate-300'
                      }`}
                    >
                      {file.entropy.toFixed(2)}
                    </span>
                  </td>

                  {/* Magic Header */}
                  <td className="py-2.5 px-3 text-center text-[11px] text-slate-400">
                    <span className={file.isCorrupt && file.corruptionType === 'CORRUPT_ARCHIVE_HEADER' ? 'text-rose-400 font-bold bg-rose-950/40 px-1 rounded' : ''}>
                      {file.magicHeaderHex}
                    </span>
                  </td>

                  {/* Integrity Status */}
                  <td className="py-2.5 px-3 text-center font-sans">
                    {file.isCorrupt ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Anomaly</span>
                      </span>
                    ) : file.isRepaired ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Repaired</span>
                      </span>
                    ) : file.readOnly ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>Read-Only</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-sans">Pristine</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right font-sans">
                    <button
                      onClick={() => onInspectFile(file)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Binary className="w-3 h-3 text-sky-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500 flex justify-between">
        <span>Showing {filteredFiles.length} of {files.length} game files</span>
        <span>Bounded streaming queue with backpressure enabled</span>
      </div>
    </div>
  );
};
