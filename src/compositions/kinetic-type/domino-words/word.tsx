import type { Domino } from './chain';
import { alpha } from './color';
import type { Face } from './fonts';
import { type Ink, textShadow } from './ink';

const fillAlphaOf = (fill: string) =>
  fill.length === 9 ? Number.parseInt(fill.slice(7, 9), 16) / 255 : 1;

export const DominoWord = ({
  domino,
  angle,
  ink,
  face,
  plain,
}: {
  domino: Domino;
  angle: number;
  ink: Ink;
  face: Face;
  plain: boolean;
}) => {
  const { thickness, length, size } = domino;
  const fillAlpha = fillAlphaOf(ink.fill);
  return (
    <div
      style={{
        position: 'absolute',
        left: domino.pivot - thickness,
        top: -length,
        width: thickness,
        height: length,
        transformOrigin: '100% 100%',
        transform: `rotate(${((angle * 180) / Math.PI).toFixed(4)}deg)`,
        borderRadius: ink.tile === null ? 0 : thickness * 0.1,
        background: ink.tile ?? 'transparent',
        boxShadow:
          !plain && ink.tile !== null && ink.glowAmount > 0.001
            ? `0 0 ${(0.3 * size * Math.min(ink.glowAmount, 1.5)).toFixed(2)}px ${alpha(ink.glow, Math.min(0.9, ink.glowAmount))}`
            : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: length,
          height: thickness,
          transformOrigin: '0 0',
          transform: `translate(0px, ${length.toFixed(3)}px) rotate(-90deg)`,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: domino.pad,
            top: domino.textTop,
            fontFamily: face.family,
            fontWeight: face.weight,
            fontSize: size,
            lineHeight: `${size}px`,
            whiteSpace: 'pre',
            color: ink.fill,
            WebkitTextStroke:
              ink.strokeWidth > 0 ? `${ink.strokeWidth.toFixed(2)}px ${ink.stroke}` : undefined,
            textShadow: !plain && ink.tile === null ? textShadow(ink, size, fillAlpha) : 'none',
          }}
        >
          {domino.text}
        </span>
      </div>
    </div>
  );
};

export const FloorShadow = ({
  minX,
  maxX,
  size,
  strength,
}: {
  minX: number;
  maxX: number;
  size: number;
  strength: number;
}) => {
  const height = size * 0.12;
  const blur = size * 0.14;
  return (
    <div
      style={{
        position: 'absolute',
        left: minX + blur * 0.5,
        width: Math.max(1, maxX - minX - blur),
        top: -height / 2,
        height,
        borderRadius: height,
        background: `rgba(0, 0, 0, ${(0.22 * strength).toFixed(3)})`,
        boxShadow: `0 0 ${blur.toFixed(2)}px ${(blur * 0.4).toFixed(2)}px rgba(0, 0, 0, ${(0.22 * strength).toFixed(3)})`,
      }}
    />
  );
};
