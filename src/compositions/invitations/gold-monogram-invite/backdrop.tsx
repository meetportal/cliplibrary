import { useId } from 'react';
import { mix } from './color';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const eased = (t: number) => t * t * (3 - 2 * t);

export const Backdrop = ({ center, edge }: { center: string; edge: string }) => {
  const id = `backdrop${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      aria-hidden="true"
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <radialGradient id={id} cx="960" cy="540" r="1180" gradientUnits="userSpaceOnUse">
          {STOPS.map((offset) => (
            <stop key={offset} offset={offset} stopColor={mix(center, edge, eased(offset))} />
          ))}
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id})`} />
    </svg>
  );
};
