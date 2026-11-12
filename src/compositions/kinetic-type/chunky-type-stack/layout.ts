import type { ChunkyTypeStackProps } from '@/schemas';
import type { Measurer } from './fonts';

export type Letter = {
  char: string;
  x: number;
  centerX: number;
  baseline: number;
  size: number;
  tilt: number;
  lift: number;
};

type Line = {
  letters: Letter[];
  left: number;
  width: number;
  baseline: number;
  size: number;
};

export type Bar = { x: number; y: number; width: number; thickness: number };

export type StackLayout = {
  lines: Line[];
  underline: Bar | null;
  name: Line;
  nameUnderline: Bar | null;
  ampersand: { x: number; baseline: number; size: number };
  cap: number;
};

const STAIRS = [0, 1, 1.2, 2.2];

const jitter = (line: number, at: number, salt: number) => {
  const value = Math.sin((line + 1) * 127.1 + (at + 1) * 311.7 + salt * 74.7) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

const textOf = (value: string, caps: boolean) => (caps ? value.toUpperCase() : value).trim();

const lettersOf = (
  text: string,
  left: number,
  baseline: number,
  size: number,
  measure: Measurer,
  line: number,
  tilt: number,
): Letter[] => {
  const chars = [...text];
  return chars.flatMap((char, at) => {
    if (char.trim() === '') {
      return [];
    }
    const x = left + measure.advance(chars.slice(0, at).join('')) * size;
    const width = measure.advance(char) * size;
    return [
      {
        char,
        x,
        centerX: x + width / 2,
        baseline,
        size,
        tilt: jitter(line, at, 1) * tilt,
        lift: jitter(line, at, 2) * 0.03 * size,
      },
    ];
  });
};

const barUnder = (line: Line, cap: number, gap: number, thickness: number): Bar => ({
  x: line.left,
  y: line.baseline + gap * cap * line.size,
  width: line.width,
  thickness,
});

export const buildLayout = (
  props: ChunkyTypeStackProps,
  measure: Measurer,
  frame: { width: number; height: number },
): StackLayout => {
  const { stack } = props;
  const cap = measure.metrics.cap;
  const sizes = [stack.firstSize, stack.secondSize, stack.thirdSize, stack.fourthSize];
  const texts = [props.lines.first, props.lines.second, props.lines.third, props.lines.fourth];
  const rows = texts
    .map((value, at) => ({ text: textOf(value, stack.caps), at }))
    .filter((row) => row.text !== '')
    .map((row, order) => {
      const indent = stack.step * (STAIRS[order] ?? 0);
      const advance = Math.max(0.001, measure.advance(row.text));
      const base = sizes[row.at] ?? 100;
      const size = Math.min(base, (stack.maxWidth - indent) / advance);
      return { ...row, indent, size, width: advance * size };
    });
  const blockWidth = Math.max(1, ...rows.map((row) => row.indent + row.width));
  const blockLeft = (frame.width - blockWidth) / 2;
  const baselines: number[] = [];
  rows.forEach((row, order) => {
    const previous = baselines[order - 1];
    baselines.push(
      previous === undefined
        ? cap * row.size
        : previous + stack.lineGap * cap * row.size + cap * row.size,
    );
  });
  const last = rows.at(-1);
  const lastBaseline = baselines.at(-1) ?? 0;
  const bottom =
    props.underline.show && last !== undefined
      ? lastBaseline + props.underline.gap * cap * last.size + props.underline.thickness
      : lastBaseline;
  const top = stack.centerY - bottom / 2;
  const lines: Line[] = rows.map((row, order) => {
    const baseline = top + (baselines[order] ?? 0);
    const left = blockLeft + row.indent;
    return {
      letters: lettersOf(row.text, left, baseline, row.size, measure, row.at, stack.tilt),
      left,
      width: row.width,
      baseline,
      size: row.size,
    };
  });
  const lastLine = lines.at(-1);
  const nameText = textOf(props.companyName, stack.caps);
  const nameAdvance = Math.max(0.001, measure.advance(nameText));
  const nameSize = Math.min(props.endCard.nameSize, stack.maxWidth / nameAdvance);
  const nameWidth = nameAdvance * nameSize;
  const nameBar = props.underline.show && props.endCard.underline;
  const nameBottom = nameBar
    ? (1 + props.underline.gap) * cap * nameSize + props.underline.thickness
    : cap * nameSize;
  const nameBaseline = stack.centerY - nameBottom / 2 + cap * nameSize;
  const nameLeft = (frame.width - nameWidth) / 2;
  const name: Line = {
    letters: lettersOf(nameText, nameLeft, nameBaseline, nameSize, measure, 7, stack.tilt),
    left: nameLeft,
    width: nameWidth,
    baseline: nameBaseline,
    size: nameSize,
  };
  return {
    lines,
    underline:
      props.underline.show && lastLine !== undefined
        ? barUnder(lastLine, cap, props.underline.gap, props.underline.thickness)
        : null,
    name,
    nameUnderline: nameBar
      ? barUnder(name, cap, props.underline.gap, props.underline.thickness)
      : null,
    ampersand: {
      x: frame.width / 2,
      baseline: stack.centerY + (cap * props.ampersand.size) / 2,
      size: props.ampersand.size,
    },
    cap,
  };
};
