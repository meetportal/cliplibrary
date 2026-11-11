import * as THREE from 'three';
import { mix } from './color';
import { seeded } from './layout';

const canvasTexture = (
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  srgb: boolean,
) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    draw(ctx);
  }
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.anisotropy = 8;
  return texture;
};

export const towerTexture = (walls: string) =>
  canvasTexture(
    256,
    768,
    (ctx) => {
      const random = seeded(3);
      ctx.fillStyle = mix(walls, '#3b3048', 0.55);
      ctx.fillRect(0, 0, 256, 768);
      for (let row = 0; row < 30; row++) {
        for (let column = 0; column < 7; column++) {
          const lit = random() < 0.42;
          ctx.fillStyle = lit ? '#ffd79a' : mix(walls, '#1b1524', 0.75);
          ctx.fillRect(14 + column * 34, 16 + row * 25, 22, 13);
        }
      }
    },
    true,
  );

export const surfTexture = () => {
  const texture = canvasTexture(
    512,
    512,
    (ctx) => {
      ctx.clearRect(0, 0, 512, 512);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineCap = 'round';
      ctx.filter = 'blur(2.5px)';
      const lines = [
        { x: 90, width: 11, amplitude: 9, phase: 0 },
        { x: 250, width: 8, amplitude: 12, phase: 1.7 },
        { x: 400, width: 9, amplitude: 8, phase: 3.1 },
      ];
      for (const line of lines) {
        ctx.lineWidth = line.width;
        ctx.beginPath();
        for (let y = -16; y <= 528; y += 4) {
          const wave = Math.sin((y / 512) * Math.PI * 4 + line.phase) * line.amplitude;
          const x = line.x + wave + Math.sin((y / 512) * Math.PI * 10 + line.phase) * 3;
          if (y === -16) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    },
    false,
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};
