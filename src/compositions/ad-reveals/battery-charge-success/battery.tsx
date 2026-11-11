import { useId } from 'react';
import { alpha, mix } from './color';
import type { Box } from './geometry';
import { INSET, innerBox, liquidSurface, waveY } from './liquid';

export type BatteryLook = {
  box: Box;
  roundness: number;
  level: number;
  tone: string;
  liquid: string;
  ink: string;
  shell: string;
  body: string;
  glow: number;
  wave: number;
  bubbles: boolean;
  rings: readonly number[];
  bolt: number;
  frame: number;
};

const SHELL = 7;
const TICKS = [0.3, 0.47, 0.64, 0.81] as const;
const BOLT = 'M0.62 0 L0.1 0.58 H0.46 L0.36 1 L0.9 0.4 H0.54 Z';
const BUBBLES = [
  { x: 0.18, speed: 0.31, offset: 0.1, r: 5 },
  { x: 0.34, speed: 0.24, offset: 0.62, r: 7 },
  { x: 0.52, speed: 0.36, offset: 0.35, r: 4 },
  { x: 0.67, speed: 0.27, offset: 0.85, r: 6 },
  { x: 0.81, speed: 0.33, offset: 0.48, r: 5 },
  { x: 0.44, speed: 0.21, offset: 0.2, r: 3 },
] as const;

const wavePath = (frame: number, inner: Box, surface: number, amplitude: number, phase: number) => {
  const steps = 24;
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const x = inner.x + (inner.width * index) / steps;
    const y = waveY(x, frame, surface, amplitude, phase);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const bottom = inner.y + inner.height + 4;
  return `${points.join(' ')} L${(inner.x + inner.width).toFixed(1)} ${bottom} L${inner.x.toFixed(1)} ${bottom} Z`;
};

export const Battery = ({ look }: { look: BatteryLook }) => {
  const id = useId().replace(/:/g, '');
  const { box, level } = look;
  const inner = innerBox(box);
  const innerRadius = Math.max(4, look.roundness - INSET);
  const { surface, amplitude } = liquidSurface(box, level, look.wave);
  const time = look.frame / 30;
  const liquidHeight = inner.y + inner.height - surface;
  const floor = Math.max(0, 1 - level * 4) * (0.82 + 0.18 * Math.sin(time * 2.6));
  const glow = look.glow * (0.55 + 0.45 * level);
  const boltSize = Math.round(box.height * 0.075);
  const boltY = box.y + box.height * 0.22 - boltSize / 2;
  const boltX = box.x + box.width / 2 - boltSize * 0.4;
  const covered = Math.max(0, Math.min(1, (boltY + boltSize - surface) / boltSize));
  const boltColor = mix(
    mix(mix(look.body, look.shell, 0.22), look.tone, look.bolt),
    look.ink,
    covered,
  );
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: 'absolute', left: 0, top: 0 }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-glow`} x="-40%" y="-30%" width="180%" height="160%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <clipPath id={`${id}-inner`}>
          <rect
            x={inner.x}
            y={inner.y}
            width={inner.width}
            height={inner.height}
            rx={innerRadius}
          />
        </clipPath>
        <linearGradient
          id={`${id}-liquid`}
          x1="0"
          y1={surface}
          x2="0"
          y2={inner.y + inner.height}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={mix(look.liquid, '#ffffff', 0.28)} />
          <stop offset="1" stopColor={mix(look.liquid, look.body, 0.12)} />
        </linearGradient>
        <linearGradient
          id={`${id}-floor`}
          x1="0"
          y1={inner.y + inner.height * 0.62}
          x2="0"
          y2={inner.y + inner.height}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={look.tone} stopOpacity={0} />
          <stop offset="0.55" stopColor={look.tone} stopOpacity={0.35} />
          <stop offset="1" stopColor={look.tone} stopOpacity={0.95} />
        </linearGradient>
      </defs>
      {look.rings.map((ring, index) =>
        ring <= 0 || ring >= 1 ? null : (
          <rect
            key={index}
            x={box.x - 14 - ring * 70}
            y={box.y - 14 - ring * 70}
            width={box.width + 28 + ring * 140}
            height={box.height + 28 + ring * 140}
            rx={look.roundness + 14 + ring * 40}
            fill="none"
            stroke={alpha(look.tone, 0.75 * (1 - ring) * Math.min(1, ring * 8))}
            strokeWidth={4}
          />
        ),
      )}
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={look.roundness}
        fill="none"
        stroke={look.tone}
        strokeWidth={18}
        opacity={glow}
        filter={`url(#${id}-glow)`}
      />
      <rect
        x={box.x + box.width / 2 - 42}
        y={box.y - 22}
        width={84}
        height={26}
        rx={6}
        fill={mix(look.shell, look.body, 0.25)}
      />
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={look.roundness}
        fill={look.body}
        stroke={look.shell}
        strokeWidth={SHELL}
      />
      <g clipPath={`url(#${id}-inner)`}>
        {floor > 0.001 ? (
          <rect
            x={inner.x}
            y={inner.y}
            width={inner.width}
            height={inner.height}
            fill={`url(#${id}-floor)`}
            opacity={floor}
          />
        ) : null}
        {level > 0.0005 ? (
          <>
            <path
              d={wavePath(look.frame, inner, surface - 6, amplitude * 0.8, 2.1)}
              fill={mix(look.liquid, look.body, 0.45)}
              opacity={0.7}
            />
            <path
              d={wavePath(look.frame, inner, surface, amplitude, 0)}
              fill={`url(#${id}-liquid)`}
            />
          </>
        ) : null}
        {look.bubbles && liquidHeight > 40
          ? BUBBLES.map((bubble) => {
              const cycle = (time * bubble.speed + bubble.offset) % 1;
              const y = inner.y + inner.height - 12 - cycle * (liquidHeight - 24);
              const shown = Math.min(1, cycle / 0.15, (1 - cycle) / 0.2);
              return (
                <circle
                  key={bubble.x}
                  cx={inner.x + inner.width * bubble.x + Math.sin(time * 2 + bubble.offset * 9) * 6}
                  cy={y}
                  r={bubble.r}
                  fill="none"
                  stroke={alpha('#ffffff', 0.45 * shown)}
                  strokeWidth={2}
                />
              );
            })
          : null}
        {TICKS.flatMap((tick) => [
          <rect
            key={`l${tick}`}
            x={inner.x + 8}
            y={inner.y + inner.height * tick}
            width={16}
            height={3}
            rx={1.5}
            fill={alpha(look.shell, 0.28)}
          />,
          <rect
            key={`r${tick}`}
            x={inner.x + inner.width - 24}
            y={inner.y + inner.height * tick}
            width={16}
            height={3}
            rx={1.5}
            fill={alpha(look.shell, 0.28)}
          />,
        ])}
      </g>
      <path
        d={BOLT}
        transform={`translate(${boltX.toFixed(1)} ${boltY.toFixed(1)}) scale(${boltSize * 0.8} ${boltSize})`}
        fill={boltColor}
      />
    </svg>
  );
};
