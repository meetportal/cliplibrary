import type { ArchSaveTheDateProps } from '@/schemas';
import { type ArchShape, CENTER_X, seeded, wrap } from './geometry';

const Cloud = ({
  x,
  y,
  width,
  color,
  opacity,
  filter,
}: {
  x: number;
  y: number;
  width: number;
  color: string;
  opacity: number;
  filter: string;
}) => (
  <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`} opacity={opacity} filter={filter}>
    <ellipse cx={0} cy={0} rx={width * 0.5} ry={width * 0.09} fill={color} />
    <ellipse cx={-width * 0.14} cy={-width * 0.07} rx={width * 0.2} ry={width * 0.1} fill={color} />
    <ellipse cx={width * 0.1} cy={-width * 0.1} rx={width * 0.16} ry={width * 0.12} fill={color} />
    <ellipse
      cx={width * 0.28}
      cy={-width * 0.03}
      rx={width * 0.14}
      ry={width * 0.07}
      fill={color}
    />
  </g>
);

const dome = (x: number, base: number, width: number, height: number): string =>
  `M ${x - width / 2} ${base} C ${x - width * 0.62} ${base - height * 0.38} ${x - width * 0.3} ${base - height * 0.74} ${x} ${base - height} C ${x + width * 0.3} ${base - height * 0.74} ${x + width * 0.62} ${base - height * 0.38} ${x + width / 2} ${base} Z`;

const Palace = ({
  x,
  horizon,
  scale,
  color,
}: {
  x: number;
  horizon: number;
  scale: number;
  color: string;
}) => {
  const s = scale;
  const base = horizon - 52 * s;
  const tower = (side: number) => {
    const tx = x + side * 176 * s;
    return (
      <g key={side}>
        <rect x={tx - 7 * s} y={horizon - 124 * s} width={14 * s} height={124 * s} fill={color} />
        <path d={dome(tx, horizon - 124 * s, 20 * s, 22 * s)} fill={color} />
      </g>
    );
  };
  const chhatri = (side: number) => {
    const cx = x + side * 112 * s;
    return (
      <g key={`c${side}`}>
        <rect x={cx - 26 * s} y={base - 24 * s} width={52 * s} height={24 * s} fill={color} />
        <path d={dome(cx, base - 24 * s, 46 * s, 40 * s)} fill={color} />
      </g>
    );
  };
  return (
    <g>
      <rect x={x - 190 * s} y={base} width={380 * s} height={52 * s} fill={color} />
      <rect x={x - 70 * s} y={base - 34 * s} width={140 * s} height={34 * s} fill={color} />
      <path d={dome(x, base - 34 * s, 104 * s, 96 * s)} fill={color} />
      <rect x={x - 1.5 * s} y={base - 150 * s} width={3 * s} height={24 * s} fill={color} />
      {tower(-1)}
      {tower(1)}
      {chhatri(-1)}
      {chhatri(1)}
    </g>
  );
};

export const SunsetSky = ({
  shape,
  sky,
  skyline,
  time,
  ids,
}: {
  shape: ArchShape;
  sky: ArchSaveTheDateProps['sky'];
  skyline: ArchSaveTheDateProps['skyline'];
  time: number;
  ids: { sky: string; water: string; blur: string; halo: string };
}) => {
  const left = CENTER_X - shape.halfWidth - 20;
  const width = shape.halfWidth * 2 + 40;
  const top = shape.apexY - 40;
  const horizon = skyline.show ? skyline.horizon : shape.sillY;
  const span = width + 900;
  const sunY = horizon - sky.sunSize * 0.3;
  return (
    <g>
      <defs>
        <linearGradient
          id={ids.sky}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={shape.apexY}
          x2={0}
          y2={horizon}
        >
          <stop offset={0} stopColor={sky.top} />
          <stop offset={0.55} stopColor={sky.middle} />
          <stop offset={1} stopColor={sky.horizon} />
        </linearGradient>
        <linearGradient
          id={ids.water}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={horizon}
          x2={0}
          y2={shape.sillY}
        >
          <stop offset={0} stopColor={skyline.water} />
          <stop offset={1} stopColor={sky.middle} />
        </linearGradient>
        <filter id={ids.blur} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <filter id={ids.halo} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={28} />
        </filter>
      </defs>
      <rect x={left} y={top} width={width} height={shape.sillY - top} fill={`url(#${ids.sky})`} />
      {sky.sunSize > 0 ? (
        <g>
          <circle
            cx={sky.sunX}
            cy={sunY}
            r={sky.sunSize * 1.9}
            fill={sky.sun}
            opacity={0.45}
            filter={`url(#${ids.halo})`}
          />
          <circle cx={sky.sunX} cy={sunY} r={sky.sunSize} fill={sky.sun} />
        </g>
      ) : null}
      {Array.from({ length: sky.clouds }, (_, index) => {
        const cloudWidth = 220 + seeded(index, 3) * 200;
        const rate = sky.cloudSpeed * (0.6 + seeded(index, 4) * 0.8);
        const x = left - 450 + wrap(seeded(index, 1) * span + time * rate, span);
        const band = horizon - 260 - (shape.apexY + 140);
        const y =
          shape.apexY +
          140 +
          ((index + seeded(index, 2) * 0.6) / Math.max(1, sky.clouds)) * Math.max(0, band);
        return (
          <Cloud
            key={index}
            x={x}
            y={y}
            width={cloudWidth}
            color={sky.cloud}
            opacity={sky.cloudOpacity}
            filter={`url(#${ids.blur})`}
          />
        );
      })}
      {skyline.show ? (
        <g>
          <path
            d={`M ${left} ${horizon} L ${left} ${horizon - 40} Q ${left + width * 0.2} ${horizon - 78} ${left + width * 0.38} ${horizon - 46} T ${left + width * 0.78} ${horizon - 58} T ${left + width} ${horizon - 36} L ${left + width} ${horizon} Z`}
            fill={skyline.color}
            opacity={0.35}
          />
          <g opacity={0.7}>
            <Palace x={skyline.x} horizon={horizon} scale={skyline.scale} color={skyline.color} />
          </g>
          <rect
            x={left}
            y={horizon}
            width={width}
            height={shape.sillY - horizon}
            fill={`url(#${ids.water})`}
          />
          <g
            opacity={0.16}
            transform={`translate(0 ${horizon}) scale(1 -0.45) translate(0 ${-horizon})`}
          >
            <Palace x={skyline.x} horizon={horizon} scale={skyline.scale} color={skyline.color} />
          </g>
          {sky.sunSize > 0
            ? [0, 1, 2, 3].map((row) => (
                <rect
                  key={row}
                  x={sky.sunX - sky.sunSize * (0.9 - row * 0.18)}
                  y={horizon + 10 + row * 14}
                  width={sky.sunSize * (1.8 - row * 0.36)}
                  height={3}
                  rx={1.5}
                  fill={sky.sun}
                  opacity={0.55}
                />
              ))
            : null}
        </g>
      ) : null}
    </g>
  );
};
