import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BatteryChargeSuccessProps } from '@/schemas';
import { Backdrop } from './backdrop';
import { Battery } from './battery';
import { CableLabels, CableWires, type DrawnCable } from './cables';
import { inkOn, legibleOn, lowCharge, mix, mixLab } from './color';
import { LABEL_FACE, useMeasure } from './fonts';
import { batteryBox, cableState } from './geometry';
import { lockupLayout, wordmarkLayout } from './layout';
import { Lockup } from './lockup';
import { Percent } from './percent';
import { buildTimeline, CABLE_KEYS, chargeLevel, progress, toneAmount } from './timeline';
import { useLogoAspect } from './use-logo-aspect';
import { Wordmark } from './wordmark';

const SEEDS = [0.4, 2.2, 3.7, 5.1, 1.3] as const;
const LABEL_MARGIN = 28;
const RING_FRAMES = 34;
const RING_GAP = 11;

export const BatteryChargeSuccess = (props: BatteryChargeSuccessProps) => {
  const frame = useCurrentFrame();
  const measure = useMeasure();
  const { durationInFrames } = useVideoConfig();
  const line = useMemo(
    () => buildTimeline(props.timing, durationInFrames),
    [props.timing, durationInFrames],
  );
  const box = batteryBox(props.battery);
  const aspect = useLogoAspect(props.logo);
  const { colors } = props;
  const tone = toneAmount(frame, line);
  const level = chargeLevel(frame, line);
  const charged = legibleOn(colors.charged, colors.background, 4.5);
  const empty = legibleOn(colors.empty, colors.background, 3);
  const toneColor = mix(empty, charged, tone);
  const liquid = mixLab(
    lowCharge(colors.charged, props.battery.lowTint),
    colors.charged,
    progress(level, 0.15, 0.85),
  );
  const ink = inkOn(liquid, mix(colors.body, colors.charged, 0.18), colors.text);
  const labelFit = Math.min(
    ...CABLE_KEYS.map((key) => {
      const label = props.cables[key].label.trim();
      const width = measure(label, LABEL_FACE) + 0.56;
      return label === '' ? props.type.labelSize : (box.x - LABEL_MARGIN - 14) / width;
    }),
  );
  const labelSize = Math.max(18, Math.min(props.type.labelSize, Math.floor(labelFit)));
  const cables: DrawnCable[] = CABLE_KEYS.map((key, index) => ({
    key,
    state: cableState(key, frame, line, box, props.motion.sway),
    label: props.cables[key].label,
    color: props.cables[key].color,
    seed: SEEDS[index] ?? 0,
  }));
  const look = {
    frame,
    tone,
    empty: colors.empty,
    wire: colors.wire,
    shell: colors.shell,
    text: colors.text,
    sway: props.motion.sway,
    pulses: props.motion.pulses,
    pulseStart: line.landed,
    labelSize,
  };
  const rings = props.motion.rings
    ? [0, 1].map((index) =>
        progress(frame, line.full + index * RING_GAP, line.full + index * RING_GAP + RING_FRAMES),
      )
    : [];
  const wordmark = wordmarkLayout(props, box, measure);
  const lockup = lockupLayout(props, box, aspect, measure);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground ? (
        <Backdrop base={colors.background} beam={mix(colors.beam, toneColor, 0.12)} />
      ) : null}
      <Battery
        look={{
          box,
          roundness: props.battery.roundness,
          level,
          tone: toneColor,
          liquid,
          ink,
          shell: colors.shell,
          body: colors.body,
          glow: props.battery.glow,
          wave: props.motion.wave,
          bubbles: props.motion.bubbles,
          rings,
          bolt: tone,
          frame,
        }}
      />
      <Percent
        box={box}
        level={level}
        size={props.type.percentSize}
        frame={frame}
        wave={props.motion.wave}
        light={colors.text}
        dark={ink}
      />
      <CableWires cables={cables} look={look} />
      <CableLabels cables={cables} look={look} />
      <Wordmark layout={wordmark} color={toneColor} tracking={props.type.nameTracking} />
      <Lockup
        layout={lockup}
        look={{
          frame,
          starts: line.lockup,
          frames: line.lockupFrames,
          logo: props.logo,
          tagline: props.tagline,
          website: props.website,
          plate: colors.plate,
          showPlate: props.lockup.showPlate,
          text: colors.text,
          accent: charged,
        }}
      />
    </AbsoluteFill>
  );
};
