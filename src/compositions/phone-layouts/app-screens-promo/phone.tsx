import { Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { usableImage } from '../../kit/use-logo-box';
import type { Palette } from './palette';

export const PHONE_WIDTH = 350;
export const PHONE_HEIGHT = 740;

const RADIUS = 60;
const BEZEL = 13;
const ISLAND = { width: 104, height: 31, top: 22 };
const BUTTONS = [
  { side: -1, top: 150, height: 44 },
  { side: -1, top: 214, height: 76 },
  { side: -1, top: 304, height: 76 },
  { side: 1, top: 232, height: 112 },
] as const;

export type PhonePose = { x: number; y: number; rotate: number; scale: number };

const Screen = ({ src, palette }: { src: string; palette: Palette }) => {
  const style = {
    position: 'absolute' as const,
    left: BEZEL,
    top: BEZEL,
    width: PHONE_WIDTH - BEZEL * 2,
    height: PHONE_HEIGHT - BEZEL * 2,
    borderRadius: RADIUS - BEZEL,
    overflow: 'hidden' as const,
  };
  if (!usableImage(src)) {
    return (
      <div
        style={{
          ...style,
          backgroundImage: `linear-gradient(160deg, ${palette.screenTo} 0%, ${palette.screenFrom} 100%)`,
        }}
      />
    );
  }
  return (
    <div style={{ ...style, backgroundColor: palette.island }}>
      <Img
        src={resolveCustom(src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
      />
    </div>
  );
};

export const Phone = ({
  src,
  pose,
  palette,
}: {
  src: string;
  pose: PhonePose;
  palette: Palette;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      transform: `translate(${pose.x - PHONE_WIDTH / 2}px, ${pose.y - PHONE_HEIGHT / 2}px) rotate(${pose.rotate}deg) scale(${pose.scale})`,
    }}
  >
    {BUTTONS.map((button) => (
      <div
        key={`${button.side}-${button.top}`}
        style={{
          position: 'absolute',
          left: button.side < 0 ? -4 : PHONE_WIDTH - 2,
          top: button.top,
          width: 6,
          height: button.height,
          borderRadius: 3,
          backgroundColor: palette.phoneRim,
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: RADIUS,
        backgroundColor: palette.phone,
        border: `2px solid ${palette.phoneRim}`,
        boxShadow: `0 46px 70px -18px ${palette.shadow}`,
      }}
    />
    <Screen src={src} palette={palette} />
    <div
      style={{
        position: 'absolute',
        left: (PHONE_WIDTH - ISLAND.width) / 2,
        top: BEZEL + ISLAND.top,
        width: ISLAND.width,
        height: ISLAND.height,
        borderRadius: ISLAND.height / 2,
        backgroundColor: palette.island,
      }}
    />
  </div>
);
