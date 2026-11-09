import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from './control';
import { defineControls } from './control-layout';
import { PHONE_FINISHES, phoneStageSchema } from './phone-kit';
import type { ClipMeta, ClipVariant } from './registry';

export const PHONE_SPIN_ARRANGEMENTS = ['text-left', 'text-right', 'split'] as const;

export type PhoneSpinArrangement = (typeof PHONE_SPIN_ARRANGEMENTS)[number];

export const PHONE_SPIN_FONTS = ['inter-tight', 'instrument-serif', 'manrope'] as const;

export type PhoneSpinFont = (typeof PHONE_SPIN_FONTS)[number];

export const PHONE_SPIN_LINKS = ['arrow', 'pill', 'underline'] as const;

export const phoneSpinInSchema = z.object({
  screen: zImage(),
  logo: zImage(),
  headline: zMultiline(),
  website: z.string(),
  colors: z.object({
    primary: zColor(),
    headline: zColor(),
    website: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    plate: zColor(),
  }),
  showBackground: z.boolean(),
  layout: z.object({
    arrangement: z.enum(PHONE_SPIN_ARRANGEMENTS),
    phoneSize: zSlider({ min: 0.8, max: 2, step: 0.01 }),
    phoneX: zSlider({ min: 0, max: 5, step: 0.05 }),
    phoneY: zSlider({ min: -2, max: 2, step: 0.05 }),
    textInset: zSlider({ min: 60, max: 400, step: 2 }),
    textWidth: zSlider({ min: 360, max: 900, step: 4 }),
    textGap: zSlider({ min: 30, max: 300, step: 2 }),
  }),
  type: z.object({
    font: z.enum(PHONE_SPIN_FONTS),
    headlineSize: zSlider({ min: 48, max: 140, step: 2 }),
    headlineLines: zSlider({ min: 1, max: 4 }),
    websiteSize: zSlider({ min: 20, max: 48 }),
    websiteStyle: z.enum(PHONE_SPIN_LINKS),
  }),
  logoBox: z.object({
    size: zSlider({ min: 60, max: 240, step: 2 }),
    plate: z.boolean(),
    padding: zSlider({ min: 0, max: 60 }),
    roundness: zSlider({ min: 0, max: 100 }),
  }),
  phone: z.object({
    finish: z.enum(PHONE_FINISHES),
    spinTurns: zSlider({ min: 0, max: 1, step: 0.05 }),
    restAngle: zSlider({ min: -0.8, max: 0.8, step: 0.01 }),
    startTip: zSlider({ min: 0, max: 1.2, step: 0.01 }),
    startLean: zSlider({ min: 0, max: 1, step: 0.01 }),
    slideIn: zSlider({ min: 0, max: 6, step: 0.05 }),
    float: zSlider({ min: 0, max: 0.3, step: 0.005 }),
    sway: zSlider({ min: 0, max: 0.2, step: 0.005 }),
  }),
  stage: phoneStageSchema,
  timing: z.object({
    spinFrames: zSlider({ min: 40, max: 140 }),
    textStart: zSlider({ min: 20, max: 120 }),
    textStagger: zSlider({ min: 0, max: 20 }),
  }),
});

export type PhoneSpinInProps = z.infer<typeof phoneSpinInSchema>;

const ROLE_HINT = 'Scroll to More options to set each part on its own';

export const phoneSpinInControls = defineControls<PhoneSpinInProps>({
  sections: [
    {
      title: 'Screen and copy',
      fields: [
        {
          path: 'screen',
          label: 'Phone screen',
          hint: 'A screenshot of your app; it fills the screen from the top and crops the rest',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it sits above the headline, or left of the phone in Split',
        },
        {
          path: 'headline',
          label: 'Headline',
          hint: 'Wraps on its own and shrinks to fit the lines allowed',
        },
        {
          path: 'website',
          label: 'Website',
          hint: 'Last line, under the headline; long addresses shrink to fit',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The website button, pill or underline and the light that catches the phone edges',
        },
        {
          link: ['colors.headline', 'colors.website'],
          label: 'Text color',
          hint: `The headline and the website. ${ROLE_HINT}`,
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: `Center and edges of the studio together. A dark color also dims the 3D studio. ${ROLE_HINT}`,
        },
      ],
      more: [
        {
          path: 'colors.plate',
          label: 'Surface color',
          hint: 'The plate behind the logo, when Logo plate is on',
        },
        { path: 'colors.headline', label: 'Headline color' },
        {
          path: 'colors.website',
          label: 'Website color',
          hint: 'Arrow and Underline styles; the pill picks black or white text for itself',
        },
        {
          path: 'colors.background',
          label: 'Background center',
          hint: 'A dark color also dims the 3D studio',
        },
        { path: 'colors.backgroundEdge', label: 'Background edges' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the phone and copy over another clip',
        },
      ],
    },
    {
      title: 'Phone and studio',
      fields: [
        { path: 'phone.finish', label: 'Phone finish' },
        {
          path: 'phone.spinTurns',
          label: 'Spin amount',
          hint: 'Turns the phone spins through as it rises; 0.25 is a quarter turn',
        },
      ],
      more: [
        {
          path: 'phone.restAngle',
          label: 'Resting angle',
          hint: 'How far the phone stays turned once it lands, in radians; positive turns the screen toward the copy',
        },
        {
          path: 'phone.startTip',
          label: 'Starting tip back',
          hint: 'How far the phone is tipped back as it rises; it straightens as it lands',
        },
        {
          path: 'phone.startLean',
          label: 'Starting lean',
          hint: 'How far the phone leans sideways as it rises; it levels out as it lands',
        },
        {
          path: 'phone.slideIn',
          label: 'Sideways slide',
          hint: 'How far out to the side the phone starts before sliding into place',
        },
        {
          path: 'phone.float',
          label: 'Idle float',
          hint: 'How far the phone drifts slowly upward across the clip, so it never sits dead still',
        },
        { path: 'phone.sway', label: 'Idle sway', hint: 'Gentle side to side turn' },
        {
          path: 'stage.cameraDistance',
          label: 'Camera distance',
          hint: 'Higher pulls the camera back so the phone looks smaller',
        },
        {
          path: 'stage.fieldOfView',
          label: 'Field of view',
          hint: 'Lower flattens perspective like a longer lens',
        },
        { path: 'stage.keyLight', label: 'Key light' },
        {
          path: 'stage.rimLight',
          label: 'Edge light',
          hint: 'Light from behind in the Primary color that catches the phone edges; 0 turns it off',
        },
        {
          path: 'stage.reflections',
          label: 'Reflections',
          hint: 'Strength of the studio highlights on the glass and frame',
        },
        { path: 'stage.shadow', label: 'Shadow strength' },
        { path: 'stage.shadowSoftness', label: 'Shadow softness' },
        { path: 'stage.cameraDrift', label: 'Camera drift', hint: 'Slow wandering camera' },
      ],
    },
    {
      title: 'Layout',
      fields: [
        {
          path: 'layout.arrangement',
          label: 'Arrangement',
          hint: 'Text left or right of the phone, or Split: logo left and headline right of a centered phone',
        },
        { path: 'layout.phoneSize', label: 'Phone size' },
      ],
      more: [
        {
          path: 'layout.phoneX',
          label: 'Phone distance from center',
          hint: 'Text left and Text right only; the phone moves away from the center and the copy follows it',
        },
        {
          path: 'layout.phoneY',
          label: 'Phone height',
          hint: 'Negative moves the phone down',
        },
        {
          path: 'layout.textInset',
          label: 'Side margin',
          hint: 'Least space in pixels between the frame edge and the copy; long copy grows out to it',
        },
        {
          path: 'layout.textWidth',
          label: 'Copy width',
          hint: 'Widest the headline may run, in pixels',
        },
        {
          path: 'layout.textGap',
          label: 'Gap to the phone',
          hint: 'Space in pixels between the phone and the copy; Split keeps it on both sides',
        },
      ],
    },
    {
      title: 'Type and logo',
      fields: [{ path: 'type.font', label: 'Headline font' }],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in pixels; long headlines shrink',
        },
        {
          path: 'type.headlineLines',
          label: 'Headline lines',
          hint: 'Most lines the headline may wrap to before it shrinks',
        },
        { path: 'type.websiteSize', label: 'Website size', hint: 'In pixels' },
        {
          path: 'type.websiteStyle',
          label: 'Website style',
          hint: 'Arrow puts a Primary button before it, Pill fills it with Primary, Underline draws a Primary bar under it',
        },
        {
          path: 'logoBox.size',
          label: 'Logo size',
          hint: 'Side of a square logo in pixels; wide logos grow wider and shorter',
        },
        {
          path: 'logoBox.plate',
          label: 'Logo plate',
          hint: 'A backing plate in the Surface color, so a dark logo reads on a dark studio',
        },
        { path: 'logoBox.padding', label: 'Plate padding', hint: 'In pixels' },
        {
          path: 'logoBox.roundness',
          label: 'Plate roundness',
          hint: '100 makes a pill or a circle, 0 a sharp rectangle',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.spinFrames',
          label: 'Spin-in length',
          hint: 'In frames; the phone rises, spins and lands over this time',
        },
        {
          path: 'timing.textStart',
          label: 'Copy entrance',
          hint: 'Frame the logo starts to arrive; the headline and website follow',
        },
      ],
      more: [
        {
          path: 'timing.textStagger',
          label: 'Copy stagger',
          hint: 'In frames, between the logo, headline and website',
        },
      ],
    },
  ],
});

export const phoneSpinInMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'theme' | 'source'>,
): ClipMeta => ({
  ...extra,
  category: 'phone-reveals',
  tags: ['3d', 'phone', 'spin', 'float', 'headline'],
  durationInFrames: 180,
  posterFrame: 150,
  fps: 30,
  width: 1920,
  height: 1080,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'phone-spin-in',
  variant,
});
