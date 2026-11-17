import type { CSSProperties } from 'react';
import { Easing, Img } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { ramp } from '../../kit/motion';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';
import { CanvasText } from './canvas-text';
import type { Face } from './fonts';
import { type Blob, irisRadius, landPoint, primaryAmount, type Stage } from './geometry';
import type { Box } from './layout';
import { type LetterState, Letters } from './letters';
import { irisProgress, riseIn } from './timeline';

const WORD_RISE = 0.25;
const WORD_SINK = 0.4;
const WORD_EXIT = 12;

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
  if (frame >= stage.schedule.flipsEnd) {
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

export const Words = ({ stage, frame, face }: { stage: Stage; frame: number; face: Face }) => {
  const { line, schedule, palette } = stage;
  const count = line.words.length;
  const stagger = count <= 1 ? 0 : Math.min(1, 4 / (count - 1));
  const rise = Math.round(line.size * WORD_RISE);
  const sink = Math.round(line.size * WORD_SINK);
  return (
    <>
      {line.words.map((word, at) => {
        const land = schedule.lands[at] ?? 0;
        const leave = schedule.dropStart + 3 + at * stagger;
        const gone = ramp(frame, leave, leave + WORD_EXIT, Easing.inOut(Easing.sin));
        const opacity = ramp(frame, land - 2, land + 4, Easing.inOut(Easing.sin)) * (1 - gone);
        if (opacity <= 0) {
          return null;
        }
        const amount = primaryAmount(stage, frame, {
          x: word.cx,
          y: word.top + line.lineHeight / 2,
        });
        return (
          <CanvasText
            key={`word-${at}`}
            glyph={{
              text: word.text,
              face,
              size: line.size,
              tracking: face.tracking,
              color: mixLab(palette.text, palette.fillInk, amount),
              lineHeight: line.lineHeight,
              width: word.width,
            }}
            left={word.left}
            top={word.top}
            opacity={opacity}
            dx={0}
            dy={
              riseIn(frame, land - 2, 10, rise) +
              sink * ramp(frame, leave, leave + WORD_EXIT, Easing.in(Easing.quad))
            }
          />
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
        transform: `rotate(${fill.rotation.toFixed(3)}deg) scale(${fill.scale.toFixed(5)})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -(fill.cx - fill.shift - fill.w / 2) - edge,
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

const plateTransform = (dx: number, dy: number, rotation: number, scale: number) =>
  `translate(${dx.toFixed(3)}px, ${dy.toFixed(3)}px) rotate(${rotation.toFixed(3)}deg) scale(${scale.toFixed(5)})`;

export const Trail = ({
  stage,
  fill,
  speed,
  fade,
}: {
  stage: Stage;
  fill: Blob;
  speed: number;
  fade: number;
}) => {
  const strength = Math.min(1, Math.max(0, (speed - 16) / 50)) ** 2;
  if (strength <= 0 || fade <= 0) {
    return null;
  }
  const color = mixLab(stage.palette.background, stage.palette.primary, 0.45);
  const length = Math.min(speed * 3.2, stage.frameWidth * 0.55) * fade;
  const end = fill.cx - fill.w * 0.3;
  return (
    <>
      {[
        [-0.26, 0.8],
        [0, 1],
        [0.26, 0.62],
      ].map(([row = 0, share = 1]) => {
        const span = length * share;
        return (
          <div
            key={`trail-${row}`}
            style={{
              position: 'absolute',
              left: end - span,
              top: fill.cy + row * fill.h - 2,
              width: span,
              height: 4,
              borderRadius: 2,
              backgroundColor: color,
              opacity: strength,
            }}
          />
        );
      })}
    </>
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
  dx,
  dy,
  rotation,
}: {
  box: Box;
  color: string;
  scale: number;
  dx: number;
  dy: number;
  rotation: number;
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
        transform: plateTransform(dx, dy, rotation, scale),
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
