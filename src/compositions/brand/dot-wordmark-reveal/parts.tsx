import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { lerp, ramp } from '../../kit/motion';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';
import type { Face } from './fonts';
import { type Blob, irisRadius, landPoint, primaryAmount, type Stage } from './geometry';
import type { Box } from './layout';
import { type LetterState, Letters } from './letters';
import { irisProgress, pixelRise } from './timeline';

export const boxStyle = (box: Box): CSSProperties => ({
  position: 'absolute',
  left: box.cx - box.w / 2,
  top: box.cy - box.h / 2,
  width: box.w,
  height: box.h,
  borderRadius: box.r,
});

export const Disc = ({
  x,
  y,
  size,
  scale,
  color,
}: {
  x: number;
  y: number;
  size: number;
  scale: number;
  color: string;
}) =>
  scale > 0 ? (
    <div
      style={{
        ...boxStyle({ cx: x, cy: y, w: size, h: size, r: size / 2 }),
        backgroundColor: color,
        transform: scale === 1 ? undefined : `scale(${scale})`,
      }}
    />
  ) : null;

export const Irises = ({ stage, frame }: { stage: Stage; frame: number }) => {
  if (frame >= stage.schedule.dropStart) {
    return null;
  }
  return (
    <>
      {stage.targets.map((target, at) => {
        const radius =
          target === null
            ? 0
            : irisProgress(frame, stage.schedule.lands[at] ?? 0) * irisRadius(stage, at);
        if (radius <= 0) {
          return null;
        }
        const point = landPoint(stage, at);
        return (
          <div
            key={`iris-${at}`}
            style={{
              ...boxStyle({ cx: point.x, cy: point.y, w: radius * 2, h: radius * 2, r: radius }),
              backgroundColor: target ? stage.palette.primary : stage.palette.background,
            }}
          />
        );
      })}
    </>
  );
};

export const Words = ({
  stage,
  frame,
  face,
  fade,
}: {
  stage: Stage;
  frame: number;
  face: Face;
  fade: number;
}) => {
  const { line, schedule, palette } = stage;
  return (
    <>
      {line.words.map((word, at) => {
        const land = schedule.lands[at] ?? 0;
        const opacity = ramp(frame, land - 2, land + 3) * fade;
        if (opacity <= 0) {
          return null;
        }
        const amount = primaryAmount(stage, frame, {
          x: word.cx,
          y: word.top + line.lineHeight / 2,
        });
        return (
          <div
            key={`word-${at}`}
            style={{
              position: 'absolute',
              left: word.left,
              top: word.top + pixelRise(frame, land - 2, 7, 18),
              height: line.lineHeight,
              lineHeight: `${line.lineHeight}px`,
              fontFamily: face.family,
              fontWeight: face.weight,
              fontSize: line.size,
              letterSpacing: `${face.tracking}em`,
              whiteSpace: 'pre',
              color: mixLab(palette.text, palette.fillInk, amount),
              opacity,
            }}
          >
            {word.text}
          </div>
        );
      })}
    </>
  );
};

export const FillLayer = ({
  stage,
  fill,
  face,
  letters,
  glowShift,
  glowStrength,
}: {
  stage: Stage;
  fill: Blob;
  face: Face;
  letters: readonly LetterState[];
  glowShift: number;
  glowStrength: number;
}) => {
  const { palette, frameWidth, frameHeight } = stage;
  const edge = palette.tileEdge === null ? 0 : 4;
  const glow = mixLab(palette.primary, palette.fillInk, 0.1);
  return (
    <div
      style={{
        ...boxStyle(fill),
        backgroundColor: fill.color,
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: palette.tileEdge === null ? undefined : `${edge}px solid ${palette.tileEdge}`,
        transform: fill.rotation === 0 ? undefined : `rotate(${fill.rotation}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -(fill.cx - fill.w / 2) - edge,
          top: -(fill.cy - fill.h / 2) - edge,
          width: frameWidth,
          height: frameHeight,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: glowShift - frameHeight,
            width: frameWidth,
            height: frameHeight * 2,
            opacity: glowStrength,
            backgroundImage: `linear-gradient(180deg, ${palette.primary} 0%, ${glow} 25%, ${palette.primary} 50%, ${glow} 75%, ${palette.primary} 100%)`,
          }}
        />
        <Letters lockup={stage.lockup} face={face} color={palette.fillInk} states={letters} />
      </div>
    </div>
  );
};

export const Plate = ({
  box,
  color,
  scale,
  opacity,
  logoIn,
  logo,
  logoBox,
  size,
}: {
  box: Box;
  color: string;
  scale: number;
  opacity: number;
  logoIn: number;
  logo: string;
  logoBox: LogoBox | null;
  size: { width: number; height: number } | null;
}) =>
  scale > 0 ? (
    <div
      style={{
        ...boxStyle(box),
        backgroundColor: color,
        opacity,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {logoBox !== null && size !== null && logoIn > 0 ? (
        <div
          style={{
            width: size.width,
            height: size.height,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            opacity: logoIn,
            transform: logoIn === 1 ? undefined : `scale(${lerp(0.86, 1, logoIn)})`,
          }}
        >
          <Img
            src={resolveCustom(logo)}
            style={{
              position: 'absolute',
              maxWidth: 'none',
              left: (-logoBox.x * size.width) / logoBox.w,
              top: (-logoBox.y * size.height) / logoBox.h,
              width: size.width / logoBox.w,
              height: size.height / logoBox.h,
            }}
          />
        </div>
      ) : null}
    </div>
  ) : null;

export const DriftBand = ({ stage, shift }: { stage: Stage; shift: number }) => {
  const { frameWidth, frameHeight, palette } = stage;
  const shade = `${palette.text.slice(0, 7)}0c`;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: shift - frameHeight,
        width: frameWidth,
        height: frameHeight * 2,
        backgroundImage: `linear-gradient(180deg, transparent 0%, ${shade} 25%, transparent 50%, ${shade} 75%, transparent 100%)`,
      }}
    />
  );
};
