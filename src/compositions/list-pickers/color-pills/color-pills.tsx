import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ColorPillsProps } from '@/schemas';
import { lerp } from '../../kit/motion';
import { Backdrop } from './backdrop';
import { Cursor } from './cursor';
import { PILL_FONT_READY, PILL_FONTS, PILL_WEIGHTS } from './fonts';
import { cursorColor, glowTints, pillTones } from './palette';
import { Pill, type PillMetrics, pillReach } from './pill';
import {
  breath,
  cursorDrop,
  cursorPresence,
  dipProgress,
  entranceFade,
  entranceProgress,
  focusAt,
  settleProgress,
  type Timeline,
  touchOf,
} from './timeline';

const FRAME_MARGIN = 60;
const RISE = 0.16;
const CURSOR_RAISE = 0.12;
const CURSOR_GAP = 0.15;
const CURSOR_DROP = 0.15;
const CURSOR_SHRINK = 0.45;
const SETTLE_SCALE = 0.035;
const SETTLE_FLOOR = 0.0001;

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
    ready: PILL_FONT_READY[props.type.font],
    bullet: props.type.bullet,
  };
  const line: Timeline = { count, duration: durationInFrames, timing: props.timing };
  const tones = pillTones(props);
  const push = cursor.show ? cursor.push * scale : 0;
  const rise = pitch * RISE;
  const focus = focusAt(line, frame);
  const hoverAt = (index: number) => (cursor.show ? touchOf(focus, index) : 0);
  const offsetOf = (index: number) => (pills[index]?.offset ?? 0) * scale;
  const edge = (index: number) =>
    offsetOf(index) + push - pillReach(metrics.height, cursor.grow, 1);
  const clamped = Math.max(0, Math.min(count - 1, focus));
  const below = Math.floor(clamped);
  const above = Math.min(count - 1, below + 1);
  const presence = cursorPresence(line, frame);
  const size = cursor.size * scale * (1 - CURSOR_SHRINK * (1 - presence));
  const cursorX =
    lerp(edge(below), edge(above), clamped - below) -
    size / 2 -
    cursor.size * scale * (0.5 + CURSOR_GAP);
  const cursorY =
    Math.max(0, focus) * pitch +
    pitch / 2 -
    size / 2 -
    metrics.height * CURSOR_RAISE -
    cursorDrop(line, frame) * pitch * CURSOR_DROP;
  const dip = dipProgress(line, frame);
  const settle = 1 - SETTLE_FLOOR - SETTLE_SCALE * settleProgress(line, frame);
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
            transform: `scale(${settle.toFixed(5)})`,
            opacity: props.showBackground ? 1 : 1 - dip,
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
                  x={offsetOf(index) + push * hoverAt(index)}
                  y={rise * (1 - entranceProgress(line, index, frame))}
                  opacity={fade}
                  hover={hoverAt(index)}
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
              opacity={presence}
            />
          ) : null}
        </div>
      </div>
      {props.showBackground && dip > 0 ? (
        <AbsoluteFill style={{ backgroundColor: colors.fade, opacity: dip }} />
      ) : null}
    </AbsoluteFill>
  );
};
