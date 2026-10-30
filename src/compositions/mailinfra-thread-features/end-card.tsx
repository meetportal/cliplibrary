import type { ThreadColors, ThreadEndCard, ThreadWeb } from '@/schemas';
import { bodyFont, displayFont } from '../promo/fonts';
import { settle, tween } from '../promo/timing';
import { FadeIn, Headline } from '../promo/typography';
import { EnvelopeLogo } from './envelopes';
import { taglineFont } from './fonts';
import { OrbWeb } from './orb-web';
import { Spider } from './spider';

const Arrow = ({ size, colors }: { size: number; colors: ThreadColors }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="-30 -30 60 60"
    style={{ display: 'block' }}
  >
    <circle r={30} fill={colors.arrow} />
    <path
      d="M-11 0 H11 M2 -9 L11 0 L2 9"
      fill="none"
      stroke={colors.arrowIcon}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EndCard = ({
  card,
  web,
  colors,
  frame,
  land,
  speed,
  width,
}: {
  card: ThreadEndCard;
  web: ThreadWeb;
  colors: ThreadColors;
  frame: number;
  land: number;
  speed: number;
  width: number;
}) => {
  const at = (step: number) => (land + 4 + step * card.stagger) / speed;
  const pill = card.buttonSize * 2.3;
  return (
    <>
      <OrbWeb
        x={web.threadX}
        y={card.webY}
        radius={card.webSize}
        frame={frame}
        start={land - 6}
        frames={card.webFrames}
        web={web}
      />
      {card.showSpider ? (
        <Spider
          x={web.threadX + Math.sin(frame / 23) * 10 * tween(frame, [land + 30, land + 60], [0, 1])}
          y={tween(frame, [land, land + 40], [-160, card.webY - card.webSize * 0.12], settle)}
          heading={180 + Math.sin(frame / 17) * 9}
          phase={frame / 4}
          tuck={0.4}
          web={web}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width,
          top: card.contentY,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <FadeIn start={at(0)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: card.brandSize * 0.26 }}>
            {card.showLogo ? <EnvelopeLogo size={card.brandSize * 1.22} colors={colors} /> : null}
            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: card.brandSize,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: colors.text,
              }}
            >
              {card.brandName}
            </div>
          </div>
        </FadeIn>
        <div style={{ marginTop: card.brandSize * 0.62 }}>
          <Headline
            text={card.statement}
            size={card.statementSize}
            color={colors.text}
            accent={colors.accent}
            highlight={card.highlight}
            align="center"
            weight={600}
            tracking={-0.03}
            start={at(1)}
          />
        </div>
        <FadeIn start={at(2)} style={{ marginTop: card.statementSize * 0.55 }}>
          <div
            style={{
              fontFamily: taglineFont,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: card.taglineSize,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: colors.text,
            }}
          >
            {card.tagline}
          </div>
        </FadeIn>
        {card.showButton ? (
          <FadeIn start={at(3)} style={{ marginTop: card.taglineSize * 0.62 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: card.buttonSize * 0.5,
                height: pill,
                padding: `0 ${card.buttonSize * 0.22}px 0 ${card.buttonSize * 0.9}px`,
                borderRadius: pill,
                background: `linear-gradient(90deg, ${colors.button} 0%, ${colors.buttonEnd} 100%)`,
                fontFamily: bodyFont,
                fontWeight: 600,
                fontSize: card.buttonSize,
                letterSpacing: '-0.01em',
                color: colors.buttonText,
              }}
            >
              {card.buttonLabel}
              <Arrow size={pill - card.buttonSize * 0.44} colors={colors} />
            </div>
          </FadeIn>
        ) : null}
      </div>
    </>
  );
};
