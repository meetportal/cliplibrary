import { AbsoluteFill } from 'remotion';
import type { GoldMonogramInviteProps } from '@/schemas';
import { withAlpha } from './reveal';

const FALLOFF = [0, 0.1, 0.22, 0.36, 0.52, 0.68, 0.82, 0.93, 1];

const sideStops = (edge: string, reach: number, mirrored: boolean): string[] =>
  FALLOFF.map((amount) => {
    const alpha = (1 - amount) ** 2;
    const position = amount * reach * 100;
    return `${withAlpha(edge, alpha)} ${(mirrored ? 100 - position : position).toFixed(2)}%`;
  });

const vignette = (direction: 'right' | 'bottom', edge: string, reach: number): string =>
  `linear-gradient(to ${direction}, ${[
    ...sideStops(edge, reach, false),
    ...sideStops(edge, reach, true).reverse(),
  ].join(', ')})`;

export const InviteBackdrop = ({
  background,
}: {
  background: GoldMonogramInviteProps['background'];
}) => (
  <AbsoluteFill style={{ backgroundColor: background.color }}>
    {background.vignette > 0 ? (
      <>
        <AbsoluteFill
          style={{ backgroundImage: vignette('right', background.edge, background.vignette) }}
        />
        <AbsoluteFill
          style={{
            backgroundImage: vignette(
              'bottom',
              background.edge,
              Math.min(0.5, background.vignette * 1.3),
            ),
          }}
        />
      </>
    ) : null}
  </AbsoluteFill>
);
