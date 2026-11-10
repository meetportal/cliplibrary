import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { GoldMonogramInviteProps } from '@/schemas';
import { Backdrop } from './backdrop';
import { edgeOf, goldTones, mix } from './color';
import { Details, rowEntrance } from './details';
import { Dust } from './dust';
import { SCRIPT_FACES, SERIF_FACES, useInviteFontsReady } from './fonts';
import { buildStack, type Column, placeStack } from './layout';
import { LogoPlate, logoBox } from './logo-plate';
import { Mandala } from './mandala';
import { canvasMeasurer, fitLine, glyphMiddle } from './measure';
import { Monogram } from './monogram';
import { CORE_RINGS } from './patterns';
import { glide, pixelTween, ramp } from './timeline';
import { useLogo } from './use-logo';

const SPLIT_HERO_X = 580;
const SPLIT_COLUMN: Column = { centerX: 1420, width: 700 };
const CARD_COLUMN: Column = { centerX: 960, width: 860 };
const MANDALA_START = -12;
const HEART_LIFT = 1.14;
const CARD_GAP = 40;
const FALLBACK_MIDDLE = 0.35;
const LIGHT_FLOOR = 0.4;
const LIGHT_UP = 30;
const lightCurve = (t: number) => 1 - (1 - t) ** 1.6;

const monogramLetters = (props: GoldMonogramInviteProps) => {
  const custom = [...props.monogramLetters.trim()].slice(0, 3).join('');
  if (custom !== '') {
    return custom;
  }
  return [props.partnerOne, props.partnerTwo]
    .map((name) => [...name.trim()][0] ?? '')
    .join('')
    .toUpperCase();
};

export const GoldMonogramInvite = (props: GoldMonogramInviteProps) => {
  const frame = useCurrentFrame();
  const fontsReady = useInviteFontsReady(props.type.script, props.type.serif);
  const logo = useLogo(props.logo);
  const gold = goldTones(props.colors.primary);
  const script = SCRIPT_FACES[props.type.script];
  const serif = SERIF_FACES[props.type.serif];
  const twin = props.layout === 'twin-mandalas';
  const column = twin ? CARD_COLUMN : SPLIT_COLUMN;
  const box = logoBox(logo, props.logoPlate.width, props.logoPlate.height, props.logoPlate.plate);
  const logoHeight = box === null ? null : box.height + box.padding * 2;
  const measure = useMemo(() => canvasMeasurer(fontsReady), [fontsReady]);
  const stack = buildStack(props, measure, script, serif, column, logoHeight);
  const ringRadius = props.monogram.size * 0.92;
  const letters = monogramLetters(props);
  const letterSize = Math.min(
    props.monogram.size,
    fitLine(measure, letters, serif.strong, 0, props.monogram.size, ringRadius * 1.45),
  );
  const middle = useMemo(
    () => glyphMiddle(fontsReady, letters, serif.strong),
    [fontsReady, letters, serif.strong],
  );
  const letterBaseline = Math.round((middle ?? FALLBACK_MIDDLE) * letterSize);
  const cardHeight = ringRadius * (1 + HEART_LIFT) + CARD_GAP + stack.height;
  const cardTop = Math.max(36, (1080 - cardHeight) / 2);
  const heroY = twin ? Math.round(cardTop + ringRadius * HEART_LIFT) : 540;
  const heroX =
    props.layout === 'center-then-aside'
      ? pixelTween(
          frame,
          [props.reveal.glideAt, props.reveal.glideAt + props.reveal.glideFrames],
          960,
          SPLIT_HERO_X,
          glide,
        )
      : twin
        ? 960
        : SPLIT_HERO_X;
  const stackTop = twin ? heroY + ringRadius + CARD_GAP : Math.max(48, 540 - stack.height / 2);
  const rows = placeStack(stack, stackTop);
  const base =
    props.layout === 'center-then-aside' ? props.reveal.glideAt + 14 : props.reveal.start;
  const startOf = (order: number) => base + order * props.reveal.stagger;
  const angle = (frame * props.mandala.spin) / 30;
  const timing = {
    start: MANDALA_START - (twin ? CORE_RINGS * props.mandala.ringGap : 0),
    gap: props.mandala.ringGap,
    draw: props.mandala.ringDraw,
  };
  const mandala = (center: [number, number], mirror: boolean, withCore: boolean, key: string) => (
    <Mandala
      key={key}
      pattern={props.mandala.pattern}
      radius={props.mandala.size}
      withCore={withCore}
      center={center}
      frame={frame}
      timing={timing}
      angle={angle}
      mirror={mirror}
      gold={gold}
      lineWidth={props.mandala.lineWidth}
    />
  );
  const logoRow = rows.find((row) => row.kind === 'logo');
  const edgeOffset = props.mandala.size * 0.12;
  const edge = edgeOf(props.colors.background);
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          center={mix(
            edge,
            props.colors.background,
            LIGHT_FLOOR + (1 - LIGHT_FLOOR) * ramp(frame, 0, LIGHT_UP, lightCurve),
          )}
          edge={edge}
        />
      ) : null}
      {twin
        ? [
            mandala([-edgeOffset, 540], false, true, 'left'),
            mandala([1920 + edgeOffset, 540], true, true, 'right'),
          ]
        : mandala([heroX, heroY], false, false, 'hero')}
      <Dust
        count={props.dust.count}
        size={props.dust.size}
        rise={props.dust.rise}
        frame={frame}
        gold={gold}
      />
      <Monogram
        look={{
          letters,
          fontSize: letterSize,
          baseline: letterBaseline,
          ringRadius,
          heart: props.monogram.heart,
          fillAt: props.monogram.fillAt,
          glintAt: props.monogram.glintAt,
        }}
        face={serif.strong}
        center={[heroX, heroY]}
        frame={frame}
        gold={gold}
        background={props.showBackground ? props.colors.background : null}
      />
      <Details
        rows={rows}
        column={column}
        frame={frame}
        startOf={startOf}
        script={script}
        serif={serif}
        gold={gold}
        text={props.colors.text}
      />
      {logoRow !== undefined && box !== null ? (
        <LogoPlate
          logo={logo}
          box={box}
          centerX={column.centerX}
          top={logoRow.top + rowEntrance(frame, startOf(logoRow.order)).rise}
          opacity={rowEntrance(frame, startOf(logoRow.order)).opacity}
          plate={props.logoPlate.plate}
          surface={props.colors.surface}
          gold={gold}
        />
      ) : null}
    </AbsoluteFill>
  );
};
