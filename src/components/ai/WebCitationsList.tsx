import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { WebCitation } from '../../types';

interface WebCitationsListProps {
  citations: WebCitation[];
}

export const WebCitationsList: React.FC<WebCitationsListProps> = ({ citations }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200/80 dark:border-[#262626] text-xs space-y-2 shadow-xs">
      <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-[11px]">
        <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
        <span>Verified Web Grounding Sources:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {citations.map((c, i) => {
          let host = '';
          try {
            host = new URL(c.url).hostname.replace('www.', '');
          } catch {
            host = c.url;
          }

          return (
            <a
              key={i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-slate-200/60 dark:border-[#2f2f2f] hover:border-blue-500/50 hover:bg-blue-500/5 dark:hover:border-blue-400/50 transition-all text-slate-700 dark:text-slate-300 text-[11px] group"
            >
              <div className="truncate min-w-0 flex-1">
                <p className="font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {c.title || host}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {host}
                </p>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
