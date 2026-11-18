const FLOOR = 0.33;
const TOTAL = 0.25 + FLOOR * FLOOR;

const topUp = (shift: number) => {
  const phase = shift - Math.floor(shift);
  return Math.sqrt(Math.max(0, TOTAL - phase * (1 - phase)));
};

export const phaseBlur = (drift: { x: number; y: number }, ratio: number) =>
  ratio >= 1
    ? `${(topUp(drift.x * ratio) / ratio).toFixed(3)} ${(topUp(drift.y * ratio) / ratio).toFixed(3)}`
    : '0';
