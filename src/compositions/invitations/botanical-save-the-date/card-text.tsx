import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { BotanicalSaveTheDateProps } from '@/schemas';
import type { Face, Faces } from './fonts';
import {
  CAPS_LEADING,
  type CardLayout,
  DATE_TRACKING,
  NAME_TRACKING,
  SAVE_TRACKING,
  SCRIPT_LEADING,
} from './layout';
import { withAlpha } from './paint';
import type { Timeline } from './timeline';
import { type Cue, glyphStates, type Reveal, TypedLine } from './typed-line';
import type { LogoState } from './use-logo';

const INTRO_ALPHA = 0.82;

const row = (y: number): CSSProperties => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: y,
  display: 'flex',
  justifyContent: 'center',
});

const typeStyle = (font: Face, size: number, tracking: number, leading: number) => ({
  fontFamily: font.family,
  fontWeight: font.weight,
  fontSize: size,
  letterSpacing: `${tracking}em`,
  lineHeight: leading,
  fontVariantNumeric: 'lining-nums' as const,
});

const scriptPad = { padding: '0 0.3em' };

export const CardText = ({
  props,
  faces,
  layout,
  timeline,
  frame,
  logo,
}: {
  props: BotanicalSaveTheDateProps;
  faces: Faces;
  layout: CardLayout;
  timeline: Timeline;
  frame: number;
  logo: LogoState;
}) => {
  const { colors, lettering, words } = props;
  const reveal: Reveal = lettering.reveal;
  const typed = (text: string, cue: Cue, color: string, style: CSSProperties, y: number) => (
    <div key={`${y}:${text}`} style={row(y)}>
      <TypedLine
        text={text}
        states={glyphStates(frame, Array.from(text).length, cue, reveal)}
        color={color}
        cursor={colors.ink}
        style={style}
      />
    </div>
  );
  const { save, names } = layout;
  const saveStyle = typeStyle(faces.display.bold, save.size, SAVE_TRACKING, 1);
  const saveWord = (text: string, y: number) => (
    <div key={`${y}:${text}`} style={{ ...row(y), opacity: timeline.saveFade(frame) }}>
      <div style={{ ...saveStyle, color: colors.ink, whiteSpace: 'pre' }}>{text.toUpperCase()}</div>
    </div>
  );
  const logoWidth =
    logo === null ? 0 : Math.min(layout.logo.maxWidth, layout.logo.height * logo.aspect);
  return (
    <>
      {layout.verse.map((line, index) =>
        typed(
          line.kind === 'caps' ? line.text.toUpperCase() : line.text,
          timeline.verse(index),
          line.kind === 'caps' ? colors.ink : colors.script,
          line.kind === 'caps'
            ? typeStyle(faces.caps.body, line.size, lettering.tracking, CAPS_LEADING)
            : { ...typeStyle(faces.script, line.size, 0, SCRIPT_LEADING), ...scriptPad },
          line.y,
        ),
      )}
      {saveWord(words.saveTop, save.topY)}
      {saveWord(words.saveBottom, save.bottomY)}
      <div style={{ ...row(save.joinerY), opacity: timeline.joinerFade(frame) }}>
        <div
          style={{
            ...typeStyle(faces.script, save.joinerSize, 0, SCRIPT_LEADING),
            ...scriptPad,
            color: colors.script,
            whiteSpace: 'pre',
          }}
        >
          {words.saveJoiner}
        </div>
      </div>
      {typed(
        layout.date.text.toUpperCase(),
        timeline.date,
        colors.ink,
        typeStyle(faces.caps.strong, layout.date.size, DATE_TRACKING, CAPS_LEADING),
        layout.date.y,
      )}
      <div style={row(layout.intro.y)}>
        <div
          style={{
            ...typeStyle(faces.caps.body, layout.intro.size, lettering.tracking, CAPS_LEADING),
            color: withAlpha(colors.ink, INTRO_ALPHA),
            whiteSpace: 'pre',
          }}
        >
          {layout.intro.text.toUpperCase()}
        </div>
      </div>
      <div style={row(names.firstY)}>
        <div
          style={{
            ...typeStyle(faces.display.name, names.size, NAME_TRACKING, 1.08),
            color: colors.ink,
            whiteSpace: 'pre',
          }}
        >
          {props.partnerOne.toUpperCase()}
        </div>
      </div>
      <div style={{ ...row(names.secondY), alignItems: 'baseline' }}>
        <div
          style={{
            ...typeStyle(faces.script, names.joinerSize, 0, 1.08),
            color: colors.script,
            whiteSpace: 'pre',
            paddingRight: names.size * 0.18,
          }}
        >
          {words.joiner}
        </div>
        <div
          style={{
            ...typeStyle(faces.display.name, names.size, NAME_TRACKING, 1.08),
            color: colors.ink,
            whiteSpace: 'pre',
          }}
        >
          {props.partnerTwo.toUpperCase()}
        </div>
      </div>
      {layout.venue.map((line, index) =>
        typed(
          line.text.toUpperCase(),
          timeline.venue(index),
          colors.ink,
          typeStyle(faces.caps.body, line.size, lettering.tracking, CAPS_LEADING),
          line.y,
        ),
      )}
      {logo === null ? null : (
        <div style={{ ...row(layout.logo.y), opacity: timeline.logoFade(frame) }}>
          <Img
            src={logo.src}
            style={{ width: logoWidth, height: logoWidth / logo.aspect, objectFit: 'contain' }}
          />
        </div>
      )}
    </>
  );
};
