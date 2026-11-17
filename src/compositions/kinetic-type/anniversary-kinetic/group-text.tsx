import { ramp } from '../../kit/motion';
import { Line } from './line';
import { fittedSize, type Scene } from './scene';
import { appear, blurOf, glide, middleOf, shredOf } from './text-fx';

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
        text={scene.beat.text}
        styleOf={(index) => {
          const phase = local * 0.32 + index * 0.55 + line * 1.1;
          return { y: Math.sin(phase) * size * 0.1, rotate: Math.sin(phase + 0.8) * 7 };
        }}
      />
    )),
  );
};

const CASCADE = [
  { x: -0.36, y: -0.4, scale: 0.6 },
  { x: -0.08, y: -0.27, scale: 1 },
  { x: 0.16, y: -0.15, scale: 1 },
  { x: 0.4, y: -0.03, scale: 1 },
];

const CASCADE_SPEED = 4;

export const Cascade = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, width, height, palette } = scene;
  const slide = local * CASCADE_SPEED;
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
        text={scene.beat.text}
        style={{ transform: `translateX(${(spot.x * width + slide).toFixed(3)}px) rotate(-9deg)` }}
      />
    )),
  );
};

const STACK_GOING = [0.12, -0.08, 0.12];
const STACK_STRONG = [-0.05, 0.04, -0.05];
const WHIP_FRAMES = 7;
const WHIP_REACH = 0.24;
const RISE_FRAMES = 8;
const RISE_DEPTH = 0.15;

export const Stack = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, width, beat } = scene;
  const whip = beat.texture === 'streaks';
  const offsets = whip ? STACK_GOING : STACK_STRONG;
  const lineSize = fittedSize(scene, beat.text, size * 0.82) * 0.92;
  return offsets.map((offset, line) => {
    const lag = line === 1 ? 0 : 1;
    const reach = (line === 1 ? 0.5 : 1) * WHIP_REACH * width;
    const travel = whip
      ? 1 - ramp(local, lag, lag + WHIP_FRAMES, glide)
      : 1 - ramp(local, lag, lag + RISE_FRAMES, glide);
    const shown = appear(local - lag, 4);
    return (
      <Line
        key={`${offset}-${line}`}
        face={scene.face}
        size={lineSize}
        center={
          middleOf(scene) +
          (line - 1) * lineSize * 1.08 +
          (whip ? 0 : lineSize * RISE_DEPTH * travel)
        }
        x={offset * width + (whip ? reach * travel : 0)}
        color={scene.palette.ink}
        text={beat.text}
        style={{
          opacity: (line === 1 ? 1 : 0.62) * shown,
          filter: whip ? blurOf(12 * travel) : 'none',
        }}
      />
    );
  });
};

const spreadOf = (index: number, count: number, spread: number) =>
  (index - (count - 1) / 2) * spread;

const TRACK_STEP = 1.6;
const TRACK_FALL = 8;
const TRACK_HEIGHT = 0.45;

export const Track = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, length } = scene;
  const together = ramp(local, 0, Math.max(10, length * 0.6), glide);
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      text={scene.beat.text}
      tracking={0.03}
      styleOf={(index, count) => {
        const fall = ramp(local, index * TRACK_STEP, index * TRACK_STEP + TRACK_FALL, glide);
        return {
          opacity: ramp(local, index * TRACK_STEP - 1.5, index * TRACK_STEP + 2.5),
          x: spreadOf(index, count, size * 0.2) * (1 - together),
          y: -size * TRACK_HEIGHT * (1 - fall),
        };
      }}
    />
  );
};

const COLLAPSE_SHARE = 0.92;
const COLLAPSE_FRAMES = 10;

export const Collapse = ({ scene, size }: { scene: Scene; size: number }) => {
  const { local, beat, width } = scene;
  const gaps = Math.max(1, [...beat.text].length - 1);
  const room = width * COLLAPSE_SHARE - scene.measure(beat.text, scene.face, 0.04) * size;
  const spread = Math.max(0, Math.min(size * 0.66, room / gaps));
  const together = ramp(local, 0, COLLAPSE_FRAMES, glide);
  return (
    <Line
      face={scene.face}
      size={size}
      center={middleOf(scene)}
      color={scene.palette.ink}
      text={scene.beat.text}
      tracking={0.04}
      style={{ opacity: appear(local, 4) }}
      styleOf={(index, count) => ({ x: spreadOf(index, count, spread) * (1 - together) })}
    />
  );
};
