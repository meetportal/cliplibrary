import { useCallback } from 'react';
import type * as THREE from 'three';
import type { ComingSoonNewspaperProps } from '@/schemas';
import { paintPaperPage, useCanvasTexture } from '../footage/paper-page';
import { useSpreadFonts } from './fonts';
import { drawLeftPage } from './page-left';
import { drawRightPage } from './page-right';

export type SpreadSide = 'left' | 'right';

const PAGE_SIZE = [1000, 1700] as const;

export const useSpreadTexture = (
  side: SpreadSide,
  props: ComingSoonNewspaperProps,
  photo: HTMLImageElement | null,
): THREE.Texture => {
  useSpreadFonts();
  const { leftPage, rightPage, photos, ink, print } = props;
  const { softness, paperTint } = print;
  const paint = useCallback(
    (canvas: HTMLCanvasElement) => {
      const copy = { leftPage, rightPage, photos, ink, print: { softness, paperTint } };
      const draw = side === 'left' ? drawLeftPage : drawRightPage;
      paintPaperPage(canvas, PAGE_SIZE, { paper: ink.paper, paperTint, softness }, (context) =>
        draw(context, copy, photo, [PAGE_SIZE[0], PAGE_SIZE[1]]),
      );
    },
    [side, leftPage, rightPage, photos, ink, softness, paperTint, photo],
  );
  return useCanvasTexture(paint);
};
