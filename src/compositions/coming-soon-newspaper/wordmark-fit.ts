import { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import type { ComingSoonNewspaperProps } from '@/schemas';
import { wordmarkFont, wordmarkFontReady } from './fonts';

type Wordmark = ComingSoonNewspaperProps['wordmark'];

const RULE_WIDTH = 2;
const ROOM = 0.88;

let fontLoaded = false;

const useWordmarkFont = (): boolean => {
  const [ready, setReady] = useState(fontLoaded);
  useEffect(() => {
    if (ready) {
      return;
    }
    const handle = delayRender('Loading the wordmark font');
    wordmarkFontReady()
      .catch(() => undefined)
      .then(() => {
        fontLoaded = true;
        setReady(true);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [ready]);
  return ready;
};

const textWidth = (text: string, size: number, tracking: number): number => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null || text.trim() === '') {
    return 0;
  }
  context.font = `300 ${size}px "${wordmarkFont}"`;
  context.letterSpacing = `${size * tracking}px`;
  return Math.max(0, context.measureText(text).width - size * tracking);
};

export const useWordmarkScale = (wordmark: Wordmark, frameWidth: number): number => {
  const ready = useWordmarkFont();
  if (!ready) {
    return 1;
  }
  const parts = [
    textWidth(wordmark.brand, wordmark.size, wordmark.tracking),
    wordmark.ruleHeight > 0 ? RULE_WIDTH : 0,
    textWidth(wordmark.second, wordmark.size * wordmark.secondSize, wordmark.tracking),
  ].filter((width) => width > 0);
  const total =
    parts.reduce((sum, width) => sum + width, 0) + wordmark.gap * Math.max(0, parts.length - 1);
  return total <= 0 ? 1 : Math.min(1, (frameWidth * ROOM) / total);
};

export const WORDMARK_RULE_WIDTH = RULE_WIDTH;
