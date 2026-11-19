import type { GoingLiveTeaserProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import { buildEndCard, type EndCard } from './end-layout';
import type { FaceSet } from './fonts';
import type { Palette } from './palette';
import { type Ink, makeSprite, type Sprite, type TextStyle, textWidth } from './sprites';
import { type Fit, FRAME, fitText, type Glyph, glyphRow, MAX_TEXT_WIDTH } from './text-fit';
import {
  NAME_GROW_SECONDS,
  NAME_PUSH,
  type NameTiming,
  nameTiming,
  WORD_GROW_SECONDS,
} from './timeline';

const OPENER_ZOOM = 2;
const MARK_DROP = 0.5;
const MARK_WEIGHT = 0.07;
const LINE_HEIGHT = 1.02;

type Line = { sprite: Sprite; dy: number };

export type Block = { lines: Line[]; size: number; height: number; width: number };

const block = (fitted: Fit, ink: Ink, ratio: number): Block => {
  const step = fitted.size * LINE_HEIGHT;
  const count = fitted.lines.length;
  return {
    lines: fitted.lines.map((line, at) => ({
      sprite: makeSprite(line, fitted.style, ink, ratio),
      dy: (at - (count - 1) / 2) * step,
    })),
    size: fitted.size,
    height: count * step,
    width: Math.max(0, ...fitted.lines.map((line) => textWidth(line, fitted.style))),
  };
};

export type Punch = { face: Block; accent: Block; echoes: Block[] };

type LightMark = { x: number; y: number; width: number; height: number; color: string };

export type Layout = {
  opener: Block;
  glitch: { main: Block; left: Block; right: Block };
  bridge: Block;
  panel: Block;
  light: {
    word: Line | null;
    accent: Line | null;
    width: number;
    size: number;
    mark: LightMark | null;
  };
  punchOne: Punch;
  punchTwo: Punch;
  name: { glyphs: Glyph[]; size: number; width: number; timing: NameTiming };
  end: EndCard;
};

const caseOf = (props: GoingLiveTeaserProps) => (text: string) =>
  props.type.caps ? text.toUpperCase() : text;

const wordRoom = (props: GoingLiveTeaserProps) =>
  MAX_TEXT_WIDTH / (1 + props.effects.push * WORD_GROW_SECONDS);

const nameRoom = (props: GoingLiveTeaserProps) =>
  MAX_TEXT_WIDTH / (1 + props.effects.push * NAME_PUSH * NAME_GROW_SECONDS);

const NAME_MIN_WIDTH = MAX_TEXT_WIDTH * 0.42;
const NAME_MAX_GROWTH = 1.8;

const nameStyleFor = (text: string, base: TextStyle, room: number): TextStyle => {
  const fitted = fitText(text, base, 1, room).style;
  const width = textWidth(text, fitted);
  if (width <= 0 || width >= NAME_MIN_WIDTH) {
    return fitted;
  }
  const size = Math.min(base.size * NAME_MAX_GROWTH, fitted.size * (NAME_MIN_WIDTH / width));
  return { ...fitted, size };
};

const punch = (
  text: string,
  style: TextStyle,
  palette: Palette,
  options: { count: number; room: number },
  ratio: number,
) => {
  const count = options.count;
  const fitted = fitText(text, style, 3, options.room * 0.86);
  const stroke = Math.max(2, fitted.size * 0.035);
  return {
    face: block(fitted, { fill: palette.text, stroke: palette.edge, strokeWidth: stroke }, ratio),
    accent: block(fitted, { fill: palette.accent }, ratio),
    echoes: Array.from({ length: Math.max(0, Math.round(count)) }, (_, at) =>
      block(
        fitted,
        {
          fill: palette.echoes[at % palette.echoes.length] ?? palette.accent,
          stroke: palette.edge,
          strokeWidth: stroke,
        },
        ratio,
      ),
    ),
  };
};

const lightWord = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  ratio: number,
) => {
  const toCase = caseOf(props);
  const word = toCase(props.words.light.trim());
  const accent = toCase(props.words.lightAccent.trim());
  const joined = [word, accent].filter((part) => part !== '').join(' ');
  const fitted = fitText(
    joined,
    { face: faces.display, size: props.type.wordSize, tracking: -0.01 },
    1,
    wordRoom(props),
  );
  const style = fitted.style;
  const total = textWidth(joined, style);
  const left = FRAME.centerX - total / 2;
  const space =
    word !== '' && accent !== '' ? textWidth(`${word} `, style) - textWidth(word, style) : 0;
  const wordWidth = textWidth(word, style);
  const make = (text: string, color: string, x: number): Line | null =>
    text === '' ? null : { sprite: makeSprite(text, style, { fill: color }, ratio, 'left'), dy: x };
  return {
    word: make(word, palette.text, left),
    accent: make(accent, palette.accent, left + wordWidth + space),
    width: total,
    size: style.size,
    mark:
      palette.accentMark && accent !== ''
        ? {
            x: left + wordWidth + space,
            y: style.size * MARK_DROP,
            width: textWidth(accent, style),
            height: Math.max(3, style.size * MARK_WEIGHT),
            color: palette.underline,
          }
        : null,
  };
};

export const buildLayout = (
  props: GoingLiveTeaserProps,
  faces: FaceSet,
  palette: Palette,
  box: LogoBox | null,
  ratio: number,
): Layout => {
  const toCase = caseOf(props);
  const word: TextStyle = { face: faces.display, size: props.type.wordSize, tracking: -0.01 };
  const punchStyle: TextStyle = {
    face: faces.display,
    size: props.type.punchSize,
    tracking: -0.01,
  };
  const room = wordRoom(props);
  const glitchFit = fitText(toCase(props.words.glitch), word, 3, room);
  const nameStyle = nameStyleFor(
    props.companyName.trim(),
    { face: faces.display, size: props.type.nameSize, tracking: -0.01 },
    nameRoom(props),
  );
  const nameText = props.companyName.trim();
  const echoes = { count: props.effects.echoes, room };
  const nameWidth = textWidth(nameText, nameStyle);
  return {
    opener: block(
      fitText(toCase(props.words.opener), word, 2, room),
      { fill: palette.text },
      ratio * OPENER_ZOOM,
    ),
    glitch: {
      main: block(glitchFit, { fill: palette.text }, ratio),
      left: block(glitchFit, { fill: palette.split }, ratio),
      right: block(glitchFit, { fill: palette.glow }, ratio),
    },
    bridge: block(
      fitText(toCase(props.words.bridge), word, 2, room),
      { fill: palette.text },
      ratio,
    ),
    panel: block(fitText(toCase(props.words.panel), word, 2, room), { fill: palette.text }, ratio),
    light: lightWord(props, faces, palette, ratio),
    punchOne: punch(toCase(props.words.punchOne), punchStyle, palette, echoes, ratio),
    punchTwo: punch(toCase(props.words.punchTwo), punchStyle, palette, echoes, ratio),
    name: {
      glyphs: glyphRow(
        nameText,
        nameStyle,
        FRAME.centerX - nameWidth / 2,
        props.layout.wordY,
        () => palette.text,
        ratio,
        0,
      ),
      size: nameStyle.size,
      width: nameWidth,
      timing: nameTiming([...nameText].filter((char) => char !== ' ').length),
    },
    end: buildEndCard(props, faces, palette, box, ratio),
  };
};

export const OPENER_SCALE = OPENER_ZOOM;
