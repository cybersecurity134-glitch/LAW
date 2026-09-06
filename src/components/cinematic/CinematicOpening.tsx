import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward } from 'lucide-react';

interface CinematicOpeningProps {
  onComplete: () => void;
  duration?: number; // default 3800ms
}

interface Particle {
  id: number;
  x: number;
  startY: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
  driftX: number;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({
  onComplete,
  duration = 3800
}) => {
  const [phase, setPhase] = useState<'chakra' | 'morph' | 'scale' | 'fadeout'>('chakra');
  const [progress, setProgress] = useState(0);

  // Generate deterministic particles for floating dust motes of golden light
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: (i * 13.7) % 100, // percentage across width
      startY: 70 + ((i * 19.3) % 40), // start in lower half
      size: 1.5 + ((i * 3.7) % 2.8), // 1.5px to 4.3px
      speed: 2.8 + ((i * 1.3) % 2.5), // duration in seconds
      opacity: 0.25 + ((i * 7.1) % 0.6),
      delay: (i * 0.08) % 1.6,
      driftX: ((i % 2 === 0 ? 1 : -1) * (15 + (i * 4) % 25))
    }));
  }, []);

  useEffect(() => {
    const startTime = performance.now();
    let animFrame: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (elapsed < 1400) {
        setPhase('chakra');
      } else if (elapsed < 2300) {
        setPhase('morph');
      } else if (elapsed < 3400) {
        setPhase('scale');
      } else {
        setPhase('fadeout');
      }

      if (elapsed < duration) {
        animFrame = requestAnimationFrame(update);
      } else {
        onComplete();
      }
    };

    animFrame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [duration, onComplete]);

  // Generate 24 spokes for Ashoka Chakra (exactly 15 degrees apart)
  const chakraSpokes = useMemo(() => {
    const spokes = [];
    const count = 24;
    const cx = 150;
    const cy = 150;
    const rInner = 14;
    const rOuter = 58;

    for (let i = 0; i < count; i++) {
      const angleDeg = i * (360 / count);
      const angleRad = (angleDeg * Math.PI) / 180;

      const x1 = cx + rInner * Math.sin(angleRad);
      const y1 = cy - rInner * Math.cos(angleRad);
      const x2 = cx + rOuter * Math.sin(angleRad);
      const y2 = cy - rOuter * Math.cos(angleRad);

      // Decorative finial at the tip
      const xFinial = cx + (rOuter + 3.5) * Math.sin(angleRad);
      const yFinial = cy - (rOuter + 3.5) * Math.cos(angleRad);

      spokes.push({ id: i, x1, y1, x2, y2, xFinial, yFinial, angleDeg });
    }
    return spokes;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none bg-[#020617]"
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #0a1330 0%, #050b1e 45%, #020617 100%)'
      }}
    >
      {/* 1. Subtle Golden Light Rays (God-rays streaming down) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'conic-gradient(from 180deg at 50% -10%, transparent 0deg, rgba(245, 158, 11, 0.15) 20deg, transparent 40deg, rgba(234, 179, 8, 0.22) 65deg, transparent 90deg, rgba(245, 158, 11, 0.18) 120deg, transparent 150deg, rgba(234, 179, 8, 0.12) 175deg, transparent 210deg)',
          filter: 'blur(35px)',
          transform: 'scale(1.25)'
        }}
      />

      {/* 2. Indian Tricolor Aurora Streak (Ethereal ribbon, subtle and sophisticated) */}
      <motion.div
        initial={{ opacity: 0, x: '-30%', y: '10%' }}
        animate={{ 
          opacity: [0, 0.38, 0.48, 0.2], 
          x: ['-20%', '10%', '30%'],
          y: ['5%', '-5%', '-15%'] 
        }}
        transition={{ duration: 3.8, ease: 'easeInOut' }}
        className="absolute w-[160%] h-[320px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(255, 153, 51, 0.26) 30%, rgba(255, 255, 255, 0.22) 50%, rgba(19, 136, 8, 0.24) 70%, transparent 100%)',
          filter: 'blur(52px)',
          transform: 'rotate(-25deg)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 3. Drifting Particles / Golden Dust Motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 0, 
              y: `${p.startY}vh`, 
              x: `${p.x}vw`,
              scale: 0.6 
            }}
            animate={{ 
              opacity: [0, p.opacity, p.opacity * 0.8, 0],
              y: [`${p.startY}vh`, `${p.startY - 45}vh`],
              x: [`${p.x}vw`, `${p.x + (p.driftX / 20)}vw`],
              scale: [0.6, 1.2, 0.8]
            }}
            transition={{ 
              duration: p.speed, 
              repeat: Infinity, 
              delay: p.delay,
              ease: 'easeInOut' 
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: '#FDE68A',
              boxShadow: '0 0 8px 1px rgba(245, 158, 11, 0.65)'
            }}
          />
        ))}
      </div>

      {/* 4. Background Architectural Outlines: Indian Parliament & Courthouse Colonnade */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ 
          opacity: phase === 'chakra' ? 0.08 : 0.22, 
          scale: 1.02, 
          y: -5 
        }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[620px] max-w-[95vw] h-[340px] pointer-events-none flex items-center justify-center -translate-y-4"
      >
        <svg 
          viewBox="0 0 600 300" 
          className="w-full h-full text-amber-300/30 dark:text-amber-400/30"
          fill="none" 
          stroke="currentColor"
        >
          {/* Central Dome / Rotunda of Parliament House */}
          <path 
            d="M240,110 Q300,60 360,110" 
            strokeWidth="1.2" 
            strokeDasharray="4 3"
            stroke="rgba(245, 158, 11, 0.35)"
          />
          <path 
            d="M298,48 L302,48 L300,38 Z" 
            fill="rgba(245, 158, 11, 0.5)"
            stroke="none"
          />
          <line x1="300" y1="38" x2="300" y2="60" strokeWidth="1.5" stroke="rgba(245, 158, 11, 0.6)" />

          {/* Colonnade Entablature & Pediment Arch */}
          <line x1="60" y1="110" x2="540" y2="110" strokeWidth="1.8" stroke="rgba(245, 158, 11, 0.3)" />
          <line x1="80" y1="116" x2="520" y2="116" strokeWidth="1.2" stroke="rgba(245, 158, 11, 0.25)" />
          <line x1="50" y1="230" x2="550" y2="230" strokeWidth="2.2" stroke="rgba(245, 158, 11, 0.35)" />
          <line x1="30" y1="238" x2="570" y2="238" strokeWidth="1.5" stroke="rgba(245, 158, 11, 0.2)" />
          
          {/* Classical Colonnade Pillars (16 symmetrically spaced columns) */}
          {[100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500].map((colX, idx) => (
            <g key={idx}>
              <line 
                x1={colX} 
                y1="116" 
                x2={colX} 
                y2="230" 
                strokeWidth="1.2" 
                stroke="rgba(245, 158, 11, 0.22)" 
              />
              {/* Capital & Base */}
              <line x1={colX - 4} y1="118" x2={colX + 4} y2="118" strokeWidth="1.5" stroke="rgba(245, 158, 11, 0.3)" />
              <line x1={colX - 4} y1="228" x2={colX + 4} y2="228" strokeWidth="1.5" stroke="rgba(245, 158, 11, 0.3)" />
            </g>
          ))}

          {/* Symmetrical Perspective Steps */}
          <path 
            d="M30,238 L0,265 L600,265 L570,238 Z" 
            strokeWidth="1" 
            stroke="rgba(245, 158, 11, 0.15)" 
            fill="none" 
          />
        </svg>
      </motion.div>

      {/* 5. Centerpiece: Morphing Ashoka Chakra & Golden Scale of Justice */}
      <div className="relative z-10 w-[300px] h-[300px] flex items-center justify-center">
        
        {/* Golden Ambient Glow Behind Wheel / Scale */}
        <motion.div
          animate={{
            scale: phase === 'morph' ? [1, 1.25, 1.1] : [0.95, 1.08, 0.95],
            opacity: phase === 'morph' ? 0.75 : 0.45
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-52 h-52 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 75%)',
            filter: 'blur(30px)'
          }}
        />

        <svg
          viewBox="0 0 300 300"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Rich Golden Gradient */}
            <linearGradient id="goldSheenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE68A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Beam Metallic Shimmer */}
            <linearGradient id="beamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFFBEB" stopOpacity="1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing Golden Light Trail Filter */}
            <filter id="cinematicGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="coloredBlur" />
              <feGaussianBlur stdDeviation="7.5" result="softBlur" />
              <feMerge>
                <feMergeNode in="softBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Fine Light Line Filter */}
            <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* =============================================================== */}
          {/* LAYER A: ASHOKA CHAKRA (Fades & morphs out as rotation finishes) */}
          {/* =============================================================== */}
          <motion.g
            initial={{ rotate: 0, scale: 0.82, opacity: 0 }}
            animate={{
              rotate: 360,
              scale: phase === 'chakra' ? 1 : 1.06,
              opacity: phase === 'chakra' ? 1 : phase === 'morph' ? 0.25 : 0
            }}
            transition={{
              rotate: { duration: 1.85, ease: [0.25, 0.1, 0.25, 1] },
              scale: { duration: 1.4, ease: 'easeOut' },
              opacity: { duration: 0.7, delay: phase === 'chakra' ? 0 : 0.1 }
            }}
            style={{ originX: '150px', originY: '150px' }}
            filter="url(#cinematicGlow)"
          >
            {/* Outer Rim Ring */}
            <circle
              cx="150"
              cy="150"
              r="58"
              fill="none"
              stroke="url(#goldSheenGrad)"
              strokeWidth="2.2"
            />
            {/* Outer Fine Concentric Beaded Border */}
            <circle
              cx="150"
              cy="150"
              r="62"
              fill="none"
              stroke="url(#goldSheenGrad)"
              strokeWidth="0.8"
              strokeDasharray="2 4"
              opacity="0.75"
            />

            {/* Inner Hub Rings */}
            <circle
              cx="150"
              cy="150"
              r="14"
              fill="none"
              stroke="url(#goldSheenGrad)"
              strokeWidth="2"
            />
            <circle
              cx="150"
              cy="150"
              r="6"
              fill="url(#goldSheenGrad)"
            />

            {/* 24 Radial Spokes (with authentic tapered light trails & finials) */}
            {chakraSpokes.map((spoke) => (
              <g key={spoke.id}>
                <line
                  x1={spoke.x1}
                  y1={spoke.y1}
                  x2={spoke.x2}
                  y2={spoke.y2}
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                {/* Micro finial dot at each spoke tip */}
                <circle
                  cx={spoke.xFinial}
                  cy={spoke.yFinial}
                  r="1.4"
                  fill="#FFFBEB"
                />
              </g>
            ))}
          </motion.g>

          {/* =============================================================== */}
          {/* LAYER B: SCALES OF JUSTICE (Nyay ka Tarazu, perfectly balanced) */}
          {/* =============================================================== */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: phase === 'chakra' ? 0 : 1,
              scale: phase === 'chakra' ? 0.9 : 1,
              y: phase === 'fadeout' ? -2 : 0
            }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
            }}
            filter="url(#cinematicGlow)"
          >
            {/* Central Vertical Pillar of Justice */}
            <line
              x1="150"
              y1="64"
              x2="150"
              y2="225"
              stroke="url(#goldSheenGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Apex Finial (Crown of Sovereignty) */}
            <circle cx="150" cy="58" r="4.5" fill="url(#goldSheenGrad)" />
            <polygon points="150,48 153,55 147,55" fill="url(#goldSheenGrad)" />

            {/* Fulcrum Pivot Ring */}
            <circle
              cx="150"
              cy="88"
              r="8.5"
              fill="#030712"
              stroke="url(#goldSheenGrad)"
              strokeWidth="2.5"
            />
            <circle cx="150" cy="88" r="3.2" fill="#FFFBEB" />

            {/* Stepped Pedestal Base */}
            <path
              d="M128,225 L172,225 M120,230 L180,230 M110,235 L190,235"
              stroke="url(#goldSheenGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Main Balanced Horizontal Crossbeam (Balanced Nyay Beam) */}
            <motion.g
              animate={{
                rotate: [0, -0.35, 0.35, 0]
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{ originX: '150px', originY: '88px' }}
            >
              {/* Central Solid Beam */}
              <line
                x1="68"
                y1="88"
                x2="232"
                y2="88"
                stroke="url(#beamGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Decorative Beam Finials */}
              <circle cx="68" cy="88" r="3.5" fill="url(#goldSheenGrad)" />
              <circle cx="232" cy="88" r="3.5" fill="url(#goldSheenGrad)" />

              {/* ----------------- LEFT SCALE PAN ----------------- */}
              <g>
                {/* Suspension Cords / Fine Golden Chains */}
                <line
                  x1="68"
                  y1="88"
                  x2="48"
                  y2="152"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1.2"
                  opacity="0.85"
                />
                <line
                  x1="68"
                  y1="88"
                  x2="88"
                  y2="152"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1.2"
                  opacity="0.85"
                />
                <line
                  x1="68"
                  y1="88"
                  x2="68"
                  y2="152"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1"
                  opacity="0.65"
                  strokeDasharray="2 2"
                />

                {/* Left Pan Rim & Bowl */}
                <path
                  d="M44,152 C44,152 68,168 92,152"
                  fill="rgba(245, 158, 11, 0.12)"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Liquid Glass Highlight on Left Pan */}
                <path
                  d="M52,154 C58,160 78,160 84,154"
                  fill="none"
                  stroke="#FFFBEB"
                  strokeWidth="1"
                  opacity="0.7"
                />
              </g>

              {/* ----------------- RIGHT SCALE PAN ----------------- */}
              <g>
                {/* Suspension Cords / Fine Golden Chains */}
                <line
                  x1="232"
                  y1="88"
                  x2="212"
                  y2="152"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1.2"
                  opacity="0.85"
                />
                <line
                  x1="232"
                  y1="88"
                  x2="252"
                  y2="152"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1.2"
                  opacity="0.85"
                />
                <line
                  x1="232"
                  y1="88"
                  x2="232"
                  y2="152"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="1"
                  opacity="0.65"
                  strokeDasharray="2 2"
                />

                {/* Right Pan Rim & Bowl */}
                <path
                  d="M208,152 C208,152 232,168 256,152"
                  fill="rgba(245, 158, 11, 0.12)"
                  stroke="url(#goldSheenGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Liquid Glass Highlight on Right Pan */}
                <path
                  d="M216,154 C222,160 242,160 248,154"
                  fill="none"
                  stroke="#FFFBEB"
                  strokeWidth="1"
                  opacity="0.7"
                />
              </g>
            </motion.g>
          </motion.g>
        </svg>

        {/* 6. Soft Lens Flare & Specular Light Sweep (Triggers during scale resolution) */}
        <AnimatePresence>
          {phase === 'scale' && (
            <motion.div
              initial={{ opacity: 0, x: -140, scaleX: 0.2 }}
              animate={{ 
                opacity: [0, 0.95, 1, 0], 
                x: [-120, 0, 120], 
                scaleX: [0.4, 1.6, 0.5] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="absolute pointer-events-none flex items-center justify-center -translate-y-8"
            >
              {/* Horizontal Anamorphic Golden Beam */}
              <div 
                className="w-96 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(254, 240, 138, 0.8) 50%, transparent 100%)',
                  boxShadow: '0 0 20px 3px rgba(245, 158, 11, 0.9)'
                }}
              />
              {/* Central Corona Starburst */}
              <div 
                className="absolute w-12 h-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #FFFFFF 0%, rgba(253, 230, 138, 0.85) 35%, transparent 70%)',
                  filter: 'blur(3px)'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Bottom Branding: Clean, Modern Sans-Serif with Golden Glow & Liquid Glass Shield */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.94 }}
        animate={{
          opacity: phase === 'chakra' ? 0.15 : 1,
          y: phase === 'chakra' ? 18 : 0,
          scale: phase === 'scale' ? 1 : 0.97
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 mt-4 sm:mt-6 flex flex-col items-center text-center px-4 max-w-md mx-auto"
      >
        {/* iOS 26 Liquid Glass Emblem Badge */}
        <div className="mb-3 px-3 py-1 rounded-full backdrop-blur-2xl bg-white/5 border border-amber-400/25 shadow-lg shadow-black/40 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-amber-200/90 uppercase font-mono">
            सत्यमेव जयते • CONSTITUTION OF INDIA
          </span>
        </div>

        {/* Primary App Name in Modern Display Sans */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.14em] text-white font-display uppercase"
          style={{
            textShadow: '0 0 24px rgba(245, 158, 11, 0.45), 0 2px 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          Nyaya<span className="text-amber-400">Setu</span>
        </h1>

        {/* Subtitle with Authoritative Tone */}
        <p className="text-xs sm:text-sm font-medium text-slate-300/90 tracking-[0.08em] mt-2 max-w-xs sm:max-w-sm leading-relaxed">
          The Definitive Legal Constitution & Statutory Guide of India
        </p>

        {/* iOS 26 Liquid Specular Indicator Pill */}
        <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-amber-300/80">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-400/50" />
          <span className="tracking-widest uppercase text-[9px]">Empowering Citizens • Upholding Justice</span>
          <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>
      </motion.div>

      {/* 8. Top Control Bar: iOS 26 Liquid Glass Skip Pill */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 backdrop-blur-2xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-400/40 shadow-lg shadow-black/25 transition-all cursor-pointer"
          title="Skip opening animation"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      </div>

      {/* 9. Bottom Cinematic Progress Bar (Ultra-thin 1.5px Golden Liquid Filament) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden z-30">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-sm shadow-amber-400/50 transition-all ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </motion.div>
  );
};
