import { staticFile } from 'remotion';

const ABSOLUTE = /^(https?:|data:|blob:|\/)/;

export const resolveCustom = (value: string): string =>
  ABSOLUTE.test(value) ? value : staticFile(value);
