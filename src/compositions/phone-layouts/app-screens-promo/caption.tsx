import type { CSSProperties, ReactNode } from 'react';
import type { AppScreensPromoProps } from '@/schemas';
import { type FittedText, fitText } from './fit-text';
import { BODY_FACE, DISPLAY_FACES, type TypeFace } from './fonts';
import type { Palette } from './palette';
import { pixelTween } from './pixel-tween';
import { liftOff, progress, settle, smooth, TEXT_IN, TEXT_OUT } from './timeline';

export const CAPTION_WIDTH = 640;
export const BAR = { width: 120, height: 12 };

const RISE = 40;

export const textStyle = (font: TypeFace, fitted: FittedText, lineHeight: number) => ({
  fontFamily: font.family,
  fontWeight: font.weight,
  fontSize: fitted.size,
  lineHeight: `${lineHeight}px`,
  letterSpacing: `${font.tracking}em`,
  whiteSpace: 'pre' as const,
});

export const Entering = ({
  frame,
  start,
  leave,
  top,
  left,
  children,
  style,
}: {
  frame: number;
  start: number;
  leave: number | null;
  top: number;
  left: number;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const opacity =
    progress(frame, start, TEXT_IN * 0.7, smooth) *
    (leave === null ? 1 : 1 - progress(frame, leave, TEXT_OUT, smooth));
  const rise = pixelTween(frame, [start, start + TEXT_IN], [RISE, 0], settle);
  const exit = leave === null ? 0 : pixelTween(frame, [leave, leave + TEXT_OUT], [0, -20], liftOff);
  if (opacity <= 0) {
    return null;
  }
  return (
    <div style={{ position: 'absolute', left, top: top + rise + exit, opacity, ...style }}>
      {children}
    </div>
  );
};

export const Caption = ({
  props,
  feature,
  palette,
  frame,
  ready,
  left,
  start,
  leave,
}: {
  props: AppScreensPromoProps;
  feature: { title: string; line: string };
  palette: Palette;
  frame: number;
  ready: boolean;
  left: number;
  start: number;
  leave: number;
}) => {
  if (frame < start || frame > leave + TEXT_OUT) {
    return null;
  }
  const font = DISPLAY_FACES[props.type.font];
  const title = fitText(feature.title, font, ready, {
    maxSize: props.type.captionSize,
    maxLines: 2,
    width: CAPTION_WIDTH,
  });
  const line = fitText(feature.line, BODY_FACE, ready, {
    maxSize: props.type.lineSize,
    maxLines: 3,
    width: CAPTION_WIDTH - 60,
  });
  const titleLine = Math.round(title.size * 1.04);
  const bodyLine = Math.round(line.size * 1.42);
  const titleGap = Math.round(title.size * 0.3);
  const lineGap = Math.round(line.size * 0.75);
  const hasLine = feature.line.trim() !== '';
  const height =
    BAR.height +
    titleGap +
    title.lines.length * titleLine +
    (hasLine ? lineGap + line.lines.length * bodyLine : 0);
  const top = Math.round(540 - height / 2);
  const stagger = props.timing.textStagger;
  const barGrow = progress(frame, start, TEXT_IN, settle);
  return (
    <>
      <Entering frame={frame} start={start} leave={leave} top={top} left={left}>
        <div
          style={{
            width: BAR.width,
            height: BAR.height,
            borderRadius: BAR.height / 2,
            backgroundColor: palette.accent,
            transform: `scaleX(${0.2 + 0.8 * barGrow})`,
            transformOrigin: 'left center',
          }}
        />
      </Entering>
      <Entering
        frame={frame}
        start={start + stagger}
        leave={leave}
        top={top + BAR.height + titleGap}
        left={left}
        style={{ ...textStyle(font, title, titleLine), color: palette.text }}
      >
        {title.lines.join('\n')}
      </Entering>
      {hasLine && (
        <Entering
          frame={frame}
          start={start + stagger * 2}
          leave={leave}
          top={top + BAR.height + titleGap + title.lines.length * titleLine + lineGap}
          left={left + 2}
          style={{ ...textStyle(BODY_FACE, line, bodyLine), color: palette.line }}
        >
          {line.lines.join('\n')}
        </Entering>
      )}
    </>
  );
};
