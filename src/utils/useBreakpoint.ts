import { useState, useEffect } from 'react';

export type BreakpointDevice =
  | 'small-phone'       // 320px–374px
  | 'phone'             // 375px–480px
  | 'large-phone'       // 481px–599px
  | 'tablet-portrait'   // 600px–899px
  | 'tablet-landscape'  // 900px–1199px
  | 'desktop';          // 1200px+

export interface BreakpointState {
  width: number;
  device: BreakpointDevice;
  isSmallPhone: boolean;       // 320-374px
  isPhoneOnly: boolean;        // 375-480px
  isLargePhone: boolean;       // 481-599px
  isPhone: boolean;            // < 600px
  isTabletPortrait: boolean;   // 600-899px
  isTabletLandscape: boolean;  // 900-1199px
  isTablet: boolean;           // 600-1199px
  isDesktop: boolean;          // >= 1200px
}

function getDevice(w: number): BreakpointDevice {
  if (w < 375) return 'small-phone';
  if (w < 481) return 'phone';
  if (w < 600) return 'large-phone';
  if (w < 900) return 'tablet-portrait';
  if (w < 1200) return 'tablet-landscape';
  return 'desktop';
}

function computeBreakpointState(width: number): BreakpointState {
  const device = getDevice(width);
  const isSmallPhone = width < 375;
  const isPhoneOnly = width >= 375 && width < 481;
  const isLargePhone = width >= 481 && width < 600;
  const isPhone = width < 600;
  const isTabletPortrait = width >= 600 && width < 900;
  const isTabletLandscape = width >= 900 && width < 1200;
  const isTablet = width >= 600 && width < 1200;
  const isDesktop = width >= 1200;

  return {
    width,
    device,
    isSmallPhone,
    isPhoneOnly,
    isLargePhone,
    isPhone,
    isTabletPortrait,
    isTabletLandscape,
    isTablet,
    isDesktop,
  };
}

export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return computeBreakpointState(w);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const currentWidth = window.innerWidth;
        // Avoid re-renders if width has not materially changed
        if (currentWidth === lastWidth) return;
        lastWidth = currentWidth;

        setState(prev => {
          const nextDevice = getDevice(currentWidth);
          // If the device bracket is the same and width delta is small, avoid unnecessary re-render churn
          if (prev.device === nextDevice && Math.abs(prev.width - currentWidth) < 20) {
            return prev;
          }
          return computeBreakpointState(currentWidth);
        });
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}
