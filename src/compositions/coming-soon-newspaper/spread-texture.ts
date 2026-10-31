import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ComingSoonNewspaperProps } from '@/schemas';
import { useSpreadFonts } from './fonts';
import { drawLeftPage } from './page-left';
import { drawRightPage } from './page-right';
import type { SpreadCopy } from './spread-type';

export type SpreadSide = 'left' | 'right';

const PAGE_WIDTH = 1000;
const PAGE_HEIGHT = 1700;

const drawSpreadPage = (
  canvas: HTMLCanvasElement,
  side: SpreadSide,
  copy: SpreadCopy,
  photo: CanvasImageSource | null,
) => {
  const art = document.createElement('canvas');
  art.width = PAGE_WIDTH;
  art.height = PAGE_HEIGHT;
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const context = art.getContext('2d');
  const target = canvas.getContext('2d');
  if (context === null || target === null) {
    return;
  }
  context.save();
  context.globalAlpha = copy.print.paperTint;
  context.fillStyle = copy.ink.paper;
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.restore();
  context.textBaseline = 'alphabetic';
  const draw = side === 'left' ? drawLeftPage : drawRightPage;
  draw(context, copy, photo, [PAGE_WIDTH, PAGE_HEIGHT]);
  target.filter = copy.print.softness > 0 ? `blur(${copy.print.softness * 2}px)` : 'none';
  target.drawImage(art, 0, 0);
};

export const useSpreadTexture = (
  side: SpreadSide,
  props: ComingSoonNewspaperProps,
  photo: HTMLImageElement | null,
): THREE.Texture => {
  useSpreadFonts();
  const { leftPage, rightPage, photos, ink, print } = props;
  const { softness, paperTint } = print;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const copy = { leftPage, rightPage, photos, ink, print: { softness, paperTint } };
    drawSpreadPage(canvas, side, copy, photo);
    const made = new THREE.CanvasTexture(canvas);
    made.colorSpace = THREE.SRGBColorSpace;
    made.anisotropy = 16;
    return made;
  }, [side, leftPage, rightPage, photos, ink, softness, paperTint, photo]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};
