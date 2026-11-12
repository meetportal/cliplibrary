import { mixLab } from '../../kit/lab-color';
import { facetShade, type Light, type Mesh, type Point3 } from './mesh';
import type { Palette } from './palette';

const LIGHT_GAIN = 1.5;
const SHADOW_GAIN = 1.3;
const MAX_MIX = 0.7;
const SHADOW_OPACITY = 0.42;
const BALL_SHADE = 0.8;

const ORIGIN: Point3 = { x: 0, y: 0, z: 0 };

type Facet = { key: number; points: string; shade: number };

const facetsOf = (
  mesh: Mesh,
  points: readonly Point3[],
  light: Light | null,
  dx = 0,
  dy = 0,
): Facet[] =>
  mesh.triangles.map((triangle, key) => {
    const [a, b, c] = triangle.map((index) => points[index] ?? ORIGIN) as [Point3, Point3, Point3];
    return {
      key,
      points: [a, b, c].map((p) => `${(p.x + dx).toFixed(1)},${(p.y + dy).toFixed(1)}`).join(' '),
      shade: light === null ? 0 : facetShade(a, b, c, light),
    };
  });

const strength = (shade: number) =>
  Math.min(MAX_MIX, shade > 0 ? shade * LIGHT_GAIN : -shade * SHADOW_GAIN);

type Layer = {
  mesh: Mesh;
  points: readonly Point3[];
  width: number;
  height: number;
};

export const PaperShadow = ({
  mesh,
  points,
  offset,
  color,
  width,
  height,
}: Layer & { offset: { x: number; y: number }; color: string }) => (
  <svg
    aria-hidden="true"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ position: 'absolute', inset: 0 }}
  >
    <g opacity={SHADOW_OPACITY}>
      {facetsOf(mesh, points, null, offset.x, offset.y).map((facet) => (
        <polygon
          key={facet.key}
          points={facet.points}
          fill={color}
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      ))}
    </g>
  </svg>
);

export const PaperFacets = ({
  mesh,
  points,
  light,
  palette,
  print,
  width,
  height,
}: Layer & { light: Light; palette: Palette; print: number }) => (
  <svg
    aria-hidden="true"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ position: 'absolute', inset: 0 }}
  >
    {facetsOf(mesh, points, light).map((facet) => {
      const amount = strength(facet.shade) * (1 - print) * BALL_SHADE;
      const fill = mixLab(
        palette.paper,
        facet.shade > 0 ? palette.highlight : palette.crease,
        amount,
      );
      return (
        <polygon
          key={facet.key}
          points={facet.points}
          fill={fill}
          stroke={fill}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      );
    })}
  </svg>
);

export const PaperShading = ({
  mesh,
  points,
  light,
  palette,
  print,
  width,
  height,
}: Layer & { light: Light; palette: Palette; print: number }) =>
  print <= 0 ? null : (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
    >
      {facetsOf(mesh, points, light).map((facet) => (
        <polygon
          key={facet.key}
          points={facet.points}
          fill={facet.shade > 0 ? palette.highlight : palette.crease}
          fillOpacity={strength(facet.shade) * print}
        />
      ))}
    </svg>
  );
