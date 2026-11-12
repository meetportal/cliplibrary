const POINTS = 180;

export const blobPath = (
  cx: number,
  cy: number,
  radius: number,
  amount: number,
  lobes: number,
  phase: number,
): string => {
  const second = Math.max(2, lobes - 2);
  const parts: string[] = [];
  for (let index = 0; index < POINTS; index++) {
    const angle = (index / POINTS) * Math.PI * 2;
    const swell =
      0.75 * Math.sin(lobes * angle + phase) + 0.25 * Math.sin(second * angle - phase * 1.4 + 1.1);
    const r = radius * (1 + amount * swell);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    parts.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${parts.join(' ')} Z`;
};

export const coverRadius = (
  cx: number,
  cy: number,
  width: number,
  height: number,
  amount: number,
): number => {
  const corner = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(width - cx, cy),
    Math.hypot(cx, height - cy),
    Math.hypot(width - cx, height - cy),
  );
  return (corner / Math.max(0.5, 1 - amount)) * 1.03;
};

export const squigglePath = (width: number, height: number, phase: number): string => {
  const waves = Math.max(2, Math.round(width / 60));
  const steps = waves * 16;
  const parts: string[] = [];
  for (let index = 0; index <= steps; index++) {
    const x = (index / steps) * width;
    const y = height / 2 + (height / 2) * Math.sin((index / steps) * waves * Math.PI * 2 - phase);
    parts.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return parts.join(' ');
};
