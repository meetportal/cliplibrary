import type { MiniaturePanoramaProps } from '@/schemas';
import { Elephant } from './elephant';
import { PATH_FEET } from './foreground';
import { mix } from './palette';
import { FRAME_WIDTH, Glow, type World } from './strip';

type Procession = MiniaturePanoramaProps['procession'];

const NIGHT_WEIGHT = 0.35;

const WALKER_STRIDE = 30;

const ELEPHANT_STRIDE = 70;

const LEAD_WALKERS = 2;

const WALKER_GAP = 72;

const TRUNK_GAP = 236;

const TAIL_GAP = 196;

const ENTRY_MARGIN = 60;

export type ProcessionColors = {
  elephant: string;
  elephantFar: string;
  blanket: string;
  canopy: string;
  trim: string;
  kurta: string;
  legs: string;
  turban: string;
  skin: string;
  glow: string;
  flame: string;
  lights: number;
};

const Walker = ({
  x,
  phase,
  lantern,
  colors,
}: {
  x: number;
  phase: number;
  lantern: boolean;
  colors: ProcessionColors;
}) => {
  const swing = Math.sin(phase) * 24;
  const bob = -Math.abs(Math.sin(phase)) * 3;
  return (
    <g transform={`translate(${x.toFixed(3)} ${bob.toFixed(3)})`}>
      {[swing, -swing].map((angle, index) => (
        <rect
          key={index}
          x={-3.5}
          y={-32}
          width={7}
          height={32}
          rx={3}
          fill={index === 0 ? colors.legs : colors.kurta}
          transform={`rotate(${angle.toFixed(3)} 0 -32)`}
        />
      ))}
      <path d="M -11 -66 L 11 -66 L 16 -26 L -16 -26 Z" fill={colors.kurta} />
      <circle cx={0} cy={-76} r={9} fill={colors.skin} />
      <path d="M -10 -78 Q -10 -92 2 -92 Q 13 -90 11 -78 Z" fill={colors.turban} />
      <path d="M -10 -80 Q -18 -74 -16 -64 L -12 -66 Q -12 -74 -8 -78 Z" fill={colors.turban} />
      {lantern ? (
        <g>
          <line x1={8} y1={-52} x2={14} y2={-128} stroke={colors.trim} strokeWidth={3} />
          <Glow x={14} y={-134} radius={34} color={colors.glow} amount={colors.lights} />
          <rect x={8} y={-142} width={12} height={16} rx={3} fill={colors.trim} />
          <rect
            x={10.5}
            y={-139}
            width={7}
            height={10}
            rx={2}
            fill={mix(colors.trim, colors.flame, colors.lights)}
          />
        </g>
      ) : (
        <rect
          x={-4}
          y={-62}
          width={7}
          height={30}
          rx={3}
          fill={colors.kurta}
          transform={`rotate(${(-swing * 0.6).toFixed(3)} 0 -62)`}
        />
      )}
    </g>
  );
};

export const Procession = ({
  procession,
  lights,
  panSpeed,
  heading,
  world,
}: {
  procession: Procession;
  lights: MiniaturePanoramaProps['lights'];
  panSpeed: number;
  heading: number;
  world: World;
}) => {
  if (!procession.show) {
    return null;
  }
  const walked = Math.max(0, world.frame - procession.start);
  const scale = procession.scale;
  const lead = -ENTRY_MARGIN * scale + walked * procession.speed;
  const ground = walked * (procession.speed + panSpeed);
  const shade = (color: string) => world.shade(color, NIGHT_WEIGHT);
  const elephant = shade(procession.elephant);
  const kurta = shade(procession.kurta);
  const colors: ProcessionColors = {
    elephant,
    elephantFar: mix(elephant, '#000000', 0.18),
    blanket: shade(procession.blanket),
    canopy: shade(procession.canopy),
    trim: shade(procession.trim),
    kurta,
    legs: mix(kurta, '#000000', 0.12),
    turban: shade(procession.turban),
    skin: shade(procession.skin),
    glow: lights.glow,
    flame: lights.flame,
    lights: world.lights,
  };
  const walkerPhase = (ground / (WALKER_STRIDE * scale)) * Math.PI;
  const elephantPhase = (ground / (ELEPHANT_STRIDE * scale)) * Math.PI;
  const elephantOffset =
    procession.walkers > 0
      ? -(Math.min(procession.walkers, LEAD_WALKERS) - 1) * WALKER_GAP - TRUNK_GAP
      : 0;
  const walkers = Array.from({ length: procession.walkers }, (_, index) => {
    const behind = index >= LEAD_WALKERS;
    const offset = behind
      ? elephantOffset - TAIL_GAP - (index - LEAD_WALKERS) * WALKER_GAP
      : -index * WALKER_GAP;
    return { index, offset, lantern: !behind };
  });
  const mirror = heading < 0 ? `translate(${FRAME_WIDTH} 0) scale(-1 1) ` : '';
  return (
    <g transform={`${mirror}translate(${lead.toFixed(3)} ${PATH_FEET}) scale(${scale})`}>
      <Elephant x={elephantOffset} phase={elephantPhase} colors={colors} frame={world.frame} />
      {walkers.map((walker) => (
        <Walker
          key={walker.index}
          x={walker.offset}
          phase={walkerPhase + walker.index * 1.1}
          lantern={walker.lantern}
          colors={colors}
        />
      ))}
    </g>
  );
};
