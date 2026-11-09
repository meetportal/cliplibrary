import { useId } from 'react';

const FALLOFF = [0, 0.1, 0.22, 0.36, 0.5, 0.64, 0.78, 0.9, 1];

export const Spotlight = ({ color }: { color: string }) => {
  const id = `magnifier-spot-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      aria-hidden="true"
      width={1080}
      height={1920}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
          {FALLOFF.map((stop) => (
            <stop
              key={stop}
              offset={stop}
              stopColor={color}
              stopOpacity={0.5 + 0.5 * Math.cos(Math.PI * stop)}
            />
          ))}
        </radialGradient>
      </defs>
      <ellipse cx={540} cy={1000} rx={780} ry={920} fill={`url(#${id})`} />
    </svg>
  );
};
