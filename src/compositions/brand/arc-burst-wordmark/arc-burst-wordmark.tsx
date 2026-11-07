import { type ReactNode, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import { Burst, stageShown } from './burst';
import { useWordMetrics, WORDMARK_FONTS } from './fonts';
import { caseName, fitMark, layoutWord } from './layout';
import { Mark } from './mark';
import { AccentArc, Orbits } from './orbits';
import { Swirl } from './swirl';
import { buildTimeline } from './timeline';
import { useLogo } from './use-logo';
import { Wordmark } from './wordmark';

const Layer = ({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ position: 'absolute', inset: 0 }}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ArcBurstWordmark = (props: ArcBurstWordmarkProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const text = caseName(props.companyName.trim(), props.name.letterCase);
  const reference = useWordMetrics(text, props.name.font, props.name.tracking);
  const logo = useLogo(props.logo);
  const shownLogo = props.mark.show ? logo : null;
  const word = useMemo(
    () =>
      layoutWord(
        reference,
        props.name,
        { width, height },
        shownLogo === null
          ? null
          : { ...fitMark(shownLogo.aspect, props.mark), gap: props.mark.gap },
      ),
    [reference, props.name, props.mark, shownLogo, width, height],
  );
  const line = useMemo(() => buildTimeline(props, word.letters), [props, word.letters]);
  const frameSize = { width, height };
  const stage = stageShown(frame, line, props);
  const backdrop = props.showBackground
    ? stage
      ? props.colors.background
      : props.colors.field
    : 'transparent';
  return (
    <AbsoluteFill style={{ backgroundColor: backdrop }}>
      <Layer width={width} height={height}>
        {stage ? null : (
          <Swirl frame={frame} word={word} line={line} props={props} frameSize={frameSize} />
        )}
        <Burst frame={frame} word={word} line={line} props={props} />
      </Layer>
      {shownLogo === null || word.mark === null ? null : (
        <Mark frame={frame} box={word.mark} src={shownLogo.src} line={line} props={props} />
      )}
      <Wordmark
        frame={frame}
        word={word}
        line={line}
        props={props}
        face={WORDMARK_FONTS[props.name.font]}
      />
      <Layer width={width} height={height}>
        <Orbits frame={frame} word={word} line={line} props={props} />
        <AccentArc frame={frame} word={word} line={line} props={props} />
      </Layer>
    </AbsoluteFill>
  );
};
