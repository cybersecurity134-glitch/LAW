import React, { useState } from 'react';
import { Phone, ExternalLink, ShieldCheck, Copy, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export interface HelplineItem {
  id: string;
  name: string;
  number: string;
  service: string;
  authority: string;
  timing: string;
  portalUrl: string;
  portalLabel: string;
  notes: string;
  category: 'cyber' | 'legal-aid' | 'consumer' | 'women' | 'emergency' | 'child';
}

export const STATUTORY_HELPLINES: HelplineItem[] = [
  {
    id: 'cybercrime',
    name: 'National Cyber Crime Reporting Helpline',
    number: '1930',
    service: 'Immediate financial fraud freeze (Golden Hour) & cyber offence registration',
    authority: 'Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs',
    timing: '24x7 All India Toll-Free',
    portalUrl: 'https://cybercrime.gov.in',
    portalLabel: 'cybercrime.gov.in',
    notes: 'Report within 2–4 hours of unauthorized transaction to trigger automated bank freeze protocols.',
    category: 'cyber'
  },
  {
    id: 'nalsa',
    name: 'National Legal Aid Helpline (NALSA)',
    number: '15100',
    service: 'Free advocate appointment, court representation & Tele-Law counsel',
    authority: 'National Legal Services Authority & Ministry of Law and Justice',
    timing: '24x7 Free Legal Advice',
    portalUrl: 'https://nalsa.gov.in',
    portalLabel: 'nalsa.gov.in',
    notes: 'All women, children, SC/ST citizens, and eligible income groups are entitled to 100% free legal counsel.',
    category: 'legal-aid'
  },
  {
    id: 'consumer',
    name: 'National Consumer Helpline (NCH)',
    number: '1915',
    service: 'Pre-litigation dispute redressal, e-commerce grievances & E-Daakhil filing',
    authority: 'Department of Consumer Affairs, Government of India',
    timing: '8:00 AM – 8:00 PM (All Days except National Holidays)',
    portalUrl: 'https://consumerhelpline.gov.in',
    portalLabel: 'consumerhelpline.gov.in',
    notes: 'Free conciliation for deficient services, defective goods, and fraudulent business practices.',
    category: 'consumer'
  },
  {
    id: 'women',
    name: 'Women in Distress & Domestic Violence Helpline',
    number: '1091',
    service: 'Emergency police dispatch, legal protection orders & shelter aid',
    authority: 'National Commission for Women (NCW) & State Police',
    timing: '24x7 Dedicated Helpline',
    portalUrl: 'https://ncw.nic.in',
    portalLabel: 'ncw.nic.in',
    notes: 'Supports protection orders under the Protection of Women from Domestic Violence Act 2005.',
    category: 'women'
  },
  {
    id: 'erss',
    name: 'Emergency Response Support System (ERSS)',
    number: '112',
    service: 'Unified pan-India emergency number for Police, Fire, and Ambulance',
    authority: 'Ministry of Home Affairs & State Police Commands',
    timing: '24x7 Instant Dispatch',
    portalUrl: 'https://112.gov.in',
    portalLabel: '112.gov.in',
    notes: 'Single emergency contact number across all States and Union Territories in India.',
    category: 'emergency'
  },
  {
    id: 'childline',
    name: 'Childline India Foundation',
    number: '1098',
    service: 'Emergency rescue, POCSO reporting & rehabilitation for children',
    authority: 'Ministry of Women and Child Development',
    timing: '24x7 Emergency Service',
    portalUrl: 'https://wcd.nic.in',
    portalLabel: 'wcd.nic.in',
    notes: 'Statutory emergency protection for any child in need of care or protection under JJ Act.',
    category: 'child'
  }
];

export const LegalHelplines: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, num: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
          <Phone className="w-4 h-4" />
          <span>Statutory Helplines & Portals</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-[#777777]">
          Official Government of India citizen helplines
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATUTORY_HELPLINES.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-3xl liquid-glass-card flex flex-col justify-between space-y-4 hover:border-orange-500/40 dark:hover:border-[#7C5CFF]/50 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-[#7C5CFF] font-mono tracking-wider">
                  {item.number}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-[#181818] border border-transparent dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3]">
                  {item.timing}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
                {item.name}
              </h4>

              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] leading-relaxed">
                {item.service}
              </p>

              <div className="text-[11px] text-slate-500 dark:text-[#777777]">
                Authority: <strong className="text-slate-700 dark:text-[#FFFFFF]">{item.authority}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-[11px] text-slate-600 dark:text-[#B3B3B3] border border-slate-200/60 dark:border-[#292929]">
                {item.notes}
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-[#222222] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.number)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-pill text-xs font-semibold text-slate-800 dark:text-[#FFFFFF] hover:text-orange-600 dark:hover:text-[#7C5CFF] transition-colors cursor-pointer"
              >
                {copiedId === item.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#22C55E]" />
                    <span>Copied {item.number}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Helpline</span>
                  </>
                )}
              </button>

              <a
                href={item.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline"
              >
                <span>{item.portalLabel}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
