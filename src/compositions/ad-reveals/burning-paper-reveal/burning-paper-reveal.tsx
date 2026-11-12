import { useId } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BurningPaperRevealProps } from '@/schemas';
import { Backdrop } from './backdrop';
import {
  burnAt,
  CARD,
  CARD_CENTER,
  cameraScale,
  edgePoints,
  edgeX,
  type Point,
  paperClip,
} from './burn';
import { Card } from './card';
import { legibleOn } from './color';
import { BurningEdge } from './edge';
import { Flames } from './flames';
import { useMeasure } from './fonts';
import { HandBack, HandFront } from './hand';
import { cardLayout } from './layout';
import type { BurnLook } from './look';
import { FILTER_REGION, Overlay } from './overlay';
import { Smoke, Sparks } from './particles';
import { useLogoAspect } from './use-logo-aspect';

const paperPath = (points: readonly Point[]) =>
  `M 0 0 ${points
    .map((point) => `L ${Math.max(0, Math.min(CARD.width, point.x)).toFixed(2)} ${point.y}`)
    .join(' ')} L 0 ${CARD.height} Z`;

const Shadow = ({ d }: { d: string }) => {
  const id = useId().replace(/:/g, '');
  return (
    <g>
      <defs>
        <filter id={id} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={22} />
        </filter>
      </defs>
      <path
        d={d}
        transform="translate(18 30)"
        fill="#0b1220"
        opacity={0.42}
        filter={`url(#${id})`}
      />
    </g>
  );
};

const WallGlow = ({ x, strength, color }: { x: number; strength: number; color: string }) => {
  const id = useId().replace(/:/g, '');
  return (
    <g>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={x + 40} cy={60} r={560}>
          <stop offset={0} stopColor={color} stopOpacity={0.34 * strength} />
          <stop offset={0.5} stopColor={color} stopOpacity={0.12 * strength} />
          <stop offset={1} stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x + 40} cy={60} rx={560} ry={700} fill={`url(#${id})`} />
    </g>
  );
};

export const BurningPaperReveal = (props: BurningPaperRevealProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const measure = useMeasure();
  const logoInfo = useLogoAspect(props.logo);
  const { colors, burn } = props;
  const state = burnAt(frame, burn, fps);
  const points = edgePoints(state.front, burn);
  const layout = cardLayout(props, measure, logoInfo?.aspect ?? null);
  const scale = cameraScale(frame, props.camera.pullBack, burn, fps);
  const look: BurnLook = {
    frame,
    fps,
    burn,
    height: props.fire.height,
    glow: props.fire.glow,
    sparks: props.fire.sparks,
    smoke: props.fire.smoke,
    flame: colors.flame,
    smokeColor: colors.smoke,
  };
  const hand = { skin: colors.skin, cuff: colors.cuff, sleeve: colors.sleeve };
  const paperD = paperPath(points);
  const glowX = Math.min(CARD.width, edgeX(0, state.front, burn));
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground ? (
        <Backdrop
          scale={scale}
          look={{
            top: colors.backTop,
            left: colors.backLeft,
            right: colors.backRight,
            floor: colors.backFloor,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: CARD_CENTER.x - CARD.width / 2,
          top: CARD_CENTER.y - CARD.height / 2,
          width: CARD.width,
          height: CARD.height,
          transform: `rotate(${props.camera.tilt}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <Overlay>
          <WallGlow x={glowX} strength={props.fire.glow * state.intensity} color={colors.flame} />
          <Shadow d={paperD} />
          {props.hand.show ? <HandBack look={hand} /> : null}
        </Overlay>
        <Card
          layout={layout}
          clip={paperClip(points)}
          look={{
            paper: colors.paper,
            border: colors.border,
            text: colors.text,
            accent: legibleOn(colors.accent, colors.paper, 3),
            flame: colors.flame,
            logo: props.logo,
            logoBox: logoInfo?.box ?? null,
            plate: colors.plate,
            showPlate: props.lockup.showPlate,
            glow: props.fire.glow,
            front: state.front,
            heat: state.char,
          }}
        />
        <Overlay>
          {props.hand.show ? <HandFront look={hand} /> : null}
          <Smoke look={look} />
          <Flames look={look} state={state} />
          <BurningEdge look={look} state={state} points={points} clip={paperD} />
          <Sparks look={look} />
        </Overlay>
      </div>
    </AbsoluteFill>
  );
};
