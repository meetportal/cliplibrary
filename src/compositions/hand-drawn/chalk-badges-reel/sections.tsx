import type { ChalkBadgesReelProps } from '@/schemas';
import { pulse, type ReelPalette } from './badges';
import { ChalkText, DrawPath, Sparkle } from './chalk';
import type { Measure, ReelFaceKey } from './fonts';
import { captionStroke, endStroke, openerStrokes } from './timeline';
import type { ReelLogo } from './use-logo';

export const CENTER_X = 960;

type SectionKit = {
  prefix: string;
  frame: number;
  palette: ReelPalette;
  measure: Measure;
  ornaments: boolean;
  twinkle: number;
};

const sized = (
  measure: Measure,
  text: string,
  face: ReelFaceKey,
  base: number,
  max: number,
  tracking = 0,
) => {
  const unit = Math.max(0.01, measure(text, face, tracking));
  const size = Math.min(base, max / unit);
  return { size, width: unit * size };
};

export const Opener = (props: { kit: SectionKit; left: string; right: string }) => {
  const { kit } = props;
  const strokes = openerStrokes(kit.frame);
  const y = 560;
  const amp = sized(kit.measure, '&', 'serif', 236, 240);
  const gap = amp.width / 2 + 44;
  const left = sized(kit.measure, props.left, 'script', 128, CENTER_X - gap - 110);
  const right = sized(kit.measure, props.right, 'script', 128, CENTER_X - gap - 110);
  const sparkles = [
    { x: -46, y: -150, size: 15, phase: 0 },
    { x: 0, y: -176, size: 22, phase: 2.1 },
    { x: 46, y: -150, size: 15, phase: 4.2 },
  ];
  return (
    <g>
      <ChalkText
        id={`${kit.prefix}-opener-left`}
        text={props.left}
        face="script"
        size={left.size}
        width={left.width}
        x={CENTER_X - gap}
        y={y}
        anchor="end"
        stroke={strokes.left}
        fill={kit.palette.chalk}
      />
      <ChalkText
        id={`${kit.prefix}-opener-amp`}
        text="&"
        face="serif"
        size={amp.size}
        width={amp.width}
        x={CENTER_X}
        y={y + 6}
        stroke={strokes.amp}
        fill={kit.palette.chalk}
      />
      <ChalkText
        id={`${kit.prefix}-opener-right`}
        text={props.right}
        face="script"
        size={right.size}
        width={right.width}
        x={CENTER_X + gap}
        y={y}
        anchor="start"
        stroke={strokes.right}
        fill={kit.palette.chalk}
      />
      {kit.ornaments
        ? sparkles.map((sparkle) => (
            <Sparkle
              key={sparkle.phase}
              x={CENTER_X + sparkle.x}
              y={y + sparkle.y}
              size={sparkle.size}
              color={kit.palette.accent}
              stroke={strokes.sparkles}
              pulse={pulse(kit, sparkle.phase)}
            />
          ))
        : null}
    </g>
  );
};

export const Caption = (props: { kit: SectionKit; text: string }) => {
  const fit = sized(props.kit.measure, props.text, 'heavy', 40, 1200, 0.2);
  return (
    <ChalkText
      id={`${props.kit.prefix}-caption`}
      text={props.text}
      face="heavy"
      size={fit.size}
      width={fit.width}
      x={CENTER_X}
      y={88}
      tracking={0.2}
      stroke={captionStroke(props.kit.frame)}
      fill={props.kit.palette.chalk}
    />
  );
};

export const LOGO_Y = 250;

export type LogoBox = { width: number; height: number; padding: number };

export const logoBox = (logo: ReelLogo, height: number): LogoBox | null => {
  if (logo === null) {
    return null;
  }
  const tall = logo.aspect < 1.5 ? height * 1.3 : height;
  const width = Math.min(tall * logo.aspect, height * 3.4);
  return { width, height: width / logo.aspect, padding: Math.round(height * 0.2) };
};

export const logoReveal = (frame: number, eraseAtEnd: boolean) => {
  const { write, erase } = endStroke(frame, 'logo', eraseAtEnd);
  const grow = 1 - (1 - write) ** 3;
  return {
    scale: (0.86 + 0.14 * grow) * (1 - 0.12 * erase ** 2),
    opacity: Math.min(1, write * 4) * (1 - erase),
  };
};

export const LogoPlate = (props: {
  box: LogoBox;
  color: string;
  frame: number;
  eraseAtEnd: boolean;
}) => {
  const { box } = props;
  const reveal = logoReveal(props.frame, props.eraseAtEnd);
  if (reveal.opacity <= 0.001) {
    return null;
  }
  const w = box.width + box.padding * 2;
  const h = box.height + box.padding * 2;
  return (
    <g
      transform={`translate(${CENTER_X} ${LOGO_Y}) scale(${reveal.scale.toFixed(4)})`}
      opacity={reveal.opacity}
    >
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={w / h < 1.3 ? h * 0.3 : Math.min(28, h / 4)}
        fill={props.color}
      />
    </g>
  );
};

export const EndCardText = (props: {
  kit: SectionKit;
  endCard: ChalkBadgesReelProps['endCard'];
  scale: number;
  eraseAtEnd: boolean;
}) => {
  const { kit, endCard, scale } = props;
  const stroke = (key: Parameters<typeof endStroke>[1]) =>
    endStroke(kit.frame, key, props.eraseAtEnd);
  const one = sized(kit.measure, endCard.lineOne, 'chunky', 98 * scale, 1300);
  const two = sized(kit.measure, endCard.lineTwo, 'chunky', 172 * scale, 1560);
  const tag = sized(kit.measure, endCard.tagline, 'chunky', 88 * scale, 1300);
  const web = sized(kit.measure, endCard.website, 'chunky', 64 * scale, 1160, 0.02);
  const rows = [one.size * 1.05, two.size * 1.02, tag.size * 1.1, web.size * 1.25];
  const total = rows.reduce((sum, row) => sum + row, 0);
  const top = 652 - total / 2;
  const at = (index: number) =>
    top + rows.slice(0, index).reduce((sum, row) => sum + row, 0) + (rows[index] ?? 0) / 2;
  const underlineY = at(3) + web.size * 0.62;
  const half = web.width / 2;
  return (
    <g>
      <ChalkText
        id={`${kit.prefix}-end-one`}
        text={endCard.lineOne}
        face="chunky"
        size={one.size}
        width={one.width}
        x={CENTER_X}
        y={at(0)}
        stroke={stroke('lineOne')}
        fill={kit.palette.accent}
        shadow={kit.palette.shadow}
      />
      <ChalkText
        id={`${kit.prefix}-end-two`}
        text={endCard.lineTwo}
        face="chunky"
        size={two.size}
        width={two.width}
        x={CENTER_X}
        y={at(1)}
        stroke={stroke('lineTwo')}
        fill={kit.palette.accent}
        shadow={kit.palette.shadow}
      />
      <ChalkText
        id={`${kit.prefix}-end-tag`}
        text={endCard.tagline}
        face="chunky"
        size={tag.size}
        width={tag.width}
        x={CENTER_X}
        y={at(2)}
        stroke={stroke('tagline')}
        fill={kit.palette.accent}
        shadow={kit.palette.shadow}
      />
      <ChalkText
        id={`${kit.prefix}-end-web`}
        text={endCard.website}
        face="chunky"
        size={web.size}
        width={web.width}
        x={CENTER_X}
        y={at(3)}
        tracking={0.02}
        stroke={stroke('website')}
        fill={kit.palette.chalk}
        shadow={kit.palette.shadow}
      />
      <DrawPath
        d={`M${CENTER_X - half - 10} ${underlineY + 2} Q${CENTER_X} ${underlineY - 5} ${CENTER_X + half + 10} ${underlineY}`}
        stroke={stroke('underline')}
        color={kit.palette.primaryLine}
        width={Math.max(6, web.size * 0.14)}
      />
    </g>
  );
};
