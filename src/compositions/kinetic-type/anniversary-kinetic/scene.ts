import type { AnniversaryKineticProps } from '@/schemas';
import type { Face } from './fonts';
import type { Measure } from './measure';
import type { Beat } from './timeline';

export type Palette = {
  ink: string;
  accent: string;
  secondary: string;
  highlight: string;
  surfaceInk: string;
};

export type Scene = {
  props: AnniversaryKineticProps;
  beat: Beat;
  local: number;
  length: number;
  width: number;
  height: number;
  face: Face;
  size: number;
  measure: Measure;
  palette: Palette;
  onSurface: boolean;
};

const MAX_TEXT_SHARE = 0.86;

export const fittedSize = (scene: Scene, text: string, base: number, tracking = 0): number => {
  const unit = scene.measure(text, scene.face, tracking);
  const maxWidth = scene.width * MAX_TEXT_SHARE;
  return unit <= 0 ? base : Math.min(base, maxWidth / unit);
};
