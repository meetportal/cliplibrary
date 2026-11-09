import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { WordPickerProps } from '@/schemas';
import { Backdrop } from './backdrop';
import { Brand } from './brand';
import { bestOn, luminance, readableOn } from './color';
import { FACES, useMeasureWidth } from './fonts';
import { brandLayout, listLayout } from './layout';
import { Bar, Bracket, barBox, Counter } from './selection';
import { brandOpacity, listOffset, listProgress, movesOf, tween } from './timeline';
import { useLogo } from './use-logo';
import { listSlots, WordList } from './word-list';

export const WordPicker = (props: WordPickerProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { colors, selection, type, brand } = props;
  const logo = useLogo(props.logo);
  const faces = useMemo(
    () => [FACES[type.listFont], FACES[type.pickFont], FACES[brand.nameFont]],
    [type.listFont, type.pickFont, brand.nameFont],
  );
  const measure = useMeasureWidth(faces);
  const list = listLayout(props, width, height, measure);
  const brandBox = brandLayout(props, logo?.aspect ?? null, width, height, measure);
  const moves = movesOf(props.steps, props.items.length);
  const offset = listOffset(frame, moves, list.pitch);
  const slots = listSlots(props, list, frame, offset, brandBox.floor);
  const dark = luminance(colors.background) < 0.2;
  const toward = dark ? '#ffffff' : '#000000';
  const pick = readableOn(colors.primary, colors.background, colors.text);
  const accent = readableOn(colors.primary, colors.background, toward, 2.2);
  const bar = selection.style === 'bar';
  const barFill = readableOn(colors.primary, colors.background, toward, 2);
  const onBar = bestOn(barFill, [colors.background, colors.text, '#ffffff', '#0b0b0c']);
  const draw = props.entrance.drawFrames;
  const counterIn = tween(frame, [draw * 0.4, draw * 1.2], [0, 1]);
  const barRect = barBox(list.frame, frame, draw);
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          background={colors.background}
          primary={colors.primary}
          strength={props.glow.strength}
          drift={props.glow.drift}
          frame={frame}
          dark={dark}
        />
      ) : null}
      <Brand
        layout={brandBox}
        src={logo?.src ?? null}
        name={props.companyName}
        font={brand.nameFont}
        text={colors.text}
        surface={colors.surface}
        plate={brand.plate}
        opacity={brandOpacity(frame)}
      />
      {bar ? null : (
        <Bracket
          selection={selection}
          frame={list.frame}
          color={accent}
          time={frame}
          drawFrames={draw}
        />
      )}
      <WordList
        props={props}
        layout={list}
        slots={slots}
        tone={{
          pick: bar ? colors.text : pick,
          near: colors.text,
          far: colors.secondary,
        }}
        only={bar ? 'list' : undefined}
      />
      {bar ? (
        <Bar box={barRect} color={barFill} time={frame} drawFrames={draw}>
          <WordList
            props={props}
            layout={list}
            slots={slots}
            tone={{ pick: onBar, near: onBar, far: onBar }}
            originX={barRect.left}
            originY={barRect.top}
            only="pick"
          />
        </Bar>
      ) : null}
      {selection.counter ? (
        <Counter
          box={list.frame}
          width={list.counterWidth}
          progress={listProgress(frame, moves)}
          total={moves.count + 1}
          color={bar ? onBar : pick}
          muted={bar ? onBar : colors.secondary}
          opacity={counterIn}
          font={type.listFont}
        />
      ) : null}
    </AbsoluteFill>
  );
};
