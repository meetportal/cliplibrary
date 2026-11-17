import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChargeCompareProps } from '@/schemas';
import { BADGE_END_Y, Badge, badgeBox, badgeCenter } from './badge';
import { apartFrom, inkOn, legibleOn, mixHue, mixLab } from './color';
import { Compare, compareLayout } from './compare';
import { EndCard, endCardLayout } from './end-card';
import { LABEL_FACE, useMeasure } from './fonts';
import { Glow } from './glow';
import { type PhoneLook, PLUG_REST, PLUG_START } from './phone';
import { buildTimeline, progress, seatEase, type Timeline } from './timeline';
import { useLogoAspect } from './use-logo-aspect';

const FLICKER_PERIOD = 26;
const HALO_PERIOD = 48;
const SPARK_SPEED = 12.5;
const SHIMMER_LAP = 22;
const BREATHE = 0.015;
const UNPLUG = 16;
const PERCENT_SIZE = 72;
const ONES_SHUTTER = { min: 1, max: 3, counts: 1.6 } as const;
const TENS_SHUTTER = 2.5;
const SAMPLES = 24;

const exposure = (length: number, valueAt: (at: number) => number, frame: number) =>
  Array.from({ length: SAMPLES }, (_, index) =>
    valueAt(frame + length * ((index + 0.5) / SAMPLES - 0.5)),
  );
const FRAME = { width: 1080, height: 1920 } as const;

const irisClip = (center: { x: number; y: number }, radius: number) => {
  const { x, y } = center;
  return `path(evenodd, 'M0 0 H${FRAME.width} V${FRAME.height} H0 Z M${x - radius} ${y} A${radius} ${radius} 0 1 0 ${x + radius} ${y} A${radius} ${radius} 0 1 0 ${x - radius} ${y} Z')`;
};

const coverRadius = (center: { x: number; y: number }) =>
  Math.hypot(
    Math.max(center.x, FRAME.width - center.x),
    Math.max(center.y, FRAME.height - center.y),
  ) + 8;

const chargeLevel = (line: Timeline, start: number, at: number) =>
  start + (1 - start) * progress(at, line.charge[0], line.charge[1], Easing.inOut(Easing.sin));

const fullFrame = (line: Timeline, start: number) => {
  for (let step = line.charge[0]; step < line.charge[1]; step++) {
    if (Math.round(chargeLevel(line, start, step) * 100) >= 100) {
      return step;
    }
  }
  return line.charge[1];
};

export const ChargeCompare = (props: ChargeCompareProps) => {
  const frame = useCurrentFrame();
  const measure = useMeasure();
  const { durationInFrames } = useVideoConfig();
  const line = useMemo(
    () => buildTimeline(props.timing, durationInFrames),
    [props.timing, durationInFrames],
  );
  const aspect = useLogoAspect(props.logo);
  const { colors, battery } = props;

  const wake = progress(frame, line.wake[0], line.wake[1], Easing.inOut(Easing.sin));
  const plugTop =
    PLUG_START +
    (PLUG_REST - PLUG_START) *
      (progress(frame, line.plug[0], line.plug[1], seatEase) -
        progress(frame, line.iris[0], line.iris[0] + UNPLUG, Easing.in(Easing.quad)));

  const screen = mixLab(colors.phone, colors.secondary, 0.06);
  const fullFill = legibleOn(colors.primary, screen, 4.5);
  const lowFill = legibleOn(apartFrom(colors.low, colors.primary), screen, 3);
  const start = battery.startLevel / 100;
  const fullAt = useMemo(() => fullFrame(line, start), [line, start]);
  const teamLevel = chargeLevel(line, start, frame);
  const countAt = (at: number) => chargeLevel(line, start, at) * 100;
  const teamRate = (countAt(frame + 1) - countAt(frame - 1)) / 2;
  const charge = start >= 1 ? 1 : (teamLevel - start) / (1 - start);
  const teamFill = mixHue(
    lowFill,
    fullFill,
    progress(charge, 0.05, 0.95, Easing.inOut(Easing.sin)),
  );
  const soloLevel = battery.soloLevel / 100;
  const pulse = 0.5 + 0.5 * Math.sin((frame * 2 * Math.PI) / FLICKER_PERIOD);
  const soloBolt = wake * (battery.flicker ? 0.2 + 0.3 * pulse : 0.35);
  const teamBolt = progress(frame, line.wake[0] + 4, line.charge[0] + 6, Easing.inOut(Easing.sin));
  const flare =
    progress(frame, fullAt - 2, fullAt + 8, Easing.inOut(Easing.sin)) *
    (1 - progress(frame, fullAt + 8, fullAt + 38, Easing.inOut(Easing.sin)));
  const pop = 0.5 - 0.5 * Math.cos(2 * Math.PI * progress(frame, fullAt - 2, fullAt + 16));

  const phoneBase = {
    shell: colors.phone,
    edge: colors.phoneEdge,
    screen,
    outline: colors.text,
    wake,
    percentSize: PERCENT_SIZE,
    percentMetrics: {
      digit: measure('0', LABEL_FACE) * PERCENT_SIZE,
      sign: measure('%', LABEL_FACE) * PERCENT_SIZE,
    },
  };
  const phones: readonly [PhoneLook, PhoneLook] = [
    {
      ...phoneBase,
      center: 270,
      fill: lowFill,
      level: soloLevel,
      bolt: soloBolt,
      boltScale: 1,
      boltInk: colors.text,
      percent: battery.showPercent
        ? {
            value: battery.soloLevel,
            shutter: { ones: [battery.soloLevel], tens: [battery.soloLevel] },
            rate: 0,
          }
        : null,
      percentColor: lowFill,
      shimmer: { at: 0, opacity: 0 },
    },
    {
      ...phoneBase,
      center: 810,
      fill: teamFill,
      level: teamLevel,
      bolt: teamBolt,
      boltScale: 1 + 0.14 * pop,
      boltInk: colors.text,
      percent: battery.showPercent
        ? {
            value: teamLevel * 100,
            shutter: {
              ones: exposure(
                Math.min(
                  ONES_SHUTTER.max,
                  Math.max(ONES_SHUTTER.min, ONES_SHUTTER.counts / Math.max(teamRate, 1e-3)),
                ),
                countAt,
                frame,
              ),
              tens: exposure(TENS_SHUTTER, countAt, frame),
            },
            rate: teamRate,
          }
        : null,
      percentColor: teamFill,
      shimmer: {
        at: Math.max(0, frame - line.charge[0]) / SHIMMER_LAP,
        opacity:
          progress(frame, line.charge[0], line.charge[0] + 12, Easing.inOut(Easing.sin)) *
          (1 - progress(frame, fullAt - 6, fullAt + 6, Easing.inOut(Easing.sin))),
      },
    },
  ];

  const compare = compareLayout(
    {
      lead: props.headlineLead,
      accent: props.headlineAccent,
      solo: props.soloLabel,
      team: props.teamLabel,
      uppercase: props.type.uppercase,
    },
    { headline: props.type.headlineSize, label: props.type.labelSize },
    measure,
  );
  const end = endCardLayout(
    { name: props.companyName, tagline: props.tagline, website: props.website },
    { name: props.type.nameSize, tagline: props.type.taglineSize, website: props.type.websiteSize },
    measure,
  );
  const box = badgeBox(props.badge.height, aspect, props.badge.endScale);
  const travel = progress(frame, line.travel[0], line.travel[1], Easing.inOut(Easing.cubic));
  const center = badgeCenter(box, travel);
  const iris = progress(frame, line.iris[0], line.iris[1], Easing.inOut(Easing.sin));
  const irisRadius = iris * coverRadius(center);
  const settledBreath = progress(frame, line.travel[1], line.settled, Easing.inOut(Easing.sin));
  const breathing =
    0.5 - 0.5 * Math.cos((Math.max(0, frame - line.travel[1]) * 2 * Math.PI) / HALO_PERIOD);
  const primaryText = legibleOn(colors.primary, colors.background, 4.5);
  const secondaryText = legibleOn(colors.secondary, colors.background, 4.5);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground ? (
        <AbsoluteFill
          style={{
            backgroundColor: colors.background,
            backgroundImage: `linear-gradient(180deg, ${mixLab(colors.background, colors.secondary, 0.09)} 0%, ${colors.background} 58%, ${mixLab(colors.background, colors.primary, 0.04)} 100%)`,
          }}
        />
      ) : null}
      {iris < 1 ? (
        <AbsoluteFill style={{ clipPath: iris > 0 ? irisClip(center, irisRadius) : undefined }}>
          <Compare
            layout={compare}
            look={{
              text: colors.text,
              muted: colors.muted,
              accentFrom: primaryText,
              accentTo: secondaryText,
              teamLabel: primaryText,
              glowColor: fullFill,
              glow: props.battery.glow * (progress(teamLevel, start + 0.1, 1) + 0.6 * flare),
              cable: colors.cable,
              plugTop,
              pulse: progress(frame, fullAt, fullAt + 26, Easing.out(Easing.quad)),
              phones,
            }}
          />
        </AbsoluteFill>
      ) : null}
      <Glow
        color={colors.primary}
        strength={travel * (0.3 + 0.08 * breathing)}
        spot={{ x: 540, y: BADGE_END_Y, radius: 620, stretch: 1, peak: 0.2 }}
      />
      {frame >= line.name[0] ? (
        <AbsoluteFill>
          <EndCard
            layout={end}
            look={{
              frame,
              line,
              website: props.website,
              text: colors.text,
              muted: colors.muted,
              accent: primaryText,
              pillFill: mixLab(colors.background, colors.secondary, 0.12),
              buttonInk: inkOn(primaryText, colors.background, colors.text),
            }}
          />
        </AbsoluteFill>
      ) : null}
      <Badge
        box={box}
        look={{
          logo: props.logo,
          primary: colors.primary,
          secondary: colors.secondary,
          plate: colors.plate,
          showPlate: props.badge.showPlate,
          travel,
          halo: 0.14 + 0.06 * travel + 0.04 * breathing,
          breathe: 1 + BREATHE * settledBreath * breathing,
          spark: {
            distance: (frame - line.travel[1]) * SPARK_SPEED,
            opacity: progress(frame, line.travel[1] - 4, line.travel[1] + 10),
          },
          opacity: 1,
        }}
      />
    </AbsoluteFill>
  );
};
