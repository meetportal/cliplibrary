import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChevronMarkAssembleProps } from '@/schemas';
import { resolveCustom } from '../../kit/resolve-custom';
import { fieldAt, inkOn, piecesOn, turnedPieces } from './field';
import { buildCenter, endLayout } from './layout';
import { Lockup, useImageAspect } from './lockup';
import { type Blur, MarkLayer, type PieceStyles } from './mark-layer';
import { BEATS, lockPulse, lockupProgress, markPoses, type Pose } from './poses';

const filled = (value: string): string | null =>
  value.trim() === '' || value.includes('{{') ? null : resolveCustom(value);

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const streak = (now: Pose, before: Pose): Blur | null => {
  const amount = (delta: number) => Math.min(10, Math.max(0, Math.abs(delta) * 0.18 - 0.6));
  const blur = { x: amount(now.x - before.x), y: amount(now.y - before.y) };
  return blur.x + blur.y > 0.05 ? blur : null;
};

export const ChevronMarkAssemble = (props: ChevronMarkAssembleProps) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame() * props.timing.speed;
  const { colors, mark, ending } = props;
  const logoSrc = filled(props.brand.logo);
  const aspect = useImageAspect(logoSrc);
  const layout = endLayout(props, aspect, width, height);
  const center = buildCenter(width, height);
  const top = -(center.y + 0.15 * mark.cell);
  const chevronAt = BEATS.flipToLight + (props.flips.style === 'diamond' ? 2 : 1);
  const poses = markPoses(frame, fps, mark, top, chevronAt);
  const before = markPoses(frame - props.timing.speed, fps, mark, top, chevronAt);
  const glide = lockupProgress(frame);
  const markX = lerp(center.x, layout.emblem.x, glide);
  const markY = lerp(center.y, layout.emblem.y, glide);
  const markScale = lerp(1, layout.emblem.scale, glide) * lockPulse(frame);
  const ink = (color: string) => inkOn(color, colors);
  const firstAtFlip = markPoses(BEATS.flipToDark, fps, mark, top, chevronAt).first;
  const field = fieldAt(
    frame,
    props,
    {
      first: { x: center.x + firstAtFlip.x, y: center.y + firstAtFlip.y },
      corner: { x: center.x, y: center.y + 1.5 * Math.SQRT2 * mark.cell },
      center,
    },
    { width, height },
  );
  const endInk = ink(colors.endField);
  const middle = BEATS.endStart + ending.frames / 2;
  const { overlay } = field;
  const onTop: PieceStyles | null =
    ending.style === 'fade' && frame >= BEATS.endStart
      ? turnedPieces(frame, { chevron: middle - 8, first: middle - 5, second: middle - 2 }, colors)
      : overlay !== null && overlay.iris === null
        ? piecesOn(overlay.opacity < 0.5 ? field.base : overlay.color, colors)
        : null;
  return (
    <AbsoluteFill style={{ backgroundColor: field.base }}>
      <MarkLayer
        width={width}
        height={height}
        field={field}
        markTransform={`translate(${markX} ${markY}) scale(${markScale})`}
        poses={poses}
        styleOn={(color) => piecesOn(color, colors)}
        onTop={onTop}
        blurs={{
          first: streak(poses.first, before.first),
          second: poses.secondVisible ? streak(poses.second, before.second) : null,
        }}
      />
      <Lockup
        frame={frame}
        props={props}
        layout={layout}
        logoSrc={logoSrc}
        ink={endInk}
        seed={poses.piece * layout.emblem.scale}
      />
    </AbsoluteFill>
  );
};
