import type { ElevatorNewspaperProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';

export type Framing = { x: number; y: number; scale: number };

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export const cameraFraming = (
  frame: number,
  camera: ElevatorNewspaperProps['camera'],
  width: number,
  height: number,
): Framing => {
  const pushEnd = camera.pushStart + camera.pushFrames;
  const pullStart = Math.max(pushEnd, camera.pullStart);
  const closeness =
    frame < pullStart
      ? tween(frame, [camera.pushStart, pushEnd], [0, 1], smooth)
      : tween(frame, [pullStart, pullStart + camera.pullFrames], [1, 0], smooth);
  const scale = 1 + (camera.zoom - 1) * closeness;
  const screenX = camera.focusX + (width / 2 - camera.focusX) * closeness;
  const screenY = camera.focusY + (height / 2 - camera.focusY) * closeness;
  return {
    scale,
    x: clamp(screenX - camera.focusX * scale, width - width * scale, 0),
    y: clamp(screenY - camera.focusY * scale, height - height * scale, 0),
  };
};
