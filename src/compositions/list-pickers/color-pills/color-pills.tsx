import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ColorPillsProps } from '@/schemas';
import { lerp } from '../../kit/motion';
import { Backdrop } from './backdrop';
import { Cursor } from './cursor';
import { PILL_FONTS, PILL_WEIGHTS } from './fonts';
import { cursorColor, glowTints, pillTones } from './palette';
import { Pill, type PillMetrics, pillReach } from './pill';
import {
  breath,
  cursorOpacity,
  cursorPosition,
  entranceFade,
  entranceProgress,
  hoverAmount,
  pixelPath,
  type Timeline,
} from './timeline';

const FRAME_MARGIN = 60;
const RISE = 0.3;
const CURSOR_RAISE = 0.12;
const CURSOR_GAP = 0.15;

export const ColorPills = (props: ColorPillsProps) => {
  const frame = useCurrentFrame();
  const { height, durationInFrames } = useVideoConfig();
  const { pills, layout, cursor, colors } = props;
  const count = pills.length;
  const pitch = Math.min(layout.pitch, (height - FRAME_MARGIN * 2) / count);
  const scale = pitch / layout.pitch;
  const metrics: PillMetrics = {
    height: props.pill.height * scale,
    padding: props.pill.padding * scale,
    fontSize: Math.round(props.type.size * scale),
    family: PILL_FONTS[props.type.font],
    weight: PILL_WEIGHTS[props.type.font],
    bullet: props.type.bullet,
  };
  const line: Timeline = { count, duration: durationInFrames, timing: props.timing };
  const tones = pillTones(props);
  const push = cursor.show ? cursor.push * scale : 0;
  const rise = pitch * RISE;
  const hoverAt = (index: number, at: number) => (cursor.show ? hoverAmount(line, index, at) : 0);
  const offsetOf = (index: number) => (pills[index]?.offset ?? 0) * scale;
  const idealX = (index: number) => (at: number) => offsetOf(index) + push * hoverAt(index, at);
  const idealY = (index: number) => (at: number) => rise * (1 - entranceProgress(line, index, at));
  const position = cursorPosition(line, frame);
  const outside = position < 0 || position > count - 1;
  const edge = (index: number) => {
    const touched = outside ? hoverAt(index, frame) : 1;
    return offsetOf(index) + push * touched - pillReach(metrics.height, cursor.grow, touched);
  };
  const clamped = Math.max(0, Math.min(count - 1, position));
  const below = Math.floor(clamped);
  const above = Math.min(count - 1, below + 1);
  const size = cursor.size * scale;
  const cursorX = lerp(edge(below), edge(above), clamped - below) - size * (1 + CURSOR_GAP);
  const cursorY = position * pitch + pitch / 2 - size / 2 - metrics.height * CURSOR_RAISE;
  const top = (height - count * pitch) / 2 + layout.y;
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          background={colors.background}
          tints={glowTints(props, tones)}
          strength={props.glow.strength}
          drift={props.glow.drift}
          phase={frame / durationInFrames}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: layout.x,
          top,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {pills.map((pill, index) => {
            const tone = tones[index];
            const fade = entranceFade(line, index, frame);
            return tone === undefined ? null : (
              <div
                key={`${index}-${pill.label}`}
                style={{ height: pitch, display: 'flex', alignItems: 'center' }}
              >
                <Pill
                  label={pill.label}
                  fill={tone.fill}
                  glow={tone.glow}
                  ink={tone.ink}
                  metrics={metrics}
                  x={pixelPath(idealX(index), frame)}
                  y={pixelPath(idealY(index), frame)}
                  opacity={fade}
                  hover={hoverAt(index, frame)}
                  grow={cursor.grow}
                  lift={cursor.lift}
                  halo={props.palette.halo * breath(line, index, frame)}
                />
              </div>
            );
          })}
          {cursor.show ? (
            <Cursor
              x={cursorX}
              y={cursorY}
              size={size}
              color={cursorColor(props, tones)}
              ring={colors.background}
              opacity={cursorOpacity(line, frame)}
            />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
