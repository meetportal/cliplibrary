import { type Coverage, GRAIN_TILE, grainTile, wobbleTile } from './grain-tile';

export type Region = { x: number; y: number; width: number; height: number };

export const chalkCoverage = (grain: number): Coverage => ({
  gain: -4.2 * grain,
  offset: 1 + 2.05 * grain,
});

export const ChalkGrain = (props: {
  id: string;
  coverage: Coverage;
  tile: number;
  regions: Record<string, Region>;
}) => (
  <>
    <pattern
      id={`${props.id}-tile`}
      patternUnits="userSpaceOnUse"
      width={props.tile}
      height={props.tile}
    >
      <image href={grainTile(props.coverage)} width={props.tile} height={props.tile} />
    </pattern>
    {Object.entries(props.regions).map(([name, region]) => (
      <mask key={name} id={`${props.id}-${name}`} maskUnits="userSpaceOnUse" {...region}>
        <rect {...region} fill={`url(#${props.id}-tile)`} />
      </mask>
    ))}
  </>
);

export const ChalkRough = (props: {
  id: string;
  scale: number;
  soften: string;
  region: Region;
}) => (
  <filter
    id={props.id}
    filterUnits="userSpaceOnUse"
    primitiveUnits="userSpaceOnUse"
    {...props.region}
    colorInterpolationFilters="sRGB"
  >
    <feImage
      href={wobbleTile()}
      x={props.region.x}
      y={props.region.y}
      width={GRAIN_TILE}
      height={GRAIN_TILE}
      preserveAspectRatio="none"
      result="tile"
    />
    <feTile in="tile" result="wobble" />
    <feDisplacementMap
      in="SourceGraphic"
      in2="wobble"
      scale={props.scale}
      xChannelSelector="R"
      yChannelSelector="G"
    />
    <feGaussianBlur stdDeviation={props.soften} />
  </filter>
);
