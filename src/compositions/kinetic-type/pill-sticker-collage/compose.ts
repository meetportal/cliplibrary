import type { PillStickerCollageProps } from '@/schemas';
import { type Collage, type Frame, MARGIN, PAN, type Sticker } from './layout';

const ROW_GAP = 36;
const CLEARANCE = 32;
const EXIT_LEAD = 8;
const EXIT_STAGGER = 2;
const SHRINK_FIRST = 0.8;
const SHRINK_LAST = 0.5;

type Box = { left: number; right: number; top: number; bottom: number };

const boxOf = (sticker: Sticker): Box => {
  const angle = (sticker.rotate * Math.PI) / 180;
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const halfW = (sticker.w * cos + sticker.h * sin) / 2;
  const halfH = (sticker.w * sin + sticker.h * cos) / 2;
  return {
    left: sticker.x - halfW,
    right: sticker.x + halfW,
    top: sticker.y - halfH,
    bottom: sticker.y + halfH,
  };
};

const union = (boxes: Box[]): Box =>
  boxes.reduce(
    (all, box) => ({
      left: Math.min(all.left, box.left),
      right: Math.max(all.right, box.right),
      top: Math.min(all.top, box.top),
      bottom: Math.max(all.bottom, box.bottom),
    }),
    {
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    },
  );

const touches = (a: Box, b: Box, margin: number) =>
  a.left < b.right + margin &&
  a.right > b.left - margin &&
  a.top < b.bottom + margin &&
  a.bottom > b.top - margin;

const fitCandidates = (): { flatten: number; scale: number }[] => {
  const out: { flatten: number; scale: number }[] = [];
  for (let scale = 1; scale >= SHRINK_FIRST - 1e-6; scale -= 0.05) {
    out.push({ flatten: 1, scale });
  }
  for (let flatten = 0.75; flatten >= 0; flatten -= 0.25) {
    out.push({ flatten, scale: SHRINK_FIRST });
  }
  for (let scale = SHRINK_FIRST - 0.05; scale >= SHRINK_LAST - 1e-6; scale -= 0.05) {
    out.push({ flatten: 0, scale });
  }
  return out;
};

export type Stage = { stickers: Sticker[]; cameraY: number };

export const composeEnd = (
  props: PillStickerCollageProps,
  collage: Collage,
  lockupAt: (usable: number, scale: number) => Sticker[],
  frame: Frame,
  frames: number,
  poster: number,
): Stage => {
  const { brandAt, lastRow } = collage;
  const end = frames - 1;
  const lastRowStickers = collage.stickers.filter((sticker) => sticker.row === lastRow);
  const firstPop = Math.min(...lastRowStickers.map((sticker) => sticker.at), brandAt);
  const sway = PAN * Math.max(poster - brandAt, end - poster);
  const usable = frame.width - MARGIN * 2 - sway * 2 - 24;
  const room = frame.height - MARGIN * 2;
  const tilted = (flatten: number) =>
    lastRowStickers.map((sticker) => ({ ...sticker, rotate: sticker.rotate * flatten }));
  const candidates = fitCandidates();
  const pick = candidates.find(({ flatten, scale }) => {
    const row = union(tilted(flatten).map(boxOf));
    const lockup = union(lockupAt(usable, scale).map(boxOf));
    return row.bottom - row.top + ROW_GAP + (lockup.bottom - lockup.top) <= room;
  }) ??
    candidates.at(-1) ?? { flatten: 0, scale: SHRINK_LAST };
  const rowBefore = tilted(pick.flatten);
  const rowBox = union(rowBefore.map(boxOf));
  const lowest = PAN * end - frame.width / 2 + MARGIN;
  const highest = PAN * firstPop + frame.width / 2 - MARGIN - (rowBox.right - rowBox.left);
  const shiftX = (lowest + highest) / 2 - rowBox.left;
  const lastRowPlaced = rowBefore.map((sticker) => ({
    ...sticker,
    x: Math.round(sticker.x + shiftX),
  }));
  const lockupLocal = lockupAt(usable, pick.scale);
  const lockupBox = union(lockupLocal.map(boxOf));
  const offsetX = PAN * poster - (lockupBox.left + lockupBox.right) / 2;
  const offsetY = rowBox.bottom + ROW_GAP - lockupBox.top;
  const lockup = lockupLocal.map((sticker) => ({
    ...sticker,
    x: Math.round(sticker.x + offsetX),
    y: Math.round(sticker.y + offsetY),
    at: sticker.at + brandAt,
  }));
  const stackTop = rowBox.top;
  const stackBottom = rowBox.bottom + ROW_GAP + (lockupBox.bottom - lockupBox.top);
  const low = stackBottom - frame.height / 2 + MARGIN;
  const high = stackTop + frame.height / 2 - MARGIN;
  const wanted = (stackTop + stackBottom) / 2 - props.brand.lift;
  const cameraY = Math.round(
    low <= high ? Math.min(high, Math.max(low, wanted)) : (low + high) / 2,
  );
  const lockupBoxes = lockup.map((sticker) => ({ sticker, box: boxOf(sticker) }));
  const name = lockup.find((sticker) => sticker.key === 'brand-name') ?? lockup[0];
  const leaving = collage.stickers
    .filter((sticker) => sticker.row !== lastRow)
    .map((sticker) => {
      const box = boxOf(sticker);
      const hits = lockupBoxes.filter((spot) => touches(box, spot.box, CLEARANCE));
      const deadline = Math.min(...hits.map((spot) => spot.sticker.at));
      const distance = name === undefined ? 0 : Math.hypot(sticker.x - name.x, sticker.y - name.y);
      return { key: sticker.key, hit: hits.length > 0, deadline, distance };
    })
    .filter((entry) => entry.hit)
    .sort((a, b) => a.deadline - b.deadline || a.distance - b.distance);
  const exits = new Map(
    leaving.map((entry, rank) => [entry.key, brandAt - EXIT_LEAD + rank * EXIT_STAGGER]),
  );
  const placedRow = new Map(lastRowPlaced.map((sticker) => [sticker.key, sticker]));
  const headline = collage.stickers.map(
    (sticker) =>
      placedRow.get(sticker.key) ?? { ...sticker, exitAt: exits.get(sticker.key) ?? null },
  );
  return { stickers: [...headline, ...lockup], cameraY };
};
