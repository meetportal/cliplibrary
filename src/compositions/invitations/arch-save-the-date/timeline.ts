import type { ArchSaveTheDateProps } from '@/schemas';
import { archDepth, dollyAt, scaleAtDepth } from './geometry';

const FRAMED_SCALE = 0.9;

export type Cues = { title: number; flourish: number; details: number; dusk: number };

const framedFrame = (arches: number, dollyFrames: number): number => {
  const last = Math.max(1, Math.round(dollyFrames));
  for (let frame = 0; frame <= last; frame++) {
    const scale = scaleAtDepth(archDepth(arches - 1, arches, dollyAt(frame, arches, dollyFrames)));
    if (scale !== null && scale >= FRAMED_SCALE) {
      return frame;
    }
  }
  return last;
};

export const buildCues = (props: ArchSaveTheDateProps): Cues => {
  const arches = Math.max(1, Math.round(props.arcade.arches));
  const framed = framedFrame(arches, props.arcade.dollyFrames);
  const { timing } = props;
  return {
    title: framed + timing.titleAt,
    flourish: framed + timing.flourishAt,
    details: framed + timing.detailsAt,
    dusk: framed + timing.duskAt,
  };
};
