import React from 'react';
import { FileText, Image as ImageIcon, Music, X } from 'lucide-react';
import { AIAttachment } from '../../types';

interface AttachmentChipsProps {
  attachments: AIAttachment[];
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const AttachmentChips: React.FC<AttachmentChipsProps> = ({
  attachments,
  onRemove,
  disabled
}) => {
  if (attachments.length === 0) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-black/5 dark:border-[#222222] bg-slate-50/50 dark:bg-[#0c0c0c]/50">
      {attachments.map(att => (
        <div
          key={att.id}
          className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#2a2a2a] text-xs shadow-xs group transition-all"
        >
          {/* Thumbnail or Icon */}
          {att.type === 'image' && att.previewUrl ? (
            <img
              src={att.previewUrl}
              alt={att.name}
              className="w-7 h-7 rounded-lg object-cover border border-black/10 dark:border-white/10"
            />
          ) : att.type === 'pdf' ? (
            <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-500 flex items-center justify-center font-bold text-[10px]">
              PDF
            </div>
          ) : att.type === 'audio' ? (
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Music className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Details */}
          <div className="max-w-[120px] sm:max-w-[160px] truncate leading-tight">
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]">
              {att.name}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">
              {formatSize(att.size)}
            </p>
          </div>

          {/* Remove Button */}
          {!disabled && (
            <button
              type="button"
              onClick={() => onRemove(att.id)}
              className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Remove attachment"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
