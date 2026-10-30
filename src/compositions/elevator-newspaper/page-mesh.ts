import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ElevatorNewspaperProps } from '@/schemas';
import { type Quad, squareToQuad } from './homography';
import { drawPage, type PageSide } from './page-art';
import { usePageFonts } from './page-fonts';

const SEGMENTS = 16;

export const gridGeometry = (): THREE.BufferGeometry => {
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= SEGMENTS; row += 1) {
    for (let column = 0; column <= SEGMENTS; column += 1) {
      uvs.push(column / SEGMENTS, 1 - row / SEGMENTS);
    }
  }
  for (let row = 0; row < SEGMENTS; row += 1) {
    for (let column = 0; column < SEGMENTS; column += 1) {
      const a = row * (SEGMENTS + 1) + column;
      const b = a + SEGMENTS + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array((SEGMENTS + 1) ** 2 * 3), 3),
  );
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
};

export const placeGrid = (
  geometry: THREE.BufferGeometry,
  quad: Quad,
  width: number,
  height: number,
): void => {
  const warp = squareToQuad(quad);
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  for (let row = 0; row <= SEGMENTS; row += 1) {
    for (let column = 0; column <= SEGMENTS; column += 1) {
      const [x, y] = warp(column / SEGMENTS, row / SEGMENTS);
      position.setXYZ(row * (SEGMENTS + 1) + column, x - width / 2, height / 2 - y, 0);
    }
  }
  position.needsUpdate = true;
  geometry.computeBoundingSphere();
};

export const usePageTexture = (
  side: PageSide,
  props: ElevatorNewspaperProps,
  photo: HTMLImageElement | null,
): THREE.Texture => {
  usePageFonts();
  const { masthead, cover, story, ink, print } = props;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    drawPage(canvas, side, { masthead, cover, story, ink, softness: print.softness }, photo);
    const made = new THREE.CanvasTexture(canvas);
    made.colorSpace = THREE.SRGBColorSpace;
    made.anisotropy = 16;
    return made;
  }, [side, masthead, cover, story, ink, print.softness, photo]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};
