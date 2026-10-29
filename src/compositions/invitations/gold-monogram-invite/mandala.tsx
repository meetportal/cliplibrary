import { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import type { GoldMonogramInviteProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { mandalaRings } from './mandala-geometry';
import { dashStyle, useSvgId } from './reveal';

const RING_SHARE = 0.34;

export const Mandala = ({
  frame,
  fps,
  mandala,
  gold,
  dimAt,
}: {
  frame: number;
  fps: number;
  mandala: GoldMonogramInviteProps['mandala'];
  gold: GoldMonogramInviteProps['gold'];
  dimAt: number;
}) => {
  const gradient = useSvgId('mandala-gold');
  const rings = useMemo(() => mandalaRings(mandala.radius), [mandala.radius]);
  const angle = (mandala.spin * frame) / fps;
  const ringFrames = mandala.drawFrames * RING_SHARE;
  const ringStep = (mandala.drawFrames - ringFrames) / Math.max(1, rings.length - 1);
  const opacity = tween(frame, [dimAt, dimAt + 45], [1, mandala.restOpacity], smooth);
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" role="presentation">
        <defs>
          <linearGradient
            id={gradient}
            gradientUnits="userSpaceOnUse"
            x1={-mandala.radius}
            y1={-mandala.radius}
            x2={mandala.radius}
            y2={mandala.radius}
            gradientTransform={`rotate(${-angle})`}
          >
            <stop offset="0" stopColor={gold.light} />
            <stop offset="0.55" stopColor={gold.dark} />
            <stop offset="1" stopColor={gold.dark} />
          </linearGradient>
        </defs>
        <g transform={`translate(${mandala.x} ${mandala.y}) rotate(${angle})`}>
          {rings.map((ring, index) => {
            const start = (rings.length - 1 - index) * ringStep;
            const progress = tween(frame, [start, start + ringFrames], [0, 1], smooth);
            if (progress <= 0) {
              return null;
            }
            if (ring.kind === 'dots') {
              return (
                <g key={`dots${index}`} fill={`url(#${gradient})`}>
                  {ring.dots.map((dot, dotIndex) => {
                    const share = dotIndex / ring.dots.length;
                    const shown = Math.min(1, Math.max(0, (progress - share * 0.75) / 0.25));
                    return shown > 0 ? (
                      <circle
                        key={`${dot.x}:${dot.y}`}
                        cx={dot.x}
                        cy={dot.y}
                        r={dot.r}
                        opacity={shown}
                      />
                    ) : null;
                  })}
                </g>
              );
            }
            return (
              <g
                key={`lines${index}`}
                fill="none"
                stroke={`url(#${gradient})`}
                strokeWidth={mandala.lineWidth * (0.45 + 0.55 * Math.min(1, progress * 1.6))}
                strokeLinejoin="round"
              >
                {ring.paths.map((path) => (
                  <path key={path} d={path} pathLength={1} style={dashStyle(progress)} />
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
