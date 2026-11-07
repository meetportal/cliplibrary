import { Easing, interpolateColors } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import { ARC_STYLES, arcPath, type Point, seeded, strokeFor, type WordLayout } from './layout';
import { progress, type Timeline } from './timeline';

const TAIL_SAMPLES = 10;
const TAIL_SPACING = 0.5;

const SwirlArcs = ({
  frame,
  word,
  line,
  props,
  frameSize,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
  frameSize: { width: number; height: number };
}) => {
  const unit = frameSize.width * 0.0058;
  const pull = progress(frame, [line.burstAt - 16, line.burstAt + 4], Easing.in(Easing.quad));
  const fade = 1 - progress(frame, [line.burstAt, line.burstEnd]);
  if (fade <= 0) {
    return null;
  }
  return (
    <g opacity={fade}>
      {Array.from({ length: props.swirl.arcs }, (_, index) => {
        const [sx, sy, sr, sa, ss, sd, sl, sp] = seeded(`arc-burst-swirl-${index}`, 8);
        const home = {
          x: word.center.x + ((sx ?? 0.5) - 0.5) * frameSize.width * 0.72,
          y: word.center.y + ((sy ?? 0.5) - 0.5) * frameSize.height * 0.66,
        };
        const center = {
          x: home.x + (word.center.x - home.x) * pull * 0.55,
          y: home.y + (word.center.y - home.y) * pull * 0.55,
        };
        const radius =
          (frameSize.height * 0.05 + (sr ?? 0.5) * frameSize.height * 0.2) * (1 - 0.3 * pull);
        const direction = (sd ?? 0) > 0.5 ? 1 : -1;
        const rotation =
          (sa ?? 0) * Math.PI * 2 +
          direction * props.swirl.spin * (0.05 + (ss ?? 0) * 0.07) * frame;
        const span = (0.7 + (sl ?? 0) * 1.9) * (0.65 + 0.35 * Math.sin(frame / 8 + (sp ?? 0) * 6));
        const style = ARC_STYLES[index % ARC_STYLES.length] ?? 'thin';
        return (
          <path
            key={`swirl-${index}`}
            d={arcPath(center, radius, rotation, rotation + span * direction)}
            fill="none"
            stroke={props.colors.primary}
            {...strokeFor(style, unit)}
          />
        );
      })}
    </g>
  );
};

const cometAt = (
  time: number,
  start: number,
  travel: number,
  origin: Point,
  far: number,
  angle: number,
  turn: number,
) => {
  const p = Math.max(0, Math.min(1, (time - start) / travel));
  const radius = far * (1 - p ** 1.4);
  const theta = angle + turn * p;
  return { x: origin.x + radius * Math.cos(theta), y: origin.y + radius * Math.sin(theta), p };
};

const Comets = ({
  frame,
  word,
  line,
  props,
  frameSize,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
  frameSize: { width: number; height: number };
}) => {
  if (frame >= line.burstAt) {
    return null;
  }
  const head = frameSize.width * 0.0075;
  return (
    <g>
      {Array.from({ length: props.swirl.comets }, (_, index) => {
        const [sa, st, sw] = seeded(`arc-burst-comet-${index}`, 3);
        const travel = 34 + (st ?? 0) * 16;
        const start = line.burstAt - travel;
        const angle = (index / Math.max(1, props.swirl.comets)) * Math.PI * 2 + (sa ?? 0) * 0.8;
        const turn = 1.1 + (sw ?? 0) * 0.7;
        const at = (time: number) =>
          cometAt(time, start, travel, word.center, word.reach + head * 4, angle, turn);
        const now = at(frame);
        if (now.p <= 0) {
          return null;
        }
        const trail = Array.from({ length: TAIL_SAMPLES + 1 }, (_sample, sample) =>
          at(frame - sample * TAIL_SPACING),
        );
        const left: Point[] = [];
        const right: Point[] = [];
        trail.forEach((point, k) => {
          const next = trail[Math.min(trail.length - 1, k + 1)] ?? point;
          const previous = trail[Math.max(0, k - 1)] ?? point;
          const dx = next.x - previous.x;
          const dy = next.y - previous.y;
          const length = Math.hypot(dx, dy) || 1;
          const half = head * 0.85 * (1 - k / TAIL_SAMPLES);
          left.push({ x: point.x - (dy / length) * half, y: point.y + (dx / length) * half });
          right.push({ x: point.x + (dy / length) * half, y: point.y - (dx / length) * half });
        });
        const outline = [...left, ...right.reverse()]
          .map((point, k) => `${k === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
          .join(' ');
        const color = interpolateColors(
          now.p,
          [0.45, 0.9],
          [props.colors.comet, props.colors.primary],
        );
        return (
          <g key={`comet-${index}`}>
            <path d={`${outline} Z`} fill={props.colors.comet} opacity={0.85} />
            <circle cx={now.x} cy={now.y} r={head} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

export const Swirl = (props: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
  frameSize: { width: number; height: number };
}) => (
  <>
    <SwirlArcs {...props} />
    <Comets {...props} />
  </>
);
