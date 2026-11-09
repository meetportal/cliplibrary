import type { CSSProperties } from 'react';
import type { WordPickerProps } from '@/schemas';
import { mixHex } from './color';
import { FACES, type Face } from './fonts';
import type { ListLayout } from './layout';
import { tween, wordEntrance } from './timeline';

export type WordTone = { pick: string; near: string; far: string };

type Slot = {
  key: number;
  text: string;
  top: number;
  scale: number;
  distance: number;
  opacity: number;
};

export const listSlots = (
  props: WordPickerProps,
  layout: ListLayout,
  frame: number,
  offset: number,
  ceiling: number,
): Slot[] => {
  const { reach } = props.type;
  const lineBox = Math.round(layout.pickSize * 1.4);
  const fadeFrom = Math.max(0.6, reach - 0.9);
  return props.items.flatMap((text, slot) => {
    const along = slot * layout.pitch - offset;
    const distance = Math.abs(along) / layout.pitch;
    if (distance >= reach) {
      return [];
    }
    const enter = wordEntrance(frame, props.entrance, slot);
    const glyphTop =
      layout.centerY +
      along -
      (layout.pickSize * (1 + (layout.sideScale - 1) * Math.min(1, distance))) / 2;
    const clear = ceiling <= 0 ? 1 : tween(glyphTop, [ceiling + 100, ceiling + 160], [0, 1]);
    const opacity = enter.opacity * clear * tween(distance, [fadeFrom, reach], [1, 0]);
    if (opacity <= 0.001) {
      return [];
    }
    return [
      {
        key: slot,
        text,
        top: layout.centerY + along + enter.rise - Math.round(lineBox / 2),
        scale: 1 + (layout.sideScale - 1) * Math.min(1, distance),
        distance,
        opacity,
      },
    ];
  });
};

const toneAt = (tone: WordTone, distance: number) =>
  distance < 1
    ? mixHex(tone.pick, tone.near, distance)
    : mixHex(tone.near, tone.far, Math.min(1, distance - 1));

const pickShare = (distance: number) => tween(distance, [0.1, 0.65], [1, 0]);

const wordStyle = (
  slot: Slot,
  layout: ListLayout,
  originX: number,
  originY: number,
  face: Face,
): CSSProperties => {
  const lineBox = Math.round(layout.pickSize * 1.4);
  return {
    position: 'absolute',
    left: Math.round(layout.centerX - layout.column / 2 - originX),
    top: slot.top - originY,
    width: layout.column,
    height: lineBox,
    lineHeight: `${lineBox}px`,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: `${face.tracking}em`,
    fontSize: layout.pickSize,
    transform: `scale(${slot.scale.toFixed(4)})`,
  };
};

export const WordList = ({
  props,
  layout,
  slots,
  tone,
  originX = 0,
  originY = 0,
  only,
}: {
  props: WordPickerProps;
  layout: ListLayout;
  slots: readonly Slot[];
  tone: WordTone;
  originX?: number;
  originY?: number;
  only?: 'list' | 'pick' | undefined;
}) => {
  const listFace = FACES[props.type.listFont];
  const pickFace = FACES[props.type.pickFont];
  const sameFace = props.type.listFont === props.type.pickFont;
  return (
    <>
      {slots.map((slot) => {
        const color = toneAt(tone, slot.distance);
        const reveal = only === 'list' && !sameFace ? tween(slot.distance, [0.45, 0.9], [0, 1]) : 1;
        const share =
          only === 'list' ? 0 : only === 'pick' ? 1 : sameFace ? 0 : pickShare(slot.distance);
        return (
          <div key={slot.key}>
            {share < 1 ? (
              <div
                style={{
                  ...wordStyle(slot, layout, originX, originY, listFace),
                  color,
                  opacity: slot.opacity * reveal * (1 - share),
                }}
              >
                {slot.text}
              </div>
            ) : null}
            {share > 0 ? (
              <div
                style={{
                  ...wordStyle(slot, layout, originX, originY, pickFace),
                  color,
                  opacity: slot.opacity * reveal * share,
                }}
              >
                {slot.text}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};
