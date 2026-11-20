import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { TechStackBranchesProps } from '@/schemas';
import { contrast } from '../../kit/lab-color';
import { ramp } from '../../kit/motion';
import { Backdrop } from './backdrop';
import { Branch, DashedArc } from './connectors';
import { facesFor, useMeasure } from './fonts';
import { buildLayout } from './layout';
import { LogoChip } from './logo';
import { buildPalette } from './palette';
import { Pill } from './pill';
import { buildTimeline, pulseAt, wheelOffset } from './timeline';
import { useTrimmedLogo } from './use-trimmed-logo';
import { Wheel } from './wheel';

const WHEEL_FADE = 8;
const LOGO_RATIO = 2;

export const TechStackBranches = (props: TechStackBranchesProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const measure = useMeasure(props.pills.font);
  const faces = useMemo(() => facesFor(props.pills.font), [props.pills.font]);
  const logo = useTrimmedLogo(props.logo);
  const aspect = logo?.aspect ?? null;
  const palette = useMemo(() => buildPalette(props), [props]);
  const plate =
    props.brand.plate ||
    (logo?.tone != null && contrast(logo.tone, palette.root.fill) < LOGO_RATIO);
  const placed = useMemo(
    () => (plate === props.brand.plate ? props : { ...props, brand: { ...props.brand, plate } }),
    [props, plate],
  );
  const layout = useMemo(
    () => buildLayout(placed, faces, measure, aspect, { width, height }),
    [placed, faces, measure, aspect, width, height],
  );
  const line = useMemo(() => buildTimeline(props, durationInFrames), [props, durationInFrames]);
  const offset = wheelOffset(frame, line);
  const wheelIn = ramp(frame, -1, WHEEL_FADE);
  const { root } = layout;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.background.show ? <Backdrop frame={frame} props={props} /> : null}
      <DashedArc
        clock={frame}
        props={props}
        layout={layout}
        offset={offset}
        color={palette.lines}
        opacity={wheelIn}
        frame={{ width, height }}
      />
      <Branch props={props} layout={layout} color={palette.lines} pulse={pulseAt(frame, line)} />
      <Wheel
        props={props}
        layout={layout}
        palette={palette}
        faces={faces}
        offset={offset}
        opacity={wheelIn}
        frameHeight={height}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transform: `translate(${root.x}px, ${layout.centerY}px)`,
        }}
      >
        <Pill
          box={root}
          title={props.companyName}
          detail={props.tagline}
          colors={palette.root}
          faces={faces}
          icon={props.pills.icon}
          rim={props.pills.rim}
          shadow={props.pills.shadow}
          shadowColor={palette.shadow}
          lead={
            layout.chip === null || logo === null ? undefined : (
              <LogoChip
                src={logo.src}
                chip={layout.chip}
                plate={plate}
                plateColor={palette.plate}
              />
            )
          }
        />
      </div>
    </AbsoluteFill>
  );
};
