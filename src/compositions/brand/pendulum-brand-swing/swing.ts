export const FRAME = { width: 1080, height: 1350 };

export const PIVOT = { x: 540, y: -72 };

const SWINGS = 8;

const MAX_BOB_SPEED = 50;

const SEQUENCE = [0, 1, 2, 1] as const;

type StateIndex = (typeof SEQUENCE)[number];

export type Point = { x: number; y: number };

export type Swing = {
  half: number;
  amplitude: number;
  dwell: number;
  length: number;
};

export const radians = (degrees: number) => (degrees * Math.PI) / 180;

export const makeSwing = (
  duration: number,
  amplitude: number,
  dwell: number,
  length: number,
): Swing => {
  const half = Math.max(1, duration / SWINGS);
  const plainSpeed = (amplitude * Math.PI * length) / half;
  const allowed = plainSpeed > 0 ? MAX_BOB_SPEED / plainSpeed - 1 : dwell;
  return { half, amplitude, dwell: Math.max(0, Math.min(dwell, allowed)), length };
};

const phaseAt = (swing: Swing, t: number) => {
  const u = (Math.PI * t) / swing.half;
  return u - (swing.dwell / 2) * Math.sin(2 * u);
};

export const angleAt = (swing: Swing, t: number) => swing.amplitude * Math.cos(phaseAt(swing, t));

const peakSpeed = (swing: Swing) => (swing.amplitude * Math.PI * (1 + swing.dwell)) / swing.half;

export const speedAt = (swing: Swing, t: number) => {
  const delta = 0.25;
  const change = Math.abs(angleAt(swing, t + delta) - angleAt(swing, t - delta)) / (2 * delta);
  const peak = peakSpeed(swing);
  return peak > 0 ? Math.min(1, change / peak) : 0;
};

export const bobCenter = (swing: Swing, angle: number): Point => ({
  x: PIVOT.x + swing.length * Math.sin(angle),
  y: PIVOT.y + swing.length * Math.cos(angle),
});

export type Pass = { from: StateIndex; to: StateIndex; revealLeft: boolean };

export const passAt = (swing: Swing, t: number): Pass => {
  const index = Math.max(0, Math.floor(t / swing.half));
  return {
    from: SEQUENCE[index % SEQUENCE.length] ?? 0,
    to: SEQUENCE[(index + 1) % SEQUENCE.length] ?? 0,
    revealLeft: index % 2 === 1,
  };
};

const percent = (value: number) => `${value.toFixed(3)}%`;

export const edgeMask = (angle: number, left: boolean, feather: number): string => {
  const direction = left
    ? { x: Math.cos(angle), y: -Math.sin(angle) }
    : { x: -Math.cos(angle), y: Math.sin(angle) };
  const degrees = (Math.atan2(direction.x, -direction.y) * 180) / Math.PI;
  const span = Math.abs(FRAME.width * direction.x) + Math.abs(FRAME.height * direction.y);
  const center = { x: FRAME.width / 2, y: FRAME.height / 2 };
  const edge = (PIVOT.x - center.x) * direction.x + (PIVOT.y - center.y) * direction.y + span / 2;
  const start = ((edge - feather / 2) / span) * 100;
  const end = ((edge + feather / 2) / span) * 100;
  return `linear-gradient(${degrees.toFixed(3)}deg, #000 ${percent(start)}, transparent ${percent(end)})`;
};

export const edgeSpeed = (swing: Swing, t: number, height: number) => {
  const delta = 0.5;
  const change = Math.abs(angleAt(swing, t + delta) - angleAt(swing, t - delta)) / (2 * delta);
  return change * (height - PIVOT.y);
};
