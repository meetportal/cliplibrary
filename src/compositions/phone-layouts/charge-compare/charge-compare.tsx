import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChargeCompareProps } from '@/schemas';
import { Badge, badgeBox } from './badge';
import { apartFrom, inkOn, legibleOn, mixHue, mixLab, softInkOn } from './color';
import { Compare, compareLayout } from './compare';
import { EndCard, endCardLayout } from './end-card';
import { useMeasure } from './fonts';
import { Glow } from './glow';
import { type PhoneLook, PLUG_REST, PLUG_START } from './phone';
import {
  buildTimeline,
  chargeEase,
  INTRO_FRAMES,
  pixelTween,
  progress,
  seatEase,
} from './timeline';
import { useLogoAspect } from './use-logo-aspect';

const FLICKER_PERIOD = 26;
const HALO_PERIOD = 48;
const SPARK_LAP = 64;
const LEAVE_DROP = 64;

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

  const introFrames = Math.max(INTRO_FRAMES, props.timing.plugAt + 6);
  const intro = 0.55 + 0.45 * progress(frame, 0, introFrames, Easing.inOut(Easing.sin));
  const outro =
    1 -
    0.45 * progress(frame, durationInFrames - 11, durationInFrames - 1, Easing.inOut(Easing.sin));
  const leave = progress(frame, line.leave[0], line.leave[1], Easing.inOut(Easing.sin));
  const drop = pixelTween(
    frame,
    0,
    LEAVE_DROP,
    line.leave[0],
    line.leave[1] - line.leave[0],
    Easing.in(Easing.cubic),
  );
  const wake = progress(frame, line.wake[0], line.wake[1], Easing.out(Easing.cubic));
  const plugTop = pixelTween(
    frame,
    PLUG_START,
    PLUG_REST,
    line.plug[0],
    line.plug[1] - line.plug[0],
    seatEase,
  );
  const flash = Math.sin(Math.PI * progress(frame, line.wake[0], line.wake[0] + 16));

  const screen = mixLab(colors.phone, colors.secondary, 0.05 * wake + 0.1 * flash);
  const fullFill = legibleOn(colors.primary, screen, 3);
  const lowFill = legibleOn(apartFrom(colors.low, colors.primary), screen, 3);
  const start = battery.startLevel / 100;
  const teamCount = pixelTween(
    frame,
    battery.startLevel,
    100,
    line.charge[0],
    line.charge[1] - line.charge[0],
    chargeEase,
  );
  const teamLevel = teamCount / 100;
  const fullAt = useMemo(() => {
    for (let step = line.charge[0]; step < line.charge[1]; step++) {
      const count = pixelTween(
        step,
        battery.startLevel,
        100,
        line.charge[0],
        line.charge[1] - line.charge[0],
        chargeEase,
      );
      if (count >= 100) {
        return step;
      }
    }
    return line.charge[1];
  }, [line, battery.startLevel]);
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
    progress(frame, fullAt, fullAt + 3) *
    (1 - progress(frame, fullAt + 3, fullAt + 34, Easing.out(Easing.quad)));
  const pop = Math.sin(Math.PI * progress(frame, fullAt, fullAt + 14));
  const boltOver = (fill: string, level: number) =>
    mixLab(colors.text, softInkOn(fill, colors.phone, colors.text), progress(level, 0.42, 0.6));

  const phoneBase = {
    shell: colors.phone,
    edge: colors.phoneEdge,
    screen,
    outline: colors.text,
    wake,
    percentSize: 72,
  };
  const phones: readonly [PhoneLook, PhoneLook] = [
    {
      ...phoneBase,
      center: 270,
      fill: lowFill,
      level: soloLevel,
      bolt: soloBolt,
      boltScale: 1,
      boltInk: boltOver(lowFill, soloLevel),
      percent: battery.showPercent ? battery.soloLevel : null,
      percentColor: lowFill,
    },
    {
      ...phoneBase,
      center: 810,
      fill: teamFill,
      level: teamLevel,
      bolt: teamBolt,
      boltScale: 1 + 0.14 * pop,
      boltInk: boltOver(teamFill, teamLevel),
      percent: battery.showPercent ? teamCount : null,
      percentColor: teamFill,
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
      {leave < 1 ? (
        <AbsoluteFill style={{ opacity: intro * (1 - leave), transform: `translateY(${drop}px)` }}>
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
        strength={outro * travel * (0.75 + 0.35 * breathing)}
        spot={{ x: 540, y: 520, radius: 620, stretch: 1, peak: 0.2 }}
      />
      {frame >= line.name[0] ? (
        <AbsoluteFill style={{ opacity: outro }}>
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
          halo: 0.18 + 0.16 * travel + 0.12 * breathing,
          spark: {
            at: (frame - line.travel[1]) / SPARK_LAP,
            opacity: progress(frame, line.travel[1] - 4, line.travel[1] + 10),
          },
          opacity: 1,
        }}
      />
    </AbsoluteFill>
  );
};
