import { Easing, Img } from 'remotion';
import type { TextRingsProps } from '@/schemas';
import type { LogoFit } from './logo';

const TAU = Math.PI * 2;
const PLATE_INSET = 0.05;
const draw = Easing.bezier(0.3, 0.3, 0.55, 1);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const phase = (frame: number, start: number, length: number) =>
  clamp01((frame - start) / Math.max(1, length));

export type MarkGeometry = { radius: number; plateRadius: number; logoRadius: number };

export const markGeometry = (mark: TextRingsProps['mark'], logo: LogoFit | null): MarkGeometry => {
  const wide = logo === null ? 0 : clamp01((logo.contentAspect - 1) / 3);
  const radius = (mark.size / 2) * (1 + mark.wideGrow * wide);
  const plateRadius = radius - mark.stroke / 2 - radius * PLATE_INSET;
  return {
    radius,
    plateRadius,
    logoRadius: mark.plate ? plateRadius : radius - mark.stroke / 2,
  };
};

const HEAD = 0.45;
const HEAD_STEPS = 40;

const DrawnCircle = ({
  radius,
  drawn,
  color,
  width,
}: {
  radius: number;
  drawn: number;
  color: string;
  width: number;
}) => {
  const length = TAU * radius;
  const head = drawn * length * (1 + HEAD);
  const fade = Math.min(length * HEAD, Math.max(1, head * 0.6));
  const solid = Math.min(length, head - fade);
  const arc = (from: number, to: number) => {
    const start = Math.max(0, from);
    const end = Math.min(length, to);
    return end > start ? { start, size: end - start } : null;
  };
  const steps = Array.from({ length: HEAD_STEPS }, (_, step) => ({
    step,
    span: arc(
      head - fade + (step * fade) / HEAD_STEPS - 0.5,
      head - fade + ((step + 1) * fade) / HEAD_STEPS,
    ),
  }));
  const common = {
    r: radius,
    fill: 'none',
    stroke: color,
    strokeWidth: width,
    strokeLinecap: 'butt' as const,
    transform: 'rotate(-90)',
  };
  return (
    <g>
      {solid >= length ? (
        <circle {...common} />
      ) : solid > 0 ? (
        <circle {...common} strokeDasharray={`${solid} ${length * 2}`} />
      ) : null}
      {solid >= length
        ? null
        : steps.map(({ step, span }) =>
            span === null ? null : (
              <circle
                key={step}
                {...common}
                strokeDasharray={`${span.size} ${length * 2}`}
                strokeDashoffset={-span.start}
                strokeOpacity={1 - (step + 0.5) / HEAD_STEPS}
              />
            ),
          )}
    </g>
  );
};

const FADE_FRAMES = 14;
const LOGO_RASTER = 0.98;
const GROW_FRAMES = 34;
const GROW_FROM = 0.8;
const grow = Easing.bezier(0.3, 0.3, 0.55, 1);
const IRIS_FRAMES = 12;
const IRIS_FROM = 0.35;
const IRIS_TO = 0.65;
const IRIS_FILL = [0.3, 0.75] as const;
const IRIS_LOGO = [0.6, 1] as const;

const between = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));

const irisCover = (closing: number) => IRIS_FROM + (IRIS_TO - IRIS_FROM) * closing;

const markEntrance = (frame: number, props: TextRingsProps) => {
  const { logoAt } = props.timing;
  const start = Math.max(0, logoAt - FADE_FRAMES);
  const faded = logoAt <= 0 ? 1 : smooth(phase(frame, start, logoAt - start));
  const closing = phase(frame, start, IRIS_FRAMES);
  const iris = props.mark.entrance === 'iris' && props.mark.plate;
  return {
    start,
    cover: irisCover(closing),
    filled: smooth(between(closing, IRIS_FILL[0], IRIS_FILL[1])),
    shown: iris ? faded * smooth(between(closing, IRIS_LOGO[0], IRIS_LOGO[1])) : faded,
    scale: GROW_FROM + (1 - GROW_FROM) * grow(phase(frame, start, GROW_FRAMES)),
  };
};

export const MarkShapes = ({
  frame,
  props,
  geometry,
  stroke,
}: {
  frame: number;
  props: TextRingsProps;
  geometry: MarkGeometry;
  stroke: string;
}) => {
  const { mark, timing, colors } = props;
  const drawn = draw(phase(frame, 0, timing.drawFrames));
  const entrance = markEntrance(frame, props);
  const plateRadius = geometry.plateRadius * entrance.scale;
  const iris = entrance.cover * plateRadius;
  return (
    <g>
      {mark.plate ? (
        mark.entrance === 'iris' ? (
          <g>
            <circle
              r={plateRadius - iris / 2}
              fill="none"
              stroke={colors.plate}
              strokeWidth={iris}
            />
            {entrance.filled > 0 ? (
              <circle r={plateRadius} fill={colors.plate} opacity={entrance.filled} />
            ) : null}
          </g>
        ) : (
          <circle r={plateRadius} fill={colors.plate} opacity={entrance.shown} />
        )
      ) : null}
      {drawn > 0 ? (
        <DrawnCircle
          radius={geometry.radius * entrance.scale}
          drawn={drawn}
          color={stroke}
          width={mark.stroke * (0.35 + 0.65 * Math.min(1, drawn * 3))}
        />
      ) : null}
    </g>
  );
};

export const MarkLogo = ({
  frame,
  props,
  geometry,
  logo,
  center,
}: {
  frame: number;
  props: TextRingsProps;
  geometry: MarkGeometry;
  logo: LogoFit | null;
  center: { x: number; y: number };
}) => {
  const { shown, scale } = markEntrance(frame, props);
  if (logo === null || shown <= 0) {
    return null;
  }
  const width = (geometry.logoRadius * props.mark.logoFill) / logo.reach / LOGO_RASTER;
  const height = width / logo.aspect;
  return (
    <Img
      src={logo.src}
      style={{
        position: 'absolute',
        left: center.x - width * logo.centerX,
        top: center.y - height * logo.centerY,
        width,
        height,
        opacity: shown,
        transform: `scale(${(scale * LOGO_RASTER).toFixed(5)})`,
        transformOrigin: `${(logo.centerX * 100).toFixed(3)}% ${(logo.centerY * 100).toFixed(3)}%`,
        filter: shown < 1 ? `blur(${(8 * (1 - shown)).toFixed(2)}px)` : undefined,
      }}
    />
  );
};
