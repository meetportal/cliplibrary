import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import { mix } from './color';

const STOPS = [0, 0.1, 0.25, 0.42, 0.6, 0.78, 0.92, 1];

export const Backdrop = ({ base, beam }: { base: string; beam: string }) => {
  const id = useId().replace(/:/g, '');
  return (
    <AbsoluteFill style={{ backgroundColor: base }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" aria-hidden="true">
        <defs>
          <radialGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            cx={540}
            cy={520}
            r={980}
            gradientTransform="translate(540 520) scale(0.62 1) translate(-540 -520)"
          >
            {STOPS.map((offset, index) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={mix(beam, base, (index / (STOPS.length - 1)) ** 0.8)}
              />
            ))}
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
