import type { CSSProperties, ReactNode } from 'react';
import { Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';
import { CAPTION_FACE, LABEL_FACE } from './fonts';
import type { Palette } from './palette';

export type Reveal = { opacity: number; rise: number };

export const revealStyle = (reveal: Reveal): CSSProperties => ({
  opacity: reveal.opacity,
  transform: reveal.rise === 0 ? undefined : `translateY(${reveal.rise}px)`,
});

export const logoSize = (box: LogoBox, size: number, maxWidth: number) => {
  const height = size / box.aspect ** 0.35;
  const width = height * box.aspect;
  return width > maxWidth ? { width: maxWidth, height: maxWidth / box.aspect } : { width, height };
};

export const LogoPlate = ({
  src,
  box,
  width,
  height,
  padding,
  plate,
  palette,
}: {
  src: string;
  box: LogoBox;
  width: number;
  height: number;
  padding: number;
  plate: boolean;
  palette: Palette;
}) => {
  const imageWidth = width / box.w;
  const imageHeight = height / box.h;
  const outer = height + padding * 2;
  return (
    <div
      style={{
        padding: plate ? padding : 0,
        borderRadius: Math.min(outer * 0.26, 34),
        backgroundColor: plate ? palette.surface : undefined,
        boxShadow: plate
          ? `0 ${Math.round(outer * 0.08)}px ${Math.round(outer * 0.3)}px ${palette.plateShadow}`
          : undefined,
      }}
    >
      <div style={{ width, height, overflow: 'hidden', position: 'relative' }}>
        <Img
          src={resolveCustom(src)}
          style={{
            position: 'absolute',
            left: -box.x * imageWidth,
            top: -box.y * imageHeight,
            width: imageWidth,
            height: imageHeight,
          }}
        />
      </div>
    </div>
  );
};

export const Button = ({
  caption,
  label,
  height,
  labelSize,
  fill,
  ink,
  edge,
  reveal,
  sheen,
  sheenColor,
}: {
  caption: string;
  label: string;
  height: number;
  labelSize: number;
  fill: string;
  ink: string;
  edge: string;
  reveal: Reveal;
  sheen: number | null;
  sheenColor: string;
}) => (
  <div
    style={{
      ...revealStyle(reveal),
      position: 'relative',
      height,
      minWidth: Math.round(height * 2.5),
      padding: `0 ${Math.round(height * 0.44)}px`,
      boxSizing: 'border-box',
      borderRadius: height / 2,
      backgroundColor: fill,
      border: `2px solid ${edge}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: ink,
      whiteSpace: 'pre',
    }}
  >
    {sheen === null ? null : (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${(sheen * 100).toFixed(2)}%`,
          width: '45%',
          backgroundImage: `linear-gradient(100deg, transparent 0%, ${sheenColor} 50%, transparent 100%)`,
        }}
      />
    )}
    {caption.trim() === '' ? null : (
      <span
        style={{
          position: 'relative',
          fontFamily: CAPTION_FACE.family,
          fontWeight: CAPTION_FACE.weight,
          fontSize: Math.round(labelSize * 0.5),
          lineHeight: 1.1,
          opacity: 0.82,
        }}
      >
        {caption}
      </span>
    )}
    <span
      style={{
        position: 'relative',
        fontFamily: LABEL_FACE.family,
        fontWeight: LABEL_FACE.weight,
        fontSize: labelSize,
        letterSpacing: `${LABEL_FACE.tracking}em`,
        lineHeight: 1.08,
      }}
    >
      {label}
    </span>
  </div>
);

export const Row = ({
  top,
  height,
  width,
  style,
  children,
}: {
  top: number;
  height: number;
  width: number;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: Math.round(top),
      width,
      height: Math.round(height),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {children}
  </div>
);
