import type { CSSProperties } from 'react';
import { Easing } from 'remotion';
import type { ArchSaveTheDateProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { type Faces, fontSpec } from './fonts';
import { CENTER_X } from './geometry';
import type { Layout, Row } from './layout';
import type { Cues } from './timeline';

const FEATHER = 5;

const lineBox = (y: number, height: number): CSSProperties => ({
  position: 'absolute',
  left: 0,
  width: CENTER_X * 2,
  top: y,
  height,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  whiteSpace: 'pre',
});

const WipedLine = ({ text, progress }: { text: string; progress: number }) => {
  const chars = Array.from(text);
  const head = progress * (chars.length + FEATHER);
  return (
    <>
      {chars.map((char, index) => (
        <span key={index} style={{ opacity: Math.min(1, Math.max(0, (head - index) / FEATHER)) }}>
          {char}
        </span>
      ))}
    </>
  );
};

const DetailRow = ({
  row,
  color,
  progress,
}: {
  row: Row;
  color: string;
  progress: (line: number) => number;
}) => (
  <>
    {row.lines.map((line, index) => {
      const height = row.size * row.lineHeight;
      return (
        <div
          key={index}
          style={{
            ...lineBox(row.y + index * height, height),
            font: fontSpec(row.font, row.size),
            letterSpacing: `${row.tracking}em`,
            textTransform: row.caps ? 'uppercase' : 'none',
            color,
            lineHeight: 1,
          }}
        >
          <WipedLine text={line} progress={progress(index)} />
        </div>
      );
    })}
  </>
);

const FLOURISH_LEFT = [
  'M 380 4 C 352 14 323 30 296 22 C 271 14 261 -22 278 -36 C 293 -48 310 -28 303 -10 C 299 0 289 -2 288 -10',
  'M 369 62 C 344 72 315 80 286 66 C 268 56 256 38 249 16',
  'M 296 22 C 281 36 262 42 245 30',
];

const Flourish = ({
  y,
  scale,
  color,
  draw,
}: {
  y: number;
  scale: number;
  color: string;
  draw: number;
}) => {
  const side = (mirror: boolean) => (
    <g transform={mirror ? `translate(${CENTER_X * 2} 0) scale(-1 1)` : undefined}>
      {FLOURISH_LEFT.map((d) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={2.6 / scale}
          strokeLinecap="butt"
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
      ))}
      <circle cx={241} cy={-12} r={4.5 / scale} fill={color} opacity={ramp(draw, 0.8, 1)} />
    </g>
  );
  return (
    <svg
      aria-hidden="true"
      width={CENTER_X * 2}
      height={400}
      viewBox={`0 ${-200} ${CENTER_X * 2} 400`}
      style={{ position: 'absolute', left: 0, top: y - 200, overflow: 'visible' }}
    >
      <g
        transform={`translate(${CENTER_X} 0) scale(${scale}) translate(${-CENTER_X} 0)`}
        opacity={Math.min(1, draw * 6)}
      >
        {side(false)}
        {side(true)}
      </g>
    </svg>
  );
};

export const CardText = ({
  props,
  faces,
  layout,
  frame,
  cues,
}: {
  props: ArchSaveTheDateProps;
  faces: Faces;
  layout: Layout;
  frame: number;
  cues: Cues;
}) => {
  const { timing, colors } = props;
  const titleOpacity = ramp(
    frame,
    cues.title,
    cues.title + timing.titleFrames,
    Easing.inOut(Easing.quad),
  );
  const draw = ramp(
    frame,
    cues.flourish,
    cues.flourish + timing.flourishFrames,
    Easing.inOut(Easing.cubic),
  );
  const { title } = layout;
  const titleLine = (part: Title['top'], key: string) => (
    <div
      key={key}
      style={{
        ...lineBox(part.y, part.size),
        font: fontSpec(faces.script, part.size),
        color: colors.script,
        lineHeight: 1,
        opacity: titleOpacity,
      }}
    >
      {part.text}
    </div>
  );
  let lineIndex = 0;
  return (
    <>
      {props.words.saveJoiner.trim() === '' ? null : (
        <Flourish
          y={title.joiner.y + title.joiner.size * 0.5}
          scale={props.lettering.titleSize / 172}
          color={colors.script}
          draw={draw}
        />
      )}
      {titleLine(title.top, 'top')}
      {titleLine(title.joiner, 'joiner')}
      {titleLine(title.bottom, 'bottom')}
      {layout.rows.map((row) => {
        const first = lineIndex;
        lineIndex += row.lines.length;
        return (
          <DetailRow
            key={row.key}
            row={row}
            color={row.color === 'script' ? colors.script : colors.text}
            progress={(line) => {
              const start = cues.details + (first + line) * timing.lineStagger;
              return ramp(frame, start, start + timing.wipeFrames, Easing.inOut(Easing.sin));
            }}
          />
        );
      })}
    </>
  );
};

type Title = Layout['title'];
