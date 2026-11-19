import { fitLines, makeSprite, type Sprite, type TextStyle, textWidth } from './sprites';

export const FRAME = { width: 1080, height: 1920, centerX: 540 };

export const MAX_TEXT_WIDTH = 920;

export type Fit = { size: number; lines: string[]; style: TextStyle };

export const fitText = (
  text: string,
  style: TextStyle,
  maxLines: number,
  maxWidth = MAX_TEXT_WIDTH,
): Fit => {
  const fitted = fitLines(text, style, maxWidth, maxLines);
  return { ...fitted, style: { ...style, size: fitted.size } };
};

export type Glyph = { sprite: Sprite; x: number; y: number };

export const glyphRow = (
  text: string,
  style: TextStyle,
  left: number,
  y: number,
  ink: (index: number) => string,
  ratio: number,
  offset: number,
): Glyph[] => {
  const chars = [...text];
  return chars.flatMap((char, index) => {
    if (char === ' ') {
      return [];
    }
    const before = chars.slice(0, index).join('');
    const x = left + (index === 0 ? 0 : textWidth(before, style) + style.tracking * style.size);
    const color = ink(offset + index);
    return [
      {
        sprite: makeSprite(char, style, { fill: color }, ratio, 'left'),
        x,
        y,
      },
    ];
  });
};
