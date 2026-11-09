import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { ComingSoonFlipsProps, FlipWord as FlipWordProps } from '@/schemas';
import { type Face, flickerFace } from './fonts';
import { capTop, fitSize, type Measure } from './measure';

const SIDE = 90;
const START_THICKNESSES = 6;
const MIN_GROWTH = 4;

const faceAt = (
  word: FlipWordProps,
  type: ComingSoonFlipsProps['type'],
  main: Face,
  local: number,
) => {
  if (!word.flicker || type.flickerFonts.length === 0) {
    return main;
  }
  const step = Math.floor(local / Math.max(1, type.flickerHold)) % type.flickerFonts.length;
  return flickerFace(type.flickerFonts[step] ?? 'main', main);
};

export const FlipWord = ({
  props,
  word,
  local,
  length,
  main,
  measure,
  color,
  barColor,
}: {
  props: ComingSoonFlipsProps;
  word: FlipWordProps;
  local: number;
  length: number;
  main: Face;
  measure: Measure;
  color: string;
  barColor: string;
}) => {
  const { width, height } = useVideoConfig();
  const { type, underline } = props;
  const text = word.text.trim();
  if (text === '') {
    return null;
  }
  const letters = [...text].length;
  const maxWidth = width - SIDE * 2;
  const mainBox = measure(text, main);
  const mainSize = fitSize(mainBox, type.size, type.tracking, letters, maxWidth);
  const capHeight = mainBox.cap * mainSize;
  const face = faceAt(word, type, main, local);
  const box = face === main ? mainBox : measure(text, face);
  const matched = box.cap > 0 ? (mainBox.cap * mainSize) / box.cap : mainSize;
  const size = fitSize(box, matched, type.tracking, letters, maxWidth);
  const capY = type.y * height - (box.cap * size) / 2;
  const wordWidth = (mainBox.width + type.tracking * (letters - 1)) * mainSize;
  const shortest = underline.thickness * START_THICKNESSES;
  const start = Math.max(shortest, wordWidth * underline.width * underline.startWidth);
  const full = Math.max(wordWidth * underline.width, start + MIN_GROWTH * length);
  const barWidth = 2 * Math.round((start + ((full - start) * local) / Math.max(1, length)) / 2);
  return (
    <AbsoluteFill>
      {underline.show && barWidth > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: Math.round((width - barWidth) / 2),
            top: Math.round(type.y * height + capHeight / 2 + underline.gap),
            width: barWidth,
            height: underline.thickness,
            backgroundColor: barColor,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: capY - capTop(box, size),
          paddingLeft: `${type.tracking}em`,
          textAlign: 'center',
          fontFamily: face.family,
          fontWeight: face.weight,
          fontSize: size,
          letterSpacing: `${type.tracking}em`,
          lineHeight: 1,
          whiteSpace: 'pre',
          color,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
