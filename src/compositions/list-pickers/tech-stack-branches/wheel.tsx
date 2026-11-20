import type { TechStackBranchesProps } from '@/schemas';
import { clamp01 } from '../../kit/motion';
import type { Faces } from './fonts';
import type { Layout } from './layout';
import type { Palette } from './palette';
import { Pill } from './pill';

type WheelProps = {
  props: TechStackBranchesProps;
  layout: Layout;
  palette: Palette;
  faces: Faces;
  offset: number;
  opacity: number;
  frameHeight: number;
};

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

const wrap = (value: number, count: number) => {
  const shifted = ((value % count) + count) % count;
  return shifted >= count / 2 ? shifted - count : shifted;
};

type Placed = { key: string; index: number; depth: number };

const placements = (count: number, position: number): Placed[] =>
  Array.from({ length: count }, (_, index) => {
    const base = wrap(index - position, count);
    return [-1, 0, 1].map((copy) => ({
      key: `${index}:${copy}`,
      index,
      depth: base + copy * count,
    }));
  }).flat();

const activenessAt = (depth: number) => 1 - smoothstep(0.2, 0.85, Math.abs(depth));

export const Wheel = ({
  props,
  layout,
  palette,
  faces,
  offset,
  opacity,
  frameHeight,
}: WheelProps) => {
  const { wheel, pills } = props;
  const position = offset / wheel.spacing;
  return (
    <>
      {placements(props.items.length, position).map(({ key, index, depth }) => {
        const box = layout.items[index];
        const copy = props.items[index];
        const reach = Math.abs(depth);
        const visible =
          opacity * (1 - wheel.fade * clamp01(reach - 0.6)) * (1 - smoothstep(1.5, 2.2, reach));
        const y = Math.round(layout.centerY + depth * wheel.spacing);
        if (box === undefined || copy === undefined || visible <= 0.002) {
          return null;
        }
        if (y + box.height < 0 || y - box.height > frameHeight) {
          return null;
        }
        const active = activenessAt(depth);
        const scale = wheel.sideScale + (1 - wheel.sideScale) * active;
        const x = Math.round(layout.wheelX + layout.curve * depth * depth);
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              opacity: visible,
              transformOrigin: '0 0',
              transform: `translate(${x}px, ${y}px) scale(${scale.toFixed(4)})`,
            }}
          >
            <Pill
              box={box}
              title={copy.title}
              detail={copy.detail}
              colors={palette.pill(active)}
              faces={faces}
              icon={pills.icon}
              rim={pills.rim}
              shadow={pills.shadow}
              shadowColor={palette.shadow}
            />
          </div>
        );
      })}
    </>
  );
};
