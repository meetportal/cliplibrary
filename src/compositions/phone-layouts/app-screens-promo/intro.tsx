import { Easing } from 'remotion';
import type { AppScreensPromoProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import { fitText } from './fit-text';
import { DISPLAY_FACES } from './fonts';
import type { Palette } from './palette';
import { pixelTween } from './pixel-tween';
import { Tile, tileShape } from './tile';
import { INTRO, lerp, liftOff, progress, settle, smooth, TEXT_IN, TEXT_OUT } from './timeline';

const SAFE_WIDTH = 1640;
const GAP = 110;
const MIN_LEFT = 140;
const TILE_SHARE = 0.45;
const FIRST_OPACITY = 0.35;

export const Intro = ({
  props,
  palette,
  logo,
  frame,
  ready,
}: {
  props: AppScreensPromoProps;
  palette: Palette;
  logo: LogoBox | null;
  frame: number;
  ready: boolean;
}) => {
  if (frame > INTRO.tileOut + 34) {
    return null;
  }
  const natural = tileShape(logo, props.tile.size);
  const fit = Math.min(1, (SAFE_WIDTH * TILE_SHARE) / natural.width);
  const shape = { width: natural.width * fit, height: natural.height * fit };
  const tileSpan = shape.width * 1.06;
  const font = DISPLAY_FACES[props.type.font];
  const name = fitText(props.companyName, font, ready, {
    maxSize: props.type.nameSize,
    maxLines: 2,
    width: SAFE_WIDTH - GAP - tileSpan,
  });
  const total = name.width + GAP + tileSpan;
  const left = Math.max(MIN_LEFT, (1920 - total) / 2);
  const enter = progress(frame, INTRO.tileIn, INTRO.tileInFrames, Easing.out(Easing.cubic));
  const lift = progress(frame, INTRO.tileOut, 30, liftOff);
  const tilt = props.tile.tilt;
  const creep = frame / (INTRO.tileOut + 30);
  const rotateY = lerp(88, tilt + 10, enter) - 20 * creep + 18 * lift;
  const rotateZ = lerp(-15, -8, enter) + 10 * creep;
  const turn = Math.cos((rotateY * Math.PI) / 180);
  const skew = 7 * Math.sin((rotateY * Math.PI) / 180);
  const bob = 16 * Math.sin((frame - INTRO.tileInFrames) / 15) * enter;
  const tileY = 540 - shape.height / 2 + bob - (540 + shape.height) * 1.15 * lift;
  const nameIn = progress(frame, INTRO.nameIn, TEXT_IN, settle);
  const nameOpacity =
    progress(frame, INTRO.nameIn, TEXT_IN * 0.7, smooth) *
    (1 - progress(frame, INTRO.nameOut, TEXT_OUT, smooth));
  const rise = pixelTween(frame, [INTRO.nameIn, INTRO.nameIn + TEXT_IN], [44, 0], settle);
  const leave = pixelTween(frame, [INTRO.nameOut, INTRO.nameOut + TEXT_OUT], [0, -22], liftOff);
  const lineHeight = Math.round(name.size * 1.06);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left,
          top: Math.round(540 - (name.lines.length * lineHeight) / 2) + rise + leave,
          width: Math.ceil(name.width) + 8,
          fontFamily: font.family,
          fontWeight: font.weight,
          fontSize: name.size,
          lineHeight: `${lineHeight}px`,
          letterSpacing: `${font.tracking}em`,
          color: palette.text,
          opacity: nameOpacity * (nameIn > 0 ? 1 : 0),
          whiteSpace: 'pre',
        }}
      >
        {name.lines.join('\n')}
      </div>
      <div
        style={{
          position: 'absolute',
          left: left + name.width + GAP + (tileSpan - shape.width) / 2,
          top: 0,
          opacity: lerp(FIRST_OPACITY, 1, progress(frame, INTRO.tileIn, 12, smooth)),
          transform: `translateY(${tileY}px) rotate(${rotateZ}deg) skewY(${-skew}deg) scaleX(${turn}) scale(${lerp(0.84, 1, enter) + 0.1 * creep})`,
        }}
      >
        <Tile props={props} palette={palette} logo={logo} shape={shape} />
      </div>
    </>
  );
};
