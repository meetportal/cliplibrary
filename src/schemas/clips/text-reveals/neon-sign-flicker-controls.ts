import { defineControls } from '../../control-layout';
import type { NeonSignFlickerProps } from './neon-sign-flicker';

const FRAMES = 'In frames, at 30 per second';

export const neonSignFlickerControls = defineControls<NeonSignFlickerProps>({
  sections: [
    {
      title: 'Sign',
      fields: [
        {
          path: 'headline',
          label: 'Neon word',
          hint: 'Shrinks to fit the width; two or more words may stack on two lines',
        },
        {
          path: 'tagline',
          label: 'Line under the sign',
          hint: 'Wraps to at most three lines and shrinks if it needs more',
        },
      ],
      more: [
        {
          path: 'neon.uppercase',
          label: 'Neon in capitals',
          hint: 'Off shows the word as typed',
        },
        {
          path: 'neon.size',
          label: 'Neon size',
          hint: 'Largest size in pixels; long words shrink',
        },
        { path: 'neon.tracking', label: 'Neon letter spacing', hint: 'Share of the neon size' },
        {
          path: 'neon.glow',
          label: 'Tube glow',
          hint: 'Strength of the glow around the tubes; 0 leaves bare tubes',
        },
        {
          path: 'neon.wallGlow',
          label: 'Wall glow',
          hint: 'How much the sign lights the wall behind it; 0 turns it off',
        },
        {
          path: 'neon.hum',
          label: 'Glow hum',
          hint: 'A slow breathing of the glow; 0 holds it steady',
        },
        {
          path: 'layout.signY',
          label: 'Sign position',
          hint: 'Pixels from the top to the middle of the neon word',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The neon tubes, their glow, the wall glow and the glow around the logo plate',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The line under the sign, the company name and the website',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The wall' },
        { path: 'colors.lamp', label: 'Accent color', hint: 'The light from the pendant lamp' },
        { path: 'colors.plate', label: 'Surface color', hint: 'The lit plate behind the logo' },
      ],
      more: [
        {
          path: 'colors.glass',
          label: 'Unlit glass color',
          hint: 'A tube when it is off; also tints the lamp shade',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the sign over another clip',
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
          hint: 'Under the logo; long names shrink to one line',
        },
        { path: 'website', label: 'Website', hint: 'Last line, shown in capitals' },
      ],
      more: [
        {
          path: 'lockup.plate',
          label: 'Lit plate behind the logo',
          hint: 'Keeps dark logos readable on the dark wall; turn off for a light logo',
        },
        {
          path: 'lockup.logoWidth',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels',
        },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels',
        },
        {
          path: 'lockup.padding',
          label: 'Plate padding',
          hint: 'Space around the logo, in pixels',
        },
        {
          path: 'type.nameSize',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        {
          path: 'type.websiteSize',
          label: 'Website size',
          hint: 'Largest size in pixels; long addresses shrink',
        },
        {
          path: 'layout.lockupY',
          label: 'Logo position',
          hint: 'Pixels from the top to the middle of the logo',
        },
      ],
    },
    {
      title: 'Flicker',
      fields: [
        {
          path: 'flicker.letter',
          label: 'Failing letter',
          hint: 'Which letter sputters, counting from 1 and skipping spaces; past the end picks the last',
        },
        {
          path: 'flicker.ending',
          label: 'How it ends',
          hint: 'Burn out leaves the letter dark glass; Relight lets it catch and stay lit',
        },
      ],
      more: [
        {
          path: 'flicker.start',
          label: 'First sputter',
          hint: `${FRAMES}; with Switch on it waits for the sign to light`,
        },
        { path: 'flicker.bursts', label: 'Bursts', hint: 'How many times the letter fights back' },
        { path: 'flicker.firstBurst', label: 'First burst length', hint: FRAMES },
        {
          path: 'flicker.shrink',
          label: 'Burst shortening',
          hint: 'Frames each burst loses against the one before',
        },
        { path: 'flicker.gap', label: 'Dark gap', hint: `${FRAMES}, between bursts` },
        {
          path: 'flicker.pattern',
          label: 'Stutter pattern',
          hint: 'Pick another number for a different rhythm of drop-outs',
        },
        {
          path: 'opening.style',
          label: 'Opening',
          hint: 'Lit starts with the sign on; Switch on lights the lamp, then each letter in turn, while the line, logo and name show from the start',
        },
        {
          path: 'opening.length',
          label: 'Switch on length',
          hint: `${FRAMES}, until the last letter lights; Switch on only`,
        },
      ],
    },
    {
      title: 'Type',
      fields: [
        { path: 'neon.font', label: 'Neon lettering' },
        {
          path: 'type.font',
          label: 'Text font',
          hint: 'The line under the sign, name and website',
        },
      ],
      more: [
        { path: 'type.uppercase', label: 'Line in capitals', hint: 'Off shows the line as typed' },
        { path: 'type.taglineSize', label: 'Line size', hint: 'Largest size in pixels' },
        { path: 'type.tracking', label: 'Line letter spacing', hint: 'Share of the line size' },
      ],
    },
    {
      title: 'Lamp',
      fields: [],
      more: [
        { path: 'lamp.show', label: 'Show lamp', hint: 'It hangs over the failing letter' },
        { path: 'lamp.beam', label: 'Beam brightness', hint: '0 leaves only the lit shade' },
        { path: 'lamp.sway', label: 'Sway', hint: 'In degrees either side; 0 holds it still' },
        {
          path: 'lamp.height',
          label: 'Hang height',
          hint: 'Pixels between the lamp and the top of the neon',
        },
        { path: 'lamp.size', label: 'Shade width', hint: 'In pixels' },
      ],
    },
  ],
});
