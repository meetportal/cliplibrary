import { useCallback, useEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { Face } from './fonts';

export type TextBox = { width: number; ascent: number; descent: number; cap: number };

export type Measure = (text: string, face: Face) => TextBox;

const REFERENCE = 100;

const spec = (face: Face) => `${face.weight} ${REFERENCE}px "${face.family}"`;

const estimate = (text: string): TextBox => ({
  width: [...text].length * 0.55,
  ascent: 0.95,
  descent: 0.25,
  cap: 0.7,
});

let canvas: HTMLCanvasElement | null = null;

const context = () => {
  canvas ??= document.createElement('canvas');
  return canvas.getContext('2d');
};

const measureWith = (text: string, face: Face): TextBox => {
  const ctx = context();
  if (ctx === null) {
    return estimate(text);
  }
  ctx.font = spec(face);
  const whole = ctx.measureText(text === '' ? 'H' : text);
  return {
    width: text === '' ? 0 : whole.width / REFERENCE,
    ascent: whole.fontBoundingBoxAscent / REFERENCE,
    descent: whole.fontBoundingBoxDescent / REFERENCE,
    cap: ctx.measureText('HIEN').actualBoundingBoxAscent / REFERENCE,
  };
};

export const useMeasure = (faces: readonly Face[]): Measure => {
  const key = [...new Set(faces.map(spec))].join('|');
  const latest = useRef(faces);
  latest.current = faces;
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender('Loading the coming soon fonts');
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(key);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      latest.current.map((item) =>
        item.waitUntilDone().then(() => document.fonts.load(spec(item))),
      ),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [key, delayRender, continueRender]);
  useEffect(() => {
    if (ready === key && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, key, handle, continueRender]);
  const loaded = ready === key;
  return useCallback(
    (text: string, face: Face) => (loaded ? measureWith(text, face) : estimate(text)),
    [loaded],
  );
};

export const fitSize = (
  box: TextBox,
  size: number,
  tracking: number,
  letters: number,
  maxWidth: number,
): number => {
  const unitWidth = box.width + tracking * Math.max(0, letters - 1);
  return unitWidth <= 0 ? size : Math.min(size, maxWidth / unitWidth);
};

export const capTop = (box: TextBox, size: number): number =>
  (size * (1 + box.ascent - box.descent)) / 2 - box.cap * size;
