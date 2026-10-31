import { useCallback } from 'react';
import type * as THREE from 'three';
import type { ElevatorNewspaperProps } from '@/schemas';
import { useCanvasTexture } from '../footage/paper-page';
import { usePageFonts } from './page-fonts';
import { drawPage, type PageSide } from './page-layout';

export const usePageTexture = (
  side: PageSide,
  props: ElevatorNewspaperProps,
  photo: HTMLImageElement | null,
): THREE.Texture => {
  usePageFonts();
  const { masthead, cover, story, ink, print } = props;
  const { softness, paperTint } = print;
  const paint = useCallback(
    (canvas: HTMLCanvasElement) =>
      drawPage(
        canvas,
        side,
        { masthead, cover, story, ink, print: { softness, paperTint } },
        photo,
      ),
    [side, masthead, cover, story, ink, softness, paperTint, photo],
  );
  return useCanvasTexture(paint);
};
