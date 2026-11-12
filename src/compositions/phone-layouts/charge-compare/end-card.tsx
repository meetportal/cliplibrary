import { Easing } from 'remotion';
import { alpha, mixLab } from './color';
import { type Measure, MONO_FACE, NAME_FACE, URL_FACE, type Wrapped, wrapToFit } from './fonts';
import { pixelTween, progress, type Timeline } from './timeline';

const SIDE = 70;
const NAME_CENTER = 935;
const NAME_GAP = 44;
const PILL_GAP = 110;
const PILL_TOP = 1350;
const PILL = { width: 780, height: 108, button: 80 } as const;
const MONO_TRACKING = 0.16;
const RISE = 28;

export type EndCardLayout = {
  name: Wrapped;
  tagline: Wrapped;
  websiteSize: number;
};

export const endCardLayout = (
  input: { name: string; tagline: string; website: string },
  sizes: { name: number; tagline: number; website: number },
  measure: Measure,
): EndCardLayout => {
  const width = 1080 - SIDE * 2;
  const name = wrapToFit(
    input.name,
    { width, size: sizes.name, minSize: 56, maxLines: 2 },
    (text) => measure(text, NAME_FACE, -0.01),
  );
  const tagline = wrapToFit(
    input.tagline,
    { width: width - 40, size: sizes.tagline, minSize: 24, maxLines: 2 },
    (text) => measure(text, MONO_FACE, MONO_TRACKING),
  );
  const textRoom = PILL.width - 48 - PILL.button - 36;
  const ems = measure(input.website, URL_FACE);
  const websiteSize = Math.max(
    20,
    Math.min(sizes.website, Math.floor(textRoom / Math.max(ems, 0.01))),
  );
  return { name, tagline, websiteSize };
};

export type EndCardLook = {
  frame: number;
  line: Timeline;
  website: string;
  text: string;
  muted: string;
  accent: string;
  pillFill: string;
  buttonInk: string;
};

const NameLetters = ({
  line,
  look,
  offset,
  total,
}: {
  line: string;
  look: EndCardLook;
  offset: number;
  total: number;
}) => {
  const [start, end] = look.line.name;
  const span = end - start;
  return (
    <div>
      {[...line].map((letter, index) => {
        const at = start + (span * 0.65 * (offset + index)) / Math.max(1, total - 1);
        const shown = progress(look.frame, at, at + span * 0.35, Easing.inOut(Easing.sin));
        const settle = progress(
          look.frame,
          at + span * 0.2,
          at + span * 0.6,
          Easing.inOut(Easing.sin),
        );
        return (
          <span
            key={index}
            style={{ opacity: shown, color: mixLab(look.accent, look.text, settle) }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export const EndCard = ({ layout, look }: { layout: EndCardLayout; look: EndCardLook }) => {
  const { frame, line } = look;
  const nameLineHeight = Math.round(layout.name.size * 1.12);
  const taglineLineHeight = Math.round(layout.tagline.size * 1.7);
  const nameTop = NAME_CENTER - Math.round((layout.name.lines.length * nameLineHeight) / 2);
  const taglineTop = nameTop + layout.name.lines.length * nameLineHeight + NAME_GAP;
  const pillTop = Math.max(
    PILL_TOP,
    taglineTop + layout.tagline.lines.length * taglineLineHeight + PILL_GAP,
  );
  const tagline = {
    opacity: progress(frame, line.tagline[0], line.tagline[0] + 12, Easing.inOut(Easing.sin)),
    offset: pixelTween(
      frame,
      RISE,
      0,
      line.tagline[0],
      line.tagline[1] - line.tagline[0],
      Easing.out(Easing.cubic),
    ),
  };
  const pillGrow = progress(frame, line.pill[0], line.pill[1], Easing.inOut(Easing.sin));
  const pillWidth = Math.round(PILL.button + 28 + (PILL.width - PILL.button - 28) * pillGrow);
  const chars = [...look.website];
  const perFrame = Math.max(
    1,
    Math.ceil(chars.length / Math.max(1, line.typing[1] - line.typing[0])),
  );
  const count =
    frame < line.typing[0] ? 0 : Math.min(chars.length, (frame - line.typing[0] + 1) * perFrame);
  const typingEnd = line.typing[0] + Math.ceil(chars.length / perFrame);
  const shown = chars.slice(0, count).join('');
  const caret = frame >= line.typing[0] ? 1 - progress(frame, typingEnd + 4, typingEnd + 12) : 0;
  const total = layout.name.lines.reduce((sum, text) => sum + [...text].length, 0);
  let offset = 0;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          width: 1080 - SIDE * 2,
          top: nameTop,
          textAlign: 'center',
          fontFamily: NAME_FACE.family,
          fontWeight: NAME_FACE.weight,
          fontSize: layout.name.size,
          lineHeight: `${nameLineHeight}px`,
          letterSpacing: '-0.01em',
          whiteSpace: 'pre',
        }}
      >
        {layout.name.lines.map((text) => {
          const from = offset;
          offset += [...text].length;
          return (
            <NameLetters
              key={`${from}-${text}`}
              line={text}
              look={look}
              offset={from}
              total={total}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          width: 1080 - SIDE * 2,
          top: taglineTop + tagline.offset,
          textAlign: 'center',
          fontFamily: MONO_FACE.family,
          fontWeight: MONO_FACE.weight,
          fontSize: layout.tagline.size,
          lineHeight: `${taglineLineHeight}px`,
          letterSpacing: `${MONO_TRACKING}em`,
          color: look.muted,
          opacity: tagline.opacity,
          whiteSpace: 'pre',
        }}
      >
        {layout.tagline.lines.map((text) => (
          <div key={text}>{text}</div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - pillWidth / 2,
          top: pillTop,
          width: pillWidth,
          height: PILL.height,
          borderRadius: PILL.height / 2,
          backgroundColor: look.pillFill,
          border: `3px solid ${alpha(look.accent, 0.75)}`,
          opacity: progress(frame, line.pill[0], line.pill[0] + 12),
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 45,
            top: 0,
            height: PILL.height - 6,
            display: 'flex',
            alignItems: 'center',
            fontFamily: URL_FACE.family,
            fontWeight: URL_FACE.weight,
            fontSize: layout.websiteSize,
            color: look.text,
            whiteSpace: 'pre',
          }}
        >
          {shown}
          <span
            style={{
              display: 'inline-block',
              width: 3,
              height: Math.round(layout.websiteSize * 1.05),
              marginLeft: 4,
              backgroundColor: look.accent,
              opacity: caret,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 11,
            top: (PILL.height - 6 - PILL.button) / 2,
            width: PILL.button,
            height: PILL.button,
            borderRadius: PILL.button / 2,
            backgroundColor: look.accent,
          }}
        >
          <svg
            width={PILL.button}
            height={PILL.button}
            viewBox="0 0 80 80"
            aria-hidden="true"
            style={{ position: 'absolute', left: 0, top: 0 }}
          >
            <path
              d="M24 40 H54 M42 27 L55 40 L42 53"
              fill="none"
              stroke={look.buttonInk}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
};
