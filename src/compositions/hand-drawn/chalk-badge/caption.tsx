import { CAPTION_FACE } from './fonts';

type CaptionProps = {
  text: string;
  size: number;
  top: number;
  tracking: number;
  color: string;
  typed: number;
  erased: number;
};

const FADE_CHARS = 3;

const level = (index: number, count: number, progress: number) =>
  Math.max(0, Math.min(1, (progress * (count + FADE_CHARS) - index) / FADE_CHARS));

const typedLevel = (index: number, count: number, lead: number, progress: number) =>
  Math.max(0, Math.min(1, (lead + FADE_CHARS + progress * (count - lead) - index) / FADE_CHARS));

const firstWord = (chars: string[]) => {
  const start = chars.findIndex((char) => char.trim() !== '');
  const gap = chars.findIndex((char, index) => index > start && char.trim() === '');
  return start < 0 ? 0 : gap < 0 ? chars.length : gap;
};

export const Caption = (props: CaptionProps) => {
  const chars = [...props.text.toUpperCase()];
  if (chars.length === 0 || props.erased >= 1) {
    return null;
  }
  const lead = firstWord(chars);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: props.top,
        display: 'flex',
        justifyContent: 'center',
        fontFamily: `"${CAPTION_FACE.family}"`,
        fontWeight: CAPTION_FACE.weight,
        fontSize: props.size,
        lineHeight: 1.2,
        letterSpacing: `${props.tracking}em`,
        paddingLeft: `${props.tracking}em`,
        color: props.color,
        whiteSpace: 'pre',
      }}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          style={{
            opacity:
              typedLevel(index, chars.length, lead, props.typed) *
              (1 - level(chars.length - 1 - index, chars.length, props.erased)),
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
