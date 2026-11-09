import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import { alpha } from './color';
import type { Face } from './fonts';
import type { LogoState } from './use-logo';

export type Box = { x: number; y: number; width: number; height: number };

export type TextRow = { text: string; top: number; size: number };

const centered = (face: Face, size: number, tracking: number): CSSProperties => ({
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  whiteSpace: 'pre',
  fontFamily: face.family,
  fontWeight: face.weight,
  fontSize: size,
  lineHeight: 1,
  letterSpacing: `${tracking}em`,
  paddingLeft: `${tracking}em`,
});

export const TextRows = ({
  rows,
  face,
  tracking,
  color,
  opacity,
  shadow,
}: {
  rows: readonly TextRow[];
  face: Face;
  tracking: number;
  color: string;
  opacity: number;
  shadow: boolean;
}) => (
  <>
    {rows.map((row, index) => (
      <div
        key={`${index}-${row.text}`}
        style={{
          ...centered(face, row.size, tracking),
          top: row.top,
          color,
          opacity,
          textShadow: shadow
            ? `0 ${(row.size * 0.06).toFixed(1)}px ${(row.size * 0.2).toFixed(1)}px rgba(0,0,0,0.7)`
            : undefined,
        }}
      >
        {row.text}
      </div>
    ))}
  </>
);

export const LogoPlate = ({
  plate,
  logoBox,
  logo,
  showPlate,
  colors,
}: {
  plate: Box;
  logoBox: Box;
  logo: LogoState;
  showPlate: boolean;
  colors: { plate: string; glass: string; primary: string; text: string };
}) => {
  const radius = Math.min(plate.width, plate.height) * 0.2;
  return (
    <>
      {showPlate ? (
        <div
          style={{
            position: 'absolute',
            left: plate.x,
            top: plate.y,
            width: plate.width,
            height: plate.height,
            borderRadius: radius,
            background: colors.plate,
            boxShadow: `0 0 ${(plate.height * 0.45).toFixed(0)}px ${alpha(colors.primary, 0.45)}, 0 ${(plate.height * 0.06).toFixed(0)}px ${(plate.height * 0.18).toFixed(0)}px rgba(0,0,0,0.6)`,
          }}
        />
      ) : null}
      {logo === null ? (
        <div
          style={{
            position: 'absolute',
            left: logoBox.x,
            top: logoBox.y,
            width: logoBox.width,
            height: logoBox.height,
            boxSizing: 'border-box',
            borderRadius: radius * 0.6,
            border: `4px dashed ${showPlate ? colors.glass : colors.text}`,
            opacity: 0.35,
          }}
        />
      ) : (
        <Img
          src={logo.src}
          style={{
            position: 'absolute',
            left: logoBox.x,
            top: logoBox.y,
            width: logoBox.width,
            height: logoBox.height,
            objectFit: 'contain',
          }}
        />
      )}
    </>
  );
};
