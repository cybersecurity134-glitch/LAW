import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { FastForward, Shield } from 'lucide-react';

interface CinematicOpeningProps {
  onComplete: () => void;
  duration?: number; // total duration 2.8 - 3.2s; default 3000ms
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({
  onComplete,
  duration = 3000
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [displayedTitleLength, setDisplayedTitleLength] = useState(0);
  const titleText = "LawSphere";
  const timerRefs = useRef<number[]>([]);
  const hasCompletedRef = useRef(false);

  // Safe dismiss ensuring onComplete fires exactly once
  const handleDismiss = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsExiting(true);
    const t = window.setTimeout(() => {
      onComplete();
    }, 280); // 0.28s exit fade
    timerRefs.current.push(t);
  }, [onComplete]);

  // Handle keyboard dismiss (Escape, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss]);

  // Precompute 24 Ashoka Chakra spokes (15° apart)
  const chakraSpokes = useMemo(() => {
    const spokes = [];
    const count = 24;
    const cx = 50;
    const cy = 50;
    const rInner = 8.5;
    const rOuter = 34.5;

    for (let i = 0; i < count; i++) {
      const angleDeg = i * (360 / count);
      const angleRad = (angleDeg * Math.PI) / 180;
      const x1 = cx + rInner * Math.sin(angleRad);
      const y1 = cy - rInner * Math.cos(angleRad);
      const x2 = cx + rOuter * Math.sin(angleRad);
      const y2 = cy - rOuter * Math.cos(angleRad);
      spokes.push({ id: i, x1, y1, x2, y2 });
    }
    return spokes;
  }, []);

  // Sequence scheduling
  useEffect(() => {
    // 1. Text Typewriter Reveal: Starts at 800ms, 60ms per character
    const typeStart = 800;
    for (let i = 1; i <= titleText.length; i++) {
      const t = window.setTimeout(() => {
        setDisplayedTitleLength(i);
      }, typeStart + (i * 65));
      timerRefs.current.push(t);
    }

    // 2. Scheduled auto-exit at (duration - 280ms)
    const exitTime = Math.max(1200, duration - 280);
    const exitTimer = window.setTimeout(() => {
      handleDismiss();
    }, exitTime);
    timerRefs.current.push(exitTimer);

    return () => {
      timerRefs.current.forEach(t => clearTimeout(t));
    };
  }, [duration, handleDismiss, titleText.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        y: isExiting ? -10 : 0
      }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.28,
        ease: 'easeInOut'
      }}
      onClick={handleDismiss}
      className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden select-none cursor-pointer"
      style={{
        backgroundColor: '#FCFCF9',
        color: '#0A192F'
      }}
      role="dialog"
      aria-label="Welcome Intro - LawSphere"
    >
      {/* 1. TOP OFFICIAL TRICOLOR STRIPE (0.4s draw left-to-right like an official sovereign letterhead) */}
      <div className="w-full relative top-0 left-0 right-0 overflow-hidden z-20">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left center' }}
          className="w-full flex flex-col shadow-xs"
        >
          {/* Saffron band */}
          <div className="h-[3px] w-full bg-[#FF9933]" />
          {/* White band with fine navy pin-stripe */}
          <div className="h-[2px] w-full bg-[#FFFFFF] relative flex items-center justify-center">
            <div className="h-[0.75px] w-full bg-[#000080]/20" />
          </div>
          {/* India Green band */}
          <div className="h-[3px] w-full bg-[#138808]" />
        </motion.div>
      </div>

      {/* Top Bar: Official Header Label & Skip Button */}
      <div className="w-full px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between z-30">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-slate-700 uppercase"
        >
          <Shield className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Government of India • Statutory Architecture</span>
        </motion.div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white/90 hover:bg-white border border-slate-300/80 shadow-xs hover:shadow transition-all cursor-pointer"
          title="Skip intro directly into LawSphere (Esc)"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-[#000080]" />
        </button>
      </div>

      {/* 2. CENTER STAGE: EMBLEM, LAW SPHERE ORBITS, ROTATING CHAKRA & SCALES */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-xl mx-auto -mt-6">
        
        {/* Emblem & LawSphere Orbital Shield (Fades in & scales 0.90 to 1.0 over 0.6s) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center mb-5"
        >
          {/* Soft pulsing luminous aura behind the emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.3, 1.45]
            }}
            transition={{
              duration: 1.2,
              delay: 0.35,
              ease: 'easeOut'
            }}
            className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0, 0, 128, 0.14) 0%, rgba(255, 153, 51, 0.1) 45%, transparent 70%)'
            }}
          />

          {/* Central Circular Emblem */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            
            {/* Outer LawSphere Orbital Rings (Representing jurisdictional sovereignty) */}
            <svg
              viewBox="0 0 120 120"
              className="absolute inset-0 w-full h-full text-[#000080]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer decorative orbit rim */}
              <circle cx="60" cy="60" r="56" stroke="#000080" strokeWidth="1.25" strokeOpacity="0.8" />
              <circle cx="60" cy="60" r="51" stroke="#FF9933" strokeWidth="0.8" strokeOpacity="0.65" strokeDasharray="3 3" />
              <circle cx="60" cy="60" r="46" stroke="#000080" strokeWidth="1" strokeOpacity="0.5" />
              
              {/* Four Cardinal Sovereignty Studs */}
              <circle cx="60" cy="4" r="2" fill="#FF9933" />
              <circle cx="116" cy="60" r="2" fill="#138808" />
              <circle cx="60" cy="116" r="2" fill="#FF9933" />
              <circle cx="4" cy="60" r="2" fill="#138808" />
            </svg>

            {/* Inner Rotating Ashoka Chakra (360° smooth continuous rotation representing eternal Dharma) */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute w-[68%] h-[68%] text-[#000080]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.2,
                ease: 'easeInOut'
              }}
              style={{ transformOrigin: 'center center' }}
            >
              {/* Chakra Rim */}
              <circle cx="50" cy="50" r="36" stroke="#000080" strokeWidth="2.2" />
              <circle cx="50" cy="50" r="34.5" stroke="#000080" strokeWidth="0.5" strokeOpacity="0.5" />
              
              {/* Center Hub */}
              <circle cx="50" cy="50" r="8" fill="#000080" />
              <circle cx="50" cy="50" r="3.2" fill="#FCFCF9" />

              {/* 24 Authentic Spokes */}
              {chakraSpokes.map((spoke) => (
                <line
                  key={spoke.id}
                  x1={spoke.x1}
                  y1={spoke.y1}
                  x2={spoke.x2}
                  y2={spoke.y2}
                  stroke="#000080"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              ))}
            </motion.svg>
          </div>
        </motion.div>

        {/* 3. SCALES OF JUSTICE ACCENT (Nyay Ka Tarazu) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
          className="flex items-center justify-center text-[#B45309] dark:text-[#F59E0B] mb-2.5"
          aria-hidden="true"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Center Pillar & Finial */}
            <path d="M12 3v17" />
            <path d="M9 21h6" />
            <circle cx="12" cy="3" r="1.2" fill="currentColor" />
            {/* Horizontal Balance Beam */}
            <path d="M4 7h16" />
            {/* Left Balance Pan */}
            <path d="M4 7l-2.2 6.5h6.4L6 7" />
            {/* Right Balance Pan */}
            <path d="M20 7l-2.2 6.5h6.4L22 7" />
          </svg>
        </motion.div>

        {/* 4. TEXT REVEAL: "LawSphere" */}
        <div className="text-center min-h-[44px] flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{
              fontFamily: 'Outfit, "Cinzel", Georgia, serif',
              letterSpacing: '-0.01em'
            }}
          >
            {/* Typewriter slice of LawSphere */}
            {(() => {
              const current = titleText.slice(0, displayedTitleLength);
              const lawPart = current.slice(0, 3);
              const spherePart = current.slice(3);
              return (
                <>
                  <span className="text-[#000080]">{lawPart}</span>
                  <span className="text-[#E65100]">{spherePart}</span>
                </>
              );
            })()}
            {displayedTitleLength < titleText.length && (
              <span className="inline-block w-[2.5px] h-7 sm:h-8 ml-1 bg-[#E65100] animate-pulse align-middle" />
            )}
          </h1>
        </div>

        {/* National Motto: Satyameva Jayate */}
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.4, ease: 'easeOut' }}
          className="mt-1 text-center"
        >
          <span 
            className="text-xs sm:text-sm font-bold text-[#8B4513] tracking-wider"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            सत्यमेव जयते
          </span>
          <span className="mx-2 text-slate-300">•</span>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wide">
            Truth Alone Triumphs
          </span>
        </motion.div>

        {/* Subtitle / Portal Identity */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 1.65, ease: 'easeInOut' }}
          className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 text-center max-w-md tracking-wide"
        >
          National Legal Information & Statutory Reference Portal
        </motion.p>

        {/* 5. LOADING DOCUMENT UNDERLINE INDICATOR */}
        <div className="w-52 sm:w-60 h-[2.5px] bg-slate-200 mt-4 overflow-hidden rounded-full">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.0,
              delay: 1.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{ transformOrigin: 'left center' }}
            className="h-full bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] w-full"
          />
        </div>
      </div>

      {/* Bottom Legal / Official Citation note & Tap Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.4, delay: 1.0, ease: 'easeInOut' }}
        className="w-full pb-4 sm:pb-6 text-center text-[10px] sm:text-[11px] text-slate-500 font-medium px-4"
      >
        <span>India Code • e-Gazette Verified Database • Tap or press Esc to enter</span>
      </motion.div>
    </motion.div>
  );
};
