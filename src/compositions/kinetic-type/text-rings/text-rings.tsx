import { useId, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { TextRingsProps } from '@/schemas';
import { readableOn } from './contrast';
import { layoutPhrase, type PhraseLayout, planField, ringStates } from './field';
import { type PhraseRequest, usePhraseMetrics } from './fonts';
import { useLogoFit } from './logo';
import { MarkLogo, MarkShapes, markGeometry } from './mark';
import { Ring, type RingStyle, ringPath } from './rings';

type RingType = TextRingsProps['nameRings'];

const shown = (text: string, type: RingType) => {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  return type.caps ? trimmed.toLocaleUpperCase() : trimmed;
};

const usePhrases = (props: TextRingsProps) => {
  const { nameRings, taglineRings, rings } = props;
  const separator = rings.separator.trim();
  const requests = useMemo<PhraseRequest[]>(
    () => [
      { text: shown(props.companyName, nameRings), font: nameRings.font },
      { text: shown(props.tagline, taglineRings), font: taglineRings.font },
      { text: separator, font: nameRings.font },
      { text: separator, font: taglineRings.font },
    ],
    [props.companyName, props.tagline, nameRings, taglineRings, separator],
  );
  const [name, tagline, nameSeparator, taglineSeparator] = usePhraseMetrics(requests);
  return useMemo(() => {
    const build = (
      kind: PhraseLayout['kind'],
      metrics: typeof name,
      separatorMetrics: typeof name,
      type: RingType,
    ) =>
      metrics === undefined || separatorMetrics === undefined || metrics.text === ''
        ? null
        : layoutPhrase(
            kind,
            metrics,
            separatorMetrics,
            type.tracking,
            rings.separatorGap,
            rings.textSize,
          );
    return {
      name: build('name', name, nameSeparator, nameRings),
      tagline: build('tagline', tagline, taglineSeparator, taglineRings),
    };
  }, [name, tagline, nameSeparator, taglineSeparator, nameRings, taglineRings, rings]);
};

export const TextRings = (props: TextRingsProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pathId = `text-ring-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const logo = useLogoFit(props.logo);
  const phrases = usePhrases(props);
  const geometry = markGeometry(props.mark, logo);
  const field = useMemo(
    () => planField(props, phrases, geometry.radius + props.mark.stroke / 2),
    [props, phrases, geometry.radius],
  );
  const edge = Math.hypot(width / 2, height / 2);
  const states = field === null ? [] : ringStates(field, props, frame, edge);
  const { colors } = props;
  const accent = readableOn(colors.primary, colors.background, colors.text);
  const styleOf = (type: RingType): RingStyle => ({
    font: type.font,
    color: type.usePrimary ? accent : colors.text,
    opacity: type.opacity,
  });
  const styles = { name: styleOf(props.nameRings), tagline: styleOf(props.taglineRings) };
  return (
    <AbsoluteFill
      style={{ backgroundColor: props.showBackground ? colors.background : 'transparent' }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        textRendering="geometricPrecision"
        aria-hidden="true"
      >
        <defs>
          <path id={pathId} d={ringPath()} />
        </defs>
        {states.map((state) => (
          <Ring
            key={state.plan.index}
            state={state}
            style={styles[state.plan.phrase.kind]}
            separatorColor={accent}
            pathId={pathId}
            entrance={props.rings.entrance}
            entranceFrames={props.rings.entranceFrames}
          />
        ))}
        <MarkShapes frame={frame} props={props} geometry={geometry} stroke={accent} />
      </svg>
      <MarkLogo
        frame={frame}
        props={props}
        geometry={geometry}
        logo={logo}
        center={{ x: width / 2, y: height / 2 }}
      />
    </AbsoluteFill>
  );
};
