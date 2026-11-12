import type { Sparkle } from './layout';

export type SparkleDrawing = { sparkle: Sparkle; grow: number; phase: number };

const PULSE = 44;
const SWAY = 90;

const starPath = (r: number) => {
  const k = 0.16 * r;
  return `M 0 ${-r} Q ${k} ${-k} ${r} 0 Q ${k} ${k} 0 ${r} Q ${-k} ${k} ${-r} 0 Q ${-k} ${-k} 0 ${-r} Z`;
};

const pulse = (frame: number, phase: number) => Math.sin((2 * Math.PI * frame) / PULSE + phase);

export const Stars = (props: { items: SparkleDrawing[]; frame: number; twinkle: number }) => (
  <>
    {props.items.map(({ sparkle, grow, phase }) => {
      const scale = grow * (1 + 0.16 * props.twinkle * pulse(props.frame, phase));
      const turn = 12 * props.twinkle * Math.sin((2 * Math.PI * props.frame) / SWAY + phase);
      if (scale <= 0.001) {
        return null;
      }
      return (
        <path
          key={phase}
          d={starPath(sparkle.r)}
          transform={`translate(${sparkle.x.toFixed(2)} ${sparkle.y.toFixed(2)}) rotate(${turn.toFixed(2)}) scale(${scale.toFixed(4)})`}
        />
      );
    })}
  </>
);

export const Halos = (props: {
  id: string;
  items: SparkleDrawing[];
  frame: number;
  twinkle: number;
  color: string;
}) => (
  <>
    <defs>
      <radialGradient id={props.id}>
        <stop offset="0" stopColor={props.color} stopOpacity={0.5} />
        <stop offset="0.35" stopColor={props.color} stopOpacity={0.2} />
        <stop offset="1" stopColor={props.color} stopOpacity={0} />
      </radialGradient>
    </defs>
    {props.items.map(({ sparkle, grow, phase }) => {
      const level = grow * props.twinkle * (0.5 + 0.5 * pulse(props.frame, phase));
      if (level <= 0.001) {
        return null;
      }
      return (
        <circle
          key={phase}
          cx={sparkle.x}
          cy={sparkle.y}
          r={sparkle.r * 3.4}
          fill={`url(#${props.id})`}
          opacity={level.toFixed(4)}
        />
      );
    })}
  </>
);
