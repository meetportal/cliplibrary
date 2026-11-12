import { type BadgeKit, fitText, Stroke, WipeText } from './parts';

const torn = (x: number, top: number, bottom: number, teeth: number, depth: number) =>
  Array.from({ length: teeth * 2 + 1 }, (_, at) => {
    const y = top + ((bottom - top) * at) / (teeth * 2);
    return `${(x + (at % 2 === 0 ? 0 : depth)).toFixed(2)} ${y.toFixed(2)}`;
  });

export const TapeBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'heavy', 66, 290);
  const s = fit.size;
  const w = Math.max(fit.width + 68, 150);
  const h = 78;
  const right = torn(w / 2, -h / 2, h / 2, 4, -7);
  const left = torn(-w / 2, h / 2, -h / 2, 4, 7);
  const tape = `M ${right.join(' L ')} L ${left.join(' L ')} Z`;
  const grow = kit.state.shape;
  const under = `M ${-0.24 * w} ${h / 2 + 18} Q 0 ${h / 2 + 14} ${0.22 * w} ${h / 2 + 19}`;
  return (
    <g transform="rotate(-2)">
      {grow > 0.002 ? (
        <path
          d={tape}
          fill={kit.palette.secondary}
          transform={`translate(${-w / 2} 0) scale(${grow.toFixed(4)} 1) translate(${w / 2} 0)`}
        />
      ) : null}
      <WipeText
        kit={kit}
        name="t"
        face="heavy"
        fit={fit}
        y={0.36 * s}
        fill={kit.palette.secondaryInk}
      />
      <Stroke
        d={under}
        amount={kit.ornaments ? kit.state.ornament : 0}
        color={kit.palette.chalk}
        width={4}
      />
    </g>
  );
};

const burst = (outer: number, inner: number, points: number) =>
  `M ${Array.from({ length: points * 2 }, (_, at) => {
    const r = at % 2 === 0 ? outer : inner;
    const angle = (at / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    return `${(Math.cos(angle) * r).toFixed(2)} ${(Math.sin(angle) * r).toFixed(2)}`;
  }).join(' L ')} Z`;

const ring = (r: number) => `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;

export const BurstBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'heavy', 74, 104);
  const s = fit.size;
  const pop = kit.state.pop;
  const marks = kit.ornaments ? kit.state.ornament : 0;
  return (
    <>
      {pop > 0.002 ? (
        <g transform={`rotate(${((1 - pop) * -40).toFixed(3)}) scale(${pop.toFixed(4)})`}>
          <path d={burst(96, 82, 18)} fill={kit.palette.primary} />
        </g>
      ) : null}
      <Stroke
        d={ring(64)}
        amount={kit.state.shape}
        color={kit.palette.primaryInk}
        width={2.5}
        opacity={0.6}
      />
      <WipeText
        kit={kit}
        name="t"
        face="heavy"
        fit={fit}
        y={0.36 * s}
        fill={kit.palette.primaryInk}
      />
      <Stroke d="M -132 -78 L -112 -94" amount={marks} color={kit.palette.chalk} width={4} />
      <Stroke d="M 110 86 L 130 70" amount={marks} color={kit.palette.chalk} width={4} />
      <Stroke d="M 122 104 L 134 95" amount={marks} color={kit.palette.chalk} width={3} />
    </>
  );
};

export const ArrowBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'heavy', 60, 230);
  const s = fit.size;
  const body = Math.max(fit.width + 50, 120);
  const h = 72;
  const x0 = -body / 2 - 16;
  const x1 = body / 2 - 16;
  const tip = x1 + 40;
  const tag = `M ${x0} ${-h / 2} L ${x1} ${-h / 2} L ${tip} 0 L ${x1} ${h / 2} L ${x0} ${h / 2} Z`;
  const pad = 16;
  const loop = `M ${x0 - pad + 10} ${h / 2 + pad} Q ${x0 - pad} ${h / 2 + pad} ${x0 - pad} ${h / 2 + pad - 12} V ${-h / 2 - pad + 12} Q ${x0 - pad} ${-h / 2 - pad} ${x0 - pad + 12} ${-h / 2 - pad} H ${x1 + 2} Q ${tip + 26} ${-h / 2 - pad + 6} ${tip + 24} 0 Q ${tip + 22} ${h / 2 + pad - 4} ${x1} ${h / 2 + pad} H ${x0 + 30}`;
  const grow = kit.state.shape;
  return (
    <>
      {grow > 0.002 ? (
        <path
          d={tag}
          fill={kit.palette.secondary}
          transform={`translate(${x0} 0) scale(${grow.toFixed(4)} 1) translate(${-x0} 0)`}
        />
      ) : null}
      <Stroke d={loop} amount={kit.state.ornament} color={kit.palette.chalk} width={3.5} />
      <WipeText
        kit={kit}
        name="t"
        face="heavy"
        fit={fit}
        x={-16}
        y={0.36 * s}
        fill={kit.palette.secondaryInk}
      />
    </>
  );
};

export const RibbonBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'serif', 46, 400, 0.03);
  const s = fit.size;
  const w = Math.max(fit.width + 64, 200);
  const h = 66;
  const band = kit.state.shape;
  const tails = kit.state.ornament;
  const tail = (sign: number) => {
    const inner = sign * (w / 2 - 22);
    const outer = sign * (w / 2 + 44);
    const top = -h / 2 + 18;
    const bottom = h / 2 + 18;
    const shape = `M ${inner} ${top} L ${outer} ${top} L ${outer - sign * 18} ${(top + bottom) / 2} L ${outer} ${bottom} L ${inner} ${bottom} Z`;
    const fold = `M ${sign * (w / 2)} ${h / 2} L ${sign * (w / 2 - 22)} ${h / 2 + 18} L ${sign * (w / 2 - 22)} ${h / 2} Z`;
    const slide = (1 - tails) * -sign * 40;
    return (
      <g key={sign} transform={`translate(${slide.toFixed(3)} 0)`} opacity={Math.min(1, tails * 3)}>
        <path d={shape} fill={kit.palette.accentShade} />
        <path d={fold} fill={kit.palette.accentShade} opacity={0.8} />
      </g>
    );
  };
  return (
    <>
      {tails > 0.002 ? [-1, 1].map(tail) : null}
      {band > 0.002 ? (
        <path
          d={`M ${-w / 2} ${-h / 2} Q 0 ${-h / 2 - 8} ${w / 2} ${-h / 2} L ${w / 2} ${h / 2} Q 0 ${h / 2 - 8} ${-w / 2} ${h / 2} Z`}
          fill={kit.palette.accent}
          transform={`scale(${band.toFixed(4)} 1)`}
        />
      ) : null}
      <WipeText
        kit={kit}
        name="t"
        face="serif"
        fit={fit}
        y={0.34 * s}
        fill={kit.palette.accentInk}
        tracking={0.03}
      />
    </>
  );
};
