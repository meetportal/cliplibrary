import * as THREE from 'three';
import { seeded } from './layout';

const paint = (width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    draw(ctx);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};

export const ripplesTexture = () => {
  const texture = paint(512, 512, (ctx) => {
    const random = seeded(41);
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    ctx.filter = 'blur(3px)';
    for (let index = 0; index < 420; index++) {
      const light = random() < 0.5;
      const shade = light ? 150 + random() * 60 : 50 + random() * 40;
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${0.35 + random() * 0.4})`;
      const x = random() * 512;
      const y = random() * 512;
      const w = 4 + random() * 10;
      const h = 30 + random() * 90;
      for (const dx of [-512, 0, 512]) {
        for (const dy of [-512, 0, 512]) {
          ctx.beginPath();
          ctx.ellipse(x + dx, y + dy, w / 2, h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

export const shoreFadeTexture = () =>
  paint(256, 4, (ctx) => {
    const fade = ctx.createLinearGradient(0, 0, 256, 0);
    fade.addColorStop(0, 'rgb(0,0,0)');
    fade.addColorStop(0.5, 'rgb(0,0,0)');
    fade.addColorStop(0.85, 'rgb(170,170,170)');
    fade.addColorStop(1, 'rgb(255,255,255)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, 256, 4);
  });

export const glitterTexture = () =>
  paint(256, 1024, (ctx) => {
    const random = seeded(77);
    ctx.clearRect(0, 0, 256, 1024);
    ctx.filter = 'blur(2px)';
    for (let index = 0; index < 900; index++) {
      const y = random() * 1024;
      const spread = 0.5 * (0.25 + 0.75 * (1 - y / 1024));
      const x = 128 + (random() - 0.5) * 256 * spread * (random() + random());
      const along = 1 - y / 1024;
      const ends = Math.min(1, along * 6) * Math.min(1, (1 - along) * 12);
      ctx.fillStyle = `rgba(255,255,255,${(0.25 + random() * 0.5) * ends})`;
      ctx.fillRect(x, y, 6 + random() * 18, 2 + random() * 3);
    }
    ctx.filter = 'blur(24px)';
    const core = ctx.createLinearGradient(0, 0, 256, 0);
    core.addColorStop(0, 'rgba(255,255,255,0)');
    core.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    core.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = core;
    ctx.fillRect(40, 60, 176, 900);
  });
