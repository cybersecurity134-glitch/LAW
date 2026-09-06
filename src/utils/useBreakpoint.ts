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

export function useBreakpoint(): BreakpointState {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      // Debounce slightly for smooth performance
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    // Initial sync
    setWidth(window.innerWidth);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

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
