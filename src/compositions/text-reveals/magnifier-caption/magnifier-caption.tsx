import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { MagnifierCaptionProps } from '@/schemas';
import { FLIGHT_FRAMES, type Flight, TypedCaption } from './caption';
import { alpha, contrast, mix, readableOn } from './color';
import { type Bubble, buildField } from './field';
import { BODY_FACES, CAPTION_FACES, useFontsReady } from './fonts';
import { MagnifierGlass } from './glass';
import { type CellGlow, Honeycomb } from './honeycomb';
import { Lockup, layoutLockup } from './lockup';
import { canvasMeasurer, layoutCaption } from './measure';
import { pathKeys, pathState, wordTimes } from './path';
import { Spotlight } from './spotlight';
import { useLogo } from './use-logo';

const CAPTION_WIDTH = 940;
const MAX_LINES = 3;

const smooth = (edge0: number, edge1: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export const MagnifierCaption = (props: MagnifierCaptionProps) => {
  const frame = useCurrentFrame();
  const { colors, lens, caption, type } = props;
  const ready = useFontsReady(type.caption, type.body);
  const logo = useLogo(props.logo);
  const captionFace = CAPTION_FACES[type.caption];
  const bodyFaces = BODY_FACES[type.body];
  const measure = useMemo(() => canvasMeasurer(ready), [ready]);
  const layout = useMemo(
    () =>
      layoutCaption({
        measure,
        text: props.headline,
        font: captionFace,
        maxSize: type.captionSize,
        maxWidth: CAPTION_WIDTH,
        maxLines: MAX_LINES,
        top: caption.top,
        centerX: 540,
      }),
    [measure, props.headline, captionFace, type.captionSize, caption.top],
  );
  const words = useMemo(() => layout.words.map((word) => word.text), [layout]);
  const count = words.length;
  const lockup = layoutLockup({ props, logo, measure, faces: bodyFaces });
  const roomTop = layout.bottom + 36;
  const roomBottom = lockup.plate.y - 24;
  const keys = useMemo(
    () => pathKeys(props, count, { top: roomTop, bottom: roomBottom }),
    [props, count, roomTop, roomBottom],
  );
  const bubbles = useMemo(() => buildField(props, words, keys), [props, words, keys]);
  const found = useMemo(() => wordTimes(count, props.timing), [count, props.timing]);
  const state = pathState(frame, keys, lens.sway);
  const background = colors.background;
  const accent = readableOn(colors.primary, background, colors.text, 3);
  const darkBackground = contrast(background, '#000000') < contrast(background, '#ffffff');
  const keyword =
    darkBackground && contrast(colors.primary, background) < 3
      ? readableOn(colors.primary, background, colors.text, contrast(colors.text, background))
      : accent;
  const lensKeyword = readableOn(mix(keyword, colors.text, 0.4), colors.glass, colors.text, 3);
  const keywordSpot = contrast(colors.glass, '#000000') > 8 ? 0.45 : 0.8;
  const markBlend = mix(background, colors.primary, 0.42);
  const markText =
    caption.keyword === 'highlight' && contrast(keyword, markBlend) < 3 ? colors.text : keyword;
  const rim = readableOn(colors.rim, background, colors.text, 4);
  const cellWord = mix(colors.secondary, colors.text, 0.25);
  const glowOf = (bubble: Bubble): CellGlow | null => {
    if (bubble.target < 0) {
      return null;
    }
    const time = found[bubble.target] ?? 0;
    const lit = Math.max(0, Math.min(1, (frame - (time - 16)) / 12));
    const x = lens.magnify * (bubble.x + state.offset.x - state.lens.x);
    const y = lens.magnify * (bubble.y + state.offset.y - state.lens.y);
    const near = 1 - smooth(lens.radius * 0.5, lens.radius * 1.02, Math.hypot(x, y));
    const isKeyword = bubble.target === count - 1;
    const lifted = caption.flyWords ? Number(frame >= time - 4) : 0;
    const emptied = lifted * Math.min(1, Math.max(0, (frame - (time - 4)) / FLIGHT_FRAMES));
    return {
      amount: lit * near,
      spot: isKeyword ? colors.primary : colors.glow,
      spotStrength: (isKeyword ? keywordSpot : 1) * (1 - emptied),
      text: isKeyword ? lensKeyword : colors.text,
      keep: 1 - lifted,
      font: bodyFaces.lit,
    };
  };
  const flights: (Flight | null)[] = caption.flyWords
    ? bubbles
        .filter((bubble) => bubble.target >= 0)
        .sort((a, b) => a.target - b.target)
        .map((bubble) => {
          const at = pathState((found[bubble.target] ?? 0) - 4, keys, lens.sway);
          return {
            from: {
              x: at.lens.x + lens.magnify * (bubble.x + at.offset.x - at.lens.x),
              y: at.lens.y + lens.magnify * (bubble.y + at.offset.y - at.lens.y),
            },
            size: bubble.size * lens.magnify,
            face: bodyFaces.lit,
            color: bubble.target === count - 1 ? lensKeyword : colors.text,
            fadeIn: 0,
          };
        })
    : [];
  const fade = { top: caption.top - 160, bottom: lockup.plate.y - 10, length: 280 };
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <>
          <AbsoluteFill style={{ backgroundColor: background }} />
          <Spotlight color={colors.spotlight} />
        </>
      ) : null}
      <AbsoluteFill
        style={{ filter: props.cells.blur > 0 ? `blur(${props.cells.blur}px)` : undefined }}
      >
        <Honeycomb
          bubbles={bubbles}
          offset={state.offset}
          fade={fade}
          style={{
            shape: props.cells.shape,
            ring: mix(colors.secondary, background, 0.55),
            word: mix(colors.secondary, background, 0.42),
            lineWidth: 5,
            font: bodyFaces.word,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `circle(${lens.radius.toFixed(2)}px at ${state.lens.x.toFixed(3)}px ${state.lens.y.toFixed(3)}px)`,
        }}
      >
        <AbsoluteFill style={{ backgroundColor: colors.glass }} />
        <Honeycomb
          bubbles={bubbles}
          offset={state.offset}
          scale={lens.magnify}
          center={state.lens}
          glowOf={glowOf}
          style={{
            shape: props.cells.shape,
            ring: alpha(colors.secondary, 0.85),
            word: cellWord,
            lineWidth: 2.25,
            font: bodyFaces.word,
          }}
        />
      </AbsoluteFill>
      <MagnifierGlass
        pose={state.lens}
        lens={lens}
        colors={{ rim, handle: colors.handle, edge: colors.text }}
      />
      <TypedCaption
        frame={frame}
        layout={layout}
        face={captionFace}
        colors={{
          text: colors.text,
          keyword: markText,
          mark: caption.keyword === 'highlight' ? colors.primary : accent,
        }}
        timing={{ found, fly: caption.flyWords, typing: caption.typing }}
        style={caption.keyword}
        flights={flights}
      />
      <Lockup
        props={props}
        layout={lockup}
        logo={logo}
        faces={bodyFaces}
        colors={{
          surface: colors.surface,
          name: colors.text,
          website: mix(colors.secondary, colors.text, 0.35),
          shadow: '#000000',
        }}
      />
    </AbsoluteFill>
  );
};
