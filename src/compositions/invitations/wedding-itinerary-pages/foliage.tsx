import { type Art, type BushTone, bushColors, fill } from './art';
import {
  between,
  circlePath,
  dark,
  f,
  HEIGHT,
  leafPath,
  light,
  memo,
  mix,
  moundPath,
  random,
  sway,
  WIDTH,
} from './paint';

type BushShape = { mass: string; shade: string; middle: string; lit: string; spots: string };

const bushShape = (x: number, y: number, w: number, h: number, seed: number): BushShape =>
  memo(`bush|${x}|${y}|${w}|${h}|${seed}`, () => {
    const rand = random(seed);
    const bumps = Math.max(3, Math.round(w / Math.max(40, h * 0.42)));
    const mass = moundPath(x, y, w, h, rand, bumps);
    const size = Math.min(1.6, Math.max(0.6, h / 120));
    const count = Math.min(520, Math.max(30, Math.round((w * h) / 120)));
    let shade = '';
    let lit = '';
    let middle = '';
    let spots = '';
    for (let index = 0; index < count; index++) {
      const across = between(rand, -0.47, 0.47);
      const reach = h * Math.sqrt(Math.max(0, 1 - (across * 2) ** 2));
      const up = rand();
      const px = x + across * w;
      const py = y - up * reach * 0.92 - 4;
      const angle = between(rand, 0, Math.PI * 2);
      const length = between(rand, 8, 15) * size;
      const leaf = leafPath(px, py, length, length * 0.36, angle);
      const band = up + between(rand, -0.25, 0.25);
      if (band > 0.62) {
        lit += leaf;
      } else if (band > 0.3) {
        middle += leaf;
      } else {
        shade += leaf;
      }
      if (index % 9 === 0) {
        spots += circlePath(px + 3, py - 2, 1.6 * size);
      }
    }
    return { mass, shade, middle, lit, spots };
  });

export const Bush = ({
  art,
  x,
  y,
  w,
  h,
  tone,
  seed,
  bloom,
}: {
  art: Art;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BushTone;
  seed: number;
  bloom?: string | undefined;
}) => {
  const shape = bushShape(x, y, w, h, seed);
  const [shadow, base, top] = bushColors(art, tone);
  return (
    <g>
      <path d={shape.mass} fill={fill(art, `bush-${tone}`)} />
      <path d={shape.shade} fill={shadow} opacity={0.75} />
      <path d={shape.middle} fill={mix(base, top, 0.35)} opacity={0.8} />
      <path d={shape.lit} fill={top} opacity={0.85} />
      {bloom ? <path d={shape.spots} fill={bloom} /> : null}
    </g>
  );
};

export const Mist = ({
  art,
  x,
  y,
  w,
  h,
  seed,
  opacity = 0.75,
}: {
  art: Art;
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  opacity?: number;
}) => {
  const shape = memo(`mist|${x}|${y}|${w}|${h}|${seed}`, () => {
    const rand = random(seed);
    return moundPath(x, y, w, h, rand, Math.max(3, Math.round(w / (h * 0.32))));
  });
  return <path d={shape} fill={fill(art, 'mist')} opacity={opacity} />;
};

export const Tree = ({
  art,
  x,
  y,
  trunk,
  w,
  h,
  tone,
  seed,
  bloom,
}: {
  art: Art;
  x: number;
  y: number;
  trunk: number;
  w: number;
  h: number;
  tone: BushTone;
  seed: number;
  bloom?: string | undefined;
}) => (
  <g>
    <path
      d={`M${f(x - 9)} ${f(y)}Q${f(x - 4)} ${f(y - trunk * 0.5)} ${f(x - 6)} ${f(y - trunk - 20)}L${f(x + 6)} ${f(y - trunk - 20)}Q${f(x + 5)} ${f(y - trunk * 0.5)} ${f(x + 10)} ${f(y)}Z`}
      fill={fill(art, 'trunk')}
    />
    <Bush art={art} x={x} y={y - trunk} w={w} h={h} tone={tone} seed={seed} bloom={bloom} />
  </g>
);

type PalmShape = { trunk: string; rings: string; fronds: string[] };

const palmShape = (x: number, y: number, height: number, lean: number, seed: number): PalmShape =>
  memo(`palm|${x}|${y}|${height}|${lean}|${seed}`, () => {
    const rand = random(seed);
    const topX = x + lean;
    const topY = y - height;
    const trunk = `M${f(x - 11)} ${f(y)}Q${f(x + lean * 0.2 - 8)} ${f(y - height * 0.55)} ${f(topX - 5)} ${f(topY)}L${f(topX + 5)} ${f(topY)}Q${f(x + lean * 0.2 + 10)} ${f(y - height * 0.55)} ${f(x + 12)} ${f(y)}Z`;
    let rings = '';
    for (let t = 0.06; t < 0.97; t += 0.055) {
      const cx = x + lean * t * t + (lean * 0.2 - lean * t * t) * 0.3 * (1 - t);
      const cy = y - height * t;
      const half = 11 - 6 * t;
      rings += `M${f(cx - half)} ${f(cy)}q${f(half)} ${f(4)} ${f(half * 2)} 0`;
    }
    const fronds: string[] = [];
    const count = 11;
    for (let index = 0; index < count; index++) {
      const angle = -Math.PI + (index / (count - 1)) * Math.PI + between(rand, -0.12, 0.12);
      const length = height * between(rand, 0.42, 0.6);
      const droop = length * (0.55 - Math.abs(Math.sin(angle)) * 0.25);
      let frond = '';
      for (let t = 0.1; t <= 1; t += 0.05) {
        const px = topX + Math.cos(angle) * length * t;
        const py = topY + Math.sin(angle) * length * t * 0.75 + droop * t * t;
        const tangent = Math.atan2(
          Math.sin(angle) * length * 0.75 + droop * 2 * t,
          Math.cos(angle) * length,
        );
        const leafLength = length * 0.3 * (1 - t * 0.55);
        frond += leafPath(px, py, leafLength, 4.2, tangent + 1.05);
        frond += leafPath(px, py, leafLength, 4.2, tangent - 1.05 + 0.25);
      }
      fronds.push(frond);
    }
    return { trunk, rings, fronds };
  });

export const Palm = ({
  art,
  x,
  y,
  height,
  lean,
  seed,
  phase = 0,
}: {
  art: Art;
  x: number;
  y: number;
  height: number;
  lean: number;
  seed: number;
  phase?: number;
}) => {
  const shape = palmShape(x, y, height, lean, seed);
  const angle = sway(art.frame, 150, phase, 1.6 * art.sway);
  const { leaf } = art;
  return (
    <g>
      <path d={shape.trunk} fill={fill(art, 'trunk')} />
      <path d={shape.rings} fill="none" stroke={dark(leaf.trunk, 0.35)} strokeWidth={1.6} />
      <g transform={`rotate(${f(angle)} ${f(x + lean)} ${f(y - height)})`}>
        {shape.fronds.map((frond, index) => (
          <path
            key={index}
            d={frond}
            fill={index % 2 === 0 ? leaf.dark : mix(leaf.mid, leaf.dark, 0.3)}
          />
        ))}
      </g>
    </g>
  );
};

export const Agave = ({
  art,
  x,
  y,
  size,
  seed,
  pale = 0.4,
}: {
  art: Art;
  x: number;
  y: number;
  size: number;
  seed: number;
  pale?: number;
}) => {
  const shape = memo(`agave|${x}|${y}|${size}|${seed}`, () => {
    const rand = random(seed);
    let back = '';
    let front = '';
    for (let index = 0; index < 26; index++) {
      const angle = -Math.PI / 2 + between(rand, -1.3, 1.3);
      const length = size * between(rand, 0.55, 1);
      const leaf = leafPath(x + between(rand, -8, 8), y, length, 5 + size * 0.02, angle);
      if (index % 2 === 0) {
        back += leaf;
      } else {
        front += leaf;
      }
    }
    return { back, front };
  });
  const tone = mix(art.leaf.light, art.leaf.mist, pale);
  return (
    <g>
      <path d={shape.back} fill={dark(tone, 0.25)} />
      <path d={shape.front} fill={tone} />
    </g>
  );
};

export const BigLeaf = ({
  art,
  x,
  y,
  angle,
  length,
  width,
  tone,
  phase = 0,
}: {
  art: Art;
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  tone: string;
  phase?: number;
}) => {
  const rotation = angle + sway(art.frame, 120, phase, 3 * art.sway);
  const shape = memo(`bigleaf|${length}|${width}`, () => {
    let veins = '';
    for (let t = 0.14; t < 0.94; t += 0.08) {
      const half = width * Math.sin(Math.PI * t) * 0.86;
      veins += `M${f(length * t)} 0L${f(length * t + half * 0.5)} ${f(-half)}M${f(length * t)} 0L${f(length * t + half * 0.5)} ${f(half)}`;
    }
    return {
      blade: `M0 0C${f(length * 0.2)} ${f(-width * 1.1)} ${f(length * 0.75)} ${f(-width * 0.95)} ${f(length)} 0C${f(length * 0.75)} ${f(width * 0.95)} ${f(length * 0.2)} ${f(width * 1.1)} 0 0Z`,
      veins,
    };
  });
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rotation)})`}>
      <path d={shape.blade} fill={tone} />
      <path
        d={`M0 0C${f(length * 0.3)} ${f(-width * 0.5)} ${f(length * 0.75)} ${f(-width * 0.45)} ${f(length)} 0C${f(length * 0.7)} ${f(-width * 0.1)} ${f(length * 0.3)} ${f(-width * 0.08)} 0 0Z`}
        fill={light(tone, 0.18)}
        opacity={0.7}
      />
      <path d={shape.veins} stroke={dark(tone, 0.25)} strokeWidth={1.2} fill="none" />
      <path
        d={`M0 0L${f(length * 0.97)} 0`}
        stroke={light(tone, 0.35)}
        strokeWidth={2.4}
        fill="none"
      />
    </g>
  );
};

export const Lawn = ({ art, top, seed }: { art: Art; top: number; seed: number }) => {
  const grass = memo(`lawn|${top}|${seed}`, () => {
    const rand = random(seed);
    let dim = '';
    let lit = '';
    for (let index = 0; index < 900; index++) {
      const depth = rand() ** 0.8;
      const px = rand() * WIDTH;
      const py = top + 6 + depth * (HEIGHT - top);
      const blade = 3 + depth * 9;
      const stroke = `M${f(px)} ${f(py)}l${f(between(rand, -2, 2))} ${f(-blade)}`;
      if (rand() > 0.5) {
        lit += stroke;
      } else {
        dim += stroke;
      }
    }
    return { dim, lit };
  });
  return (
    <g>
      <rect x={0} y={top} width={WIDTH} height={HEIGHT - top + 80} fill={fill(art, 'lawn')} />
      <path d={grass.dim} stroke={dark(art.leaf.lawn, 0.2)} strokeWidth={1.4} fill="none" />
      <path d={grass.lit} stroke={light(art.leaf.lawn, 0.22)} strokeWidth={1.2} fill="none" />
    </g>
  );
};
