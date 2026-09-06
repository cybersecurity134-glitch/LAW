import React from 'react';

export const LawBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-white dark:bg-[#050505] transition-colors duration-300"
      aria-hidden="true"
    >
      {/* 1. Ambient Judicial Caustic Glows */}
      <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] bg-gradient-to-br from-amber-400/12 via-orange-400/8 to-transparent dark:from-[#7C5CFF]/15 dark:via-[#7C5CFF]/5 dark:to-transparent rounded-full blur-3xl opacity-75 dark:opacity-40 liquid-orb-1" />
      <div className="absolute top-1/4 -right-28 w-[42rem] h-[42rem] bg-gradient-to-tl from-indigo-400/12 via-blue-400/8 to-sky-300/8 dark:from-[#7C5CFF]/12 dark:via-[#3B82F6]/8 dark:to-transparent rounded-full blur-3xl opacity-70 dark:opacity-30 liquid-orb-2" />
      <div className="absolute -bottom-36 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-emerald-400/10 via-teal-400/8 to-amber-300/6 dark:from-[#7C5CFF]/10 dark:via-[#22C55E]/5 dark:to-transparent rounded-full blur-3xl opacity-65 dark:opacity-25 liquid-orb-3" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 via-rose-300/8 to-transparent dark:from-[#7C5CFF]/8 dark:to-transparent rounded-full blur-3xl opacity-50 dark:opacity-20 liquid-pulse" />

      {/* 2. Watermark: Grand Scales of Justice (Libra) in Top-Right Background */}
      <div className="absolute top-12 right-0 lg:right-12 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] opacity-[0.06] dark:opacity-[0.035] text-amber-800 dark:text-white transition-opacity duration-500">
        <svg
          viewBox="0 0 500 500"
          fill="none"
          stroke="currentColor"
          className="w-full h-full"
        >
          {/* Central Finial & Mast */}
          <circle cx="250" cy="50" r="14" strokeWidth="6" />
          <path d="M250 64 V 420" strokeWidth="8" strokeLinecap="round" />
          <path d="M220 420 H 280" strokeWidth="10" strokeLinecap="round" />
          <path d="M190 440 H 310" strokeWidth="12" strokeLinecap="round" />
          <path d="M160 455 H 340" strokeWidth="10" strokeLinecap="round" />

          {/* Crossbeam with Balance Pivot */}
          <path d="M70 140 Q 250 120 430 140" strokeWidth="8" strokeLinecap="round" />
          <circle cx="250" cy="130" r="18" strokeWidth="6" />
          <circle cx="250" cy="130" r="6" fill="currentColor" />

          {/* Left Scale Suspension & Pan */}
          <circle cx="90" cy="142" r="8" strokeWidth="5" />
          <path d="M90 150 L 40 280" strokeWidth="4" />
          <path d="M90 150 L 140 280" strokeWidth="4" />
          <path d="M90 150 L 90 280" strokeWidth="3" strokeDasharray="6 4" />
          <path d="M30 280 Q 90 320 150 280 Z" strokeWidth="6" fill="currentColor" fillOpacity="0.1" />

          {/* Right Scale Suspension & Pan */}
          <circle cx="410" cy="142" r="8" strokeWidth="5" />
          <path d="M410 150 L 360 280" strokeWidth="4" />
          <path d="M410 150 L 460 280" strokeWidth="4" />
          <path d="M410 150 L 410 280" strokeWidth="3" strokeDasharray="6 4" />
          <path d="M350 280 Q 410 320 470 280 Z" strokeWidth="6" fill="currentColor" fillOpacity="0.1" />

          {/* Sword of Truth & Justice faint outline */}
          <path d="M250 150 L 250 380" strokeWidth="4" strokeLinecap="round" />
          <path d="M225 180 H 275" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3. Watermark: Neoclassical Judicial Colonnade / Courthouse Pillars (Bottom Horizon) */}
      <div className="absolute bottom-0 left-0 right-0 h-96 opacity-[0.05] dark:opacity-[0.03] text-slate-800 dark:text-white pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 380"
          fill="none"
          stroke="currentColor"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full"
        >
          {/* Pediment & Architrave */}
          <path d="M120 70 L 720 10 L 1320 70 Z" strokeWidth="6" fill="currentColor" fillOpacity="0.05" />
          <rect x="100" y="70" width="1240" height="24" strokeWidth="6" />
          <rect x="80" y="94" width="1280" height="18" strokeWidth="4" />

          {/* Classical Ionic / Doric Pillars */}
          {[160, 300, 440, 580, 720, 860, 1000, 1140, 1280].map((x, i) => (
            <g key={i}>
              {/* Capital */}
              <path d={`M ${x-24} 112 H ${x+24}`} strokeWidth="6" strokeLinecap="round" />
              <path d={`M ${x-18} 122 H ${x+18}`} strokeWidth="4" />
              {/* Column shaft with fluting */}
              <line x1={x-14} y1="122" x2={x-14} y2="330" strokeWidth="3" />
              <line x1={x-6} y1="122" x2={x-6} y2="330" strokeWidth="2" strokeDasharray="12 4" />
              <line x1={x+6} y1="122" x2={x+6} y2="330" strokeWidth="2" strokeDasharray="12 4" />
              <line x1={x+14} y1="122" x2={x+14} y2="330" strokeWidth="3" />
              {/* Base */}
              <rect x={x-22} y="330" width="44" height="16" strokeWidth="4" />
            </g>
          ))}

          {/* Steps of Justice (Stylobate) */}
          <line x1="40" y1="346" x2="1400" y2="346" strokeWidth="6" />
          <line x1="20" y1="360" x2="1420" y2="360" strokeWidth="8" />
          <line x1="0" y1="376" x2="1440" y2="376" strokeWidth="10" />
        </svg>
      </div>

      {/* 4. Constitutional Dharma Chakra / Ashoka Medallion (Center-Left Background) */}
      <div className="absolute top-1/3 -left-20 sm:left-4 w-72 h-72 sm:w-96 sm:h-96 opacity-[0.045] dark:opacity-[0.03] text-amber-700 dark:text-white">
        <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" className="w-full h-full">
          <circle cx="200" cy="200" r="190" strokeWidth="4" />
          <circle cx="200" cy="200" r="176" strokeWidth="2" strokeDasharray="8 6" />
          <circle cx="200" cy="200" r="150" strokeWidth="3" />
          <circle cx="200" cy="200" r="50" strokeWidth="4" />
          <circle cx="200" cy="200" r="20" fill="currentColor" fillOpacity="0.2" />

          {Array.from({ length: 24 }).map((_, idx) => {
            const angle = (idx * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + 50 * Math.cos(rad);
            const y1 = 200 + 50 * Math.sin(rad);
            const x2 = 200 + 150 * Math.cos(rad);
            const y2 = 200 + 150 * Math.sin(rad);
            return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2.5" />;
          })}
        </svg>
      </div>

      {/* 5. Latin Jurisprudence Ribbon Watermark across mid-canvas */}
      <div className="hidden md:flex absolute top-[45%] left-0 right-0 justify-around text-[10px] lg:text-xs font-serif italic tracking-[0.35em] uppercase text-slate-900/[0.12] dark:text-white/[0.04] select-none pointer-events-none">
        <span>Fiat Justitia Ruat Caelum</span>
        <span>•</span>
        <span>Lex Est Tutissima Cassis</span>
        <span>•</span>
        <span>Ubi Jus Ibi Remedium</span>
        <span>•</span>
        <span>Justitia Omnibus</span>
      </div>

      {/* 6. Subtle Gavel & Statutory Code Motif (Lower Left) */}
      <div className="absolute bottom-28 left-8 w-44 h-44 opacity-[0.05] dark:opacity-[0.03] text-amber-800 dark:text-white hidden xl:block">
        <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" className="w-full h-full">
          <rect x="40" y="30" width="60" height="26" rx="4" transform="rotate(-30 70 43)" strokeWidth="4" />
          <rect x="34" y="24" width="10" height="38" rx="2" transform="rotate(-30 70 43)" strokeWidth="3" />
          <rect x="96" y="24" width="10" height="38" rx="2" transform="rotate(-30 70 43)" strokeWidth="3" />
          <path d="M78 52 L 125 130" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="60" cy="120" rx="36" ry="14" strokeWidth="4" />
          <ellipse cx="60" cy="116" rx="36" ry="14" strokeWidth="3" />
        </svg>
      </div>

      {/* 7. Liquid Prismatic Glass Specular Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.7),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.06),transparent_70%)]" />
      
      {/* 8. Fine Optical Liquid Glass Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] text-slate-900 dark:text-white pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />
    </div>
  );
};
