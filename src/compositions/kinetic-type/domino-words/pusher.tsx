import type { DominoWordsProps } from '@/schemas';
import { alpha, mixHex } from './color';

export const Pusher = ({
  x,
  pusher,
  colors,
}: {
  x: number;
  pusher: DominoWordsProps['pusher'];
  colors: DominoWordsProps['colors'];
}) => {
  const radius = pusher.radius;
  const spin = ((x / radius) * 180) / Math.PI;
  const light = mixHex(colors.primary, '#ffffff', 0.35);
  const dark = mixHex(colors.primary, '#000000', 0.45);
  const glowing = pusher.style === 'glow';
  const body = glowing
    ? `linear-gradient(160deg, #ffffff 0%, ${mixHex(colors.primary, '#ffffff', 0.6)} 40%, ${colors.primary} 100%)`
    : `linear-gradient(160deg, ${light} 0%, ${colors.primary} 45%, ${dark} 100%)`;
  const halo = glowing
    ? `0 0 ${radius * 0.5}px ${alpha(colors.primary, 0.95)}, 0 0 ${radius * 1.4}px ${alpha(colors.primary, 0.6)}`
    : pusher.style === 'striped'
      ? `0 0 ${radius * 0.25}px ${alpha(colors.primary, 0.7)}, 0 0 ${radius * 0.7}px ${alpha(colors.primary, 0.35)}`
      : 'none';
  return (
    <div
      style={{
        position: 'absolute',
        left: x - radius,
        top: -2 * radius,
        width: 2 * radius,
        height: 2 * radius,
        borderRadius: '50%',
        overflow: 'hidden',
        background: body,
        boxShadow: halo,
      }}
    >
      {glowing ? null : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${spin.toFixed(3)}deg)`,
          }}
        >
          {pusher.style === 'striped' ? (
            <div
              style={{
                position: 'absolute',
                left: -2,
                right: -2,
                top: radius * 0.83,
                height: radius * 0.34,
                background: alpha(colors.surface, 0.92),
              }}
            />
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: radius * 0.3,
              top: radius * 0.3,
              width: radius * 0.28,
              height: radius * 0.28,
              borderRadius: '50%',
              background:
                pusher.style === 'striped' ? alpha(colors.surface, 0.92) : alpha(dark, 0.9),
            }}
          />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'linear-gradient(150deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 38%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </div>
  );
};
