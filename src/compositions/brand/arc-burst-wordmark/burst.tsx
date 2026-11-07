import { Easing, interpolateColors } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import { type Point, seeded, type WordLayout } from './layout';
import { burstOut, progress, settle, smooth, type Timeline } from './timeline';

const SPARKLES = 14;
const SPLIT_AXIS = 0.42;
const SPLIT_OVERLAP = 0.1;
const CLOSING = 7;
const irisOpen = Easing.bezier(0.45, 0, 0.25, 1);

const circle = (center: Point, radius: number) =>
  `M ${(center.x - radius).toFixed(2)} ${center.y.toFixed(2)} a ${radius.toFixed(2)} ${radius.toFixed(2)} 0 1 0 ${(radius * 2).toFixed(2)} 0 a ${radius.toFixed(2)} ${radius.toFixed(2)} 0 1 0 ${(-radius * 2).toFixed(2)} 0`;

const irisRadii = (frame: number, line: Timeline, word: WordLayout) => {
  const length = line.burstEnd - line.burstAt;
  return {
    outer: word.reach * progress(frame, [line.burstAt - 2, line.burstAt + length * 0.62], burstOut),
    inner: word.reach * progress(frame, [line.burstAt + 1, line.burstEnd], irisOpen),
  };
};

const Sparkles = ({
  frame,
  word,
  line,
  color,
  inner,
  outer,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  color: string;
  inner: number;
  outer: number;
}) => {
  const fade = 1 - progress(frame, [line.burstEnd - 4, line.burstEnd + 6], Easing.linear);
  const appear = progress(frame, [line.burstAt, line.burstAt + 3], Easing.linear);
  if (fade <= 0 || appear <= 0) {
    return null;
  }
  return (
    <g opacity={fade * appear}>
      {Array.from({ length: SPARKLES }, (_, index) => {
        const [sa, sd, ss] = seeded(`arc-burst-sparkle-${index}`, 3);
        const angle = (sa ?? 0) * Math.PI * 2;
        const distance = outer * (0.3 + (sd ?? 0) * 0.62);
        const visible = Math.max(0, Math.min(1, (distance - inner) / 40));
        if (visible <= 0) {
          return null;
        }
        return (
          <circle
            key={`sparkle-${index}`}
            cx={word.center.x + Math.cos(angle) * distance}
            cy={word.center.y + Math.sin(angle) * distance}
            r={word.reach * (0.004 + (ss ?? 0) * 0.007)}
            fill={color}
            opacity={visible}
          />
        );
      })}
    </g>
  );
};

const Iris = ({
  frame,
  word,
  line,
  props,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
}) => {
  const { outer, inner } = irisRadii(frame, line, word);
  return (
    <>
      <path
        d={`${circle(word.center, outer)} ${inner > 0 ? circle(word.center, inner) : ''}`}
        fill={props.colors.primary}
        fillRule="evenodd"
      />
      {props.showBackground && inner > 0 ? (
        <path d={circle(word.center, inner)} fill={props.colors.background} />
      ) : null}
      <Sparkles
        frame={frame}
        word={word}
        line={line}
        color={props.colors.comet}
        inner={inner}
        outer={outer}
      />
    </>
  );
};

const splitGap = (frame: number, line: Timeline, word: WordLayout) => {
  const radius = word.reach * 2;
  const open = word.reach * 2 + 40;
  const overlap = -radius * SPLIT_OVERLAP;
  const closing = progress(
    frame,
    [line.burstAt - 1 - CLOSING, line.burstAt - 1],
    Easing.in(Easing.quad),
  );
  const opening = progress(frame, [line.burstAt - 1, line.burstEnd], settle);
  return { radius, gap: open + (overlap - open) * closing + (open - overlap) * opening };
};

const Split = ({
  frame,
  word,
  line,
  props,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
}) => {
  const { radius, gap } = splitGap(frame, line, word);
  const axis = { x: Math.cos(SPLIT_AXIS), y: Math.sin(SPLIT_AXIS) };
  const offset = radius + gap / 2;
  const dim = progress(frame, [line.burstAt, line.burstEnd], smooth);
  const front = interpolateColors(dim, [0, 1], [props.colors.primary, props.colors.field]);
  const back = interpolateColors(
    dim * 0.7 + 0.18,
    [0, 1],
    [props.colors.primary, props.colors.field],
  );
  const first = { x: word.center.x - axis.x * offset, y: word.center.y - axis.y * offset };
  const second = { x: word.center.x + axis.x * offset, y: word.center.y + axis.y * offset };
  return (
    <>
      <path d={circle(second, radius)} fill={back} />
      <path d={circle(first, radius)} fill={front} />
    </>
  );
};

const burstActive = (frame: number, line: Timeline, props: ArcBurstWordmarkProps) =>
  props.burst.style === 'split'
    ? frame >= line.burstAt - 1 - CLOSING && frame < line.burstEnd
    : frame >= line.burstAt - 2 && frame < line.burstEnd;

export const stageShown = (frame: number, line: Timeline, props: ArcBurstWordmarkProps) =>
  props.burst.style === 'split' ? frame >= line.burstAt : frame >= line.burstEnd;

export const Burst = (props: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
}) => {
  if (!burstActive(props.frame, props.line, props.props)) {
    return null;
  }
  return props.props.burst.style === 'split' ? <Split {...props} /> : <Iris {...props} />;
};
