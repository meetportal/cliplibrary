import { Img } from 'remotion';
import { type BadgeKit, Sparkle } from './parts';
import type { GridLogo } from './use-logo';

export type LogoBox = { width: number; height: number };

export const logoBox = (logo: GridLogo, height: number): LogoBox => {
  const aspect = logo?.aspect ?? 1;
  const width = Math.min(300, height * aspect);
  return { width, height: width / aspect };
};

const PAD = 20;

export const LogoPlate = (props: {
  kit: BadgeKit;
  box: LogoBox;
  showPlate: boolean;
  hasLogo: boolean;
}) => {
  const { kit, box } = props;
  const w = box.width + PAD * 2;
  const h = box.height + PAD * 2;
  const pop = kit.state.pop;
  const top = -h / 2;
  return (
    <>
      {props.showPlate && props.hasLogo && pop > 0.002 ? (
        <g transform={`scale(${(0.6 + 0.4 * pop).toFixed(4)})`} opacity={Math.min(1, pop * 1.6)}>
          <rect
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            rx={Math.min(26, h / 2)}
            fill={kit.palette.plate}
          />
        </g>
      ) : null}
      <Sparkle kit={kit} x={-24} y={top - 30} r={13} color={kit.palette.highlight} phase={0.6} />
      <Sparkle kit={kit} x={16} y={top - 44} r={10} color={kit.palette.highlight} phase={2.4} />
      <Sparkle kit={kit} x={30} y={top - 18} r={7} color={kit.palette.highlight} phase={4.1} />
    </>
  );
};

export const LogoImage = (props: {
  logo: GridLogo;
  box: LogoBox;
  x: number;
  y: number;
  scale: number;
  reveal: number;
}) => {
  if (props.logo === null || props.reveal <= 0.002) {
    return null;
  }
  const { box } = props;
  const grow = 0.8 + 0.2 * props.reveal;
  return (
    <Img
      src={props.logo.src}
      style={{
        position: 'absolute',
        left: props.x - box.width / 2,
        top: props.y - box.height / 2,
        width: box.width,
        height: box.height,
        objectFit: 'contain',
        opacity: props.reveal,
        transform: `scale(${(grow * props.scale).toFixed(4)})`,
      }}
    />
  );
};
