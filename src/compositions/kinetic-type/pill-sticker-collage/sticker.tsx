import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { LogoBox } from '../../kit/use-logo-box';
import { BadgeGlyph } from './badges';
import type { StickerFace } from './fonts';
import { faceStyle } from './fonts';
import type { Sticker } from './layout';
import type { Palette } from './palette';

export type StickerLook = {
  face: StickerFace;
  palette: Palette;
  outline: number;
  shadow: number;
  popFrames: number;
  spin: number;
  logo: { src: string; box: LogoBox } | null;
};

const START_SCALE = 0.18;
const SPIN_IN = 14;
const TEXT_NUDGE = 0.04;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const SETTLED = 0.002;
const EXIT_FRAMES = 10;

const leaving = (frame: number, exitAt: number | null) =>
  exitAt === null ? 0 : clamp01((frame - exitAt) / EXIT_FRAMES) ** 2;

const edgeOf = (sticker: Sticker, paint: StickerLook['palette']['primary'], look: StickerLook) => {
  if (paint.line !== null) {
    return `${look.outline}px solid ${paint.line}`;
  }
  const ring = Math.max(sticker.ring, paint.ring);
  return ring > 0 ? `${ring}px solid ${look.palette.surface.fill}` : 'none';
};

const landing = (local: number, frames: number) => {
  const rest = Math.exp((-4.6 * local) / frames);
  return rest < SETTLED ? 1 : 1 - rest;
};

const LogoArt = ({
  sticker,
  logo,
}: {
  sticker: Sticker;
  logo: NonNullable<StickerLook['logo']>;
}) => {
  const { box } = logo;
  const room = sticker.disc
    ? { w: sticker.h * 0.62, h: sticker.h * 0.62 }
    : { w: sticker.w - sticker.h * 0.7, h: sticker.h * 0.5 };
  const scale = Math.min(room.w / box.aspect, room.h);
  const shown = { w: scale * box.aspect, h: scale };
  const image = { w: shown.w / box.w, h: shown.h / box.h };
  return (
    <div
      style={{
        position: 'absolute',
        left: (sticker.w - shown.w) / 2,
        top: (sticker.h - shown.h) / 2,
        width: shown.w,
        height: shown.h,
        overflow: 'hidden',
      }}
    >
      <Img
        src={logo.src}
        style={{
          position: 'absolute',
          left: -box.x * image.w,
          top: -box.y * image.h,
          width: image.w,
          height: image.h,
        }}
      />
    </div>
  );
};

export const StickerView = ({
  sticker,
  frame,
  look,
}: {
  sticker: Sticker;
  frame: number;
  look: StickerLook;
}) => {
  const local = frame - sticker.at;
  const gone = leaving(frame, sticker.exitAt);
  if (local < 0 || gone >= 1) {
    return null;
  }
  const eased = landing(local, look.popFrames) * (1 - gone);
  const scale = START_SCALE + (1 - START_SCALE) * eased;
  const side = sticker.rotate >= 0 ? 1 : -1;
  const rotate = sticker.rotate + side * SPIN_IN * (1 - eased);
  const opacity = clamp01((local + 1) / (look.popFrames * 0.3)) * (1 - gone);
  const paint = look.palette[sticker.style];
  const radius = sticker.disc ? sticker.w / 2 : sticker.h / 2;
  const shadow =
    look.shadow > 0 && paint.fill !== 'transparent'
      ? `0 ${Math.round(sticker.h * 0.06)}px ${Math.round(sticker.h * 0.22)}px rgba(0, 0, 0, ${look.shadow})`
      : 'none';
  const box: CSSProperties = {
    position: 'absolute',
    left: sticker.x - sticker.w / 2,
    top: sticker.y - sticker.h / 2,
    width: sticker.w,
    height: sticker.h,
    borderRadius: radius,
    backgroundColor: paint.fill,
    border: edgeOf(sticker, paint, look),
    boxSizing: 'border-box',
    boxShadow: shadow,
    transform: `rotate(${rotate}deg) scale(${scale})`,
    opacity,
  };
  const { content } = sticker;
  return (
    <div style={box}>
      {content.kind === 'word' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: paint.ink,
            fontSize: content.fontSize,
            lineHeight: content.text.includes('\n') ? 1.06 : 1,
            whiteSpace: 'pre',
            textAlign: 'center',
            paddingBottom: content.fontSize * TEXT_NUDGE,
            ...faceStyle(look.face),
          }}
        >
          {content.text}
        </div>
      ) : null}
      {content.kind === 'badge' ? (
        <BadgeGlyph
          kind={content.badge}
          glyph={sticker.accent ? look.palette.burst : paint.ink}
          burst={look.palette.burst}
          turn={frame * look.spin}
          nudge={Math.sin(frame / 9) * 3 * Math.min(1, look.spin)}
        />
      ) : null}
      {content.kind === 'logo' && look.logo !== null ? (
        <LogoArt sticker={sticker} logo={look.logo} />
      ) : null}
    </div>
  );
};
