import { AbsoluteFill, Easing, Img } from 'remotion';
import type { AnniversaryKineticProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { Badge } from './badge';
import { mix } from './color';
import { BODY_FACE, MONO_FACE, NAME_FACE } from './fonts';
import { Line } from './line';
import type { Measure } from './measure';
import { appear, fade, glide } from './text-fx';
import type { LogoState } from './use-logo';

const SHARE = 0.86;
const COMPACT_LOGO = 1.6;
const COMPACT_BOOST = 1.3;
const GAPS = { logo: 64, badge: 76, name: 22, rule: 26 };
const BREATH = 0.02;
const FOUNDED_TRACKING = 0.3;

export type EndInks = { ink: string; accent: string; name: string; muted: string; surface: string };

const logoBox = (logo: LogoState, height: number, width: number) => {
  if (logo === null) {
    return null;
  }
  const maxWidth = width * 0.6;
  const tall = logo.aspect < COMPACT_LOGO ? height * COMPACT_BOOST : height;
  const w = Math.min(tall * logo.aspect, maxWidth);
  return { width: w, height: w / logo.aspect };
};

export const EndCard = ({
  props,
  local,
  span,
  width,
  height,
  measure,
  logo,
  inks,
}: {
  props: AnniversaryKineticProps;
  local: number;
  span: number;
  width: number;
  height: number;
  measure: Measure;
  logo: LogoState;
  inks: EndInks;
}) => {
  const build = props.timing.endBuild;
  const { brand, badge } = props;
  const name = brand.nameCaps ? props.companyName.toUpperCase() : props.companyName;
  const box = logoBox(logo, brand.logoHeight, width);
  const maxWidth = width * SHARE;
  const tracking = brand.nameTracking;
  const nameSize = Math.min(
    brand.nameSize,
    maxWidth / Math.max(0.01, measure(name, NAME_FACE, tracking)),
  );
  const monoSize = brand.taglineSize * 0.6;
  const founded = props.founded.toUpperCase();
  const foundedWidth = measure(founded, MONO_FACE, FOUNDED_TRACKING) * monoSize;
  const taglineSize = Math.min(
    brand.taglineSize,
    maxWidth / Math.max(0.01, measure(props.tagline, BODY_FACE)),
  );
  const nameBox = nameSize * 1.2;
  const ruleBox = monoSize * 1.6;
  const tagBox = taglineSize * 1.4;
  const parts = [
    box === null ? 0 : box.height + GAPS.logo,
    badge.size + GAPS.badge,
    name.trim() === '' ? 0 : nameBox + GAPS.name,
    founded.trim() === '' ? 0 : ruleBox + GAPS.rule,
    props.tagline.trim() === '' ? 0 : tagBox,
  ];
  const total = parts.reduce((sum, part) => sum + part, 0);
  let cursor = (height - total) / 2;
  const place = (part: number) => {
    const at = cursor;
    cursor += part;
    return at;
  };
  const logoTop = place(parts[0] ?? 0);
  const badgeTop = place(parts[1] ?? 0);
  const nameTop = place(parts[2] ?? 0);
  const ruleTop = place(parts[3] ?? 0);
  const tagTop = place(parts[4] ?? 0);
  const ruleGap = monoSize * 1.2;
  const textHalf = foundedWidth / 2 + monoSize * FOUNDED_TRACKING;
  const ruleLength = Math.max(0, maxWidth / 2 - textHalf - ruleGap);
  const ruleGrow = ramp(local, build * 0.4, build * 1.05, glide);
  const middle = ([...name].length - 1) / 2;
  const spread = nameSize * 0.12;
  const together = ramp(local, 0, build * 1.05, glide);
  const breath =
    1 + BREATH * (1 - Easing.inOut(Easing.sin)(Math.min(1, local / Math.max(1, span))));
  const rule = (side: -1 | 1) =>
    ruleGrow < 0.01 ? null : (
      <div
        style={{
          position: 'absolute',
          left:
            side < 0 ? width / 2 - textHalf - ruleGap - ruleLength : width / 2 + textHalf + ruleGap,
          top: ruleTop + ruleBox / 2 - 1,
          width: ruleLength,
          height: 2,
          backgroundColor: inks.accent,
          transform: `scaleX(${ruleGrow.toFixed(4)})`,
          transformOrigin: side < 0 ? 'left center' : 'right center',
        }}
      />
    );
  return (
    <AbsoluteFill style={{ transform: `scale(${breath.toFixed(5)})` }}>
      {box !== null && logo !== null ? (
        <div
          style={{
            position: 'absolute',
            left: (width - box.width) / 2,
            top: 0,
            transform: `translateY(${(logoTop - 30 * (1 - ramp(local, 0, build * 0.6, glide))).toFixed(3)}px)`,
            width: box.width,
            height: box.height,
            opacity: appear(local + 1, build * 0.3),
          }}
        >
          {brand.plate ? (
            <div
              style={{
                position: 'absolute',
                inset: -box.height * 0.22,
                borderRadius: box.height * 0.3,
                backgroundColor: mix(inks.surface, '#ffffff', 0.55),
              }}
            />
          ) : null}
          <Img
            src={logo.src}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              maxWidth: 'none',
              maxHeight: 'none',
              objectFit: 'contain',
            }}
          />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: (width - badge.size) / 2, top: badgeTop }}>
        <Badge
          look={{
            size: badge.size,
            dots: badge.dots,
            ring: badge.ring,
            spin: badge.spin,
            years: props.years,
            line: props.badgeLine,
            ordinal: props.milestone.ordinal,
            ink: inks.ink,
            accent: inks.accent,
          }}
          local={local}
          build={build}
          measure={measure}
        />
      </div>
      <Line
        face={NAME_FACE}
        size={nameSize}
        center={nameTop + nameBox / 2}
        color={inks.name}
        text={name}
        tracking={tracking}
        style={{ opacity: ramp(local, build * 0.2, build * 0.6, fade) }}
        styleOf={(index) => ({
          color: index === 0 ? inks.accent : inks.name,
          x: (index - middle) * spread * (1 - together),
        })}
      />
      {founded.trim() === '' ? null : (
        <>
          {rule(-1)}
          <Line
            face={MONO_FACE}
            size={monoSize}
            center={ruleTop + ruleBox / 2}
            color={inks.name}
            text={founded}
            tracking={FOUNDED_TRACKING}
            style={{ opacity: ramp(local, build * 0.4, build * 0.8, fade) }}
          />
          {rule(1)}
        </>
      )}
      <Line
        face={BODY_FACE}
        size={taglineSize}
        center={tagTop + tagBox / 2 + 24 * (1 - ramp(local, build * 0.6, build * 1.15, glide))}
        color={inks.muted}
        text={props.tagline}
        style={{ opacity: ramp(local, build * 0.6, build * 1.05, fade) }}
      />
    </AbsoluteFill>
  );
};
