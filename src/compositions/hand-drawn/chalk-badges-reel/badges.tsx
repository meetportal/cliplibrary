import type { ReactNode } from 'react';
import { ChalkText, DrawPath, Pop, Sparkle } from './chalk';
import type { Measure, ReelFaceKey } from './fonts';
import { FILL_LAST, MARKS_SLOW, type Stroke, span, TEXT_FIRST } from './timeline';

export type ReelPalette = {
  chalk: string;
  primary: string;
  primaryInk: string;
  primaryLine: string;
  secondary: string;
  secondaryInk: string;
  ribbon: string;
  ribbonInk: string;
  ribbonShade: string;
  accent: string;
  plate: string;
  shadow: string;
};

export type BadgeKit = {
  id: string;
  text: string;
  stroke: Stroke;
  frame: number;
  palette: ReelPalette;
  measure: Measure;
  ornaments: boolean;
  twinkle: number;
};

type Fit = { size: number; width: number };

const fitText = (
  kit: BadgeKit,
  face: ReelFaceKey,
  base: number,
  maxWidth: number,
  tracking = 0,
): Fit => {
  const unit = Math.max(0.01, kit.measure(kit.text, face, tracking));
  const size = Math.min(base, maxWidth / unit);
  return { size, width: unit * size };
};

export const pulse = (kit: { frame: number; twinkle: number }, phase: number) =>
  1 + 0.16 * kit.twinkle * Math.sin(kit.frame * 0.19 + phase);

const ScriptBadge = (kit: BadgeKit) => {
  const f = fitText(kit, 'script', 92, 300);
  const hw = Math.max(f.width / 2, 40);
  const swash = `M${-hw - 26} 46 C${-hw / 3} 30 ${hw / 3} 54 ${hw + 6} 38 c14 -6 22 -22 8 -24 c-12 -2 -10 18 6 22 c10 2 22 -4 30 -10`;
  return (
    <g>
      <ChalkText
        id={`${kit.id}-t`}
        text={kit.text}
        face="script"
        size={f.size}
        width={f.width}
        y={-14}
        stroke={span(0, 0.75, kit.stroke)}
        fill={kit.palette.chalk}
      />
      <DrawPath
        d={swash}
        stroke={span(0.35, 1, kit.stroke)}
        color={kit.palette.chalk}
        width={4.5}
      />
      {kit.ornaments ? (
        <>
          <Sparkle
            x={hw + 0.45 * f.size}
            y={-14 - 0.95 * f.size}
            size={17}
            color={kit.palette.primaryLine}
            stroke={span(0.7, 0.95, kit.stroke)}
            pulse={pulse(kit, 0)}
          />
          <Sparkle
            x={hw + 0.72 * f.size}
            y={-14 - 0.6 * f.size}
            size={9}
            color={kit.palette.primaryLine}
            stroke={span(0.78, 1, kit.stroke)}
            pulse={pulse(kit, 2)}
          />
        </>
      ) : null}
    </g>
  );
};

const tapeEdge = (x: number, h: number, dir: number) => {
  const steps = 6;
  return Array.from({ length: steps + 1 }, (_, at) => {
    const y = -h / 2 + (h * at) / steps;
    const jag = at % 2 === 0 ? 0 : 7 * dir;
    return `${(x + jag).toFixed(1)} ${y.toFixed(1)}`;
  });
};

const TapeBadge = (kit: BadgeKit) => {
  const f = fitText(kit, 'heavy', 72, 300, 0.02);
  const w = f.width + 66;
  const h = 98;
  const right = tapeEdge(w / 2, h, -1);
  const left = tapeEdge(-w / 2, h, 1).reverse();
  const d = `M${right.join(' L')} L${left.join(' L')} Z`;
  return (
    <g>
      <g transform="rotate(-2.5)">
        <Pop
          stroke={span(0, 0.62, kit.stroke, FILL_LAST)}
          from={0.06}
          axis="x"
          dust={kit.palette.chalk}
        >
          {(tint) => <path d={d} fill={tint(kit.palette.secondary)} />}
        </Pop>
        <ChalkText
          id={`${kit.id}-t`}
          text={kit.text}
          face="heavy"
          size={f.size}
          width={f.width}
          y={2}
          tracking={0.02}
          stroke={span(0.14, 0.92, kit.stroke, TEXT_FIRST)}
          fill={kit.palette.secondaryInk}
        />
      </g>
      {kit.ornaments ? (
        <DrawPath
          d={`M${-f.width * 0.22} 74 Q0 70 ${f.width * 0.22} 73`}
          stroke={span(0.7, 1, kit.stroke, TEXT_FIRST)}
          color={kit.palette.chalk}
          width={4}
        />
      ) : null}
    </g>
  );
};

const burst = (points: number, outer: number, inner: number) =>
  `M${Array.from({ length: points * 2 }, (_, at) => {
    const radius = at % 2 === 0 ? outer : inner;
    const angle = (Math.PI * at) / points - Math.PI / 2;
    return `${(Math.cos(angle) * radius).toFixed(1)} ${(Math.sin(angle) * radius).toFixed(1)}`;
  }).join(' L')} Z`;

const BurstBadge = (kit: BadgeKit) => {
  const f = fitText(kit, 'heavy', 66, 128, 0.02);
  const slash = (x: number, y: number, s: number) =>
    `M${x} ${y} l${14 * s} ${-14 * s} M${x + 12 * s} ${y + 10 * s} l${10 * s} ${-10 * s}`;
  return (
    <g>
      <Pop
        stroke={span(0, 0.6, kit.stroke, FILL_LAST)}
        from={0.1}
        turn={-35}
        dust={kit.palette.chalk}
      >
        {(tint) => (
          <>
            <path d={burst(22, 98, 82)} fill={tint(kit.palette.primary)} />
            <circle
              r={64}
              fill="none"
              stroke={tint(kit.palette.primaryInk)}
              strokeWidth={2.5}
              opacity={0.35}
            />
          </>
        )}
      </Pop>
      <ChalkText
        id={`${kit.id}-t`}
        text={kit.text}
        face="heavy"
        size={f.size}
        width={f.width}
        y={2}
        tracking={0.02}
        stroke={span(0.3, 0.96, kit.stroke, TEXT_FIRST)}
        fill={kit.palette.primaryInk}
      />
      {kit.ornaments ? (
        <>
          <DrawPath
            d={slash(-128, -78, 1)}
            stroke={span(0.62, 0.95, kit.stroke, MARKS_SLOW)}
            color={kit.palette.chalk}
            width={4}
            opacity={0.55 * pulse(kit, 1)}
          />
          <DrawPath
            d={slash(104, 92, -1)}
            stroke={span(0.68, 1, kit.stroke, MARKS_SLOW)}
            color={kit.palette.chalk}
            width={4}
            opacity={0.55 * pulse(kit, 3)}
          />
        </>
      ) : null}
    </g>
  );
};

const RibbonBadge = (kit: BadgeKit) => {
  const f = fitText(kit, 'serif', 58, 290, 0.05);
  const w = f.width + 72;
  const h = 66;
  const tail = (dir: number) => {
    const inner = dir * (w / 2 - 14);
    const outer = dir * (w / 2 + 46);
    return `M${inner} -12 L${outer} -12 L${outer - dir * 18} 22 L${outer} 56 L${inner} 56 Z`;
  };
  const body = `M${-w / 2} ${-h / 2} Q0 ${-h / 2 - 8} ${w / 2} ${-h / 2} L${w / 2} ${h / 2} Q0 ${h / 2 - 8} ${-w / 2} ${h / 2} Z`;
  return (
    <g>
      <Pop
        stroke={span(0, 0.55, kit.stroke, FILL_LAST)}
        from={0.05}
        axis="x"
        dust={kit.palette.chalk}
      >
        {(tint) => (
          <>
            <path d={tail(-1)} fill={tint(kit.palette.ribbonShade)} />
            <path d={tail(1)} fill={tint(kit.palette.ribbonShade)} />
            <path d={body} fill={tint(kit.palette.ribbon)} />
          </>
        )}
      </Pop>
      <ChalkText
        id={`${kit.id}-t`}
        text={kit.text}
        face="serif"
        size={f.size}
        width={f.width}
        y={-2 - 0.1 * f.size}
        tracking={0.05}
        stroke={span(0.4, 1, kit.stroke, TEXT_FIRST)}
        fill={kit.palette.ribbonInk}
      />
    </g>
  );
};

const BubbleBadge = (kit: BadgeKit) => {
  const f = fitText(kit, 'script', 80, 240);
  const rx = Math.max(f.width / 2 + 46, 96);
  const ry = 66;
  const point = (degrees: number) => {
    const angle = (degrees * Math.PI) / 180;
    return `${(Math.cos(angle) * rx).toFixed(1)} ${(Math.sin(angle) * ry).toFixed(1)}`;
  };
  const d = `M${point(126)} A${rx} ${ry} 0 1 1 ${point(102)} L${(-0.74 * rx).toFixed(1)} ${ry + 34} L${point(126)}`;
  return (
    <g>
      <DrawPath d={d} stroke={span(0, 0.7, kit.stroke)} color={kit.palette.accent} width={5.5} />
      <ChalkText
        id={`${kit.id}-t`}
        text={kit.text}
        face="script"
        size={f.size}
        width={f.width}
        y={-4}
        stroke={span(0.42, 1, kit.stroke)}
        fill={kit.palette.chalk}
      />
    </g>
  );
};

const circle = (r: number) => `M0 ${-r} A${r} ${r} 0 1 1 ${-0.01} ${-r}`;

const RingBadge = (kit: BadgeKit) => {
  const f = fitText(kit, 'hand', 92, 112, 0.04);
  const rays = Array.from({ length: 12 }, (_, at) => (Math.PI * 2 * at) / 12 - Math.PI / 2);
  return (
    <g>
      <DrawPath
        d={circle(72)}
        stroke={span(0, 0.55, kit.stroke)}
        color={kit.palette.chalk}
        width={4.5}
      />
      <DrawPath
        d={circle(80)}
        stroke={span(0.12, 0.65, kit.stroke)}
        color={kit.palette.chalk}
        width={2.5}
      />
      <ChalkText
        id={`${kit.id}-t`}
        text={kit.text}
        face="hand"
        size={f.size}
        width={f.width}
        y={2}
        tracking={0.04}
        stroke={span(0.32, 0.9, kit.stroke)}
        fill={kit.palette.chalk}
      />
      {kit.ornaments
        ? rays.map((angle, at) => {
            const grow = pulse(kit, at * 1.3);
            const inner = 98;
            const outer = inner + 15 * grow;
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return (
              <DrawPath
                key={angle}
                d={`M${(c * inner).toFixed(1)} ${(s * inner).toFixed(1)} L${(c * outer).toFixed(1)} ${(s * outer).toFixed(1)}`}
                stroke={span(0.5 + at * 0.03, 0.62 + at * 0.03, kit.stroke)}
                color={kit.palette.primaryLine}
                width={4}
              />
            );
          })
        : null}
    </g>
  );
};

export const BADGES: readonly ((kit: BadgeKit) => ReactNode)[] = [
  ScriptBadge,
  TapeBadge,
  BurstBadge,
  RibbonBadge,
  BubbleBadge,
  RingBadge,
];
