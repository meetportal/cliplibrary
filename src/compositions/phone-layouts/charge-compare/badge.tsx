import { Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { alpha } from './color';
import { usableImage } from './use-logo-aspect';

const CORNER = { left: 60, top: 64 } as const;
const END_CENTER = { x: 540, y: 520 } as const;
const MAX_END_WIDTH = 900;
const WIDE_LIMIT = 3.2;
const RING = 5;

export type BadgeBox = {
  width: number;
  height: number;
  pad: number;
  logoWidth: number;
  logoHeight: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  endScale: number;
};

export const badgeBox = (height: number, aspect: number | null, endScale: number): BadgeBox => {
  const pad = Math.round(height * 0.14);
  const inner = height - pad * 2;
  const ratio = Math.max(0.4, aspect ?? 1);
  const logoWidth = Math.round(Math.min(inner * ratio, inner * WIDE_LIMIT));
  const logoHeight = Math.round(Math.min(inner, logoWidth / ratio));
  const width = Math.max(logoWidth + pad * 2, height);
  return {
    width,
    height,
    pad,
    logoWidth,
    logoHeight,
    from: { x: CORNER.left + width / 2, y: CORNER.top + height / 2 },
    to: END_CENTER,
    endScale: Math.min(endScale, MAX_END_WIDTH / width),
  };
};

const ringPoint = (width: number, height: number, radius: number, at: number) => {
  const r = Math.min(radius, width / 2, height / 2);
  const straightX = width - r * 2;
  const straightY = height - r * 2;
  const arc = (Math.PI * r) / 2;
  const total = (straightX + straightY) * 2 + arc * 4;
  let rest = (((at % 1) + 1) % 1) * total;
  const corners = [
    { cx: width - r, cy: r, from: -Math.PI / 2 },
    { cx: width - r, cy: height - r, from: 0 },
    { cx: r, cy: height - r, from: Math.PI / 2 },
    { cx: r, cy: r, from: Math.PI },
  ];
  const sides = [
    (d: number) => ({ x: r + d, y: 0 }),
    (d: number) => ({ x: width, y: r + d }),
    (d: number) => ({ x: width - r - d, y: height }),
    (d: number) => ({ x: 0, y: height - r - d }),
  ];
  for (let index = 0; index < 4; index++) {
    const length = index % 2 === 0 ? straightX : straightY;
    if (rest <= length) {
      return sides[index]?.(rest) ?? { x: 0, y: 0 };
    }
    rest -= length;
    const corner = corners[index];
    if (rest <= arc && corner !== undefined) {
      const angle = corner.from + rest / r;
      return { x: corner.cx + Math.cos(angle) * r, y: corner.cy + Math.sin(angle) * r };
    }
    rest -= arc;
  }
  return { x: r, y: 0 };
};

export type BadgeLook = {
  logo: string;
  primary: string;
  secondary: string;
  plate: string;
  showPlate: boolean;
  travel: number;
  halo: number;
  opacity: number;
  spark: { at: number; opacity: number };
};

const SPARK = 9;

const Spark = ({
  point,
  color,
  opacity,
}: {
  point: { x: number; y: number };
  color: string;
  opacity: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: point.x + RING / 2 - SPARK / 2,
      top: point.y + RING / 2 - SPARK / 2,
      width: SPARK,
      height: SPARK,
      borderRadius: SPARK / 2,
      backgroundColor: '#ffffff',
      boxShadow: `0 0 8px 4px ${alpha(color, 0.9)}, 0 0 22px 8px ${alpha(color, 0.45)}`,
      opacity,
    }}
  />
);

export const Badge = ({ box, look }: { box: BadgeBox; look: BadgeLook }) => {
  if (!usableImage(look.logo)) {
    return null;
  }
  const x = box.from.x + (box.to.x - box.from.x) * look.travel;
  const y = box.from.y + (box.to.y - box.from.y) * look.travel;
  const scale = 1 + (box.endScale - 1) * look.travel;
  const radius = Math.round(Math.min(box.width, box.height) * 0.26);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: box.width,
        height: box.height,
        transform: `translate(${x - box.width / 2}px, ${y - box.height / 2}px) scale(${scale})`,
        transformOrigin: '50% 50%',
        opacity: look.opacity,
      }}
    >
      {look.showPlate ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            backgroundImage: `linear-gradient(135deg, ${look.primary}, ${look.secondary})`,
            boxShadow: `0 0 ${Math.round(box.height * 0.3)}px ${alpha(look.primary, look.halo)}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: RING,
              borderRadius: radius - RING,
              backgroundColor: look.plate,
            }}
          />
        </div>
      ) : null}
      {look.showPlate && look.spark.opacity > 0 ? (
        <Spark
          point={ringPoint(box.width - RING, box.height - RING, radius - RING / 2, look.spark.at)}
          color={look.primary}
          opacity={look.spark.opacity}
        />
      ) : null}
      <Img
        src={resolveCustom(look.logo)}
        style={{
          position: 'absolute',
          left: (box.width - box.logoWidth) / 2,
          top: (box.height - box.logoHeight) / 2,
          width: box.logoWidth,
          height: box.logoHeight,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
