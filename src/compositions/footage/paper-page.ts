import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export type PaperFinish = { paper: string; paperTint: number; softness: number };

export const paintPaperPage = (
  canvas: HTMLCanvasElement,
  [width, height]: readonly [number, number],
  finish: PaperFinish,
  draw: (context: CanvasRenderingContext2D) => void,
) => {
  const art = document.createElement('canvas');
  art.width = width;
  art.height = height;
  canvas.width = width;
  canvas.height = height;
  const context = art.getContext('2d');
  const target = canvas.getContext('2d');
  if (context === null || target === null) {
    return;
  }
  context.save();
  context.globalAlpha = finish.paperTint;
  context.fillStyle = finish.paper;
  context.fillRect(0, 0, width, height);
  context.restore();
  context.textBaseline = 'alphabetic';
  draw(context);
  target.filter = finish.softness > 0 ? `blur(${finish.softness * 2}px)` : 'none';
  target.drawImage(art, 0, 0);
};

export const useCanvasTexture = (paint: (canvas: HTMLCanvasElement) => void): THREE.Texture => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    paint(canvas);
    const made = new THREE.CanvasTexture(canvas);
    made.colorSpace = THREE.SRGBColorSpace;
    made.anisotropy = 16;
    return made;
  }, [paint]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};
