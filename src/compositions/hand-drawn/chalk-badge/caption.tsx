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

const FADE_CHARS = 1.5;

const level = (index: number, count: number, progress: number) =>
  Math.max(0, Math.min(1, (progress * (count + FADE_CHARS) - index) / FADE_CHARS));

export const Caption = (props: CaptionProps) => {
  const chars = [...props.text.toUpperCase()];
  if (chars.length === 0 || props.erased >= 1) {
    return null;
  }
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
              level(index, chars.length, props.typed) *
              (1 - level(index, chars.length, props.erased)),
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
