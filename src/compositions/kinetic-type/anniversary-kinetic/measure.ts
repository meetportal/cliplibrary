import { useCallback, useEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { Face } from './fonts';

export type Measure = (text: string, face: Face, tracking?: number) => number;

const REFERENCE = 100;

const spec = (face: Face) => `${face.weight} ${REFERENCE}px "${face.family}"`;

let canvas: HTMLCanvasElement | null = null;

const context = () => {
  canvas ??= document.createElement('canvas');
  return canvas.getContext('2d');
};

const widthOf = (text: string, face: Face, tracking: number, loaded: boolean): number => {
  const letters = [...text].length;
  const ctx = loaded ? context() : null;
  if (ctx === null) {
    return letters * (0.58 + tracking);
  }
  ctx.font = spec(face);
  return ctx.measureText(text).width / REFERENCE + tracking * Math.max(0, letters - 1);
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
    const pending = delayRender('Loading the anniversary fonts');
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
    (text: string, face: Face, tracking = 0) => widthOf(text, face, tracking, loaded),
    [loaded],
  );
};
