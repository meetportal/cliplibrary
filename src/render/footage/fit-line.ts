export type Sample = { along: number; across: number };

export type Line = { slope: number; offset: number };

const leastSquares = (samples: Sample[]): Line => {
  const count = samples.length;
  const meanAlong = samples.reduce((sum, sample) => sum + sample.along, 0) / count;
  const meanAcross = samples.reduce((sum, sample) => sum + sample.across, 0) / count;
  let covariance = 0;
  let variance = 0;
  for (const { along, across } of samples) {
    covariance += (along - meanAlong) * (across - meanAcross);
    variance += (along - meanAlong) ** 2;
  }
  const slope = variance === 0 ? 0 : covariance / variance;
  return { slope, offset: meanAcross - slope * meanAlong };
};

export const lineAt = (line: Line, along: number) => line.slope * along + line.offset;

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
};

export const fitEdge = (samples: Sample[], minimum: number): Line | undefined => {
  let kept = samples;
  for (let round = 0; round < 4; round += 1) {
    if (kept.length < minimum) {
      return undefined;
    }
    const line = leastSquares(kept);
    const residuals = kept.map((sample) => Math.abs(sample.across - lineAt(line, sample.along)));
    const spread = Math.max(2, 3 * median(residuals));
    kept = kept.filter((_, index) => (residuals[index] ?? 0) <= spread);
  }
  return kept.length < minimum ? undefined : leastSquares(kept);
};

export type Point = [number, number];

export const crossRowColumn = (row: Line, column: Line): Point => {
  const y = (row.slope * column.offset + row.offset) / (1 - row.slope * column.slope);
  return [column.slope * y + column.offset, y];
};

export const crossRows = (first: Line, second: Line): Point => {
  const x = (second.offset - first.offset) / (first.slope - second.slope);
  return [x, lineAt(first, x)];
};
