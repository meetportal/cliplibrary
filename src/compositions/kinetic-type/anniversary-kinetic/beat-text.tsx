import type { ReactNode } from 'react';
import { Easing, interpolate } from 'remotion';
import { ramp } from '../../kit/motion';
import { mix } from './color';
import { Cascade, Collapse, Stack, Track, Wave } from './group-text';
import { Letters, Line } from './line';
import { pixelTween } from './pixel-tween';
import { fittedSize, type Scene } from './scene';
import { blurOf, middleOf, out, Plain, shredOf } from './text-fx';
import { type BeatKind, KINDER_FLASH_SHARE } from './timeline';

const Whip = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, width, palette } = scene;
  const x = pixelTween(local, [0, 6], [-width * 0.7, 0], out);
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      x={x}
      color={palette.ink}
      style={{ filter: blurOf(14 * (1 - ramp(local, 0, 6))) }}
    >
      <Letters
        text={scene.beat.text}
        styleOf={(index, count) => ({
          color: mix(palette.highlight, palette.secondary, count > 1 ? index / (count - 1) : 0),
        })}
      />
    </Line>
  );
};

const Shrink = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, length, palette, width } = scene;
  const unit = scene.measure(scene.beat.text, scene.face);
  const startScale = Math.min(1.6, (width * 0.98) / Math.max(1, unit * size));
  const scale = interpolate(local, [0, length * 0.55], [startScale, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={palette.ink}
      style={{ transform: `scale(${scale.toFixed(4)})` }}
    >
      <Letters
        text={scene.beat.text}
        styleOf={(index) => ({
          color: mix(palette.secondary, palette.ink, ramp(local, 3 + index * 1.2, 7 + index * 1.2)),
        })}
      />
    </Line>
  );
};

const DROP_FRAMES = 13;
const DROP_DEPTH = 0.4;

const Drop = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local } = scene;
  const rise = pixelTween(local, [0, DROP_FRAMES], [size * DROP_DEPTH, 0], Easing.out(Easing.quad));
  return (
    <Line face={scene.face} size={size} center={middleOf(scene)} color={scene.palette.ink}>
      <Letters
        text={scene.beat.text}
        styleOf={(index, count) =>
          index === count - 1
            ? { y: rise, opacity: ramp(local, 0, 2) }
            : { opacity: 0.4 + 0.6 * ramp(local, 0, 3) }
        }
      />
    </Line>
  );
};

const Typed = ({ scene, size, step }: { scene: Scene; size: number; step: number }) => {
  const { local } = scene;
  return shredOf(
    scene,
    0.6 * (1 - ramp(local, 0, 5)),
    size,
    local,
    <Line face={scene.face} size={size} center={middleOf(scene)} color={scene.palette.ink}>
      <Letters
        text={scene.beat.text}
        styleOf={(index) => ({
          opacity: ramp(local, index * step - 1, index * step + 3),
          y: (1 - ramp(local, index * step - 1, index * step + 3)) * size * 0.12,
        })}
      />
    </Line>,
  );
};

const Sweep = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, palette } = scene;
  const y = pixelTween(local, [0, 5], [size * 0.2, 0], out);
  return (
    <Line face={scene.face} size={size} center={middleOf(scene) + y} color={palette.accent}>
      <Letters
        text={scene.beat.text}
        styleOf={(index, count) => ({
          color:
            index < count / 2
              ? palette.accent
              : mix(palette.secondary, palette.accent, ramp(local, 2 + index, 7 + index)),
          opacity: 0.4 + 0.6 * ramp(local, 0, 2),
        })}
      />
    </Line>
  );
};

const Wipe = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, length } = scene;
  return shredOf(
    scene,
    ramp(local, length - 6, length, (t) => t),
    size,
    local,
    <Line face={scene.face} size={size} center={middleOf(scene)} color={scene.palette.ink}>
      <Letters
        text={scene.beat.text}
        styleOf={(index) => ({ opacity: ramp(local, index * 1.1 - 1.5, index * 1.1 + 3) })}
      />
    </Line>,
  );
};

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
      filter={blurOf(
        10 * (1 - ramp(scene.local, 0, 4)) + 9 * ramp(scene.local, scene.length - 4, scene.length),
      )}
    />
  ),
  shrink: (scene, size) => <Shrink scene={scene} size={size} />,
  rise: (scene, size) => (
    <Plain
      scene={scene}
      size={size}
      opacity={0.45 + 0.55 * ramp(scene.local, 0, 6)}
      y={pixelTween(scene.local, [0, 8], [size * 0.3, 0], out)}
    />
  ),
  drop: (scene, size) => <Drop scene={scene} size={size} />,
  cascade: (scene, size) => <Cascade scene={scene} size={size} />,
  blur: (scene, size) => (
    <Plain
      scene={scene}
      size={size}
      opacity={0.35 + 0.65 * ramp(scene.local, 0, 5)}
      filter={blurOf(12 * (1 - ramp(scene.local, 0, 5)))}
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
      opacity={0.4 + 0.6 * ramp(scene.local, 0, 3)}
      scale={1 + 0.14 * (1 - ramp(scene.local, 0, 5))}
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

export const BeatText = ({ scene }: { scene: Scene }) => {
  const { beat } = scene;
  const base = scene.size * (SCALE[beat.kind] ?? 1);
  const size = fittedSize(scene, beat.text, base, beat.kind === 'collapse' ? 0.04 : 0);
  return RENDERS[beat.kind](scene, size);
};
