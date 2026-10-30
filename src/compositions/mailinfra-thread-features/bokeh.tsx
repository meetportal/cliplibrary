import { AbsoluteFill, random } from 'remotion';
import type { ThreadLook, ThreadTitle } from '@/schemas';
import { withAlpha } from './color';
import { nearness, type ThreadSchedule } from './schedule';

const GAP = 300;

const DOTS_PER_STOP = 11;

export const Bokeh = ({
  look,
  titles,
  schedule,
  camera,
  parallax,
  width,
  height,
  frame,
  blur,
}: {
  look: ThreadLook;
  titles: ThreadTitle[];
  schedule: ThreadSchedule;
  camera: number;
  parallax: number;
  width: number;
  height: number;
  frame: number;
  blur: number;
}) => {
  if (look.bokeh <= 0) {
    return null;
  }
  const view = camera * parallax;
  const length = schedule.endTop * parallax + height + GAP * 2;
  const count = Math.ceil(length / GAP);
  const blobs = Array.from({ length: count }, (_, index) => {
    const seed = (key: string) => random(`thread-bokeh-${index}-${key}`);
    const size = 300 + seed('size') * 320;
    const y = index * GAP - GAP + seed('y') * GAP * 0.8 - view;
    const x = -120 + seed('x') * (width + 240);
    const pace = 60 + seed('drift') * 40;
    return {
      key: index,
      x: x + Math.sin(frame / pace + index) * 36,
      y: y + Math.cos(frame / (pace * 1.3) + index * 2) * 44,
      size,
      color: seed('tone') > 0.5 ? look.bokehViolet : look.bokehBlue,
      alpha: Math.min(1, (0.22 + seed('alpha') * 0.26) * look.bokeh),
    };
  }).filter((blob) => blob.y > -blob.size * 1.5 && blob.y < height + blob.size * 0.5);
  const dots = titles.flatMap((item, stop) => {
    if (!item.goldDots) {
      return [];
    }
    const stopCamera = (stop + 1) * schedule.spacing;
    const presence = nearness(camera, stopCamera, schedule.spacing);
    if (presence <= 0) {
      return [];
    }
    return Array.from({ length: DOTS_PER_STOP }, (_, index) => {
      const seed = (key: string) => random(`thread-dot-${stop}-${index}-${key}`);
      const size = 26 + seed('size') * 46;
      const rise = frame * (0.2 + seed('rise') * 0.3);
      return {
        key: `${stop}-${index}`,
        x: seed('x') * width,
        y: seed('y') * height - (camera - stopCamera) * parallax * 1.6 - rise,
        size,
        alpha:
          presence * (0.3 + 0.35 * seed('alpha')) * (0.75 + 0.25 * Math.sin(frame / 14 + index)),
      };
    });
  });
  return (
    <AbsoluteFill style={{ filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
      {blobs.map((blob) => (
        <div
          key={blob.key}
          style={{
            position: 'absolute',
            left: blob.x - blob.size / 2,
            top: blob.y - blob.size / 2,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            backgroundColor: withAlpha(blob.color, blob.alpha),
            filter: `blur(${(blob.size * 0.16).toFixed(1)}px)`,
          }}
        />
      ))}
      {dots.map((dot) => (
        <div
          key={dot.key}
          style={{
            position: 'absolute',
            left: dot.x - dot.size / 2,
            top: dot.y - dot.size / 2,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            backgroundColor: withAlpha(look.bokehGold, Math.min(1, dot.alpha * look.bokeh)),
            filter: `blur(${(dot.size * 0.12).toFixed(1)}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
