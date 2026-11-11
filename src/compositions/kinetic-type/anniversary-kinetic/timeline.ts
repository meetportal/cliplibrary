import type { AnniversaryKineticProps } from '@/schemas';

export type Stage = 'dark' | 'deep' | 'surface' | 'plum';

export type BeatKind =
  | 'glitch'
  | 'wave'
  | 'whip'
  | 'news'
  | 'shrink'
  | 'rise'
  | 'drop'
  | 'cascade'
  | 'blur'
  | 'type'
  | 'sweep'
  | 'stack'
  | 'track'
  | 'number'
  | 'band'
  | 'slab'
  | 'collapse'
  | 'flash'
  | 'wipe';

type FontRole = 'word' | 'wide' | 'value' | 'number';

type Texture = 'none' | 'streaks' | 'noise';

export type Beat = {
  text: string;
  kind: BeatKind;
  stage: Stage;
  font: FontRole;
  texture: Texture;
  giant: 'none' | 'word' | 'first';
  ghost: boolean;
  arcs: boolean;
  band: boolean;
  start: number;
  end: number;
};

type Plan = Omit<Beat, 'start' | 'end'> & { frames: number };

const plan = (
  text: string,
  kind: BeatKind,
  frames: number,
  extra: Partial<Omit<Plan, 'text' | 'kind' | 'frames'>> = {},
): Plan => ({
  text,
  kind,
  frames,
  stage: 'dark',
  font: 'word',
  texture: 'none',
  giant: 'none',
  ghost: false,
  arcs: false,
  band: false,
  ...extra,
});

const plans = (props: AnniversaryKineticProps): Plan[] => {
  const { opening, news, journey, milestone, values } = props;
  return [
    plan(opening.intro, 'glitch', 17),
    plan(opening.leanIn, 'wave', 27, { stage: 'deep', font: 'wide' }),
    plan(news.weveGot, 'whip', 10, { texture: 'streaks' }),
    plan(news.bigNews, 'news', 25, { texture: 'noise', giant: 'word', ghost: true }),
    plan(news.soGood, 'shrink', 18, { stage: 'surface' }),
    plan(news.toShare, 'rise', 24, { stage: 'plum' }),
    plan(news.withYou, 'drop', 22),
    plan(journey.look, 'cascade', 12, { stage: 'surface', arcs: true }),
    plan(journey.look, 'blur', 21, { stage: 'plum' }),
    plan(journey.howFar, 'type', 14, { texture: 'noise' }),
    plan(journey.weve, 'type', 16, { giant: 'word' }),
    plan(journey.come, 'sweep', 10, { stage: 'surface' }),
    plan(journey.and, 'blur', 7),
    plan(journey.still, 'rise', 15),
    plan(journey.going, 'stack', 11, { texture: 'streaks' }),
    plan(journey.strong, 'stack', 12, { texture: 'noise' }),
    plan(milestone.turning, 'track', 22, { giant: 'first', ghost: true }),
    plan(props.years, 'number', 11, { font: 'number', giant: 'word', arcs: true }),
    plan(milestone.today, 'band', 20, { band: true }),
    plan(values.first, 'slab', 15, { font: 'value' }),
    plan(values.second, 'collapse', 14, { font: 'value', band: true }),
    plan(values.third, 'flash', 14, { font: 'value', band: true }),
    plan(values.fourth, 'wipe', 22, { font: 'value', texture: 'noise', giant: 'first' }),
  ];
};

const MIN_END_FRAMES = 40;

export type Timeline = { beats: Beat[]; endStart: number };

export const buildTimeline = (props: AnniversaryKineticProps, duration: number): Timeline => {
  const list = plans(props);
  const total = list.reduce((sum, item) => sum + item.frames, 0);
  const room = Math.max(1, duration - MIN_END_FRAMES);
  const pace = Math.min(props.timing.pace, room / total);
  const beats: Beat[] = [];
  let used = 0;
  for (const { frames, ...rest } of list) {
    const start = Math.round(used * pace);
    used += frames;
    beats.push({ ...rest, start, end: Math.max(start + 2, Math.round(used * pace)) });
  }
  return { beats, endStart: beats.at(-1)?.end ?? 0 };
};

export const beatAt = (timeline: Timeline, frame: number): number =>
  timeline.beats.findIndex((beat) => frame >= beat.start && frame < beat.end);

export const KINDER_FLASH_SHARE = 0.4;

export const stageAt = (beat: Beat, local: number): Stage => {
  if (beat.kind === 'flash') {
    return local < (beat.end - beat.start) * KINDER_FLASH_SHARE ? 'surface' : 'dark';
  }
  if (beat.kind === 'rise' && beat.stage === 'plum') {
    return local < 7 ? 'plum' : 'dark';
  }
  return beat.stage;
};
