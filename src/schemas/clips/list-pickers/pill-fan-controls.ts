import { defineControls } from '../../control-layout';
import type { PillFanProps } from './pill-fan';

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

export const pillFanControls = defineControls<PillFanProps>({
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
      ],
      more: [
        SURFACE,
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
        PLACEMENT,
      ],
      more: [
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
