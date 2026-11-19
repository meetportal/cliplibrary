import { lerp } from '../../kit/motion';
import type { LogoBox } from '../../kit/use-logo-box';
import type { Scene } from './draw-words';
import type { Contact } from './end-layout';
import type { Layout } from './layout';
import type { Palette } from './palette';
import { drawSprite } from './sprites';
import { FRAME, type Glyph } from './text-fit';
import {
  accelerate,
  DECOR,
  eased,
  exitAlpha,
  NAME_PUSH,
  nameBeat,
  progress,
  type Span,
  settle,
  smooth,
  wordState,
} from './timeline';

type Context = CanvasRenderingContext2D;

const GLYPH_FRAMES = 12;
const GLYPH_SHARE_MAX = 0.75;
const END_NAME_RISE = 16;

const typeOn = (
  scene: Scene,
  glyphs: Glyph[],
  span: Span,
  options: { rise: number; blur: number; fade?: number; haze?: number },
) => {
  const fade = options.fade ?? 1;
  const haze = options.haze ?? 0;
  const count = Math.max(1, glyphs.length);
  const share = Math.min(
    GLYPH_SHARE_MAX,
    Math.max(GLYPH_FRAMES / (span.to - span.from), 2.5 / count + 0.12),
  );
  glyphs.forEach((glyph, index) => {
    const start = count === 1 ? 0 : (index / (count - 1)) * (1 - share);
    const raw = Math.max(0, Math.min(1, (progress(scene.frame, span) - start) / share));
    if (raw <= 0) {
      return;
    }
    const own = settle(raw);
    drawSprite(
      scene.context,
      glyph.sprite,
      {
        x: glyph.x,
        y: glyph.y + (1 - own) * options.rise,
        alpha: (0.5 - 0.5 * Math.cos(Math.PI * raw)) * fade,
        blur: (1 - own) * options.blur + haze,
      },
      scene.ratio,
    );
  });
};

export const drawName = (scene: Scene, layout: Layout) => {
  const beat = nameBeat(layout.name.timing);
  const state = wordState(scene.frame, beat);
  if (!state.visible) {
    return;
  }
  const exit = accelerate(state.exit);
  const scale = (1 + scene.push * NAME_PUSH * state.seconds) * lerp(1, 0.84, exit);
  const { context } = scene;
  context.save();
  context.translate(FRAME.centerX, scene.y);
  context.scale(scale, scale);
  context.translate(-FRAME.centerX, -scene.y);
  typeOn(scene, layout.name.glyphs, beat.enter, {
    rise: 0,
    blur: layout.name.size * 0.22,
    fade: exitAlpha(state.exit),
    haze: exit * 16,
  });
  context.restore();
};

const archPath = (
  context: Context,
  width: number,
  height: number,
  radius: number,
  foot: number,
) => {
  const left = -width / 2;
  const top = -height / 2;
  const r = Math.min(radius, width / 2, height);
  context.beginPath();
  context.roundRect(left, top, width, height, [r, r, foot, foot]);
};

export type LogoImage = { image: HTMLImageElement; box: LogoBox } | null;

const plateSize = (frame: number, plate: Layout['end']['plate']) => ({
  width: lerp(
    Math.min(64, plate.width),
    plate.width,
    eased(frame, { from: DECOR.plate.from + 6, to: DECOR.plate.to }, settle),
  ),
  height: lerp(
    6,
    plate.height,
    eased(frame, { from: DECOR.plate.from, to: DECOR.plate.from + 20 }),
  ),
});

const fitInside = (
  frame: number,
  plate: Layout['end']['plate'],
  logo: { width: number; height: number },
  shown: boolean,
) => {
  if (!shown) {
    return 1;
  }
  const size = plateSize(frame, plate);
  const padX = plate.width - logo.width;
  const padY = plate.height - logo.height;
  return Math.max(
    0,
    Math.min(1, (size.width - padX) / logo.width, (size.height - padY) / logo.height),
  );
};

export const drawPlate = (
  scene: Scene,
  layout: Layout,
  palette: Palette,
  logo: LogoImage,
  options: { plate: boolean; y: number },
) => {
  const { plate } = layout.end;
  const { context, frame } = scene;
  if (frame < DECOR.plate.from) {
    return;
  }
  context.save();
  context.translate(FRAME.centerX, options.y);
  if (options.plate) {
    const round = eased(frame, { from: DECOR.plate.from + 12, to: DECOR.plate.to });
    const { width, height } = plateSize(frame, plate);
    context.fillStyle = palette.surface;
    archPath(context, width, height, lerp(0, plate.radius, round), lerp(0, 18, round));
    context.fill();
    if (palette.plateRim !== null) {
      context.strokeStyle = palette.plateRim;
      context.lineWidth = 3;
      context.stroke();
    }
  }
  const show = settle(progress(frame, DECOR.logo));
  if (logo !== null && plate.logo !== null && show > 0) {
    const scale = lerp(0.86, 1, show) * fitInside(frame, plate, plate.logo, options.plate);
    const { box, image } = logo;
    const w = plate.logo.width * scale;
    const h = plate.logo.height * scale;
    context.globalAlpha = Math.min(1, show * 1.4);
    context.drawImage(
      image,
      box.x * image.naturalWidth,
      box.y * image.naturalHeight,
      box.w * image.naturalWidth,
      box.h * image.naturalHeight,
      -w / 2,
      -h / 2,
      w,
      h,
    );
  }
  context.restore();
};

const icon = (
  context: Context,
  kind: Contact['icon'],
  x: number,
  y: number,
  size: number,
  color: string,
) => {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = Math.max(1.5, size * 0.09);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  const r = size * 0.42;
  context.beginPath();
  if (kind === 'globe') {
    context.arc(x, y, r, 0, Math.PI * 2);
    context.moveTo(x - r, y);
    context.lineTo(x + r, y);
    context.moveTo(x + r * 0.42, y);
    context.ellipse(x, y, r * 0.42, r, 0, 0, Math.PI * 2);
  } else if (kind === 'mail') {
    context.roundRect(x - r, y - r * 0.72, r * 2, r * 1.44, r * 0.18);
    context.moveTo(x - r, y - r * 0.6);
    context.lineTo(x, y + r * 0.1);
    context.lineTo(x + r, y - r * 0.6);
  } else {
    context.moveTo(x - r * 0.55, y - r);
    context.quadraticCurveTo(x - r * 1.05, y - r * 0.2, x - r * 0.1, y + r * 0.7);
    context.quadraticCurveTo(x + r * 0.5, y + r * 1.15, x + r, y + r * 0.55);
    context.lineTo(x + r * 0.55, y + r * 0.1);
    context.lineTo(x + r * 0.15, y + r * 0.35);
    context.lineTo(x - r * 0.35, y - r * 0.15);
    context.lineTo(x - r * 0.1, y - r * 0.55);
    context.closePath();
  }
  context.stroke();
  context.restore();
};

const drawContact = (
  scene: Scene,
  contact: Contact,
  span: Span,
  palette: Palette,
  icons: boolean,
) => {
  const size = contact.size;
  const show = settle(progress(scene.frame, span));
  if (show <= 0) {
    return;
  }
  const y = contact.y + (1 - show) * 18;
  if (icons) {
    scene.context.save();
    scene.context.globalAlpha = show;
    icon(scene.context, contact.icon, contact.x - size * 0.95, y, size, palette.muted);
    scene.context.restore();
  }
  drawSprite(scene.context, contact.sprite, { x: contact.x, y, alpha: show }, scene.ratio);
};

export const drawEndText = (scene: Scene, layout: Layout, palette: Palette, icons: boolean) => {
  const { end } = layout;
  if (end.name !== null) {
    const raw = progress(scene.frame, DECOR.endName);
    if (raw > 0) {
      drawSprite(
        scene.context,
        end.name.sprite,
        {
          x: FRAME.centerX,
          y: end.name.y + (1 - settle(raw)) * END_NAME_RISE,
          alpha: 0.5 - 0.5 * Math.cos(Math.PI * raw),
        },
        scene.ratio,
      );
    }
  }
  typeOn(scene, end.tagline, DECOR.tagline, {
    rise: end.taglineSize * 0.35,
    blur: end.taglineSize * 0.25,
  });
  if (end.underline !== null) {
    const draw = eased(scene.frame, DECOR.underline, smooth);
    if (draw > 0) {
      const { from, to, y } = end.underline;
      scene.context.save();
      scene.context.fillStyle = palette.underline;
      scene.context.fillRect(from, y, (to - from) * draw, Math.max(2, end.taglineSize * 0.07));
      scene.context.restore();
    }
  }
  if (end.website !== null) {
    drawContact(scene, end.website, DECOR.website, palette, icons);
  }
  for (const contact of end.contacts) {
    drawContact(scene, contact, DECOR.contacts, palette, icons);
  }
};
