import type { AppScreensPromoProps } from '@/schemas';
import { PHONE_HEIGHT, PHONE_WIDTH, type PhonePose } from './phone';
import {
  END,
  END_TEXT_LEFT,
  EXIT_FRAMES,
  FAN,
  FEATURE_1,
  FEATURE_2,
  glide,
  lerp,
  liftOff,
  progress,
} from './timeline';

type ScreenKey = 'screen1' | 'screen2' | 'screen3';

type Rest = { x: number; y: number; rotate: number; scale: number };

type PhoneSpec = {
  key: string;
  screen: ScreenKey;
  start: number;
  frames: number;
  rest: Rest;
  from: Partial<Rest>;
  slide: { start: number; frames: number; x: number; rotate: number } | null;
  exit: number | null;
  phase: number;
};

const FRAME_HEIGHT = 1080;
const LAST_FRAME = 449;
const EDGE_MARGIN = 24;
const END_TEXT_GAP = 50;
const HOLD_DRIFT = 0.3;
const SWAY = 0.8 / 7;
const END_FRONT_SCALE = 1.26;
const END_BACK_SCALE = 1.12;

const holdOffset = (spec: PhoneSpec, frame: number, float: number) =>
  -float * Math.sin((frame - spec.start - spec.frames) / 26) - HOLD_DRIFT * (frame - spec.start);

const fitRest = (spec: PhoneSpec, float: number): Rest => {
  const { rest } = spec;
  const angle = ((Math.abs(rest.rotate) + SWAY * float) * Math.PI) / 180;
  const half = (PHONE_HEIGHT * Math.cos(angle) + PHONE_WIDTH * Math.sin(angle)) / 2;
  const holdEnd = spec.exit ?? LAST_FRAME;
  let high = Number.POSITIVE_INFINITY;
  let low = Number.NEGATIVE_INFINITY;
  for (let frame = spec.start + spec.frames; frame <= holdEnd; frame += 1) {
    const offset = holdOffset(spec, frame, float);
    high = Math.min(high, offset);
    low = Math.max(low, offset);
  }
  const top = EDGE_MARGIN - high;
  const bottom = FRAME_HEIGHT - EDGE_MARGIN - low;
  const scale = Math.min(rest.scale, (bottom - top) / (2 * half));
  const y = Math.min(Math.max(rest.y, top + half * scale), bottom - half * scale);
  return { ...rest, y, scale };
};

const below = (scale: number, y: number) =>
  FRAME_HEIGHT + (PHONE_HEIGHT / 2) * scale * 1.15 + 60 - y;

const above = (scale: number, y: number) => y + (PHONE_HEIGHT / 2) * scale * 1.2 + 140;

export const phoneSpecs = ({ phones, timing }: AppScreensPromoProps): PhoneSpec[] => {
  const size = phones.size;
  const rise = timing.riseFrames;
  const tilt = phones.tilt;
  const spread = phones.fanSpread;
  const spec = (
    key: string,
    screen: ScreenKey,
    rest: Rest,
    options: Partial<Omit<PhoneSpec, 'key' | 'screen' | 'rest'>> & { start: number },
  ): PhoneSpec => {
    const wanted: PhoneSpec = {
      key,
      screen,
      rest: { ...rest, scale: rest.scale * size },
      frames: rise,
      from: {},
      slide: null,
      exit: null,
      phase: 0,
      ...options,
    };
    return { ...wanted, rest: fitRest(wanted, phones.float) };
  };
  const besideEndText = (phone: PhoneSpec): PhoneSpec => ({
    ...phone,
    rest: {
      ...phone.rest,
      x: Math.min(
        phone.rest.x,
        END_TEXT_LEFT - END_TEXT_GAP - (PHONE_WIDTH / 2) * phone.rest.scale,
      ),
    },
  });
  const endFront = besideEndText(
    spec(
      'end-front',
      'screen1',
      { x: 640, y: 575, rotate: 0, scale: END_FRONT_SCALE },
      {
        start: END.rise,
        from: { rotate: 4 },
        phase: 8,
      },
    ),
  );
  const endBack = spec(
    'end-back',
    'screen2',
    {
      x: 380,
      y: 485,
      rotate: 0,
      scale: Math.min(
        END_BACK_SCALE,
        (endFront.rest.scale / size) * (END_BACK_SCALE / END_FRONT_SCALE),
      ),
    },
    {
      start: END.rise,
      frames: rise - 6,
      from: { rotate: -4 },
      phase: 7,
    },
  );
  const fanSlide = { start: FAN.slide, frames: FAN.slideFrames, x: 960, rotate: 0 };
  return [
    spec(
      'fan-left',
      'screen2',
      { x: 960 - spread, y: 560, rotate: -tilt * 0.45, scale: 1.1 },
      {
        start: FAN.rise,
        slide: fanSlide,
        exit: FAN.exit + 4,
        phase: 1,
      },
    ),
    spec(
      'fan-right',
      'screen3',
      { x: 960 + spread, y: 560, rotate: tilt * 0.45, scale: 1.1 },
      {
        start: FAN.rise,
        slide: fanSlide,
        exit: FAN.exit + 4,
        phase: 2,
      },
    ),
    spec(
      'fan-center',
      'screen1',
      { x: 960, y: 540, rotate: 0, scale: 1.28 },
      {
        start: FAN.rise,
        exit: FAN.exit,
        phase: 0,
      },
    ),
    spec(
      'one-back',
      'screen3',
      { x: 1235, y: 470, rotate: tilt, scale: 0.94 },
      {
        start: FEATURE_1.rise,
        frames: rise - 6,
        from: { rotate: tilt + 5 },
        exit: FEATURE_1.exit,
        phase: 3,
      },
    ),
    spec(
      'one-front',
      'screen2',
      { x: 1525, y: 600, rotate: tilt, scale: 1.12 },
      {
        start: FEATURE_1.rise,
        from: { rotate: tilt + 4 },
        exit: FEATURE_1.exit + 4,
        phase: 4,
      },
    ),
    spec(
      'two-back',
      'screen1',
      { x: 690, y: 470, rotate: -tilt, scale: 0.94 },
      {
        start: FEATURE_2.rise,
        frames: rise - 6,
        from: { rotate: -tilt - 5 },
        exit: FEATURE_2.exit + 4,
        phase: 5,
      },
    ),
    spec(
      'two-front',
      'screen3',
      { x: 400, y: 600, rotate: -tilt, scale: 1.12 },
      {
        start: FEATURE_2.rise,
        frames: rise + 8,
        from: { x: 540, rotate: -tilt * 0.3, scale: 1.9 * size },
        exit: FEATURE_2.exit,
        phase: 6,
      },
    ),
    endBack,
    endFront,
  ];
};

export const phoneVisible = (spec: PhoneSpec, frame: number) =>
  frame >= spec.start && (spec.exit === null || frame <= spec.exit + EXIT_FRAMES);

export const phonePose = (
  spec: PhoneSpec,
  frame: number,
  float: number,
): PhonePose & { screen: ScreenKey } => {
  const enter = progress(frame, spec.start, spec.frames, glide);
  const fromScale = spec.from.scale ?? spec.rest.scale;
  const fromY = spec.rest.y + below(fromScale, spec.rest.y);
  const slide =
    spec.slide === null ? 1 : progress(frame, spec.slide.start, spec.slide.frames, glide);
  const fromX = spec.slide?.x ?? spec.from.x ?? spec.rest.x;
  const fromRotate = spec.slide?.rotate ?? spec.from.rotate ?? spec.rest.rotate;
  const moveX = spec.slide === null ? enter : slide;
  const lift = spec.exit === null ? 0 : progress(frame, spec.exit, EXIT_FRAMES, liftOff);
  const drift = holdOffset(spec, frame, float);
  const sway = SWAY * float * Math.sin((frame + spec.phase * 23) / 40);
  const scale = lerp(fromScale, spec.rest.scale, enter) * (1 + 0.06 * lift);
  return {
    screen: spec.screen,
    x: lerp(fromX, spec.rest.x, moveX),
    y: lerp(fromY, spec.rest.y, enter) + drift - above(scale, spec.rest.y) * lift,
    rotate:
      lerp(fromRotate, spec.rest.rotate, moveX) + sway + lift * 3 * Math.sign(spec.rest.rotate),
    scale,
  };
};
