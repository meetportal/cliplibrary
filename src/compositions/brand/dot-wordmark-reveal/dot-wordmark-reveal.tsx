import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DotWordmarkRevealProps } from '@/schemas';
import { frameState } from './frame-state';
import { Letters } from './letters';
import { boxStyle, Disc, DriftBand, FillLayer, Irises, Plate, Words } from './parts';
import { useStage } from './use-stage';

export const DotWordmarkReveal = (props: DotWordmarkRevealProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const { stage, writer, nameFace, lineFace, logoBox } = useStage(
    props,
    width,
    height,
    durationInFrames,
  );
  const now = frameState(stage, writer, frame, props.dot.pulse, logoBox !== null);
  const { lockup, palette } = stage;
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <AbsoluteFill style={{ backgroundColor: palette.background }} />
      ) : null}
      <Irises stage={stage} frame={frame} />
      {props.showBackground ? <DriftBand stage={stage} shift={now.glowShift} /> : null}
      <Words stage={stage} frame={frame} face={lineFace} fade={now.lineFade} />
      <Letters lockup={lockup} face={nameFace} color={palette.text} states={now.letters} />
      {now.ring === null ? null : (
        <div
          style={{
            ...boxStyle(now.ring.box),
            boxSizing: 'border-box',
            border: `${now.ring.width}px solid ${now.ring.color}`,
          }}
        />
      )}
      <FillLayer
        stage={stage}
        fill={now.fill}
        face={nameFace}
        letters={now.letters}
        glowShift={now.glowShift}
        glowStrength={now.glow}
      />
      {now.plate === null ? null : (
        <Plate
          box={now.plate.box}
          color={now.plate.color}
          scale={now.plate.scale}
          opacity={now.plate.opacity}
          logoIn={now.plate.logo}
          logo={props.logo}
          logoBox={logoBox}
          size={lockup.logo}
        />
      )}
      <Disc
        x={now.accent.x}
        y={now.accent.y}
        size={lockup.accent.size + Math.round(lockup.accent.size * 0.3)}
        scale={now.accent.scale}
        color={palette.background}
      />
      <Disc
        x={now.accent.x}
        y={now.accent.y}
        size={lockup.accent.size}
        scale={now.accent.scale}
        color={palette.accent}
      />
      {now.caret === null ? null : (
        <Disc
          x={now.caret.x}
          y={now.caret.y}
          size={stage.caret}
          scale={now.caret.scale}
          color={palette.fillInk}
        />
      )}
    </AbsoluteFill>
  );
};
