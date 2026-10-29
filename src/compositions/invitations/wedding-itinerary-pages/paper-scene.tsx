import { useVideoConfig } from 'remotion';
import type { ItineraryPalette, ItineraryScene, WeddingItineraryPagesProps } from '@/schemas';
import { accelerate, settle, tween } from '../../promo/timing';
import { type CutLayers, type CutShape, SCENE_HEIGHT, SCENE_WIDTH } from './cut-shapes';
import { gardenScene } from './garden-scene';
import { garlandsScene } from './garlands-scene';
import { lightsScene } from './lights-scene';
import { mandapScene } from './mandap-scene';

const BUILDERS: Record<
  ItineraryScene,
  (palette: ItineraryPalette, frame: number, sway: number) => CutLayers
> = {
  garden: gardenScene,
  garlands: garlandsScene,
  lights: lightsScene,
  mandap: mandapScene,
};

const LAYER_STAGGER = 6;

const SHADOW_OFFSET = 6;

const SINK = 110;

const Shape = ({ shape, fill }: { shape: CutShape; fill?: string }) =>
  shape.stroke === undefined ? (
    <path d={shape.d} fill={fill ?? shape.fill} opacity={fill ? 1 : shape.opacity} />
  ) : (
    <path
      d={shape.d}
      fill="none"
      stroke={shape.fill}
      strokeWidth={shape.stroke}
      strokeLinejoin="round"
      opacity={shape.opacity}
    />
  );

export const PaperScene = ({
  palette,
  frame,
  arrive,
  leave,
  scenery,
}: {
  palette: ItineraryPalette;
  frame: number;
  arrive: number;
  leave: number;
  scenery: WeddingItineraryPagesProps['scenery'];
}) => {
  const { width, height } = useVideoConfig();
  const layers = BUILDERS[palette.scene](palette, frame, scenery.sway);
  const left = (width - SCENE_WIDTH * scenery.scale) / 2;
  const top = height - SCENE_HEIGHT * scenery.scale;
  const sink = tween(leave, [0, 1], [0, SINK], accelerate);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      {layers.map((shapes, depth) => {
        const begin = arrive + scenery.riseDelay + depth * LAYER_STAGGER;
        const rise = tween(
          frame,
          [begin, begin + scenery.riseFrames + depth * 4],
          [SCENE_HEIGHT * scenery.scale + 60, 0],
          settle,
        );
        const drift = Math.sin(frame / 120 + depth * 0.8) * scenery.drift * (depth + 1) * 5;
        const y = top + rise + sink * (1 + depth * 0.25);
        return (
          <g
            key={depth}
            opacity={1 - leave}
            transform={`translate(${(left + drift).toFixed(3)} ${y.toFixed(3)}) scale(${scenery.scale})`}
          >
            {scenery.shadow > 0 ? (
              <g transform={`translate(0 ${SHADOW_OFFSET})`} opacity={scenery.shadow}>
                {shapes
                  .filter((shape) => shape.flat !== true)
                  .map((shape, index) => (
                    <Shape key={index} shape={shape} fill="#000000" />
                  ))}
              </g>
            ) : null}
            {shapes.map((shape, index) => (
              <Shape key={index} shape={shape} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};
