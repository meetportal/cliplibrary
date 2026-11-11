import { useMemo } from 'react';
import * as THREE from 'three';
import { font } from './assets';
import { seeded, type Vec3 } from './layout';

export const SHEET = { width: 0.8, height: 1.04 } as const;

const INK = '#4a4652';
const LIGHT_INK = '#8f8a96';
const PAPER = '#f1eef3';

const columns = (
  ctx: CanvasRenderingContext2D,
  random: () => number,
  x: number,
  y: number,
  width: number,
  height: number,
  count: number,
) => {
  const gap = 14;
  const column = (width - gap * (count - 1)) / count;
  for (let index = 0; index < count; index++) {
    const left = x + index * (column + gap);
    for (let line = y; line < y + height - 6; line += 11) {
      const short = random() < 0.12;
      ctx.fillStyle = LIGHT_INK;
      ctx.fillRect(left, line, short ? column * (0.4 + random() * 0.4) : column, 4);
    }
  }
};

const photo = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.fillStyle = '#76717d';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#9a95a1';
  ctx.fillRect(x + w * 0.1, y + h * 0.55, w * 0.8, h * 0.3);
};

const page = (draw: (ctx: CanvasRenderingContext2D) => void, width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, width, height);
    draw(ctx);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const frontPage = () =>
  page(
    (ctx) => {
      const random = seeded(11);
      ctx.fillStyle = INK;
      ctx.font = font('paper', 34);
      ctx.textAlign = 'center';
      ctx.fillText('THE DAILY HERALD', 200, 58);
      ctx.fillRect(22, 76, 356, 5);
      ctx.fillRect(22, 100, 230, 22);
      ctx.fillRect(22, 130, 180, 22);
      photo(ctx, 22, 172, 356, 130);
      columns(ctx, random, 22, 320, 356, 180, 3);
    },
    400,
    520,
  );

const spreadPage = () =>
  page(
    (ctx) => {
      const random = seeded(29);
      ctx.fillStyle = INK;
      ctx.fillRect(24, 24, 300, 18);
      ctx.fillRect(424, 24, 330, 18);
      photo(ctx, 210, 62, 160, 110);
      photo(ctx, 24, 320, 150, 100);
      columns(ctx, random, 24, 62, 170, 240, 2);
      columns(ctx, random, 186, 190, 184, 310, 2);
      columns(ctx, random, 24, 436, 150, 70, 1);
      columns(ctx, random, 424, 62, 352, 440, 3);
      ctx.fillStyle = '#d8d4dc';
      ctx.fillRect(397, 0, 6, 520);
    },
    800,
    520,
  );

const sheet = (uFrom: number, uTo: number, bow: number) => {
  const geometry = new THREE.PlaneGeometry(SHEET.width, SHEET.height, 12, 1);
  const position = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index) / (SHEET.width / 2);
    position.setZ(index, bow * (1 - x * x));
    uv.setX(index, uFrom + (uTo - uFrom) * uv.getX(index));
  }
  geometry.translate(SHEET.width / 2, 0, 0);
  geometry.computeVertexNormals();
  return geometry;
};

const usePaper = () =>
  useMemo(() => {
    const front = new THREE.MeshStandardMaterial({ map: frontPage(), roughness: 0.9 });
    const inside = new THREE.MeshStandardMaterial({ map: spreadPage(), roughness: 0.9 });
    return {
      front,
      inside,
      cover: sheet(0, 1, 0.035),
      left: sheet(0.5, 0, -0.035),
      right: sheet(0.5, 1, 0.035),
    };
  }, []);

export const Paper = ({ spine, angle, tilt }: { spine: Vec3; angle: number; tilt: number }) => {
  const paper = usePaper();
  return (
    <group position={spine} rotation={[tilt, 0, 0]}>
      <mesh geometry={paper.right} material={paper.inside} position={[0, 0, -0.012]} castShadow />
      <group rotation={[0, -angle, 0]}>
        <mesh geometry={paper.cover} material={paper.front} position={[0, 0, 0.012]} castShadow />
        <mesh
          geometry={paper.left}
          material={paper.inside}
          position={[0, 0, 0.004]}
          scale={[1, 1, -1]}
          castShadow
        />
      </group>
    </group>
  );
};
