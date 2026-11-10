import { type ReactNode, useId } from 'react';
import type { GoldTones } from './color';
import type { Face, SerifFaces } from './fonts';
import {
  type Column,
  DATE_TRACKING,
  EYEBROW_TRACKING,
  LINE_LEADING,
  NAMES_LEADING,
  type Row,
  VENUE_LEADING,
} from './layout';
import { ENTRANCE, pixelTween, RISE, ramp, settle } from './timeline';

export const rowEntrance = (frame: number, start: number) => ({
  opacity: ramp(frame, start, start + ENTRANCE, (t) => t),
  rise: pixelTween(frame, [start, start + ENTRANCE + 10], RISE, 0),
});

const textStyle = (font: Face, size: number, tracking = 0) => ({
  fontFamily: font.family,
  fontWeight: font.weight,
  fontSize: size,
  letterSpacing: tracking === 0 ? undefined : `${(tracking * size).toFixed(2)}px`,
  textRendering: 'geometricPrecision' as const,
});

export const Details = ({
  rows,
  column,
  frame,
  startOf,
  script,
  serif,
  gold,
  text,
}: {
  rows: Row[];
  column: Column;
  frame: number;
  startOf: (order: number) => number;
  script: Face;
  serif: SerifFaces;
  gold: GoldTones;
  text: string;
}) => {
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  const goldFill = `details${base}g`;
  const pad = 80;
  const left = Math.round(column.centerX - column.width / 2 - pad);
  const width = Math.round(column.width + pad * 2);
  const cx = column.centerX - left;
  const draw = (row: Row): ReactNode => {
    switch (row.kind) {
      case 'eyebrow':
        return (
          <text
            x={cx + (EYEBROW_TRACKING * row.size) / 2}
            y={row.top + row.size * 0.84}
            textAnchor="middle"
            fill={text}
            opacity={0.86}
            style={textStyle(serif.body, row.size, EYEBROW_TRACKING)}
          >
            {row.text}
          </text>
        );
      case 'names':
        return row.fitted.lines.map((line, index) => (
          <text
            key={index.toString()}
            x={cx}
            y={row.top + row.fitted.size * (0.74 + index * NAMES_LEADING)}
            textAnchor="middle"
            fill={`url(#${goldFill})`}
            style={textStyle(script, row.fitted.size)}
          >
            {line}
          </text>
        ));
      case 'divider': {
        const share = ramp(frame, startOf(row.order), startOf(row.order) + ENTRANCE + 6, settle);
        const half = (row.width / 2) * share;
        const y = row.top + 13;
        return (
          <>
            <path
              d={`M ${cx - 16} ${y} L ${cx - 16 - half} ${y} M ${cx + 16} ${y} L ${cx + 16 + half} ${y}`}
              stroke={gold.mid}
              strokeWidth={1.4}
            />
            <path
              d={`M ${cx} ${y - 7} L ${cx + 7} ${y} L ${cx} ${y + 7} L ${cx - 7} ${y} Z`}
              fill={gold.light}
            />
            <circle cx={cx - 16 - half - 5} cy={y} r={2.2} fill={gold.mid} opacity={share} />
            <circle cx={cx + 16 + half + 5} cy={y} r={2.2} fill={gold.mid} opacity={share} />
          </>
        );
      }
      case 'line':
        return row.fitted.lines.map((line, index) => (
          <text
            key={index.toString()}
            x={cx}
            y={row.top + row.fitted.size * (0.92 + index * LINE_LEADING)}
            textAnchor="middle"
            fill={text}
            style={textStyle(serif.body, row.fitted.size)}
          >
            {line}
          </text>
        ));
      case 'date':
        return (
          <text
            x={cx + (DATE_TRACKING * row.size) / 2}
            y={row.top + row.size * 0.86}
            textAnchor="middle"
            fill={`url(#${goldFill})`}
            style={textStyle(serif.strong, row.size, DATE_TRACKING)}
          >
            {row.text}
          </text>
        );
      case 'venue':
        return row.fitted.lines.map((line, index) => (
          <text
            key={index.toString()}
            x={cx + (0.02 * row.fitted.size) / 2}
            y={row.top + row.fitted.size * (0.92 + index * VENUE_LEADING)}
            textAnchor="middle"
            fill={text}
            opacity={0.8}
            style={textStyle(serif.body, row.fitted.size, 0.02)}
          >
            {line}
          </text>
        ));
      default:
        return null;
    }
  };
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={1080}
      viewBox={`0 0 ${width} 1080`}
      style={{ position: 'absolute', left, top: 0 }}
    >
      <defs>
        <linearGradient id={goldFill} x1="0" y1="0" x2="0.08" y2="1">
          <stop offset="0" stopColor={gold.light} />
          <stop offset="0.38" stopColor={gold.highlight} />
          <stop offset="0.62" stopColor={gold.light} />
          <stop offset="1" stopColor={gold.mid} />
        </linearGradient>
      </defs>
      {rows.map((row) => {
        const entrance = rowEntrance(frame, startOf(row.order));
        if (row.kind === 'logo' || entrance.opacity <= 0) {
          return null;
        }
        return (
          <g
            key={row.kind}
            opacity={entrance.opacity}
            transform={row.kind === 'divider' ? undefined : `translate(0 ${entrance.rise})`}
          >
            {draw(row)}
          </g>
        );
      })}
    </svg>
  );
};
