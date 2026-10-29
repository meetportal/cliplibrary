import type { ReactNode } from 'react';
import type { GoldEvent, GoldMonogramInviteProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { dashStyle, goldText, riseIn, useSvgId } from './reveal';

const COLUMN_WIDTH = 760;

const PART_STAGGER = 5;

const DIVIDER_WIDTH = 220;

const Divider = ({
  progress,
  gold,
}: {
  progress: number;
  gold: GoldMonogramInviteProps['gold'];
}) => {
  const gradient = useSvgId('divider-gold');
  const half = DIVIDER_WIDTH / 2;
  const diamond = tween(progress, [0.45, 1], [0, 1], smooth);
  return (
    <svg
      width={DIVIDER_WIDTH}
      height={14}
      viewBox={`${-half} -7 ${DIVIDER_WIDTH} 14`}
      role="presentation"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient
          id={gradient}
          gradientUnits="userSpaceOnUse"
          x1={-half}
          y1={0}
          x2={half}
          y2={0}
        >
          <stop offset="0" stopColor={gold.dark} />
          <stop offset="0.5" stopColor={gold.light} />
          <stop offset="1" stopColor={gold.dark} />
        </linearGradient>
      </defs>
      {progress > 0 ? (
        <g fill="none" stroke={`url(#${gradient})`} strokeWidth={1.2}>
          <path d={`M -14 0 L ${-half} 0`} pathLength={1} style={dashStyle(progress)} />
          <path d={`M 14 0 L ${half} 0`} pathLength={1} style={dashStyle(progress)} />
        </g>
      ) : null}
      <path d="M 0 -5.5 L 6 0 L 0 5.5 L -6 0 Z" fill={`url(#${gradient})`} opacity={diamond} />
    </svg>
  );
};

const Part = ({
  frame,
  start,
  rise,
  children,
}: {
  frame: number;
  start: number;
  rise: number;
  children: ReactNode;
}) => {
  const reveal = riseIn(frame, start, rise);
  return (
    <div style={{ opacity: reveal.opacity, transform: `translateY(${reveal.offset}px)` }}>
      {children}
    </div>
  );
};

const detailLine = (event: GoldEvent): string =>
  [event.time, event.venue].filter((part) => part.trim().length > 0).join(', ');

export const Schedule = ({
  frame,
  events,
  schedule,
  gold,
  text,
  serif,
  script,
}: {
  frame: number;
  events: GoldEvent[];
  schedule: GoldMonogramInviteProps['schedule'];
  gold: GoldMonogramInviteProps['gold'];
  text: GoldMonogramInviteProps['text'];
  serif: string;
  script: string;
}) => {
  if (frame < schedule.start) {
    return null;
  }
  const detail = {
    fontFamily: serif,
    fontSize: schedule.detailSize,
    lineHeight: 1.45,
    whiteSpace: 'nowrap' as const,
    fontVariantNumeric: 'lining-nums' as const,
  };
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: schedule.centerX - COLUMN_WIDTH / 2,
        width: COLUMN_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: schedule.rowGap,
      }}
    >
      {events.map((event, index) => {
        const start = schedule.start + 12 + index * schedule.stagger;
        const lineProgress = tween(frame, [start + 4, start + 40], [0, 1], smooth);
        return (
          <div
            key={`${index}:${event.title}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Part frame={frame} start={start} rise={Math.round(schedule.titleSize * 0.3)}>
              <div
                style={{
                  fontFamily: script,
                  fontSize: schedule.titleSize,
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ display: 'inline-block', ...goldText(gold.light, gold.dark) }}>
                  {event.title}
                </span>
              </div>
            </Part>
            <div
              style={{
                margin: `${Math.round(schedule.detailSize * 0.3)}px 0 ${Math.round(schedule.detailSize * 0.45)}px`,
              }}
            >
              <Divider progress={lineProgress} gold={gold} />
            </div>
            <Part
              frame={frame}
              start={start + PART_STAGGER}
              rise={Math.round(schedule.detailSize * 0.8)}
            >
              <div
                style={{
                  ...detail,
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  marginRight: '-0.24em',
                  textTransform: 'uppercase',
                  color: text.cream,
                }}
              >
                {event.date}
              </div>
            </Part>
            <Part
              frame={frame}
              start={start + PART_STAGGER * 2}
              rise={Math.round(schedule.detailSize * 0.8)}
            >
              <div
                style={{
                  ...detail,
                  fontSize: schedule.detailSize * 1.1,
                  fontWeight: 500,
                  color: text.muted,
                }}
              >
                {detailLine(event)}
              </div>
            </Part>
          </div>
        );
      })}
    </div>
  );
};
