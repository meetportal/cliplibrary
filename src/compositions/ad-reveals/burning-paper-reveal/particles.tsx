import { useId } from 'react';
import { burnAt, CARD, edgeX, hash } from './burn';
import { mixLab } from './color';
import { burningUntil, flameTip } from './flames';
import type { BurnLook } from './look';
import { FILTER_REGION } from './overlay';

const SPARKS = 48;
const SPARK_FADE = 4;
const PUFFS = 18;
const PUFF_FRAMES = 84;

const cycle = (frame: number, index: number, period: number) => {
  const shifted = frame + hash(index + 0.37) * period;
  const round = Math.floor(shifted / period);
  const age = shifted - round * period;
  return { round, age, birth: frame - age };
};

export const Sparks = ({ look }: { look: BurnLook }) => {
  const count = Math.round(SPARKS * look.sparks);
  if (count === 0) {
    return null;
  }
  const hot = mixLab(look.flame, '#ffe7a6', 0.6);
  const dots = Array.from({ length: count }, (_, index) => {
    const period = 34 + Math.round(hash(index * 3.1) * 30);
    const { round, age, birth } = cycle(look.frame, index, period);
    const seed = index * 17.3 + round * 5.1;
    const born = burnAt(birth, look.burn, look.fps);
    const y0 = Math.min(CARD.height * (0.04 + 0.7 * hash(seed)), burningUntil(born.dying) - 30);
    const x0 = Math.min(CARD.width, edgeX(y0, born.front, look.burn)) + 10;
    const rise = 4.2 + 4 * hash(seed + 1);
    const drift = 0.8 + 1.8 * hash(seed + 2);
    const life = age / period;
    const x = x0 + drift * age + 9 * Math.sin(age * 0.17 + seed);
    const y = y0 - rise * age;
    const opacity =
      Math.min(1, age / SPARK_FADE, (period - age) / SPARK_FADE) *
      (0.55 + 0.45 * Math.sin(Math.PI * life)) *
      born.intensity;
    const size = 2 + 2.6 * hash(seed + 3);
    return { key: index, x, y, opacity, size };
  });
  return (
    <g>
      {dots
        .filter((dot) => dot.opacity > 0.01)
        .map((dot) => (
          <circle
            key={dot.key}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            fill={hot}
            opacity={dot.opacity}
          />
        ))}
    </g>
  );
};

export const Smoke = ({ look }: { look: BurnLook }) => {
  const id = useId().replace(/:/g, '');
  if (look.smoke <= 0) {
    return null;
  }
  const puffs = Array.from({ length: PUFFS }, (_, index) => {
    const shifted = look.frame + (index * PUFF_FRAMES) / PUFFS;
    const round = Math.floor(shifted / PUFF_FRAMES);
    const age = shifted - round * PUFF_FRAMES;
    const born = burnAt(look.frame - age, look.burn, look.fps);
    const seed = index * 7.7 + round * 3.3;
    const tip = flameTip(look, born.front, born.dying);
    const life = age / PUFF_FRAMES;
    const x = tip.x + 8 * (hash(seed) - 0.5) + 0.35 * age + 16 * life * Math.sin(age * 0.05 + seed);
    const y = tip.y - 2.6 * age - 0.004 * age * age;
    const radius = 8 + 0.55 * age;
    const opacity = 0.22 * look.smoke * born.smoke * Math.min(1, age / 4) * (1 - life) ** 1.5;
    return { key: index, x, y, radius, opacity };
  });
  return (
    <g filter={`url(#${id}-smoke)`}>
      <defs>
        <filter id={`${id}-smoke`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={8} />
        </filter>
      </defs>
      {puffs
        .filter((puff) => puff.opacity > 0.003)
        .map((puff) => (
          <ellipse
            key={puff.key}
            cx={puff.x}
            cy={puff.y}
            rx={puff.radius}
            ry={puff.radius * 1.5}
            fill={look.smokeColor}
            opacity={Math.min(1, puff.opacity)}
          />
        ))}
    </g>
  );
};
