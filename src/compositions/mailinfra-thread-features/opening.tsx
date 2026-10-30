import type { ThreadColors, ThreadOpening, ThreadWeb } from '@/schemas';
import { bodyFont } from '../promo/fonts';
import { settle, tween } from '../promo/timing';
import { FadeIn, Headline } from '../promo/typography';
import { EnvelopeLogo } from './envelopes';
import { Spider } from './spider';

export const abseilY = (frame: number, opening: ThreadOpening): number =>
  tween(frame, [2, 2 + opening.dropFrames + 14], [-140, opening.spiderStop], settle) +
  Math.sin(frame / 11) * 6 * tween(frame, [opening.dropFrames, opening.dropFrames + 20], [0, 1]);

export const Opening = ({
  opening,
  web,
  colors,
  frame,
  speed,
  width,
}: {
  opening: ThreadOpening;
  web: ThreadWeb;
  colors: ThreadColors;
  frame: number;
  speed: number;
  width: number;
}) => {
  const right = opening.side === 'right';
  const gutter = 70;
  const column = right
    ? { left: web.threadX + gutter, right: gutter }
    : { left: gutter, right: width - web.threadX + gutter };
  const at = (sceneFrame: number) => sceneFrame / speed;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: opening.textY,
          ...column,
          display: 'flex',
          flexDirection: 'column',
          alignItems: right ? 'flex-end' : 'flex-start',
          gap: 26,
        }}
      >
        {opening.showLabel ? (
          <FadeIn start={at(4)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <EnvelopeLogo size={54} colors={colors} />
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 600,
                  fontSize: 36,
                  letterSpacing: '-0.01em',
                  color: colors.text,
                }}
              >
                {opening.label}
              </div>
            </div>
          </FadeIn>
        ) : null}
        <Headline
          text={opening.headline}
          size={opening.headlineSize}
          color={colors.text}
          accent={colors.accent}
          highlight={opening.highlight}
          align={right ? 'right' : 'left'}
          weight={700}
          start={at(10)}
        />
      </div>
      <Spider
        x={web.threadX}
        y={abseilY(frame, opening)}
        heading={180 + Math.sin(frame / 13) * 7}
        phase={frame / 5}
        tuck={0.6}
        web={web}
      />
    </>
  );
};
