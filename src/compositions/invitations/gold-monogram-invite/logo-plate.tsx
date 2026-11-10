import { Img } from 'remotion';
import type { GoldTones } from './color';
import type { LogoState } from './use-logo';

export type LogoBox = { width: number; height: number; padding: number };

export const logoBox = (
  logo: LogoState,
  maxWidth: number,
  maxHeight: number,
  plate: boolean,
): LogoBox | null => {
  if (logo === null) {
    return null;
  }
  const width = logo.aspect >= maxWidth / maxHeight ? maxWidth : maxHeight * logo.aspect;
  const height = width / logo.aspect;
  const padding = plate ? Math.round(12 + height * 0.14) : 0;
  return { width: Math.round(width), height: Math.round(height), padding };
};

export const LogoPlate = ({
  logo,
  box,
  centerX,
  top,
  opacity,
  plate,
  surface,
  gold,
}: {
  logo: LogoState;
  box: LogoBox;
  centerX: number;
  top: number;
  opacity: number;
  plate: boolean;
  surface: string;
  gold: GoldTones;
}) => {
  if (logo === null || opacity <= 0) {
    return null;
  }
  const outerWidth = box.width + box.padding * 2;
  const outerHeight = box.height + box.padding * 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(centerX - outerWidth / 2),
        top: Math.round(top),
        width: outerWidth,
        height: outerHeight,
        opacity,
      }}
    >
      {plate ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            backgroundColor: surface,
            border: `1.5px solid ${gold.mid}`,
            boxSizing: 'border-box',
          }}
        />
      ) : null}
      <Img
        src={logo.src}
        style={{
          position: 'absolute',
          left: box.padding,
          top: box.padding,
          width: box.width,
          height: box.height,
        }}
      />
    </div>
  );
};
