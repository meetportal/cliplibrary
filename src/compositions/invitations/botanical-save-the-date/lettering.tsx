import type { CSSProperties, ReactNode } from 'react';
import { settle, smooth, tween } from '../../promo/timing';
import { FadeIn } from '../../promo/typography';

export interface InviteType {
  serif: string;
  script: string;
  ink: string;
  muted: string;
  accent: string;
  gold: string;
  rule: number;
  tracking: number;
  stagger: number;
  width: number;
  offsetY: number;
}

export const EXIT_FRAMES = 14;

export const Caps = ({
  text,
  size,
  type,
  color = type.ink,
  weight = 500,
  tracking = type.tracking,
}: {
  text: string;
  size: number;
  type: InviteType;
  color?: string;
  weight?: number;
  tracking?: number;
}) => (
  <div
    style={{
      fontFamily: type.serif,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: `${tracking}em`,
      paddingLeft: `${tracking}em`,
      textTransform: 'uppercase',
      lineHeight: 1.22,
      textAlign: 'center',
      textWrap: 'balance',
      color,
    }}
  >
    {text}
  </div>
);

export const Script = ({
  text,
  size,
  type,
  lineHeight = 1.15,
  style,
}: {
  text: string;
  size: number;
  type: InviteType;
  lineHeight?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontFamily: type.script,
      fontSize: size,
      lineHeight,
      textAlign: 'center',
      color: type.accent,
      padding: '0 0.3em',
      ...style,
    }}
  >
    {text}
  </div>
);

export const GoldRule = ({
  frame,
  start,
  end,
  width,
  type,
  margin = 0,
}: {
  frame: number;
  start: number;
  end?: number | undefined;
  width: number;
  type: InviteType;
  margin?: number;
}) => {
  const grow = tween(frame, [start, start + 28], [0, 1], settle);
  const fade = end === undefined ? 0 : tween(frame, [end, end + EXIT_FRAMES], [0, 1], smooth);
  if (grow <= 0 || fade >= 1 || type.rule <= 0) {
    return <div style={{ height: type.rule, margin: `${margin}px 0` }} />;
  }
  return (
    <div
      style={{
        width,
        height: type.rule,
        margin: `${margin}px 0`,
        background: type.gold,
        transform: `scaleX(${grow.toFixed(4)})`,
        opacity: Math.min(1, grow * 3) * (1 - fade),
      }}
    />
  );
};

export const BeatColumn = ({ type, children }: { type: InviteType; children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `translateY(${type.offsetY}px)`,
    }}
  >
    <div
      style={{
        width: type.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  </div>
);

export const isOnStage = (frame: number, start: number, end: number | undefined): boolean =>
  frame >= start - 1 && (end === undefined || frame <= end + 48);

export const Rise = ({
  start,
  end,
  delay = 0,
  distance,
  style,
  children,
}: {
  start: number;
  end?: number | undefined;
  delay?: number;
  distance: number;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <FadeIn
    start={start}
    end={end === undefined ? undefined : end - Math.round(delay * 0.4)}
    delay={delay}
    distance={distance}
    {...(style === undefined ? {} : { style })}
  >
    {children}
  </FadeIn>
);
