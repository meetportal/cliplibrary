import { type BadgeKit, breathe, fitText, Stroke, WipeText } from './parts';

const diamond = (r: number) => `M 0 ${-r} L ${0.8 * r} 0 L 0 ${r} L ${-0.8 * r} 0 Z`;

export const LinesBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'hand', 104, 250, 0.08);
  const s = fit.size;
  const a = fit.width / 2 + 26;
  const top = `M ${-a} ${-0.5 * s} Q ${0.1 * a} ${-0.56 * s} ${a + 4} ${-0.52 * s}`;
  const under = `M ${-a - 6} ${0.46 * s} Q 0 ${0.42 * s} ${a + 2} ${0.47 * s}`;
  const second = `M ${-0.62 * a} ${0.58 * s} Q 0 ${0.55 * s} ${0.66 * a} ${0.59 * s}`;
  const side = a + 34;
  const grow = kit.ornaments ? kit.state.ornament : 0;
  return (
    <>
      <Stroke d={top} amount={kit.state.shape} color={kit.palette.highlight} width={4.5} />
      <Stroke d={under} amount={kit.state.shape} color={kit.palette.highlight} width={4.5} />
      <Stroke d={second} amount={kit.state.ornament} color={kit.palette.highlight} width={3.5} />
      <WipeText
        kit={kit}
        name="t"
        face="hand"
        fit={fit}
        y={0.33 * s}
        fill={kit.palette.chalk}
        tracking={0.08}
      />
      {grow > 0
        ? [-1, 1].map((sign) => (
            <g key={sign}>
              <path
                d={diamond(8)}
                fill={kit.palette.secondary}
                transform={`translate(${sign * side} ${-0.02 * s}) scale(${grow.toFixed(4)})`}
              />
              <circle
                cx={sign * (side - 18)}
                cy={-0.02 * s}
                r={3 * grow}
                fill={kit.palette.chalk}
              />
            </g>
          ))
        : null}
    </>
  );
};

const roundedBox = (w: number, h: number, r: number, shift: number) => {
  const x0 = -w / 2 + shift;
  const x1 = w / 2 + shift;
  const y0 = -h / 2 + shift * 0.6;
  const y1 = h / 2 + shift * 0.6;
  return `M ${x0 + r} ${y0} H ${x1 - r} Q ${x1} ${y0} ${x1} ${y0 + r} V ${y1 - r} Q ${x1} ${y1} ${x1 - r} ${y1} H ${x0 + r} Q ${x0} ${y1} ${x0} ${y1 - r} V ${y0 + r} Q ${x0} ${y0} ${x0 + r + 22} ${y0 - 1}`;
};

export const FrameBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'block', 112, 240);
  const s = fit.size;
  const w = Math.max(fit.width + 76, 120);
  const h = Math.max(s * 1.02, 86);
  const second = Math.max(0, Math.min(1, kit.state.shape * 1.25 - 0.25));
  return (
    <>
      <g transform="rotate(-1.4)">
        <Stroke
          d={roundedBox(w, h, 12, 0)}
          amount={kit.state.shape}
          color={kit.palette.accentLine}
          width={5}
        />
      </g>
      <g transform="rotate(1.1)">
        <Stroke
          d={roundedBox(w + 8, h + 4, 14, 3)}
          amount={second}
          color={kit.palette.accentLine}
          width={3}
          opacity={0.75}
        />
      </g>
      <WipeText kit={kit} name="t" face="block" fit={fit} y={0.35 * s} fill={kit.palette.chalk} />
    </>
  );
};

const ring = (r: number) => `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;

export const SunBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'hand', 100, 96, 0.06);
  const s = fit.size;
  const rays = kit.ornaments
    ? Array.from({ length: 14 }, (_, at) => {
        const angle = (at / 14) * Math.PI * 2 - Math.PI / 2;
        const reach = 1 + 0.12 * breathe(kit, 48, at * 0.45);
        const inner = 86;
        const outer = inner + (at % 2 === 0 ? 18 : 12) * reach;
        const delay = Math.max(0, Math.min(1, kit.state.ornament * 1.6 - (at / 14) * 0.6));
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (
          <Stroke
            key={at}
            d={`M ${(cos * inner).toFixed(2)} ${(sin * inner).toFixed(2)} L ${(cos * outer).toFixed(2)} ${(sin * outer).toFixed(2)}`}
            amount={delay}
            color={kit.palette.pink}
            width={3.5}
          />
        );
      })
    : null;
  const inner = Math.max(0, Math.min(1, kit.state.shape * 1.3 - 0.3));
  return (
    <>
      <Stroke d={ring(72)} amount={kit.state.shape} color={kit.palette.chalk} width={4.5} />
      <Stroke d={ring(62)} amount={inner} color={kit.palette.chalk} width={2.5} />
      {rays}
      <WipeText
        kit={kit}
        name="t"
        face="hand"
        fit={fit}
        y={0.33 * s}
        fill={kit.palette.chalk}
        tracking={0.06}
      />
    </>
  );
};
