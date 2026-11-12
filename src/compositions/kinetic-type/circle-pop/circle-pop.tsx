import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CirclePopProps } from '@/schemas';
import { mixLab } from '../../kit/lab-color';
import { blobPath, coverRadius } from './blob';
import { echoPath, echoShape } from './echo';
import { LINE_FACE, NAME_FACES, useFontsReady } from './fonts';
import { circleTextScale, LINE_HEIGHT, layoutName, SIDE } from './layout';
import { circlePopPalette, echoTint } from './palette';
import { Ripple } from './ripple';
import { TagLine } from './tag-line';
import { circlePopBeat, circlePopShape, circlePopTimes, FLOOD_LOBE_GROWTH } from './timeline';

export const CirclePop = (props: CirclePopProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const { name, circle, colors } = props;
  const face = NAME_FACES[name.font];
  const faces = useMemo(() => [face, LINE_FACE], [face]);
  const ready = useFontsReady(faces);
  const palette = circlePopPalette(colors);
  const layout = useMemo(
    () => layoutName(props.companyName, face, ready, name.size, width - 2 * SIDE),
    [props.companyName, face, ready, name.size, width],
  );
  const beat = circlePopBeat(frame, props, durationInFrames);
  const cx = width / 2;
  const cy = height * name.centerY;
  const baseRadius = circle.size / 2;
  const cover = coverRadius(cx, cy, width, height, circle.wobble * (1 + FLOOD_LOBE_GROWTH));
  const small = circleTextScale(layout, circle.size);
  const shape = circlePopShape(beat, baseRadius, cover, small);
  const radius = shape.radius;
  const textScale = shape.textScale;
  const amount = circle.wobble * beat.wobble * (1 + FLOOD_LOBE_GROWTH * shape.lobeGrowth);
  const echo = echoShape(layout, props.line.gap, props.tagline.trim() !== '', circle.wobble, width);
  const echoColor = mixLab(
    palette.surface,
    echoTint(colors.primary, palette.surface, circle.echo),
    beat.echo,
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: props.showBackground ? palette.background : undefined }}
    >
      {props.ripple.show ? (
        <Ripple
          progress={beat.ripple}
          cx={cx}
          cy={cy}
          from={baseRadius * 0.9}
          to={baseRadius * props.ripple.reach}
          strokeWidth={props.ripple.width}
          color={palette.ripple}
          width={width}
          height={height}
        />
      ) : null}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        <title>Circle</title>
        <path
          d={blobPath(cx, cy, radius, amount, circle.lobes, beat.phase)}
          fill={palette.surface}
        />
        {beat.echo > 0 && circle.echo > 0 ? (
          <path
            d={echoPath(
              cx,
              cy,
              echo,
              0.85 + 0.15 * beat.echo,
              circle.lobes,
              -beat.phase * 1.8 + 0.6,
              name.tilt,
            )}
            fill={echoColor}
          />
        ) : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          width: 0,
          height: 0,
          transform: `rotate(${name.tilt}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -layout.width / 2 - SIDE,
            top: -layout.height / 2,
            width: layout.width + 2 * SIDE,
            transform: `scale(${textScale})`,
            transformOrigin: `50% ${layout.height / 2}px`,
            fontFamily: face.family,
            fontWeight: face.weight,
            fontSize: layout.size,
            letterSpacing: `${face.tracking}em`,
            lineHeight: LINE_HEIGHT,
            color: palette.ink,
            textAlign: 'center',
            whiteSpace: 'pre',
          }}
        >
          {layout.lines.map((line, index) => (
            <div key={`${index}-${line}`}>{line}</div>
          ))}
        </div>
        <TagLine
          text={props.tagline}
          top={layout.height / 2 + props.line.gap}
          settings={props.line}
          beat={beat}
          ink={palette.ink}
          accent={palette.squiggle}
          maxWidth={width - 2 * SIDE}
          lineAt={circlePopTimes(props.timing, durationInFrames).lineAt}
        />
      </div>
    </AbsoluteFill>
  );
};
