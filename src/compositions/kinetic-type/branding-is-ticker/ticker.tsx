import type { Face, Measure } from './fonts';
import { TickerStrip } from './ticker-strip';
import { type Timeline, tickerPosition } from './timeline';

const LEAD = 5;
const TRAIL = 7;
const WINDOW_PAD = 0.4;
const UNDERLINE_DROP = 1.1;

const wrap = (index: number, count: number) => ((index % count) + count) % count;

export type TickerLayout = {
  words: string[];
  face: Face;
  size: number;
  slotX: number;
  top: number;
  width: number;
};

export const Ticker = ({
  frame,
  layout,
  line,
  measure,
  glideShare,
  active,
  dim,
  underline,
}: {
  frame: number;
  layout: TickerLayout;
  line: Timeline;
  measure: Measure;
  glideShare: number;
  active: string;
  dim: string;
  underline: number;
}) => {
  const { words, face, size, slotX, top, width } = layout;
  const count = words.length;
  const first = -LEAD;
  const last = line.steps + TRAIL;
  const comma = measure(',', face) * size;
  const items: {
    index: number;
    text: string;
    x: number;
    advance: number;
    word: number;
    comma: number;
  }[] = [];
  let cursor = 0;
  const origin: number[] = [];
  for (let index = 0; index <= last; index++) {
    const word = words[wrap(index, count)] ?? '';
    const advance = measure(`${word}, `, face) * size;
    origin.push(cursor);
    items.push({
      index,
      text: `${word},`,
      x: cursor,
      advance,
      word: measure(word, face) * size,
      comma,
    });
    cursor += advance;
  }
  let back = 0;
  for (let index = -1; index >= first; index--) {
    const word = words[wrap(index, count)] ?? '';
    const advance = measure(`${word}, `, face) * size;
    back -= advance;
    items.unshift({
      index,
      text: `${word},`,
      x: back,
      advance,
      word: measure(word, face) * size,
      comma,
    });
  }
  const { step, progress } = tickerPosition(frame, line, glideShare);
  const from = Math.min(step, last - 1);
  const here = origin[from] ?? 0;
  const next = origin[from + 1] ?? here;
  const shift = here + (next - here) * progress;
  const pad = Math.round(size * WINDOW_PAD);
  const pick = (index: number) => items.find((item) => item.index === index);
  const blend = (value: (item: (typeof items)[number] | undefined) => number) =>
    value(pick(from)) + (value(pick(from + 1)) - value(pick(from))) * progress;
  const barWidth = blend((item) => item?.word ?? 0);
  const windowWidth = blend((item) => (item?.word ?? 0) + (item?.comma ?? 0));
  const visible = items.filter((item) => {
    const x = slotX + item.x - shift;
    return x <= width && x + item.advance >= 0;
  });
  const bandTop = top - pad;
  return (
    <div style={{ position: 'absolute', left: 0, top: bandTop, width, height: size + 2 * pad }}>
      <TickerStrip
        runs={visible.map((item) => ({
          key: item.index,
          text: item.text,
          x: slotX + item.x - shift,
        }))}
        face={face}
        size={size}
        width={width}
        height={size + 2 * pad}
        textTop={pad}
        slot={{ left: slotX, width: windowWidth }}
        dim={dim}
        active={active}
        bar={
          underline > 0
            ? {
                width: barWidth,
                top: Math.round(top + size * UNDERLINE_DROP) - bandTop,
                height: underline,
              }
            : null
        }
      />
    </div>
  );
};
