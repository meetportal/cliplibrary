import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { useEffect, useMemo, useState } from 'react';
import { useDelayRender } from 'remotion';
import type { CtaEndCardFont } from '@/schemas';

export type Face = {
  family: string;
  weight: number;
  tracking: number;
  ready: () => Promise<unknown>;
};

type Loaded = { fontFamily: string; waitUntilDone: () => Promise<unknown> };

const face = (loaded: Loaded, weight: number, tracking: number): Face => ({
  family: loaded.fontFamily,
  weight,
  tracking,
  ready: loaded.waitUntilDone,
});

const LATIN = { subsets: ['latin' as const, 'latin-ext' as const] };

export const HEADLINE_FACES: Record<CtaEndCardFont, Face> = {
  'inter-tight': face(loadInterTight('normal', { weights: ['700'], ...LATIN }), 700, -0.045),
  sora: face(loadSora('normal', { weights: ['600'], ...LATIN }), 600, -0.04),
  outfit: face(loadOutfit('normal', { weights: ['600'], ...LATIN }), 600, -0.03),
};

const inter = loadInter('normal', { weights: ['400', '500', '600'], ...LATIN });

export const BODY_FACE = face(inter, 400, 0);
export const CAPTION_FACE = face(inter, 500, 0);
export const LABEL_FACE = face(inter, 600, -0.01);

const REFERENCE = 100;

const spec = (font: Face) => `${font.weight} ${REFERENCE}px "${font.family}"`;

const useFontsReady = (faces: readonly Face[]): boolean => {
  const wanted = faces.map(spec).join('|');
  const [ready, setReady] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the end card fonts ${wanted}`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setReady(wanted);
      } else {
        continueRender(pending);
      }
    };
    Promise.all(
      wanted
        .split('|')
        .map((one, at) =>
          (faces[at]?.ready() ?? Promise.resolve()).then(() => document.fonts.load(one)),
        ),
    ).then(finish, finish);
    return () => {
      active = false;
    };
  }, [wanted, faces, delayRender, continueRender]);
  useEffect(() => {
    if (ready === wanted && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [ready, wanted, handle, continueRender]);
  return ready === wanted;
};

export type Measure = { text: string; face: Face; tracking: number };

const widthOf = ({ text, face: font, tracking }: Measure, ready: boolean): number => {
  const chars = [...text].length;
  const spacing = (font.tracking + tracking) * REFERENCE * chars;
  const context =
    !ready || typeof document === 'undefined'
      ? null
      : document.createElement('canvas').getContext('2d');
  if (context === null) {
    return chars * REFERENCE * 0.6 + spacing;
  }
  context.font = spec(font);
  return context.measureText(text).width + spacing;
};

export const useWidths = (items: readonly Measure[]): number[] => {
  const faces = useMemo(() => [...new Set(items.map((item) => item.face))], [items]);
  const ready = useFontsReady(faces);
  return useMemo(() => items.map((item) => widthOf(item, ready) / REFERENCE), [items, ready]);
};
