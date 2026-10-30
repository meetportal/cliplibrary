import { useLoader } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { staticFile } from 'remotion';
import * as THREE from 'three';
import type { ElevatorNewspaperProps } from '@/schemas';
import { type Quad, squareToQuad } from './homography';
import { drawPage, type PageSide } from './page-art';
import { usePageFonts } from './page-fonts';

const SEGMENTS = 16;
const ABSOLUTE = /^(https?:|data:|blob:|\/)/;

const resolveImage = (value: string): string => (ABSOLUTE.test(value) ? value : staticFile(value));

const gridGeometry = (): THREE.BufferGeometry => {
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

const placeGrid = (
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

const usePageTexture = (
  side: PageSide,
  props: ElevatorNewspaperProps,
  photo: HTMLImageElement | null,
): THREE.Texture => {
  usePageFonts();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    drawPage(canvas, side, props, photo);
    const made = new THREE.CanvasTexture(canvas);
    made.colorSpace = THREE.SRGBColorSpace;
    made.anisotropy = 16;
    return made;
  }, [side, props, photo]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

type PageProps = {
  side: PageSide;
  props: ElevatorNewspaperProps;
  quad: Quad;
  light: number;
  width: number;
  height: number;
};

const PageMesh = ({
  side,
  props,
  quad,
  light,
  width,
  height,
  photo,
}: PageProps & { photo: HTMLImageElement | null }) => {
  const texture = usePageTexture(side, props, photo);
  const geometry = useMemo(gridGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  placeGrid(geometry, quad, width, height);
  const tone = 1 - props.print.shading * (1 - Math.min(1, light));
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={props.print.strength}
        color={new THREE.Color(tone, tone, tone)}
        toneMapped={false}
        depthTest={false}
      />
    </mesh>
  );
};

const PhotoPage = (page: PageProps & { src: string }) => {
  const photo = useLoader(THREE.ImageLoader, resolveImage(page.src));
  return <PageMesh {...page} photo={photo} />;
};

export const TrackedPage = (page: PageProps & { src: string }) =>
  page.src === '' ? <PageMesh {...page} photo={null} /> : <PhotoPage {...page} />;
