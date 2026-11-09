import type { ReactNode } from 'react';
import type { WordPickerProps } from '@/schemas';
import { withAlpha } from './color';
import { FACES } from './fonts';
import type { Box } from './layout';
import { settle, smooth, tween } from './timeline';

const dotStyle = (x: number, y: number, radius: number, color: string, opacity: number) => ({
  position: 'absolute' as const,
  left: x - radius,
  top: y - radius,
  width: radius * 2,
  height: radius * 2,
  borderRadius: radius,
  backgroundColor: color,
  opacity,
});

export const Bracket = ({
  selection,
  frame: box,
  color,
  time,
  drawFrames,
}: {
  selection: WordPickerProps['selection'];
  frame: Box;
  color: string;
  time: number;
  drawFrames: number;
}) => {
  const dot = tween(time, [0, drawFrames * 0.55], [0, 1], settle);
  const line = tween(time, [drawFrames * 0.15, drawFrames], [0, 1], settle);
  const fill = tween(time, [drawFrames * 0.3, drawFrames * 1.2], [0, 1], settle);
  const stroke = selection.lineWidth;
  const overhang = Math.round(box.height * 0.12);
  const reach = Math.round((box.height + overhang) * line);
  const radius = Math.max(2, stroke * 2.4) * Math.max(0.01, dot);
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          ...box,
          backgroundColor: withAlpha(color, selection.fillStrength),
          opacity: fill,
        }}
      />
      {selection.corners ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: box.left - stroke / 2,
              top: box.top - overhang,
              width: stroke,
              height: reach,
              backgroundColor: color,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: right - stroke / 2,
              top: bottom + overhang - reach,
              width: stroke,
              height: reach,
              backgroundColor: color,
            }}
          />
          <div style={dotStyle(box.left, box.top - overhang, radius, color, dot)} />
          <div style={dotStyle(right, bottom + overhang, radius, color, dot)} />
        </>
      ) : null}
    </>
  );
};

export const barBox = (box: Box, time: number, drawFrames: number): Box => {
  const across = tween(time, [0, drawFrames * 0.55], [0, 1], smooth);
  const open = tween(time, [drawFrames * 0.35, drawFrames], [0, 1], smooth);
  const width = Math.round(box.width * across);
  const thin = Math.min(box.height, 6);
  const height = Math.round(thin + (box.height - thin) * open);
  return {
    left: Math.round(box.left + (box.width - width) / 2),
    top: Math.round(box.top + (box.height - height) / 2),
    width,
    height,
  };
};

export const Bar = ({
  box,
  color,
  time,
  drawFrames,
  children,
}: {
  box: Box;
  color: string;
  time: number;
  drawFrames: number;
  children: ReactNode;
}) => {
  const opacity = tween(time, [0, drawFrames * 0.25], [0, 1], settle);
  const radius = Math.round(Math.min(box.height, box.width) * 0.14);
  return (
    <div
      style={{
        position: 'absolute',
        ...box,
        borderRadius: radius,
        overflow: 'hidden',
        opacity,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: color }} />
      {children}
    </div>
  );
};

const pad2 = (value: number) => String(value).padStart(2, '0');

export const Counter = ({
  box,
  width,
  progress,
  total,
  color,
  muted,
  opacity,
  font,
}: {
  box: Box;
  width: number;
  progress: number;
  total: number;
  color: string;
  muted: string;
  opacity: number;
  font: WordPickerProps['type']['listFont'];
}) => {
  const face = FACES[font];
  const size = Math.round(box.height * 0.22);
  const small = Math.round(size * 0.6);
  const base = Math.floor(progress);
  const part = progress - base;
  const travel = Math.round(size * 1.15);
  const shift = Math.round(part * travel);
  const left = box.left + Math.round(box.width * 0.04);
  const line = Math.round(size * 1.2);
  const top = Math.round(box.top + box.height / 2 - line / 2);
  const digits = Math.round(size * 1.32);
  const common = {
    position: 'absolute' as const,
    height: line,
    lineHeight: `${line}px`,
    textAlign: 'left' as const,
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    fontVariantNumeric: 'tabular-nums' as const,
    whiteSpace: 'nowrap' as const,
  };
  const numbers = part > 0.001 ? [base, base + 1] : [base];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {numbers.map((value) => {
        const leaving = value === base;
        return (
          <div
            key={value}
            style={{
              ...common,
              left,
              width: digits,
              top: top + (leaving ? -shift : travel - shift),
              fontSize: size,
              color,
              opacity: leaving ? 1 - part : part,
            }}
          >
            {pad2(value + 1)}
          </div>
        );
      })}
      <div
        style={{
          ...common,
          left: left + digits,
          width: Math.max(0, width - digits),
          top: top + Math.round((size - small) * 0.42),
          fontSize: small,
          color: muted,
        }}
      >
        {`/${pad2(total)}`}
      </div>
    </div>
  );
};
