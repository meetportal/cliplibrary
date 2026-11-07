import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DotMorphWordmarkProps } from '@/schemas';
import { useLogo } from '../dot-ring-logo-reveal/use-logo';
import { withContrast } from './contrast-floor';
import { BlobView, bestClusterAngle, dotBlob, isGradientDot } from './dots';
import { useTextMetrics, WORDMARK_FONTS } from './fonts';
import { buildWordmark, withoutFullStop } from './layout';
import { Letters, tightenShift } from './letters';
import { LogoMark } from './logo-mark';
import { buildTimeline } from './timeline';

const gradient = ({ primary, primaryEnd, background, text }: DotMorphWordmarkProps['colors']) =>
  `linear-gradient(165deg, ${withContrast(primary, background, text)} 8%, ${withContrast(primaryEnd, background, text)} 92%)`;

export const DotMorphWordmark = (props: DotMorphWordmarkProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const text = props.name.fullStop ? withoutFullStop(props.companyName) : props.companyName.trim();
  const metrics = useTextMetrics(text, props.name.font);
  const logo = useLogo(props.logo);
  const aspect = logo?.aspect ?? null;
  const wordmark = useMemo(
    () => buildWordmark(props, metrics, { width, height }, aspect),
    [props, metrics, width, height, aspect],
  );
  const line = useMemo(
    () => buildTimeline(props, wordmark, durationInFrames),
    [props, wordmark, durationInFrames],
  );
  const settleAngle = useMemo(() => bestClusterAngle(wordmark), [wordmark]);
  const u = (frame - line.start) / line.factor;
  const font = WORDMARK_FONTS[props.name.font];
  const fill = gradient(props.colors);
  const stopShift =
    wordmark.stop === null
      ? 0
      : tightenShift(frame, line, wordmark.stop.finalX - wordmark.stop.openX);
  return (
    <AbsoluteFill
      style={{ backgroundColor: props.showBackground ? props.colors.background : 'transparent' }}
    >
      {wordmark.rowX.map((_, index) => {
        const blob = dotBlob(index, u, wordmark, line, props, settleAngle);
        return blob === null ? null : (
          <BlobView
            key={`dot-${index}`}
            blob={blob.followsStop ? { ...blob, x: blob.x + stopShift } : blob}
            fill={isGradientDot(index, wordmark.dotCount) ? fill : props.colors.dots}
          />
        );
      })}
      {wordmark.logo === null || logo === null ? null : (
        <LogoMark frame={frame} line={line} box={wordmark.logo} src={logo.src} props={props} />
      )}
      <Letters
        frame={frame}
        u={u}
        wordmark={wordmark}
        line={line}
        props={props}
        family={font.family}
        weight={font.weight}
      />
    </AbsoluteFill>
  );
};
