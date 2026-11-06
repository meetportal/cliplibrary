import { useMemo } from 'react';
import { AbsoluteFill, Easing, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DotRingLogoRevealProps } from '@/schemas';
import { Comet } from './comet';
import { buildLockup, type Lockup } from './lockup';
import { frameOutline, Mark } from './mark';
import { NameLine } from './name-line';
import { NAME_FONTS, useNameMetrics } from './name-metrics';
import { buildTimeline, progress, settle, type Timeline } from './timeline';
import { type LogoState, useLogo } from './use-logo';

const withoutFullStop = (name: string) => name.trim().replace(/\.$/, '').trimEnd();

const logoEntrance = (handoff: DotRingLogoRevealProps['ring']['handoff'], line: Timeline) =>
  handoff === 'plate'
    ? { start: line.close + 14, end: line.close + 30, scale: 0.94 }
    : handoff === 'frame'
      ? { start: line.close + 4, end: line.close + 26, scale: 0.86 }
      : { start: line.exitEnd + 4, end: line.exitEnd + 24, scale: 0.84 };

const LogoLayer = ({
  frame,
  logo,
  lockup,
  line,
  props,
}: {
  frame: number;
  logo: LogoState;
  lockup: Lockup;
  line: Timeline;
  props: DotRingLogoRevealProps;
}) => {
  const entrance = logoEntrance(props.ring.handoff, line);
  const shown = progress(frame, [entrance.start, entrance.start + 14], Easing.linear);
  if (shown <= 0) {
    return null;
  }
  const grow = progress(frame, [entrance.start, entrance.end], settle);
  const bloom = entrance.scale + (1 - entrance.scale) * grow;
  const scale =
    props.ring.handoff === 'frame'
      ? Math.min(bloom, frameOutline(frame, line, lockup, props.ring.frameThickness).fit)
      : bloom;
  const { width, height } = lockup.logo;
  const style = {
    position: 'absolute' as const,
    left: lockup.center.x - width / 2,
    top: lockup.center.y - height / 2,
    width,
    height,
    opacity: shown,
    transform: `scale(${scale})`,
    filter: shown < 1 ? `blur(${(10 * (1 - shown)).toFixed(2)}px)` : undefined,
  };
  return logo === null ? (
    <div
      style={{
        ...style,
        boxSizing: 'border-box',
        borderRadius: Math.min(width, height) * 0.12,
        border: `4px dashed ${props.colors.text}`,
        opacity: shown * 0.3,
      }}
    />
  ) : (
    <Img src={logo.src} style={{ ...style, objectFit: 'contain' }} />
  );
};

export const DotRingLogoReveal = (props: DotRingLogoRevealProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const logo = useLogo(props.logo);
  const reference = useNameMetrics(
    withoutFullStop(props.companyName),
    props.name.font,
    props.name.tracking,
  );
  const lockup = useMemo(
    () => buildLockup(props, logo?.aspect ?? null, reference, { width, height }),
    [props, logo, reference, width, height],
  );
  const line = useMemo(() => buildTimeline(props.timing, lockup), [props.timing, lockup]);
  const font = NAME_FONTS[props.name.font];
  return (
    <AbsoluteFill
      style={{ backgroundColor: props.showBackground ? props.colors.background : 'transparent' }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <Mark frame={frame} props={props} lockup={lockup} line={line} />
      </svg>
      <LogoLayer frame={frame} logo={logo} lockup={lockup} line={line} props={props} />
      <NameLine
        frame={frame}
        lockup={lockup}
        line={line}
        color={props.colors.text}
        family={font.family}
        weight={font.weight}
      />
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <Comet frame={frame} lockup={lockup} line={line} colors={props.colors} />
      </svg>
    </AbsoluteFill>
  );
};
