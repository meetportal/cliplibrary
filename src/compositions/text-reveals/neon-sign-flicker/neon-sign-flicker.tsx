import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { NeonSignFlickerProps } from '@/schemas';
import { mix, tubeColor } from './color';
import { LABEL_FACES, NEON_FACES, NEON_STROKE, useSignFontsReady } from './fonts';
import { WallGlow } from './glow';
import { buildLayout } from './layout';
import { LogoPlate, TextRows } from './lockup';
import { canvasMeasurer } from './measure';
import { NeonWord } from './neon-word';
import { PendantLamp } from './pendant-lamp';
import { buildTimeline, signState } from './timeline';
import { useLogo } from './use-logo';

const SWAY_PERIOD = 150;

export const NeonSignFlicker = (props: NeonSignFlickerProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ready = useSignFontsReady(props.neon.font, props.type.font);
  const logo = useLogo(props.logo);
  const layout = useMemo(
    () => buildLayout(props, canvasMeasurer(ready), logo?.aspect ?? null, { width, height }),
    [props, ready, logo, width, height],
  );
  const timeline = useMemo(
    () => buildTimeline(layout.glyphs.length, props.flicker, props.opening),
    [layout.glyphs.length, props.flicker, props.opening],
  );
  const state = signState(timeline, frame, layout.target, props.neon.hum);
  const tube = tubeColor(props.colors.primary);
  const ink = {
    tube,
    core: mix(tube, '#ffffff', 0.8),
    glass: props.colors.glass,
    glow: props.neon.glow,
    stroke: NEON_STROKE[props.neon.font],
  };
  const litShare =
    state.letters.reduce((sum, level) => sum + level, 0) / Math.max(1, state.letters.length);
  const labels = LABEL_FACES[props.type.font];
  const swing = props.lamp.sway * Math.sin((2 * Math.PI * frame) / SWAY_PERIOD);
  return (
    <AbsoluteFill
      style={{ backgroundColor: props.showBackground ? props.colors.background : 'transparent' }}
    >
      <WallGlow
        center={{
          x: layout.sign.x + layout.sign.width / 2,
          y: layout.sign.y + layout.sign.height / 2,
        }}
        radius={{
          x: layout.sign.width * 0.62 + 300,
          y: layout.sign.height * 1.2 + 280,
        }}
        color={tube}
        strength={props.neon.wallGlow * state.gain * (0.35 + 0.65 * litShare)}
        frame={{ width, height }}
      />
      {props.lamp.show ? (
        <PendantLamp
          geometry={layout.lamp}
          angle={swing}
          shell={mix(props.colors.glass, '#ffffff', 0.1)}
          light={props.colors.lamp}
          level={state.lamp}
          beam={props.lamp.beam}
        />
      ) : null}
      <NeonWord
        glyphs={layout.glyphs}
        levels={state.letters}
        gain={state.gain}
        size={layout.size}
        face={NEON_FACES[props.neon.font]}
        ink={ink}
      />
      <TextRows
        rows={layout.tagline}
        face={labels.body}
        tracking={props.type.tracking}
        color={props.colors.text}
        opacity={1}
        shadow
      />
      <LogoPlate
        plate={layout.plate}
        logoBox={layout.logoBox}
        logo={logo}
        showPlate={props.lockup.plate}
        colors={{ ...props.colors, primary: tube }}
      />
      <TextRows
        rows={layout.name}
        face={labels.name}
        tracking={-0.01}
        color={props.colors.text}
        opacity={1}
        shadow={false}
      />
      <TextRows
        rows={layout.website}
        face={labels.body}
        tracking={0.18}
        color={props.colors.text}
        opacity={0.72}
        shadow={false}
      />
    </AbsoluteFill>
  );
};
