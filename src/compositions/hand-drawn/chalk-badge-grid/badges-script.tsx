import { type BadgeKit, breathe, fitText, Sparkle, Stroke, WipeText } from './parts';

export const SwooshBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'script', 92, 250);
  const s = fit.size;
  const a = fit.width / 2 + 12;
  const swoosh = `M ${-a} ${0.5 * s} C ${-0.4 * a} ${0.4 * s} ${0.4 * a} ${0.34 * s} ${a + 6} ${0.38 * s} C ${a + 30} ${0.4 * s} ${a + 34} ${0.12 * s} ${a + 20} ${0.12 * s} C ${a + 6} ${0.12 * s} ${a + 10} ${0.48 * s} ${a + 46} ${0.42 * s}`;
  return (
    <>
      <WipeText kit={kit} name="t" face="script" fit={fit} y={0.2 * s} fill={kit.palette.chalk} />
      <Stroke d={swoosh} amount={kit.state.shape} color={kit.palette.chalk} width={5} />
      <Sparkle kit={kit} x={a + 26} y={-0.62 * s} r={15} color={kit.palette.pink} phase={0} />
      <Sparkle kit={kit} x={a + 50} y={-0.4 * s} r={8} color={kit.palette.pink} phase={1.9} />
    </>
  );
};

export const ArcBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'script', 86, 224);
  const s = fit.size;
  const a = fit.width / 2 + 18;
  const arc = `M ${-a} ${-0.42 * s} Q ${-0.1 * a} ${-1.08 * s} ${a + 4} ${-0.5 * s}`;
  const under = `M ${-0.72 * a} ${0.56 * s} Q ${0.05 * a} ${0.46 * s} ${0.78 * a} ${0.52 * s}`;
  const dots = [0, 1, 2].map((at) => {
    const grow = Math.max(0, Math.min(1, kit.state.ornament * 3 - at));
    return grow <= 0 || !kit.ornaments ? null : (
      <circle
        key={at}
        cx={a + 6 + at * 11}
        cy={-0.3 * s + at * 10}
        r={(4.2 - at * 0.6) * grow}
        fill={kit.palette.warm}
      />
    );
  });
  return (
    <>
      <Stroke d={arc} amount={kit.state.shape} color={kit.palette.chalk} width={4.5} />
      <WipeText kit={kit} name="t" face="script" fit={fit} y={0.24 * s} fill={kit.palette.warm} />
      <Stroke d={under} amount={kit.state.ornament} color={kit.palette.chalk} width={3.5} />
      {dots}
    </>
  );
};

const point = (rx: number, ry: number, degrees: number) => {
  const angle = (degrees * Math.PI) / 180;
  return `${(rx * Math.cos(angle)).toFixed(2)} ${(ry * Math.sin(angle)).toFixed(2)}`;
};

export const BubbleBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'script', 80, 220);
  const s = fit.size;
  const rx = Math.max(fit.width / 2 + 46, 96);
  const ry = 54;
  const tip = `${(-0.86 * rx).toFixed(2)} ${(1.36 * ry).toFixed(2)}`;
  const bubble = `M ${tip} L ${point(rx, ry, 122)} A ${rx} ${ry} 0 1 0 ${point(rx, ry, 146)} L ${tip}`;
  return (
    <>
      <Stroke d={bubble} amount={kit.state.shape} color={kit.palette.highlight} width={5} />
      <WipeText kit={kit} name="t" face="script" fit={fit} y={0.3 * s} fill={kit.palette.chalk} />
    </>
  );
};

export const DashesBadge = ({ kit }: { kit: BadgeKit }) => {
  const fit = fitText(kit, 'script', 92, 250);
  const s = fit.size;
  const a = fit.width / 2 + 16;
  const dashes = kit.ornaments
    ? [-28, 0, 28].flatMap((tilt, at) =>
        [-1, 1].map((side) => {
          const flick = 1 + 0.18 * breathe(kit, 30, at * 1.7 + side);
          const length = 30 * flick;
          const angle = (tilt * Math.PI) / 180;
          const x0 = side * (a + 6 * Math.abs(Math.sin(angle)));
          const y0 = -0.05 * s + Math.sin(angle) * 0.42 * s;
          const x1 = x0 + side * Math.cos(angle) * length;
          const y1 = y0 + Math.sin(angle) * length * 0.8;
          return (
            <Stroke
              key={`${tilt}-${side}`}
              d={`M ${x0.toFixed(2)} ${y0.toFixed(2)} L ${x1.toFixed(2)} ${y1.toFixed(2)}`}
              amount={kit.state.ornament}
              color={kit.palette.chalk}
              width={4}
            />
          );
        }),
      )
    : null;
  return (
    <>
      <WipeText
        kit={kit}
        name="t"
        face="script"
        fit={fit}
        y={0.24 * s}
        fill={kit.palette.accentLine}
      />
      {dashes}
    </>
  );
};
