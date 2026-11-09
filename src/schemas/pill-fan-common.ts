import { z } from 'zod';
import { zColor, zImage, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const PILL_FAN_FONTS = ['sora', 'quicksand', 'fraunces', 'outfit', 'inter-tight'] as const;

export type PillFanFont = (typeof PILL_FAN_FONTS)[number];

export const PILL_FAN_TRAILS = ['tint', 'outline'] as const;

export const PILL_FAN_PLACEMENTS = ['corner', 'below-line'] as const;

export const PILL_FAN_DIRECTIONS = ['down', 'up'] as const;

export const pillFanSchema = z.object({
  headline: z.string(),
  words: z.array(z.string()).min(2).max(10),
  companyName: z.string(),
  logo: zImage(),
  colors: z.object({
    primary: zColor(),
    pillText: zColor(),
    text: zColor(),
    background: zColor(),
    glow: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  phrase: z.object({
    font: z.enum(PILL_FAN_FONTS),
    size: zSlider({ min: 48, max: 160, step: 2 }),
    tilt: zSlider({ min: -15, max: 15, step: 0.5 }),
    gap: zSlider({ min: 0, max: 120, step: 2 }),
  }),
  pills: z.object({
    font: z.enum(PILL_FAN_FONTS),
    textSize: zSlider({ min: 32, max: 120, step: 2 }),
    height: zSlider({ min: 60, max: 200, step: 2 }),
    padding: zSlider({ min: 16, max: 100, step: 2 }),
    shadow: zSlider({ min: 0, max: 1, step: 0.01 }),
    trail: z.enum(PILL_FAN_TRAILS),
  }),
  fan: z.object({
    angle: zSlider({ min: -40, max: 20, step: 0.5 }),
    direction: z.enum(PILL_FAN_DIRECTIONS),
    spread: zSlider({ min: 20, max: 60, step: 0.5 }),
    swingIn: zSlider({ min: 10, max: 90, step: 1 }),
    hinge: zSlider({ min: 0, max: 160, step: 2 }),
    slide: zSlider({ min: 0, max: 80, step: 1 }),
    shrink: zSlider({ min: 0, max: 0.15, step: 0.005 }),
    trail: zSlider({ min: 1, max: 5 }),
    fade: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    clearAtEnd: z.boolean(),
  }),
  brand: z.object({
    placement: z.enum(PILL_FAN_PLACEMENTS),
    logoWidth: zSlider({ min: 80, max: 420, step: 2 }),
    logoHeight: zSlider({ min: 40, max: 200, step: 2 }),
    nameSize: zSlider({ min: 20, max: 80, step: 1 }),
    plate: z.boolean(),
    gap: zSlider({ min: 60, max: 320, step: 2 }),
  }),
  glow: z.object({
    strength: zSlider({ min: 0, max: 1, step: 0.01 }),
    drift: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  layout: z.object({
    x: zSlider({ min: -600, max: 600, step: 2 }),
    y: zSlider({ min: -400, max: 400, step: 2 }),
    margin: zSlider({ min: 40, max: 200, step: 2 }),
  }),
  timing: z.object({
    intro: zSlider({ min: 10, max: 40 }),
    firstSwap: zSlider({ min: 12, max: 60 }),
    interval: zSlider({ min: 12, max: 60 }),
    swing: zSlider({ min: 8, max: 30 }),
    drift: zSlider({ min: 0.05, max: 0.4, step: 0.01 }),
  }),
});

export type PillFanProps = z.infer<typeof pillFanSchema>;

export const PILL_FAN_WORDS = [
  '{{Item 1}}',
  '{{Item 2}}',
  '{{Item 3}}',
  '{{Item 4}}',
  '{{Item 5}}',
  '{{Item 6}}',
];

const ROLE_HINT = 'More options sets each part on its own';

const SURFACE = {
  path: 'colors.plate',
  label: 'Surface color',
  hint: 'The pill plate behind the logo; shows when Logo plate is on',
} as const;

const PLACEMENT = {
  path: 'brand.placement',
  label: 'Logo placement',
  hint: 'Corner puts the logo and name top left; Below line centers them under the phrase, best with a fan that opens up',
} as const;

export const pillFanControls = (firstGlance: 'placement' | 'surface') =>
  defineControls<PillFanProps>({
    sections: [
      {
        title: 'Words',
        fields: [
          {
            path: 'headline',
            label: 'Phrase',
            hint: 'Sits left of the hinge and the words complete it; long phrases wrap to two lines',
          },
          {
            path: 'words',
            label: 'Words',
            hint: 'Each swings in on a pill in turn; with the default timing six fit, more words switch faster',
          },
        ],
      },
      {
        title: 'Colors',
        fields: [
          {
            link: ['colors.primary', 'colors.glow'],
            label: 'Primary color',
            hint: `The word pills and the soft corner glows. ${ROLE_HINT}`,
          },
          { path: 'colors.text', label: 'Text color', hint: 'The phrase and the company name' },
          { path: 'colors.background', label: 'Background color' },
          ...(firstGlance === 'surface' ? [SURFACE] : []),
        ],
        more: [
          ...(firstGlance === 'placement' ? [SURFACE] : []),
          { path: 'colors.primary', label: 'Pill color' },
          {
            path: 'colors.pillText',
            label: 'Word color',
            hint: 'Words on the front pill; swaps to the text or background color when it would be hard to read',
          },
          { path: 'colors.glow', label: 'Glow color' },
          { path: 'glow.strength', label: 'Glow strength', hint: '0 turns the corner glows off' },
          { path: 'glow.drift', label: 'Glow drift', hint: 'How much the corner glows wander' },
          {
            path: 'showBackground',
            label: 'Show background',
            hint: 'Turn off to layer the phrase over another clip',
          },
        ],
      },
      {
        title: 'Logo and name',
        fields: [
          { path: 'logo', label: 'Logo', hint: 'Wide, square or round; it fits the logo box' },
          {
            path: 'companyName',
            label: 'Company name',
            hint: 'Beside the logo; long names shrink to fit one line',
          },
          ...(firstGlance === 'placement' ? [PLACEMENT] : []),
        ],
        more: [
          ...(firstGlance === 'surface' ? [PLACEMENT] : []),
          {
            path: 'brand.logoWidth',
            label: 'Logo width',
            hint: 'Widest the logo may be, in pixels',
          },
          {
            path: 'brand.logoHeight',
            label: 'Logo height',
            hint: 'Tallest the logo may be, in pixels',
          },
          { path: 'brand.nameSize', label: 'Name size', hint: 'Largest size in pixels' },
          {
            path: 'brand.plate',
            label: 'Logo plate',
            hint: 'A pill of the surface color behind the logo, for dark logos on dark backgrounds',
          },
          {
            path: 'brand.gap',
            label: 'Gap below the line',
            hint: 'Pixels from the hinge down to the logo; Below line only',
          },
        ],
      },
      {
        title: 'Fan',
        fields: [
          {
            path: 'pills.trail',
            label: 'Older pills',
            hint: 'Tint fades older pills toward the background, Outline turns them into outlined pills',
          },
          {
            path: 'fan.direction',
            label: 'Fan opens',
            hint: 'Down hangs older pills below the line, Up raises them above it',
          },
        ],
        more: [
          {
            path: 'fan.spread',
            label: 'Angle between pills',
            hint: 'Degrees each older pill turns further away',
          },
          {
            path: 'fan.clearAtEnd',
            label: 'Clear the fan at the end',
            hint: 'Older pills sweep on and fade out as the last word lands, and the line and brand glide to the middle',
          },
          {
            path: 'fan.angle',
            label: 'Front pill angle',
            hint: 'In degrees, where the newest pill settles; negative points up',
          },
          {
            path: 'fan.swingIn',
            label: 'Swing-in angle',
            hint: 'Degrees a new pill sweeps through as it arrives',
          },
          {
            path: 'fan.hinge',
            label: 'Hinge gap',
            hint: 'Pixels between the hinge and the start of every pill',
          },
          {
            path: 'fan.slide',
            label: 'Slide out',
            hint: 'Pixels each older pill slides out along its spoke so its word stays clear',
          },
          { path: 'fan.shrink', label: 'Shrink', hint: 'Share each older pill shrinks by' },
          { path: 'fan.trail', label: 'Pills left behind', hint: 'Older pills kept in the fan' },
          {
            path: 'fan.fade',
            label: 'Tint per pill',
            hint: 'How far each older pill fades toward the background; Tint only, words stay readable',
          },
          { path: 'pills.height', label: 'Pill height', hint: 'Largest height in pixels' },
          { path: 'pills.padding', label: 'Side padding', hint: 'In pixels' },
          {
            path: 'pills.shadow',
            label: 'Shadow strength',
            hint: 'A darker shade of the pill color under each pill',
          },
        ],
      },
      {
        title: 'Type',
        fields: [
          { path: 'phrase.font', label: 'Phrase font' },
          { path: 'pills.font', label: 'Word font' },
        ],
        more: [
          {
            path: 'phrase.size',
            label: 'Phrase size',
            hint: 'Largest size in pixels; long phrases wrap, then shrink',
          },
          { path: 'pills.textSize', label: 'Word size', hint: 'Largest size in pixels' },
          { path: 'phrase.tilt', label: 'Phrase tilt', hint: 'In degrees' },
          {
            path: 'phrase.gap',
            label: 'Gap before the hinge',
            hint: 'Pixels between the end of the phrase and the hinge',
          },
        ],
      },
      {
        title: 'Timing and position',
        fields: [
          { path: 'timing.interval', label: 'Frames per word' },
          { path: 'layout.y', label: 'Hinge up or down', hint: 'Pixels from the center' },
        ],
        more: [
          {
            path: 'timing.swing',
            label: 'Swing length',
            hint: 'In frames, how long each switch takes',
          },
          {
            path: 'timing.drift',
            label: 'Drift between words',
            hint: 'Share of each step the fan keeps turning slowly while a word is read',
          },
          {
            path: 'timing.firstSwap',
            label: 'First switch',
            hint: 'Frame the second word starts to swing in',
          },
          {
            path: 'timing.intro',
            label: 'Intro length',
            hint: 'In frames, the phrase rises in while the first pill swings in',
          },
          {
            path: 'layout.x',
            label: 'Hinge across',
            hint: 'Pixels from the center; the phrase and fan move with it',
          },
          {
            path: 'layout.margin',
            label: 'Safe margin',
            hint: 'Pixels kept clear at the frame edges; long words shrink the pills to stay inside',
          },
        ],
      },
    ],
  });

export const pillFanMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source' | 'posterFrame'>,
): ClipMeta => ({
  ...extra,
  category: 'list-pickers',
  tags: ['list', 'picker', 'text', 'kinetic'],
  durationInFrames: 180,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'pill-fan',
  variant,
});
