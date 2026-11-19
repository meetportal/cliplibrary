import type { FloatingCardsProps } from '@/schemas';
import { drawIcon } from './icons';
import type { CardPalette } from './palette';

export type Card = FloatingCardsProps['cards'][number];

const ICON_GAP = 0.28;
const RIGHT_PAD = 1.5;
const TILE_ROUND = 0.28;
const GLYPH = 0.44;
const LABEL_LINE = 1.25;
const VALUE_LINE = 1.15;
const LINE_GAP = 0.2;
const VALUE_TRACKING = -0.01;
const OVERSAMPLE = 2;
const MARGIN = 2;

export type CardFont = { family: string; label: number; value: number };

export type CardBox = {
  width: number;
  height: number;
  radius: number;
  pad: number;
  tile: number;
  textLeft: number;
  labelSize: number;
  valueSize: number;
  labelLine: number;
  valueLine: number;
  gap: number;
};

export type CardSprite = {
  key: string;
  canvas: HTMLCanvasElement;
  box: CardBox;
  margin: number;
  density: number;
};

const fontSpec = (weight: number, size: number, family: string) =>
  `${weight} ${size.toFixed(3)}px "${family}"`;

const setFont = (context: CanvasRenderingContext2D, spec: string, tracking: number) => {
  context.font = spec;
  context.letterSpacing = `${tracking.toFixed(3)}px`;
};

const textWidth = (
  context: CanvasRenderingContext2D,
  text: string,
  spec: string,
  tracking: number,
) => {
  setFont(context, spec, tracking);
  return context.measureText(text).width;
};

const layoutCard = (
  context: CanvasRenderingContext2D,
  card: Card,
  props: FloatingCardsProps,
  font: CardFont,
): CardBox => {
  const size = props.card.size;
  const pad = props.card.padding * size;
  const tile = props.card.icon * size;
  const textLeft = pad + tile + tile * ICON_GAP;
  const rightPad = pad * RIGHT_PAD;
  const baseLabel = props.type.labelSize * size;
  const baseValue = props.type.valueSize * size;
  const labelWide = textWidth(context, card.label, fontSpec(font.label, baseLabel, font.family), 0);
  const valueWide = textWidth(
    context,
    card.value,
    fontSpec(font.value, baseValue, font.family),
    baseValue * VALUE_TRACKING,
  );
  const textWide = Math.max(1, labelWide, valueWide);
  const widest = Math.max(props.card.maxWidth, props.card.minWidth) * size;
  const fit = Math.min(1, Math.max(1, widest - textLeft - rightPad) / textWide);
  const labelSize = baseLabel * fit;
  const valueSize = baseValue * fit;
  const labelLine = labelSize * LABEL_LINE;
  const valueLine = valueSize * VALUE_LINE;
  const gap = labelSize * LINE_GAP;
  const width = Math.min(
    widest,
    Math.max(props.card.minWidth * size, textLeft + textWide * fit + rightPad),
  );
  const height = Math.max(tile, labelLine + gap + valueLine) + pad * 2;
  return {
    width,
    height,
    radius: Math.min(props.card.radius * size, height / 2),
    pad,
    tile,
    textLeft,
    labelSize,
    valueSize,
    labelLine,
    valueLine,
    gap,
  };
};

const writeLine = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  top: number,
  line: number,
) => {
  const metrics = context.measureText(text);
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  context.fillText(text, x, top + (line - ascent - descent) / 2 + ascent);
};

export const platePath = (context: CanvasRenderingContext2D, box: CardBox) => {
  context.beginPath();
  context.roundRect(-box.width / 2, -box.height / 2, box.width, box.height, box.radius);
};

const paintFace = (
  context: CanvasRenderingContext2D,
  card: Card,
  box: CardBox,
  palette: CardPalette,
  font: CardFont,
) => {
  const tone = palette.tones[card.tone];
  const left = -box.width / 2;
  context.fillStyle = palette.surface;
  platePath(context, box);
  context.fill();
  const tileLeft = left + box.pad;
  context.fillStyle = tone.tile;
  context.beginPath();
  context.roundRect(tileLeft, -box.tile / 2, box.tile, box.tile, box.tile * TILE_ROUND);
  context.fill();
  drawIcon(context, card.icon, tileLeft + box.tile / 2, 0, box.tile * GLYPH, tone.icon);
  const textX = left + box.textLeft;
  const blockTop = -(box.labelLine + box.gap + box.valueLine) / 2;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = palette.label;
  setFont(context, fontSpec(font.label, box.labelSize, font.family), 0);
  writeLine(context, card.label, textX, blockTop, box.labelLine);
  context.fillStyle = card.highlight ? tone.highlight : palette.value;
  setFont(
    context,
    fontSpec(font.value, box.valueSize, font.family),
    box.valueSize * VALUE_TRACKING,
  );
  writeLine(context, card.value, textX, blockTop + box.labelLine + box.gap, box.valueLine);
};

export const cardSprite = (
  measure: CanvasRenderingContext2D,
  card: Card,
  props: FloatingCardsProps,
  palette: CardPalette,
  font: CardFont,
  ratio: number,
  previous: CardSprite | undefined,
): CardSprite => {
  const key = JSON.stringify([card, props.type, props.card, palette, font, ratio]);
  if (previous?.key === key) {
    return previous;
  }
  const box = layoutCard(measure, card, props, font);
  const density = ratio * OVERSAMPLE;
  const canvas = previous?.canvas ?? document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil((box.width + MARGIN * 2) * density));
  canvas.height = Math.max(1, Math.ceil((box.height + MARGIN * 2) * density));
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(
      density,
      0,
      0,
      density,
      (box.width / 2 + MARGIN) * density,
      (box.height / 2 + MARGIN) * density,
    );
    paintFace(context, card, box, palette, font);
  }
  return { key, canvas, box, margin: MARGIN, density };
};
