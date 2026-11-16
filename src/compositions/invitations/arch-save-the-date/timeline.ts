import { Easing } from 'remotion';
import type { ArchSaveTheDateProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { archDepth, type Camera, cardScale, dollyAt, scaleAtDepth } from './geometry';

const FRAMED_SCALE = 0.9;
const LINE_RISE_SHARE = 0.6;
const RISE_TAIL = 10;

const rise = Easing.bezier(0.33, 0, 0.2, 1);

export type Cues = {
  title: number;
  flourish: number;
  details: number;
  dusk: number;
  exit: number;
  end: number;
};

export const cameraOf = (props: ArchSaveTheDateProps, duration: number): Camera => ({
  arches: Math.max(1, Math.round(props.arcade.arches)),
  dollyFrames: props.arcade.dollyFrames,
  drift: props.arcade.drift,
  duration,
});

const framedFrame = (camera: Camera): number => {
  const last = Math.max(1, Math.round(camera.dollyFrames));
  for (let frame = 0; frame <= last; frame++) {
    const dolly = dollyAt(frame, camera);
    const scale = scaleAtDepth(archDepth(camera.arches - 1, camera.arches, dolly));
    if (scale !== null && scale >= FRAMED_SCALE * cardScale(dolly)) {
      return frame;
    }
  }
  return last;
};

export const buildCues = (props: ArchSaveTheDateProps, duration: number): Cues => {
  const framed = framedFrame(cameraOf(props, duration));
  const { timing } = props;
  const end = duration - 1;
  return {
    title: framed + timing.titleAt,
    flourish: framed + timing.flourishAt,
    details: framed + timing.detailsAt,
    dusk: framed + timing.duskAt,
    exit: end - Math.max(0, timing.exitFrames),
    end,
  };
};

export const entrance = (frame: number, start: number, frames: number, distance: number) => ({
  offset: distance * (1 - ramp(frame, start, start + frames + RISE_TAIL, rise)),
  opacity: ramp(frame, start, start + frames, Easing.inOut(Easing.quad)),
});

export const lineRise = (distance: number) => distance * LINE_RISE_SHARE;

export const exitAmount = (frame: number, cues: Cues) =>
  cues.end > cues.exit ? ramp(frame, cues.exit, cues.end, Easing.inOut(Easing.sin)) : 0;
