import { AbsoluteFill } from 'remotion';
import { mixHex, withAlpha } from './color';

const EASED = [0, 0.08, 0.2, 0.36, 0.54, 0.72, 0.88, 1];

const glowGradient = (angle: number, color: string, strength: number, extent: number) =>
  `linear-gradient(${angle}deg, ${EASED.map((at) => {
    const alpha = strength * (1 - at) ** 2;
    return `${withAlpha(color, alpha)} ${(at * extent).toFixed(1)}%`;
  }).join(', ')}, ${withAlpha(color, 0)} 100%)`;

export const Backdrop = ({
  background,
  primary,
  strength,
  drift,
  frame,
  dark,
}: {
  background: string;
  primary: string;
  strength: number;
  drift: number;
  frame: number;
  dark: boolean;
}) => {
  const warm = mixHex(primary, background, dark ? 0.35 : 0.45);
  const cool = mixHex(primary, background, dark ? 0.55 : 0.6);
  const level = strength * (dark ? 0.45 : 0.75);
  const sway = drift * 60;
  const ax = Math.sin(frame / 70) * sway;
  const ay = Math.cos(frame / 90) * sway * 0.6;
  const bx = Math.cos(frame / 80) * sway;
  const by = Math.sin(frame / 100) * sway * 0.6;
  const layer = {
    position: 'absolute' as const,
    left: '-10%',
    top: '-10%',
    width: '120%',
    height: '120%',
  };
  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      {level > 0 ? (
        <>
          <div
            style={{
              ...layer,
              backgroundImage: glowGradient(220, warm, level, 55),
              transform: `translate(${ax.toFixed(2)}px, ${ay.toFixed(2)}px)`,
            }}
          />
          <div
            style={{
              ...layer,
              backgroundImage: glowGradient(35, cool, level * 0.9, 50),
              transform: `translate(${bx.toFixed(2)}px, ${by.toFixed(2)}px)`,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
