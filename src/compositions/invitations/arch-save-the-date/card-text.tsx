import { Easing } from 'remotion';
import type { ArchSaveTheDateProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { CanvasLine } from './canvas-line';
import type { Faces } from './fonts';
import { CENTER_X } from './geometry';
import type { Layout, Row } from './layout';
import { type Cues, entrance, lineRise } from './timeline';

const DetailRow = ({
  row,
  color,
  line: lineAt,
}: {
  row: Row;
  color: string;
  line: (line: number) => { reveal: number; offset: number };
}) => (
  <>
    {row.lines.map((line, index) => {
      const height = row.size * row.lineHeight;
      const motion = lineAt(index);
      return (
        <CanvasLine
          key={index}
          look={{
            text: row.caps ? line.toUpperCase() : line,
            face: row.font,
            size: row.size,
            tracking: row.tracking,
            color,
            top: row.y + index * height,
            height,
          }}
          offset={motion.offset}
          opacity={1}
          reveal={motion.reveal}
        />
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
  offset,
}: {
  y: number;
  scale: number;
  color: string;
  draw: number;
  offset: number;
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
        transform={`translate(0 ${offset.toFixed(3)}) translate(${CENTER_X} 0) scale(${scale}) translate(${-CENTER_X} 0)`}
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
  const { timing, colors, lettering } = props;
  const titleIn = entrance(frame, cues.title, timing.titleFrames, lettering.rise);
  const draw = ramp(
    frame,
    cues.flourish,
    cues.flourish + timing.flourishFrames,
    Easing.inOut(Easing.cubic),
  );
  const { title } = layout;
  const titleLine = (part: Title['top'], key: string) => (
    <CanvasLine
      key={key}
      look={{
        text: part.text,
        face: faces.script,
        size: part.size,
        tracking: 0,
        color: colors.script,
        top: part.y,
        height: part.size,
      }}
      offset={titleIn.offset}
      opacity={titleIn.opacity}
      reveal={1}
    />
  );
  const detailRise = lineRise(lettering.rise);
  let lineIndex = 0;
  return (
    <>
      {props.words.saveJoiner.trim() === '' ? null : (
        <Flourish
          y={title.joiner.y + title.joiner.size * 0.5}
          scale={lettering.titleSize / 172}
          color={colors.script}
          draw={draw}
          offset={titleIn.offset}
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
            line={(line) => {
              const start = cues.details + (first + line) * timing.lineStagger;
              return {
                reveal: ramp(frame, start, start + timing.wipeFrames, Easing.inOut(Easing.sin)),
                offset: entrance(frame, start, timing.wipeFrames, detailRise).offset,
              };
            }}
          />
        );
      })}
    </>
  );
};

type Title = Layout['title'];
