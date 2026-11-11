import { AbsoluteFill, Easing, Img } from 'remotion';
import type { AnniversaryKineticProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { Badge } from './badge';
import { mix } from './color';
import { BODY_FACE, MONO_FACE, NAME_FACE } from './fonts';
import { Letters } from './line';
import type { Measure } from './measure';
import { pixelTween } from './pixel-tween';
import type { LogoState } from './use-logo';

const out = Easing.out(Easing.cubic);
const SHARE = 0.86;
const COMPACT_LOGO = 1.6;
const COMPACT_BOOST = 1.3;
const GAPS = { logo: 64, badge: 76, name: 22, rule: 26 };

export type EndInks = { ink: string; accent: string; name: string; muted: string; surface: string };

const logoBox = (logo: LogoState, height: number, width: number) => {
  if (logo === null) {
    return null;
  }
  const maxWidth = width * 0.6;
  const tall = logo.aspect < COMPACT_LOGO ? height * COMPACT_BOOST : height;
  const w = Math.min(tall * logo.aspect, maxWidth);
  return { width: Math.round(w), height: Math.round(w / logo.aspect) };
};

export const EndCard = ({
  props,
  local,
  width,
  height,
  measure,
  logo,
  inks,
}: {
  props: AnniversaryKineticProps;
  local: number;
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
  const monoSize = Math.round(brand.taglineSize * 0.6);
  const founded = props.founded.toUpperCase();
  const foundedWidth = measure(founded, MONO_FACE, 0.3) * monoSize;
  const taglineSize = Math.min(
    brand.taglineSize,
    maxWidth / Math.max(0.01, measure(props.tagline, BODY_FACE)),
  );
  const nameBox = Math.round(nameSize * 1.2);
  const ruleBox = Math.round(monoSize * 1.6);
  const tagBox = Math.round(taglineSize * 1.4);
  const parts = [
    box === null ? 0 : box.height + GAPS.logo,
    badge.size + GAPS.badge,
    name.trim() === '' ? 0 : nameBox + GAPS.name,
    founded.trim() === '' ? 0 : ruleBox + GAPS.rule,
    props.tagline.trim() === '' ? 0 : tagBox,
  ];
  const total = parts.reduce((sum, part) => sum + part, 0);
  let cursor = Math.round((height - total) / 2);
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
  const ruleLength = Math.max(0, (maxWidth - foundedWidth) / 2 - monoSize * 1.2);
  const ruleGrow = ramp(local, build * 0.6, build * 1.1, out);
  const letters = [...name];
  const middle = (letters.length - 1) / 2;
  const spread = nameSize * 0.12;
  const nameFade = ramp(local, build * 0.35, build * 0.75);
  return (
    <AbsoluteFill>
      {box !== null && logo !== null ? (
        <div
          style={{
            position: 'absolute',
            left: Math.round((width - box.width) / 2),
            top: logoTop + pixelTween(local, [0, build * 0.6], [-30, 0], out),
            width: box.width,
            height: box.height,
            opacity: 0.3 + 0.7 * ramp(local, 0, build * 0.3),
          }}
        >
          {brand.plate ? (
            <div
              style={{
                position: 'absolute',
                inset: -Math.round(box.height * 0.22),
                borderRadius: Math.round(box.height * 0.3),
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
              objectFit: 'contain',
            }}
          />
        </div>
      ) : null}
      <div
        style={{ position: 'absolute', left: Math.round((width - badge.size) / 2), top: badgeTop }}
      >
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
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: nameTop,
          height: nameBox,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: NAME_FACE.family,
          fontWeight: NAME_FACE.weight,
          fontSize: nameSize,
          lineHeight: `${nameBox}px`,
          letterSpacing: `${tracking}em`,
          paddingLeft: `${tracking}em`,
          whiteSpace: 'pre',
          color: inks.name,
          opacity: nameFade,
        }}
      >
        <Letters
          text={name}
          styleOf={(index) => ({
            color: index === 0 ? inks.accent : inks.name,
            x: pixelTween(local, [build * 0.35, build * 1.1], [(index - middle) * spread, 0], out),
          })}
        />
      </div>
      {founded.trim() === '' ? null : (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: ruleTop,
            height: ruleBox,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: Math.round(monoSize * 1.2),
          }}
        >
          <div
            style={{
              width: ruleLength,
              height: 2,
              backgroundColor: inks.accent,
              transform: `scaleX(${ruleGrow.toFixed(3)})`,
              transformOrigin: 'right center',
            }}
          />
          <div
            style={{
              fontFamily: MONO_FACE.family,
              fontWeight: MONO_FACE.weight,
              fontSize: monoSize,
              letterSpacing: '0.3em',
              paddingLeft: '0.3em',
              whiteSpace: 'pre',
              color: inks.name,
              opacity: ramp(local, build * 0.6, build * 0.95),
            }}
          >
            {founded}
          </div>
          <div
            style={{
              width: ruleLength,
              height: 2,
              backgroundColor: inks.accent,
              transform: `scaleX(${ruleGrow.toFixed(3)})`,
              transformOrigin: 'left center',
            }}
          />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: tagTop + pixelTween(local, [build * 0.75, build * 1.25], [24, 0], out),
          height: tagBox,
          textAlign: 'center',
          fontFamily: BODY_FACE.family,
          fontWeight: BODY_FACE.weight,
          fontSize: taglineSize,
          lineHeight: `${tagBox}px`,
          whiteSpace: 'pre',
          color: inks.muted,
          opacity: ramp(local, build * 0.75, build * 1.15),
        }}
      >
        {props.tagline}
      </div>
    </AbsoluteFill>
  );
};
