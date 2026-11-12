import type { NameLayout } from './layout';

const CLEARANCE = 24;
const ABOVE_NAME = 70;
const BELOW_NAME_ALONE = 90;
const SIDE_MARGIN = 48;
const PAST_NAME = 90;

export type EchoShape = { rx: number; ry: number; dy: number; amount: number };

export const echoShape = (
  layout: NameLayout,
  taglineGap: number,
  hasTagline: boolean,
  wobble: number,
  width: number,
): EchoShape => {
  const amount = wobble * 1.6;
  const bottom = hasTagline
    ? layout.height / 2 + taglineGap - CLEARANCE
    : layout.height / 2 + BELOW_NAME_ALONE;
  const top = -(layout.height / 2 + ABOVE_NAME);
  const ry = Math.max(40, (bottom - top) / 2 / (1 + amount));
  const rx = Math.min(
    (width / 2 - SIDE_MARGIN) / (1 + amount),
    Math.max(layout.width / 2 + PAST_NAME, ry),
  );
  return { rx, ry, dy: (bottom + top) / 2, amount };
};

const POINTS = 180;

export const echoPath = (
  cx: number,
  cy: number,
  shape: EchoShape,
  grow: number,
  lobes: number,
  phase: number,
  tiltDegrees: number,
): string => {
  const tilt = (tiltDegrees * Math.PI) / 180;
  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);
  const ox = cx - shape.dy * sin;
  const oy = cy + shape.dy * cos;
  const second = Math.max(2, lobes - 2);
  const parts: string[] = [];
  for (let index = 0; index < POINTS; index++) {
    const angle = (index / POINTS) * Math.PI * 2;
    const swell =
      0.75 * Math.sin(lobes * angle + phase) + 0.25 * Math.sin(second * angle - phase * 1.4 + 1.1);
    const scale = grow * (1 + shape.amount * swell);
    const x = shape.rx * scale * Math.cos(angle);
    const y = shape.ry * scale * Math.sin(angle);
    parts.push(
      `${index === 0 ? 'M' : 'L'}${(ox + x * cos - y * sin).toFixed(2)} ${(oy + x * sin + y * cos).toFixed(2)}`,
    );
  }
  return `${parts.join(' ')} Z`;
};
