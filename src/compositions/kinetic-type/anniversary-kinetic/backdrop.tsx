import { AbsoluteFill, Easing } from 'remotion';
import { ramp } from '../../kit/motion';
import { alpha, mix } from './color';
import type { Scene } from './scene';
import { NoiseField, Streaks } from './textures';
import { KINDER_FLASH_SHARE } from './timeline';

const GIANT_DRIFT = 2;
const GHOST_EASE = Easing.inOut(Easing.quad);
const ARC_TURN = 30;
const BAND_FRAMES = 8;

const lastWord = (text: string) => text.trim().split(/\s+/).at(-1) ?? '';

const Giant = ({ scene, filled }: { scene: Scene; filled: boolean }) => {
  const { beat, local, length, width, height, props, palette } = scene;
  const first = beat.giant === 'first';
  const text = first ? [...beat.text.trim()].slice(0, 1).join('') : lastWord(beat.text);
  const fontSize = height * (first ? 1.05 : 0.62);
  const drift = local * GIANT_DRIFT;
  const left = width * (first ? 0.02 : -0.06) - drift;
  const fade = ramp(local, -1, 3);
  const envelope = filled
    ? ramp(local, length * 0.15, length * 0.45, GHOST_EASE) -
      ramp(local, length * 0.55, length * 0.85, GHOST_EASE)
    : fade;
  const opacity = filled ? envelope * 0.85 : envelope * props.effects.outlines;
  if (opacity <= 0.005 || text === '') {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: height / 2 - fontSize * 0.62,
        fontFamily: scene.face.family,
        fontWeight: scene.face.weight,
        fontSize,
        lineHeight: 1.2,
        whiteSpace: 'pre',
        letterSpacing: '-0.04em',
        color: filled ? mix(props.colors.plum, palette.secondary, 0.18) : 'transparent',
        WebkitTextStroke: filled ? undefined : `3px ${alpha(palette.ink, 0.7)}`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const Arcs = ({ scene }: { scene: Scene }) => {
  const { beat, local, length, width, height, palette, props } = scene;
  const number = beat.kind === 'number';
  const cx = width * (number ? 0.5 : 0.3);
  const cy = height * (number ? 0.5 : 0.8);
  const radii = number ? [0.34, 0.46, 0.6] : [0.3, 0.46, 0.62];
  const opacity =
    Math.max(0.15, props.effects.outlines) * ramp(local, -1, 4, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        {radii.map((share, index) => {
          const r = share * width;
          const around = 2 * Math.PI * r;
          const turn =
            ARC_TURN * (1 - ramp(local, index - 1, index + length * 0.8, Easing.out(Easing.quad)));
          return (
            <circle
              key={share}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={palette.ink}
              strokeOpacity={0.7}
              strokeWidth={3}
              strokeDasharray={`${around * 0.72} ${around}`}
              transform={`rotate(${-150 + index * 18 - turn} ${cx} ${cy})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Band = ({ scene, frame }: { scene: Scene; frame: number }) => {
  const { beat, local, length, width, height, props, palette } = scene;
  const startsAt = beat.kind === 'flash' ? Math.ceil(length * KINDER_FLASH_SHARE) : 0;
  if (local < startsAt) {
    return null;
  }
  const grow = ramp(local, startsAt, startsAt + BAND_FRAMES, Easing.out(Easing.quad));
  if (grow < 0.01) {
    return null;
  }
  const bandHeight = scene.size * 1.5;
  const line = 3;
  return (
    <AbsoluteFill
      style={{
        transform: `rotate(${props.effects.bandTilt}deg) scaleY(${grow.toFixed(3)})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -width * 0.3,
          width: width * 1.6,
          top: height / 2 - bandHeight / 2,
          height: bandHeight,
          overflow: 'hidden',
          backgroundColor: mix(props.colors.background, props.colors.secondary, 0.12),
          borderTop: `${line}px solid ${props.colors.highlight}`,
          borderBottom: `${line}px solid ${palette.secondary}`,
        }}
      >
        <Streaks
          color={mix(props.colors.background, props.colors.secondary, 0.55)}
          opacity={
            props.effects.streaks *
            (0.35 + 0.65 * (1 - ramp(local, startsAt, startsAt + 12, Easing.inOut(Easing.quad))))
          }
          frame={frame}
          angle={-28}
          imageHeight={height}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Backdrop = ({ scene, frame }: { scene: Scene; frame: number }) => {
  const { beat, local, props } = scene;
  const burst = 1 - ramp(local, 0, 12, Easing.inOut(Easing.quad));
  const noiseColor = mix(props.colors.background, props.colors.secondary, 0.6);
  return (
    <AbsoluteFill>
      {beat.texture === 'noise' ? (
        <NoiseField color={noiseColor} opacity={props.effects.noise * burst} frame={frame} />
      ) : null}
      {beat.texture === 'streaks' ? (
        <Streaks
          color={noiseColor}
          opacity={props.effects.streaks * (1 - ramp(local, 0, 10, Easing.inOut(Easing.quad)))}
          frame={local}
          angle={-28}
        />
      ) : null}
      {beat.giant === 'none' ? null : <Giant scene={scene} filled={false} />}
      {beat.ghost ? <Giant scene={scene} filled /> : null}
      {beat.arcs ? <Arcs scene={scene} /> : null}
      {beat.band ? <Band scene={scene} frame={local} /> : null}
    </AbsoluteFill>
  );
};
