import type { BatteryChargeSuccessProps } from '@/schemas';
import { BODY_FACE, LABEL_FACE, type Measure, NAME_FACE, wrapToFit } from './fonts';
import { type Box, HEIGHT } from './geometry';
import type { LockupLayout } from './lockup';
import { usableImage } from './use-logo-aspect';

export type WordmarkLayout = { lines: string[]; size: number; top: number; lineHeight: number };

const NAME_WIDTH = 940;
const NAME_LINE = 1.14;
const NAME_ABOVE = 140;
const TAGLINE_WIDTH = 920;
const WEBSITE_WIDTH = 900;
const LOCKUP_BELOW = 64;
const LOCKUP_BOTTOM = 70;
const LOGO_GAP = 56;
const WEBSITE_GAP = 24;

const displayName = (name: string, uppercase: boolean) =>
  uppercase ? name.trim().toLocaleUpperCase() : name.trim();

export const wordmarkLayout = (
  props: BatteryChargeSuccessProps,
  box: Box,
  measure: Measure,
): WordmarkLayout => {
  const text = displayName(props.companyName, props.type.uppercase);
  const tracking = props.type.nameTracking;
  const unit = (value: string) => measure(value, NAME_FACE, tracking);
  const single = Math.min(props.type.nameSize, NAME_WIDTH / Math.max(unit(text), 0.01));
  const wrapped =
    single >= props.type.nameSize * 0.72 || !text.includes(' ')
      ? { lines: [text], size: single }
      : wrapToFit(
          text,
          { width: NAME_WIDTH, size: props.type.nameSize * 0.8, minSize: 30, maxLines: 2 },
          unit,
        );
  const size = Math.floor(wrapped.size);
  const lineHeight = Math.round(size * NAME_LINE);
  const center = box.y - NAME_ABOVE;
  return {
    lines: wrapped.lines,
    size,
    lineHeight,
    top: Math.round(center - (lineHeight * wrapped.lines.length) / 2),
  };
};

export const lockupLayout = (
  props: BatteryChargeSuccessProps,
  box: Box,
  aspect: number | null,
  measure: Measure,
): LockupLayout => {
  const hasLogo = usableImage(props.logo);
  const ratio = aspect ?? 1;
  const logoHeight = Math.round(Math.min(props.lockup.logoHeight, props.lockup.logoWidth / ratio));
  const logoWidth = Math.round(logoHeight * ratio);
  const padding = props.lockup.showPlate ? Math.max(18, Math.round(logoHeight * 0.16)) : 0;
  const tagline = props.tagline.trim();
  const wrapped =
    tagline === ''
      ? null
      : wrapToFit(
          tagline,
          { width: TAGLINE_WIDTH, size: props.type.taglineSize, minSize: 28, maxLines: 2 },
          (value) => measure(value, LABEL_FACE),
        );
  const taglineLine = wrapped === null ? 0 : Math.round(wrapped.size * 1.22);
  const website = props.website.trim();
  const websiteSize =
    website === ''
      ? 0
      : Math.floor(
          Math.min(
            props.type.websiteSize,
            WEBSITE_WIDTH / Math.max(measure(website, BODY_FACE, 0.04), 0.01),
          ),
        );
  const plate = hasLogo ? logoHeight + padding * 2 : 0;
  const taglineHeight = wrapped === null ? 0 : taglineLine * wrapped.lines.length;
  const websiteHeight = Math.round(websiteSize * 1.2);
  const logoGap = plate > 0 && taglineHeight + websiteHeight > 0 ? LOGO_GAP : 0;
  const websiteGap = taglineHeight > 0 && websiteHeight > 0 ? WEBSITE_GAP : 0;
  const total = plate + logoGap + taglineHeight + websiteGap + websiteHeight;
  const regionTop = box.y + box.height + LOCKUP_BELOW;
  const regionBottom = HEIGHT - LOCKUP_BOTTOM;
  let cursor = Math.round(regionTop + Math.max(0, (regionBottom - regionTop - total) / 2));
  const logo = hasLogo ? { width: logoWidth, height: logoHeight, top: cursor, padding } : null;
  cursor += plate + logoGap;
  const taglineBlock = wrapped === null ? null : { wrapped, top: cursor, lineHeight: taglineLine };
  cursor += taglineHeight + websiteGap;
  return {
    logo,
    tagline: taglineBlock,
    website: website === '' ? null : { size: websiteSize, top: cursor },
  };
};
