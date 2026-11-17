import type { CSSProperties, ReactNode } from 'react';
import { Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';
import { CanvasText, type TextLook } from './canvas-text';
import { CAPTION_FACE, LABEL_FACE } from './fonts';
import type { Palette } from './palette';

export type Reveal = { opacity: number; rise: number };

export const revealStyle = (reveal: Reveal): CSSProperties => ({
  opacity: reveal.opacity,
  transform: `translateY(${reveal.rise.toFixed(3)}px)`,
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
            maxWidth: 'none',
            maxHeight: 'none',
          }}
        />
      </div>
    </div>
  );
};

export type ButtonText = {
  caption: string;
  label: string;
  captionWidth: number;
  labelWidth: number;
};

export const Button = ({
  text,
  height,
  labelSize,
  fill,
  ink,
  edge,
  reveal,
  sheen,
  sheenColor,
}: {
  text: ButtonText;
  height: number;
  labelSize: number;
  fill: string;
  ink: string;
  edge: string;
  reveal: Reveal;
  sheen: number | null;
  sheenColor: string;
}) => {
  const captionSize = Math.round(labelSize * 0.5);
  return (
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
            backgroundImage: `linear-gradient(100deg, transparent 0%, transparent 15%, ${sheenColor} 50%, transparent 85%, transparent 100%)`,
          }}
        />
      )}
      {text.caption.trim() === '' ? null : (
        <div style={{ position: 'relative', opacity: 0.82 }}>
          <CanvasText
            look={{
              text: text.caption,
              face: CAPTION_FACE,
              size: captionSize,
              tracking: 0,
              color: ink,
              lineHeight: 1.1,
              width: text.captionWidth * captionSize,
            }}
          />
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <CanvasText
          look={{
            text: text.label,
            face: LABEL_FACE,
            size: labelSize,
            tracking: 0,
            color: ink,
            lineHeight: 1.08,
            width: text.labelWidth * labelSize,
          }}
        />
      </div>
    </div>
  );
};

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

export const TextRow = ({
  top,
  width,
  reveal,
  look,
  indent = 0,
}: {
  top: number;
  width: number;
  reveal: Reveal;
  look: TextLook;
  indent?: number;
}) =>
  look.text === '' ? null : (
    <Row
      top={top}
      height={look.size * look.lineHeight}
      width={width}
      style={{ ...revealStyle(reveal), paddingLeft: indent }}
    >
      <CanvasText look={look} />
    </Row>
  );
