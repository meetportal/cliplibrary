import { useId } from 'react';
import { alpha, mixLab } from './color';
import { LABEL_FACE } from './fonts';

export const PHONE = { width: 330, height: 680, top: 740, radius: 58, edge: 4 } as const;
export const PHONE_CENTERS = [270, 810] as const;
export const PLUG_REST = PHONE.top + PHONE.height - 30;
export const PLUG_START = 1944;

const BATTERY = { width: 150, height: 250, bottomGap: 50, stroke: 6, inset: 8, cap: 18 } as const;
const SEGMENTS = 4;

export type PhoneLook = {
  center: number;
  shell: string;
  edge: string;
  screen: string;
  outline: string;
  fill: string;
  level: number;
  wake: number;
  bolt: number;
  boltScale: number;
  boltInk: string;
  percent: number | null;
  percentColor: string;
  percentSize: number;
};

const SideButtons = ({ edge }: { edge: string }) => (
  <>
    {[
      { x: -5, y: 150, h: 46 },
      { x: -5, y: 220, h: 78 },
      { x: -5, y: 312, h: 78 },
      { x: PHONE.width - 1, y: 236, h: 110 },
    ].map((button) => (
      <div
        key={`${button.x}-${button.y}`}
        style={{
          position: 'absolute',
          left: button.x,
          top: button.y,
          width: 6,
          height: button.h,
          borderRadius: 3,
          backgroundColor: edge,
        }}
      />
    ))}
  </>
);

const Battery = ({ look }: { look: PhoneLook }) => {
  const clipId = useId().replace(/:/g, '');
  const { width, height, stroke, inset, cap } = BATTERY;
  const innerTop = stroke + inset + cap;
  const innerHeight = height - stroke * 2 - inset * 2;
  const innerWidth = width - stroke * 2 - inset * 2;
  const fillHeight = Math.max(innerHeight * Math.max(0, Math.min(1, look.level)), 0);
  const fillTop = innerTop + innerHeight - fillHeight;
  const dividers = Array.from(
    { length: SEGMENTS - 1 },
    (_, index) => innerTop + (innerHeight * (index + 1)) / SEGMENTS,
  );
  return (
    <svg
      width={width}
      height={height + cap}
      viewBox={`0 0 ${width} ${height + cap}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: (PHONE.width - width) / 2,
        top: PHONE.height - BATTERY.bottomGap - height - cap,
        opacity: look.wake,
        transform: `scale(${0.9 + 0.1 * look.wake})`,
        transformOrigin: '50% 100%',
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={stroke + inset} y={innerTop} width={innerWidth} height={innerHeight} rx={6} />
        </clipPath>
      </defs>
      <rect x={width / 2 - 28} y={0} width={56} height={cap + 6} rx={6} fill={look.outline} />
      <rect
        x={stroke / 2}
        y={cap + stroke / 2}
        width={width - stroke}
        height={height - stroke}
        rx={18}
        fill={look.screen}
        stroke={look.outline}
        strokeWidth={stroke}
      />
      <g clipPath={`url(#${clipId})`}>
        <rect x={0} y={fillTop} width={width} height={fillHeight + 2} fill={look.fill} />
        {dividers.map((y) =>
          y > fillTop + 2 ? (
            <rect key={y} x={0} y={y - 3} width={width} height={6} fill={look.screen} />
          ) : null,
        )}
      </g>
      <g
        opacity={look.bolt}
        transform={`translate(${width / 2} ${cap + height / 2}) scale(${look.boltScale}) translate(-30 -46)`}
      >
        <path
          d="M36 0 L4 52 H28 L22 92 L56 36 H32 Z"
          fill={look.boltInk}
          stroke={look.screen}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const Phone = ({ look }: { look: PhoneLook }) => (
  <div
    style={{
      position: 'absolute',
      left: look.center - PHONE.width / 2,
      top: PHONE.top,
      width: PHONE.width,
      height: PHONE.height,
    }}
  >
    <SideButtons edge={look.edge} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: PHONE.radius,
        backgroundColor: look.shell,
        border: `${PHONE.edge}px solid ${look.edge}`,
        boxShadow: `inset 0 0 0 10px ${look.shell}, inset 0 0 0 12px ${alpha(look.edge, 0.5)}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 16,
        width: PHONE.width - 32,
        height: PHONE.height - 32,
        borderRadius: PHONE.radius - 14,
        backgroundColor: look.screen,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: PHONE.width / 2 - 48,
        top: 34,
        width: 96,
        height: 28,
        borderRadius: 14,
        backgroundColor: mixLab(look.shell, '#000000', 0.5),
        border: `2px solid ${alpha(look.edge, 0.7)}`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 14,
          top: 8,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: alpha(look.edge, 0.9),
        }}
      />
    </div>
    {look.percent === null ? null : (
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: PHONE.width,
          top: 170,
          textAlign: 'center',
          fontFamily: LABEL_FACE.family,
          fontWeight: LABEL_FACE.weight,
          fontSize: look.percentSize,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          color: look.percentColor,
          opacity: look.wake,
        }}
      >
        {`${Math.round(look.percent)}%`}
      </div>
    )}
    <Battery look={look} />
  </div>
);

export const Plug = ({ center, top, cable }: { center: number; top: number; cable: string }) => {
  const id = useId().replace(/:/g, '');
  const metal = mixLab(cable, '#7c82a6', 0.45);
  const shade = mixLab(cable, '#5d6290', 0.35);
  return (
    <svg
      width={120}
      height={1300}
      viewBox="-60 0 120 1300"
      aria-hidden="true"
      style={{ position: 'absolute', left: center - 60, top }}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset={0} stopColor={shade} />
          <stop offset={0.35} stopColor={cable} />
          <stop offset={0.6} stopColor={cable} />
          <stop offset={1} stopColor={shade} />
        </linearGradient>
      </defs>
      <rect x={-20} y={0} width={40} height={44} rx={7} fill={metal} />
      <rect x={-9} y={252} width={18} height={1048} fill={`url(#${id})`} />
      <path d="M-24 186 L24 186 L14 268 L-14 268 Z" fill={`url(#${id})`} />
      <rect x={-34} y={36} width={68} height={160} rx={24} fill={`url(#${id})`} />
      <rect x={-22} y={176} width={44} height={6} rx={3} fill={alpha(shade, 0.8)} />
    </svg>
  );
};
