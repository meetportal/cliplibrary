import { Easing, interpolate } from 'remotion';
import { ramp } from '../../kit/motion';
import { Letters, Line } from './line';
import { pixelTween } from './pixel-tween';
import { fittedSize, type Scene } from './scene';
import { blurOf, middleOf, out, shredOf } from './text-fx';

export const Wave = ({ scene }: { scene: Scene }) => {
  const { local, props } = scene;
  const count = props.opening.leanInRepeats;
  const size = fittedSize(scene, scene.beat.text, scene.size * 0.86);
  const gap = size * 1.08;
  const lines = Array.from({ length: count }, (_, line) => line);
  return shredOf(
    scene,
    1 - ramp(local, 0, 5),
    size * count,
    local,
    lines.map((line) => (
      <Line
        key={line}
        face={scene.face}
        size={size}
        center={middleOf(scene) + (line - (count - 1) / 2) * gap}
        color={scene.palette.ink}
      >
        <Letters
          text={scene.beat.text}
          styleOf={(index) => {
            const phase = local * 0.32 + index * 0.55 + line * 1.1;
            return { y: Math.sin(phase) * size * 0.1, rotate: Math.sin(phase + 0.8) * 7 + 0.01 };
          }}
        />
      </Line>
    )),
  );
};

const CASCADE = [
  { x: -0.36, y: -0.4, scale: 0.6 },
  { x: -0.08, y: -0.27, scale: 1 },
  { x: 0.16, y: -0.15, scale: 1 },
  { x: 0.4, y: -0.03, scale: 1 },
];

export const Cascade = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, width, height, palette } = scene;
  const slide = Math.round(local * 4);
  return shredOf(
    scene,
    1 - ramp(local, 0, 5),
    height * 0.7,
    local,
    CASCADE.map((spot) => (
      <Line
        key={spot.x}
        face={scene.face}
        size={size * spot.scale}
        center={middleOf(scene) + spot.y * height + slide}
        color={palette.secondary}
        style={{ transform: `translateX(${Math.round(spot.x * width + slide)}px) rotate(-9deg)` }}
      >
        {scene.beat.text}
      </Line>
    )),
  );
};

const STACK_GOING = [0.12, -0.08, 0.12];
const STACK_STRONG = [-0.05, 0.04, -0.05];

export const Stack = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, width, beat } = scene;
  const whip = beat.texture === 'streaks';
  const offsets = whip ? STACK_GOING : STACK_STRONG;
  const lineSize = fittedSize(scene, beat.text, size * 0.82) * 0.92;
  return offsets.map((offset, line) => {
    const lag = line === 1 ? 0 : 1 + line;
    const x = whip ? pixelTween(local, [lag, lag + 6], [width * 0.8, 0], out) : 0;
    const y = whip ? 0 : pixelTween(local, [lag, lag + 6], [lineSize * 0.3, 0], out);
    const fade = 0.4 + 0.6 * ramp(local, lag, lag + 3);
    return (
      <Line
        key={`${offset}-${line}`}
        face={scene.face}
        size={lineSize}
        center={middleOf(scene) + (line - 1) * lineSize * 1.08 + y}
        x={offset * width + x}
        color={scene.palette.ink}
        style={{
          opacity: (line === 1 ? 1 : 0.62) * (whip ? 1 : fade),
          filter: whip ? blurOf(12 * (1 - ramp(local, lag, lag + 6))) : 'none',
        }}
      >
        {beat.text}
      </Line>
    );
  });
};

const spreadOf = (index: number, count: number, spread: number) =>
  (index - (count - 1) / 2) * spread;

export const Track = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, length } = scene;
  const settle = Math.max(8, Math.round(length * 0.6));
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      style={{ letterSpacing: '0.03em' }}
    >
      <Letters
        text={scene.beat.text}
        styleOf={(index, count) => ({
          opacity: ramp(local, index * 1.6 - 1.5, index * 1.6 + 2),
          x: pixelTween(local, [0, settle], [spreadOf(index, count, size * 0.2), 0], out),
          y: pixelTween(local, [index * 1.6, index * 1.6 + 6], [-size * 0.7, 0], out),
        })}
      />
    </Line>
  );
};

const COLLAPSE_SHARE = 0.92;

export const Collapse = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, beat, width } = scene;
  const gaps = Math.max(1, [...beat.text].length - 1);
  const room = width * COLLAPSE_SHARE - scene.measure(beat.text, scene.face, 0.04) * size;
  const spread = Math.max(0, Math.min(size * 0.66, room / gaps));
  const fade = interpolate(local, [0, 4], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      style={{ letterSpacing: '0.04em', opacity: fade }}
    >
      <Letters
        text={scene.beat.text}
        styleOf={(index, count) => ({
          x: pixelTween(
            local,
            [0, 9],
            [spreadOf(index, count, spread), 0],
            Easing.out(Easing.quad),
          ),
        })}
      />
    </Line>
  );
};
