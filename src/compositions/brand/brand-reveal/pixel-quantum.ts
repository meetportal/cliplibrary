import { useCurrentScale } from 'remotion';

export const usePixelQuantum = (): number => {
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
  return Math.max(1, Math.round(1 / Math.max(0.01, scale * device)));
};
