const LAYERS = 6;
const MIN_DASH = 0.0005;
const TAIL_FADE = 0.06;

type SoftStrokeProps = {
  d: string;
  drawn: number;
  undrawn: number;
  soft: number;
  color: string;
  width: number;
};

export const SoftStroke = (props: SoftStrokeProps) => {
  const step = props.soft / (LAYERS - 1);
  const head = props.drawn * (1 + props.soft);
  const tail = props.undrawn * (1 + props.soft);
  const fade = Math.min(1, (1 - props.undrawn) / TAIL_FADE);
  if (fade <= 0) {
    return null;
  }
  return (
    <>
      {Array.from({ length: LAYERS }, (_, layer) => {
        const from = Math.max(0, tail - (LAYERS - 1 - layer) * step);
        const to = Math.min(1, head - layer * step);
        if (to - from <= MIN_DASH) {
          return null;
        }
        return (
          <path
            key={layer}
            d={props.d}
            pathLength={1}
            fill="none"
            stroke={props.color}
            strokeOpacity={fade / (LAYERS - layer)}
            strokeWidth={props.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${(to - from).toFixed(5)} 3`}
            strokeDashoffset={(-from).toFixed(5)}
          />
        );
      })}
    </>
  );
};
