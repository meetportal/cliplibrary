import type { GoingLiveTeaserProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import type { FaceSet } from './fonts';
import type { Palette } from './palette';
import { makeSprite, type Sprite, type TextStyle, textWidth } from './sprites';
import { FRAME, fitText, type Glyph, glyphRow, MAX_TEXT_WIDTH } from './text-fit';

const TAGLINE_TRACKING = 0.16;
const SIDE = 60;
const TAGLINE_CAP = 0.75;
const END_ROOM = MAX_TEXT_WIDTH / 1.05;
const END_NAME_SHARE = 0.72;
const END_NAME_GAP = 0.55;

type Plate = { width: number; height: number; radius: number; logo: LogoRect | null };

type LogoRect = { width: number; height: number };

export type Contact = {
  sprite: Sprite;
  x: number;
  y: number;
  size: number;
  icon: 'phone' | 'mail' | 'globe';
};

export type EndCard = {
  tagline: Glyph[];
  underline: { from: number; to: number; y: number } | null;
  taglineSize: number;
  website: Contact | null;
  contacts: Contact[];
  plate: Plate;
  name: EndName | null;
};

type EndName = { sprite: Sprite; y: number };

const plateFor = (props: GoingLiveTeaserProps, box: LogoBox | null): Plate => {
  const { logoWidth, logoHeight } = props.endCard;
  const logo =
    box === null
      ? null
      : (() => {
          const width = Math.min(logoWidth, logoHeight * box.aspect);
          return { width, height: width / box.aspect };
        })();
  const inner = logo ?? { width: logoHeight * 0.7, height: logoHeight * 0.7 };
  const pad = Math.max(30, Math.min(inner.width, inner.height) * 0.28);
  const width = inner.width + pad * 2;
  const height = inner.height + pad * 2;
  return { width, height, radius: Math.min(width, height) / 2, logo };
};

const contactsFor = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  ratio: number,
) => {
  const style: TextStyle = { face: faces.body, size: props.type.contactSize, tracking: 0 };
  const icon = props.endCard.icons ? style.size * 1.5 : 0;
  const items = [
    { text: props.phone.trim(), icon: 'phone' as const },
    { text: props.email.trim(), icon: 'mail' as const },
  ].filter((item) => item.text !== '');
  const half = (FRAME.width - SIDE * 2 - 40) / 2;
  const sized = items.map((item) => {
    const room = (items.length === 2 ? half : FRAME.width - SIDE * 2) - icon;
    const size = Math.min(
      style.size,
      (room / Math.max(1, textWidth(item.text, style))) * style.size,
    );
    const own = { ...style, size: Math.max(style.size * 0.6, size) };
    return { ...item, style: own, width: textWidth(item.text, own) };
  });
  const y = props.layout.contactsY;
  return sized.map((item, at): Contact => {
    const sprite = makeSprite(item.text, item.style, { fill: palette.text }, ratio, 'left');
    const width = item.width + icon;
    const x =
      items.length === 1 ? FRAME.centerX - width / 2 : at === 0 ? SIDE : FRAME.width - SIDE - width;
    return { sprite, x: x + icon, y, size: item.style.size, icon: item.icon };
  });
};

const taglineFor = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  ratio: number,
) => {
  const text = props.tagline.trim().toUpperCase();
  const fitted = fitText(
    text,
    { face: faces.label, size: props.type.taglineSize, tracking: TAGLINE_TRACKING },
    2,
    MAX_TEXT_WIDTH,
  );
  const style = fitted.style;
  const step = style.size * 1.5;
  const words = text.split(/\s+/).filter((word) => word !== '');
  const lastWord = props.endCard.accentLastWord ? (words.at(-1) ?? '') : '';
  const total = fitted.lines.join(' ').length;
  const accentFrom = lastWord === '' ? total + 1 : total - lastWord.length;
  let offset = 0;
  let underline: EndCard['underline'] = null;
  const glyphs = fitted.lines.flatMap((line, row) => {
    const width = textWidth(line, style);
    const left = FRAME.centerX - width / 2;
    const y = props.layout.taglineY + (row - (fitted.lines.length - 1)) * step;
    const ink = (index: number) => (index >= accentFrom ? palette.accent : palette.text);
    const placed = glyphRow(line, style, left, y, ink, ratio, offset);
    if (row === fitted.lines.length - 1 && lastWord !== '' && props.endCard.underline) {
      const start = line.length - lastWord.length;
      const prefix = line.slice(0, start);
      const from =
        left + (start === 0 ? 0 : textWidth(prefix, style) + style.tracking * style.size);
      underline = { from, to: left + width, y: y + style.size * 0.78 };
    }
    offset += line.length + 1;
    return placed;
  });
  const top = props.layout.taglineY - (fitted.lines.length - 1) * step - style.size * TAGLINE_CAP;
  return { glyphs, underline, size: style.size, top };
};

const websiteFor = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  options: { ratio: number; y: number },
): Contact | null => {
  const website = props.website.trim();
  if (website === '') {
    return null;
  }
  const base: TextStyle = { face: faces.body, size: props.type.contactSize, tracking: 0 };
  const style = fitText(website, base, 1, MAX_TEXT_WIDTH - base.size * 1.6).style;
  const icon = props.endCard.icons ? style.size * 1.5 : 0;
  const width = textWidth(website, style) + icon;
  return {
    sprite: makeSprite(website, style, { fill: palette.text }, options.ratio, 'left'),
    x: FRAME.centerX - width / 2 + icon,
    y: options.y,
    size: style.size,
    icon: 'globe',
  };
};

const endNameFor = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  options: { ratio: number; top: number; bottom: number },
): EndName | null => {
  const text = props.companyName.trim();
  const gap = options.bottom - options.top;
  if (!props.endCard.name || text === '' || gap <= 0) {
    return null;
  }
  const size = Math.min(props.type.nameSize * END_NAME_SHARE, gap * END_NAME_GAP);
  const style = fitText(text, { face: faces.display, size, tracking: -0.01 }, 1, END_ROOM).style;
  return {
    sprite: makeSprite(text, style, { fill: palette.text }, options.ratio),
    y: (options.top + options.bottom) / 2,
  };
};

export const buildEndCard = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  box: LogoBox | null,
  ratio: number,
): EndCard => {
  const tagline = taglineFor(props, faces, palette, ratio);
  const plate = plateFor(props, box);
  return {
    tagline: tagline.glyphs,
    underline: tagline.underline,
    taglineSize: tagline.size,
    website: websiteFor(props, faces, palette, {
      ratio,
      y: props.layout.taglineY + tagline.size * 1.55,
    }),
    contacts: contactsFor(props, faces, palette, ratio),
    plate,
    name: endNameFor(props, faces, palette, {
      ratio,
      top: props.layout.logoY + plate.height / 2,
      bottom: tagline.top,
    }),
  };
};
