import { loadFont } from '@remotion/google-fonts/LuckiestGuy';
import { useEffect, useState } from 'react';
import { useDelayRender } from 'remotion';

const luckiest = loadFont('normal', { weights: ['400'], subsets: ['latin', 'latin-ext'] });

export const STACK_FAMILY = luckiest.fontFamily;

const REFERENCE = 100;

const spec = (size: number) => `400 ${size}px "${STACK_FAMILY}"`;

type FontMetrics = { cap: number; ascent: number; descent: number };

export type Measurer = {
  advance: (text: string) => number;
  metrics: FontMetrics;
};

export const makeMeasurer = (ready: boolean): Measurer => {
  const context = ready ? document.createElement('canvas').getContext('2d') : null;
  if (context === null) {
    return {
      advance: (text) => [...text].length * 0.6,
      metrics: { cap: 0.72, ascent: 0.8, descent: 0.2 },
    };
  }
  context.font = spec(REFERENCE);
  const sample = context.measureText('HAMBURGEFONTS');
  return {
    advance: (text) => context.measureText(text).width / REFERENCE,
    metrics: {
      cap: sample.actualBoundingBoxAscent / REFERENCE,
      ascent: sample.actualBoundingBoxAscent / REFERENCE,
      descent: sample.actualBoundingBoxDescent / REFERENCE,
    },
  };
};

export const useStackFont = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the chunky type stack font');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(true);
      } else {
        continueRender(pending);
      }
    };
    luckiest
      .waitUntilDone()
      .then(() => document.fonts.load(spec(REFERENCE), 'A&'))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [delayRender, continueRender]);
  useEffect(() => {
    if (ready && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, handle, continueRender]);
  return ready;
};
