import { lerp } from '../../kit/motion';
import { BAR_WIDTH, barEdge, wipeTrailingEdge } from './draw-decor';
import { type Block, type Layout, OPENER_SCALE, type Punch } from './layout';
import { drawSprite, type Placement } from './sprites';
import { FRAME } from './text-fit';
import {
  accelerate,
  BEATS,
  eased,
  exitAlpha,
  settle,
  smooth,
  type WordBeat,
  wordState,
} from './timeline';

type Context = CanvasRenderingContext2D;

const ECHO_DRIFT = 0.15;

export type Scene = { context: Context; frame: number; ratio: number; y: number; push: number };

const drawBlock = (scene: Scene, block: Block, place: Omit<Placement, 'y'> & { y: number }) => {
  const scale = place.scale ?? 1;
  for (const line of block.lines) {
    drawSprite(scene.context, line.sprite, { ...place, y: place.y + line.dy * scale }, scene.ratio);
  }
};

type Motion = { scale: number; alpha: number; blur: number };

const standard = (scene: Scene, beat: WordBeat, from = 1.22): Motion | null => {
  const state = wordState(scene.frame, beat);
  if (!state.visible) {
    return null;
  }
  const enter = settle(state.enter);
  const exit = accelerate(state.exit);
  const fade = 1 - exitAlpha(state.exit);
  return {
    scale: lerp(from, 1, enter) * (1 + scene.push * state.seconds) * lerp(1, 0.84, exit),
    alpha: Math.min(1, state.enter * 2.2) * (1 - fade),
    blur: lerp(14, 0, enter) + exit * 16,
  };
};

export const drawOpener = (scene: Scene, layout: Layout) => {
  const state = wordState(scene.frame, BEATS.opener);
  if (!state.visible) {
    return;
  }
  const zoom = eased(scene.frame, { from: 0, to: 26 }, smooth);
  const exit = accelerate(state.exit);
  const grown = lerp(OPENER_SCALE, 1, zoom);
  const scale = grown * (1 + scene.push * state.seconds) * lerp(1, 0.84, exit);
  const anchored = FRAME.centerX + (layout.opener.width / 2) * (grown - 1);
  const reveal = barEdge(scene.frame) + BAR_WIDTH;
  const { context } = scene;
  context.save();
  if (reveal > 0) {
    context.beginPath();
    context.rect(reveal, 0, FRAME.width, FRAME.height);
    context.clip();
  }
  drawBlock(scene, layout.opener, {
    x: anchored,
    y: scene.y,
    scale,
    alpha: exitAlpha(state.exit),
    blur: exit * 16,
  });
  context.restore();
};

export const drawGlitch = (scene: Scene, layout: Layout, amount: number) => {
  const motion = standard(scene, BEATS.glitch, 1.08);
  if (motion === null) {
    return;
  }
  const state = wordState(scene.frame, BEATS.glitch);
  const strength = amount * (0.25 + 0.75 * (1 - settle(state.enter))) * (1 - smooth(state.exit));
  const split = 26 * strength * (0.8 + 0.2 * Math.sin(scene.frame * 0.4));
  const place = { x: FRAME.centerX, y: scene.y, scale: motion.scale, blur: motion.blur };
  const { main, left, right } = layout.glitch;
  drawBlock(scene, left, {
    ...place,
    x: place.x - split,
    alpha: motion.alpha * 0.85 * Math.min(1, strength * 3),
  });
  drawBlock(scene, right, {
    ...place,
    x: place.x + split,
    alpha: motion.alpha * 0.85 * Math.min(1, strength * 3),
  });
  const { context } = scene;
  const bands = 5;
  const top = scene.y - (main.height * motion.scale) / 2 - main.size * 0.3;
  const height = (main.height * motion.scale + main.size * 0.6) / bands;
  for (let band = 0; band < bands; band++) {
    const shift = 34 * strength * Math.sin(scene.frame * 0.31 + band * 1.9);
    context.save();
    context.beginPath();
    context.rect(0, top + band * height + height * 0.08, FRAME.width, height * 0.84);
    context.clip();
    drawBlock(scene, main, { ...place, x: place.x + shift, alpha: motion.alpha });
    context.restore();
  }
};

export const drawStandard = (scene: Scene, block: Block, beat: WordBeat) => {
  const motion = standard(scene, beat);
  if (motion !== null) {
    drawBlock(scene, block, { x: FRAME.centerX, y: scene.y, ...motion });
  }
};

export const drawLight = (scene: Scene, layout: Layout) => {
  const state = wordState(scene.frame, BEATS.light);
  if (!state.visible) {
    return;
  }
  const enter = settle(state.enter);
  const exit = accelerate(state.exit);
  const scale = lerp(1.08, 1, enter) * (1 + scene.push * state.seconds) * lerp(1, 0.84, exit);
  const alpha = exitAlpha(state.exit);
  const { context } = scene;
  context.save();
  const edge = wipeTrailingEdge(scene.frame);
  if (edge > 0) {
    context.beginPath();
    context.rect(edge, 0, FRAME.width, FRAME.height);
    context.clip();
  }
  context.translate(FRAME.centerX, scene.y);
  context.scale(scale, scale);
  const local = { ...scene, ratio: scene.ratio };
  for (const part of [layout.light.word, layout.light.accent]) {
    if (part !== null) {
      drawSprite(
        context,
        part.sprite,
        { x: part.dy - FRAME.centerX, y: 0, alpha, blur: exit * 16 },
        local.ratio,
      );
    }
  }
  const mark = layout.light.mark;
  if (mark !== null && alpha > 0) {
    context.globalAlpha = alpha;
    context.fillStyle = mark.color;
    context.fillRect(mark.x - FRAME.centerX, mark.y, mark.width, mark.height);
  }
  context.restore();
};

export const drawPunch = (scene: Scene, punch: Punch, beat: WordBeat, gap: number) => {
  const state = wordState(scene.frame, beat);
  if (!state.visible) {
    return;
  }
  const grow = settle(state.enter);
  const exit = accelerate(state.exit);
  const fade = exitAlpha(state.exit);
  const scale = lerp(0.55, 1, grow) * (1 + scene.push * state.seconds) * lerp(1, 0.84, exit);
  const blur = exit * 16;
  const spread =
    settle(Math.max(0, (state.enter - 0.45) / 0.55)) * (1 + ECHO_DRIFT * state.seconds);
  const count = punch.echoes.length;
  for (let at = count - 1; at >= 0; at--) {
    const echo = punch.echoes[at];
    if (echo === undefined) {
      continue;
    }
    const step = (at + 1) * spread;
    drawBlock(scene, echo, {
      x: FRAME.centerX,
      y: scene.y + step * gap * 0.9 * scale,
      scale: scale * (1 + (step * gap) / 260),
      alpha: fade * Math.min(1, spread * 3),
      blur,
    });
  }
  const ink = smooth(Math.max(0, Math.min(1, (state.enter - 0.3) / 0.5)));
  const place = { x: FRAME.centerX, y: scene.y, scale, blur };
  drawBlock(scene, punch.accent, {
    ...place,
    alpha: fade * Math.min(1, state.enter * 3) * (1 - ink),
  });
  drawBlock(scene, punch.face, { ...place, alpha: fade * ink });
};
