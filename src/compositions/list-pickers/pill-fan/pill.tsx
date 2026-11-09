import type { CSSProperties } from 'react';
import type { PillFanProps } from '@/schemas';
import type { PillPalette } from './colors';
import { mix, withAlpha } from './colors';
import type { FontFace } from './fonts';
import type { FanLayout } from './layout';
import type { PillPose } from './timeline';

type PillProps = {
  word: string;
  length: number;
  pose: PillPose;
  layout: FanLayout;
  palette: PillPalette;
  props: PillFanProps;
  face: FontFace;
};

type Look = { fill: string; word: string; border: string | null; shadow: number };

const smooth = (t: number) => t * t * (3 - 2 * t);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const solidLook = (palette: PillPalette): Look => ({
  fill: palette.pill,
  word: palette.word,
  border: palette.edge,
  shadow: 1,
});

const outlineLook = (palette: PillPalette): Look => ({
  fill: palette.background,
  word: palette.outlineWord,
  border: palette.outlineEdge,
  shadow: 0.3,
});

const tintLook = (pose: PillPose, palette: PillPalette, props: PillFanProps): Look => {
  const tint = Math.min(pose.age * props.fan.fade, palette.maxTint);
  return {
    fill: mix(palette.pill, palette.background, tint),
    word: palette.word,
    border: palette.edge === null ? null : mix(palette.edge, palette.background, tint),
    shadow: 1,
  };
};

export const Pill = ({ word, length, pose, layout, palette, props, face }: PillProps) => {
  const { pills, pivot } = layout;
  const outline = props.pills.trail === 'outline';
  const solidFade = outline ? 1 - smooth(clamp01((pose.age - 0.1) / 0.6)) : 1;
  const base = outline
    ? solidFade < 1
      ? outlineLook(palette)
      : solidLook(palette)
    : tintLook(pose, palette, props);
  const borderWidth = Math.max(2, 3 * pills.scale);
  const shape = (look: Look, alpha: number): CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: length,
    height: pills.height,
    boxSizing: 'border-box',
    borderRadius: pills.height / 2,
    border:
      look.border === null
        ? 'none'
        : `${borderWidth.toFixed(2)}px solid ${withAlpha(look.border, alpha)}`,
    backgroundColor: withAlpha(look.fill, alpha),
    backgroundClip: 'padding-box',
    boxShadow: `0 ${(pills.height * 0.16).toFixed(1)}px ${(pills.height * 0.32).toFixed(1)}px ${withAlpha(palette.shadow, props.pills.shadow * 0.4 * look.shadow * alpha)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: withAlpha(look.word, alpha),
    fontFamily: face.family,
    fontWeight: face.weight,
    fontSize: pills.textSize,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: pivot.x,
        top: pivot.y,
        width: 0,
        height: 0,
        transformOrigin: '0 0',
        transform: `rotate(${pose.angle.toFixed(3)}deg) translateX(${(pills.hinge + pills.slide * pose.offset).toFixed(2)}px) scale(${pose.scale.toFixed(4)})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: -pills.height / 2,
          width: length,
          height: pills.height,
        }}
      >
        <div style={shape(base, pose.opacity)}>{word}</div>
        {solidFade > 0 && solidFade < 1 ? (
          <div style={shape(solidLook(palette), pose.opacity * solidFade)}>{word}</div>
        ) : null}
      </div>
    </div>
  );
};
