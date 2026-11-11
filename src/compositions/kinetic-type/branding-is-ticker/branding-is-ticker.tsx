import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandingIsTickerProps } from '@/schemas';
import { usableImage, useLogoAspect } from '../../brand/app-icon-reveal/use-logo-aspect';
import { lerp, ramp } from '../../kit/motion';
import { resolveCustom } from '../../kit/resolve-custom';
import { Glow } from './backdrop';
import { EndCard, type EndInks } from './end-card';
import { faceStyle, HEADLINE_FACES, useMeasure, WORD_FACES } from './fonts';
import { gradientStops, hueTint, inkOn, legible, mixOklab } from './ink';
import { LogoImage, tileSize } from './logo-tile';
import { Ticker } from './ticker';
import { buildTimeline, swell } from './timeline';

const RIGHT_MARGIN = 60;
const LEADING = 1.1;
const NAME_TRACKING = 0.1;
const TICKER_DROP = 37;
const TILE_RADIUS = 0.24;
const TILE_WIDEST = 3;
const CARD_RADIUS = 64;

const fitSize = (preferred: number, perSize: number, room: number) =>
  perSize > 0 ? Math.min(preferred, Math.floor(room / perSize)) : preferred;

export const BrandingIsTicker = (props: BrandingIsTickerProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const { colors, layout, type } = props;
  const words = props.words.map((word) => word.trim()).filter((word) => word !== '');
  const list = words.length > 0 ? words : [''];
  const line = useMemo(() => buildTimeline(props, list.length), [props, list.length]);
  const headFace = HEADLINE_FACES[type.headlineFont];
  const faces = WORD_FACES[type.wordFont];
  const measure = useMeasure([headFace, faces.bold, faces.medium]);
  const logo = usableImage(props.logo) ? resolveCustom(props.logo) : null;
  const aspect = useLogoAspect(props.logo);
  const room = width - layout.left - RIGHT_MARGIN;
  const wordSize = fitSize(
    type.wordSize,
    Math.max(0, ...list.map((word) => measure(`${word},`, faces.bold))),
    room,
  );
  const lines = props.headline
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item !== '');
  const headSize = fitSize(
    type.headlineSize,
    Math.max(0, ...lines.map((item) => measure(item, headFace))),
    room,
  );
  const tickerTop = Math.round(height / 2 + layout.offsetY + TICKER_DROP);
  const headStep = Math.round(headSize * LEADING);
  const headTop = tickerTop - Math.round(wordSize * 0.19) - lines.length * headStep;
  const name = props.companyName.trim().toUpperCase();
  const nameSize = fitSize(layout.nameSize, measure(name, faces.bold, NAME_TRACKING), room);
  const tile = tileSize(layout.tileSize, aspect, layout.tileSize * TILE_WIDEST);
  const active = legible(colors.primary, colors.background, 4.5);
  const dim = mixOklab(colors.background, colors.text, props.ticker.dimStrength);
  const gradient = gradientStops(colors.primary);
  const ink = legible(colors.ink, colors.surface, 4.5);
  const plate = mixOklab(colors.surface, '#ffffff', 0.7);
  const chipFill = hueTint(plate, colors.primary, 0.03, 0.42);
  const inks: EndInks = {
    ink,
    plate,
    gradient,
    buttonInk: inkOn(mixOklab(gradient[0], gradient[1], 0.5), colors.surface, ink),
    chipFill,
    chipInk: legible(gradient[0], chipFill, 3),
  };
  const grow = ramp(frame, line.growStart, line.growEnd, swell);
  const stageFade = 1 - ramp(frame, line.growStart, line.growStart + 12);
  const nameFade = 1 - ramp(frame, line.cycleEnd - 4, line.cycleEnd + 6);
  const logoFade = 1 - ramp(frame, line.cycleEnd - 2, line.cycleEnd + 8);
  const box = {
    left: lerp(layout.left, 0, grow),
    top: lerp(layout.top, 0, grow),
    width: lerp(tile.width, width, grow),
    height: lerp(tile.height, height, grow),
    radius: lerp(tile.height * TILE_RADIUS, CARD_RADIUS, Math.min(1, grow * 1.6)) * (1 - grow ** 5),
  };
  const turn = (2 * Math.PI * frame) / durationInFrames;
  const glowIn = ramp(frame, line.growStart + 6, line.growEnd + 12);
  const covered = grow >= 1;
  return (
    <AbsoluteFill>
      {props.showBackground && !covered ? (
        <Glow
          center={colors.background}
          edge={colors.backgroundEdge}
          width={width}
          height={height}
          focusX={width * 0.5 + layout.lightDrift * Math.sin(turn)}
          focusY={height * 0.46 + layout.lightDrift * 0.8 * (Math.cos(turn) - 1)}
          radius={width * 0.78}
        />
      ) : null}
      {covered ? null : (
        <AbsoluteFill style={{ opacity: stageFade }}>
          {lines.map((text, index) => (
            <div
              key={`${index}-${text}`}
              style={{
                position: 'absolute',
                left: layout.left,
                top: headTop + index * headStep,
                ...faceStyle(headFace),
                fontSize: headSize,
                lineHeight: `${headSize}px`,
                whiteSpace: 'nowrap',
                color: colors.text,
              }}
            >
              {text}
            </div>
          ))}
          <Ticker
            frame={frame}
            layout={{
              words: list,
              face: faces.bold,
              size: wordSize,
              slotX: layout.left,
              top: tickerTop,
              width,
            }}
            line={line}
            measure={measure}
            glideShare={props.ticker.glide}
            active={active}
            dim={dim}
            underline={props.ticker.underline}
          />
        </AbsoluteFill>
      )}
      {name === '' || nameFade <= 0 ? null : (
        <div
          style={{
            position: 'absolute',
            left: layout.left,
            top: layout.top + tile.height + Math.round(nameSize * 0.7),
            ...faceStyle(faces.bold),
            fontSize: nameSize,
            lineHeight: `${nameSize}px`,
            letterSpacing: `${NAME_TRACKING}em`,
            whiteSpace: 'nowrap',
            color: colors.text,
            opacity: nameFade,
          }}
        >
          {name}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: Math.round(box.left),
          top: Math.round(box.top),
          width: Math.round(box.width),
          height: Math.round(box.height),
          borderRadius: box.radius,
          overflow: 'hidden',
          backgroundColor: colors.surface,
        }}
      >
        {logoFade > 0 ? (
          <LogoImage src={logo} aspect={aspect} box={tile} opacity={logoFade} />
        ) : null}
        {glowIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: -Math.round(box.left),
              top: -Math.round(box.top),
              width,
              height,
            }}
          >
            <Glow
              center={hueTint(colors.surface, colors.primary, 0.035, 0.62)}
              edge={colors.surface}
              width={width}
              height={height}
              focusX={width * 0.5 + layout.lightDrift * 1.8 * Math.sin(turn * 2)}
              focusY={height * 0.42 + layout.lightDrift * 1.8 * Math.cos(turn * 2)}
              radius={width * 0.72}
              opacity={glowIn}
            />
            {frame >= line.entryStart ? (
              <EndCard
                frame={frame}
                line={line}
                props={props}
                measure={measure}
                faces={faces}
                logo={logo}
                aspect={aspect}
                inks={inks}
                width={width}
                height={height}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
