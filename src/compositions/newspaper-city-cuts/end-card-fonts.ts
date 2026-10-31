import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

const upright = loadCormorant('normal', { weights: ['500'], subsets: ['latin'] });
const italic = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });

export const endCardFont = upright.fontFamily;

let ready = false;

const loading = Promise.all([upright.waitUntilDone(), italic.waitUntilDone()])
  .catch(() => undefined)
  .then(() => {
    ready = true;
  });

export const useEndCardFonts = (): boolean => {
  const [loaded, setLoaded] = useState(ready);
  const [handle] = useState(() => (ready ? null : delayRender('Loading end card fonts')));
  useEffect(() => {
    if (handle === null) {
      return;
    }
    loading.then(
      () => {
        setLoaded(true);
        continueRender(handle);
      },
      () => continueRender(handle),
    );
  }, [handle]);
  return loaded;
};

let measurer: CanvasRenderingContext2D | null = null;

export const fittedFontSize = (
  text: string,
  { size, style, tracking, room }: { size: number; style: string; tracking: number; room: number },
): number => {
  measurer ??= document.createElement('canvas').getContext('2d');
  if (measurer === null || text === '') {
    return size;
  }
  measurer.font = `${style} 500 ${size}px "${endCardFont}"`;
  measurer.letterSpacing = `${size * tracking}px`;
  const width = measurer.measureText(text).width;
  return width > room ? (size * room) / width : size;
};
