'use client';

import { useEffect, useState } from 'react';

export const usePlayhead = (readStep: () => number | null, loop: number): number | null => {
  const [step, setStep] = useState<number | null>(null);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const raw = readStep();
      setStep(raw === null ? null : raw % loop);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [readStep, loop]);
  return step;
};
