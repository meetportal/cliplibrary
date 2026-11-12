import type { BurningPaperRevealProps } from '@/schemas';

export type BurnLook = {
  frame: number;
  fps: number;
  burn: BurningPaperRevealProps['burn'];
  height: number;
  glow: number;
  sparks: number;
  smoke: number;
  flame: string;
  smokeColor: string;
};
