import { pathData, type Stroke } from './geometry';

const TAPER_LENGTH = 4;
const CELL = 9;
const LEVELS = 12;
const THINNEST = 0.3;
const VANISH_BIAS = 0.5;
const VANISH_SPREAD = 0.24;
const VANISH_FADE = 0.26;

const crumbHash = (index: number, salt: number) => {
  const value = Math.sin(index * 91.3 + salt * 17.9) * 43758.5453;
  return value - Math.floor(value);
};

export type Vanish = { bias: number; spread: number; fade: number };

const STROKE_VANISH: Vanish = { bias: VANISH_BIAS, spread: VANISH_SPREAD, fade: VANISH_FADE };

export const vanishAlpha = (
  erased: number,
  along: number,
  noise: number,
  vanish: Vanish = STROKE_VANISH,
) =>
  Math.max(
    0,
    Math.min(1, (vanish.bias * along + vanish.spread * noise + vanish.fade - erased) / vanish.fade),
  );

type Run = { from: number; to: number; level: number };

const runsFor = (length: number, drawn: number, erased: number): Run[] => {
  if (erased <= 0) {
    return [{ from: 0, to: drawn, level: LEVELS }];
  }
  const runs: Run[] = [];
  let cursor = 0;
  for (let index = 0; cursor < drawn; index++) {
    const from = cursor;
    const to = Math.min(drawn, from + CELL * (0.45 + crumbHash(index, 6) * 1.1));
    cursor = to;
    const level = Math.round(vanishAlpha(erased, from / length, crumbHash(index, 4)) * LEVELS);
    const last = runs.at(-1);
    if (level === 0) {
      continue;
    }
    if (last !== undefined && last.level === level && Math.abs(last.to - from) < 0.01) {
      last.to = to;
    } else {
      runs.push({ from, to, level });
    }
  }
  return runs;
};

const widthAt = (level: number) => THINNEST + (1 - THINNEST) * (level / LEVELS);

const dashFor = (runs: readonly Run[], drawn: number, width: number) => {
  const pieces = runs.map((run) => {
    const inset = (width * widthAt(run.level)) / 2;
    const from = run.from > 0 ? run.from + inset : run.from;
    const to = run.to < drawn ? run.to - inset : run.to;
    const middle = (run.from + run.to) / 2;
    return to > from ? { from, to } : { from: middle, to: middle };
  });
  const parts: number[] = [];
  pieces.forEach((piece, index) => {
    const next = pieces[index + 1];
    parts.push(piece.to - piece.from, next === undefined ? 99999 : next.from - piece.to);
  });
  return {
    array: parts.map((value) => value.toFixed(2)).join(' '),
    offset: (-(pieces[0]?.from ?? 0)).toFixed(2),
  };
};

export const PencilStroke = ({
  shape,
  progress,
  erased = 0,
  width,
  color,
}: {
  shape: Stroke;
  progress: number;
  erased?: number;
  width: number;
  color: string;
}) => {
  if (progress <= 0 || erased >= 1) {
    return null;
  }
  const drawn = shape.length * Math.min(1, progress);
  const taper = Math.min(1, 0.4 + (0.6 * drawn) / (TAPER_LENGTH * width));
  const d = pathData(shape.points);
  const grain = width * 0.34;
  const runs = runsFor(shape.length, drawn, erased);
  const levels = Array.from({ length: LEVELS }, (_, index) => LEVELS - index).filter((level) =>
    runs.some((run) => run.level === level),
  );
  return (
    <g>
      {levels.map((level) => {
        const strokeWidth = width * taper * widthAt(level);
        const dash = dashFor(
          runs.filter((run) => run.level === level),
          drawn,
          width * taper,
        );
        const alpha = level / LEVELS;
        return (
          <g key={level}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeOpacity={0.9 * alpha}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash.array}
              strokeDashoffset={dash.offset}
            />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeOpacity={0.4 * alpha}
              strokeWidth={strokeWidth * 0.42}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash.array}
              strokeDashoffset={dash.offset}
              transform={`translate(${grain.toFixed(2)} ${(-grain * 0.8).toFixed(2)})`}
            />
          </g>
        );
      })}
    </g>
  );
};
