import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { ramp } from '../../kit/motion';
import { mix, mixLch } from './color';
import { Cascade, Collapse, Stack, Track, Wave } from './group-text';
import { Line } from './line';
import { fittedSize, type Scene } from './scene';
import { appear, blurOf, fade, glide, middleOf, Plain, settle, shredOf } from './text-fx';
import { type BeatKind, KINDER_FLASH_SHARE } from './timeline';

const WHIP_FRAMES = 6;
const WHIP_REACH = 0.16;

const Whip = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, width, palette } = scene;
  const travel = 1 - ramp(local, 0, WHIP_FRAMES, Easing.inOut(Easing.quad));
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      x={-width * WHIP_REACH * travel}
      color={palette.ink}
      text={scene.beat.text}
      style={{ filter: blurOf(14 * travel), opacity: appear(local, 3) }}
      styleOf={(index, count) => ({
        color: mixLch(palette.highlight, palette.secondary, count > 1 ? index / (count - 1) : 0),
      })}
    />
  );
};

const Shrink = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, length, palette, width } = scene;
  const unit = scene.measure(scene.beat.text, scene.face);
  const startScale = Math.min(1.6, (width * 0.98) / Math.max(1, unit * size));
  const scale = interpolate(local, [0, length * 0.7], [startScale, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={palette.ink}
      text={scene.beat.text}
      style={{ transform: `scale(${scale.toFixed(5)})` }}
      styleOf={(index) => ({
        color: mix(palette.secondary, palette.ink, ramp(local, index * 1.2, 7 + index * 1.2, fade)),
      })}
    />
  );
};

const DROP_FRAMES = 14;
const DROP_DEPTH = 0.4;

const Drop = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local } = scene;
  const rise = size * DROP_DEPTH * (1 - ramp(local, 0, DROP_FRAMES, glide));
  return shredOf(
    scene,
    1 - ramp(local, 0, 4),
    size,
    local,
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      text={scene.beat.text}
      styleOf={(index, count) =>
        index === count - 1 ? { y: rise, opacity: appear(local, 3) } : {}
      }
    />,
  );
};

const TYPE_RISE = 0.08;
const TYPE_FRAMES = 6;

const Typed = ({ scene, size, step }: { scene: Scene; size: number; step: number }) => {
  const { local } = scene;
  return shredOf(
    scene,
    0.6 * (1 - ramp(local, 0, 5)),
    size,
    local,
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      text={scene.beat.text}
      styleOf={(index) => {
        const shown = ramp(local, index * step - 1, index * step - 1 + TYPE_FRAMES, settle);
        return { opacity: shown, y: (1 - shown) * size * TYPE_RISE };
      }}
    />,
  );
};

const SWEEP_FRAMES = 8;

const Sweep = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, palette } = scene;
  const y = size * 0.12 * (1 - ramp(local, 0, SWEEP_FRAMES, glide));
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene) + y}
      color={palette.accent}
      text={scene.beat.text}
      style={{ opacity: appear(local, 3) }}
      styleOf={(index, count) => ({
        color:
          index < count / 2
            ? palette.accent
            : mix(palette.secondary, palette.accent, ramp(local, 2 + index, 7 + index, fade)),
      })}
    />
  );
};

const Wipe = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, length } = scene;
  return shredOf(
    scene,
    ramp(local, length - 6, length, Easing.in(Easing.quad)),
    size,
    local,
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      text={scene.beat.text}
      styleOf={(index) => ({ opacity: ramp(local, index * 1.1 - 1.5, index * 1.1 + 3) })}
    />,
  );
};

const SLAB_GROW = 0.08;
const SLAB_FRAMES = 8;

const RISE_FRAMES = 10;
const RISE_DEPTH = 0.16;

type Render = (scene: Scene, size: number) => ReactNode;

const glitched: Render = (scene, size) =>
  shredOf(
    scene,
    1 - ramp(scene.local, 0, 7),
    size,
    scene.local,
    <Plain scene={scene} size={size} />,
  );

const RENDERS: Record<BeatKind, Render> = {
  glitch: glitched,
  number: glitched,
  wave: (scene) => <Wave scene={scene} />,
  whip: (scene, size) => <Whip scene={scene} size={size} />,
  news: (scene, size) => (
    <Plain
      scene={scene}
      size={size}
      opacity={appear(scene.local, 3)}
      filter={blurOf(
        10 * (1 - ramp(scene.local, 0, 6)) +
          9 * ramp(scene.local, scene.length - 5, scene.length, Easing.in(Easing.quad)),
      )}
    />
  ),
  shrink: (scene, size) => <Shrink scene={scene} size={size} />,
  rise: (scene, size) => (
    <Plain
      scene={scene}
      size={size}
      opacity={appear(scene.local, 4)}
      y={size * RISE_DEPTH * (1 - ramp(scene.local, 0, RISE_FRAMES, glide))}
    />
  ),
  drop: (scene, size) => <Drop scene={scene} size={size} />,
  cascade: (scene, size) => <Cascade scene={scene} size={size} />,
  blur: (scene, size) => (
    <Plain
      scene={scene}
      size={size}
      opacity={appear(scene.local, Math.min(5, scene.length - 3))}
      filter={blurOf(12 * (1 - ramp(scene.local, 0, Math.min(7, scene.length - 3))))}
    />
  ),
  type: (scene, size) => <Typed scene={scene} size={size} step={1.6} />,
  sweep: (scene, size) => <Sweep scene={scene} size={size} />,
  stack: (scene, size) => <Stack scene={scene} size={size} />,
  track: (scene, size) => <Track scene={scene} size={size} />,
  band: (scene, size) => <Typed scene={scene} size={size} step={1.4} />,
  slab: (scene, size) => (
    <Plain
      scene={scene}
      size={size}
      opacity={appear(scene.local, 3)}
      scale={1 + SLAB_GROW * (1 - ramp(scene.local, 0, SLAB_FRAMES, glide))}
    />
  ),
  collapse: (scene, size) => <Collapse scene={scene} size={size} />,
  flash: (scene, size) =>
    shredOf(
      scene,
      1 - ramp(scene.local, 0, Math.max(2, scene.length * KINDER_FLASH_SHARE)),
      size,
      scene.local,
      <Plain scene={scene} size={size} />,
    ),
  wipe: (scene, size) => <Wipe scene={scene} size={size} />,
};

const SCALE: Partial<Record<BeatKind, number>> = {
  number: 2.1,
  track: 0.9,
  collapse: 0.8,
  band: 1.15,
};

type Hold = { grow: number; x: number; y: number };

const RISING: Hold = { grow: 0.03, x: 0, y: -0.35 };
const CONTRACTING: Hold = { grow: -0.02, x: 0, y: 0 };

const HOLDS: Partial<Record<BeatKind, Hold>> = {
  shrink: CONTRACTING,
  slab: CONTRACTING,
  collapse: CONTRACTING,
  track: { grow: 0, x: 0, y: 0.35 },
  whip: { grow: 0, x: 0.4, y: 0 },
  cascade: { grow: 0, x: 0, y: 0 },
};

const STACK_HOLDS: Record<'going' | 'strong', Hold> = {
  going: { grow: 0, x: -0.4, y: 0 },
  strong: { grow: 0, x: 0, y: -0.35 },
};

const holdOf = (scene: Scene): Hold => {
  if (scene.beat.kind === 'stack') {
    return STACK_HOLDS[scene.beat.texture === 'streaks' ? 'going' : 'strong'];
  }
  return HOLDS[scene.beat.kind] ?? RISING;
};

export const BeatText = ({ scene }: { scene: Scene }) => {
  const { beat } = scene;
  const base = scene.size * (SCALE[beat.kind] ?? 1);
  const size = fittedSize(scene, beat.text, base, beat.kind === 'collapse' ? 0.04 : 0);
  const hold = holdOf(scene);
  const push = 1 + (hold.grow * scene.local) / Math.max(1, scene.length);
  const x = hold.x * scene.local;
  const y = hold.y * scene.local;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px) scale(${push.toFixed(5)})`,
      }}
    >
      {RENDERS[beat.kind](scene, size)}
    </AbsoluteFill>
  );
};
