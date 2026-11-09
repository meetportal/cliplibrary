import { AbsoluteFill } from 'remotion';
import type { DominoWordsProps } from '@/schemas';
import { alpha } from './color';

export const Backdrop = ({ colors }: { colors: DominoWordsProps['colors'] }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(to bottom, ${colors.backgroundEdge} 0%, ${colors.background} 42%, ${colors.background} 100%)`,
    }}
  />
);

export const SideShade = ({ colors }: { colors: DominoWordsProps['colors'] }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(to right, ${alpha(colors.backgroundEdge, 0.75)} 0%, ${alpha(colors.backgroundEdge, 0)} 24%, ${alpha(colors.backgroundEdge, 0)} 76%, ${alpha(colors.backgroundEdge, 0.75)} 100%)`,
    }}
  />
);

export const ReflectionFade = ({
  colors,
  floorY,
  depth,
  height,
}: {
  colors: DominoWordsProps['colors'];
  floorY: number;
  depth: number;
  height: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: floorY,
      height: height - floorY,
      background: `linear-gradient(to bottom, ${alpha(colors.background, 0.35)} 0%, ${colors.background} ${((depth / Math.max(1, height - floorY)) * 100).toFixed(2)}%, ${colors.background} 100%)`,
    }}
  />
);

export type LitSpan = { from: number; to: number; strength: number };

export const FloorLine = ({
  floor,
  colors,
  lit,
}: {
  floor: DominoWordsProps['floor'];
  colors: DominoWordsProps['colors'];
  lit: LitSpan[];
}) => {
  const half = floor.thickness / 2;
  const glow = floor.glow;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: -40,
          right: -40,
          top: floor.y - half,
          height: floor.thickness,
          background: colors.secondary,
          boxShadow:
            glow > 0
              ? `0 0 ${(6 * glow).toFixed(1)}px ${colors.secondary}, 0 0 ${(22 * glow).toFixed(1)}px ${alpha(colors.secondary, 0.7)}`
              : 'none',
        }}
      />
      {lit.map((span, index) =>
        span.strength > 0.001 && span.to - span.from > 0.5 ? (
          <div
            key={index.toString()}
            style={{
              position: 'absolute',
              left: span.from,
              width: span.to - span.from,
              top: floor.y - half,
              height: floor.thickness,
              borderRadius: half,
              background: alpha(colors.primary, span.strength),
              boxShadow: `0 0 ${(8 * Math.max(glow, 0.4)).toFixed(1)}px ${alpha(colors.primary, span.strength)}, 0 0 ${(28 * Math.max(glow, 0.4)).toFixed(1)}px ${alpha(colors.primary, 0.6 * span.strength)}`,
            }}
          />
        ) : null,
      )}
    </>
  );
};
