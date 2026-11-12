import { defineControls } from '../../control-layout';
import type { ChargeCompareProps } from './charge-compare';

export const chargeCompareControls = defineControls<ChargeCompareProps>({
  sections: [
    {
      title: 'Headline and phones',
      fields: [
        {
          path: 'headlineAccent',
          label: 'Highlighted word',
          hint: 'What charges up, shown in the Primary to Secondary blend; long headlines shrink to one line',
        },
        {
          path: 'headlineLead',
          label: 'First word',
          hint: 'Plain text before the highlighted word',
        },
        {
          path: 'soloLabel',
          label: 'Left phone label',
          hint: 'Over the phone that barely charges',
        },
        {
          path: 'teamLabel',
          label: 'Right phone label',
          hint: 'Over the phone that charges to full, in the Primary color',
        },
      ],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in pixels; long headlines shrink',
        },
        { path: 'type.uppercase', label: 'Headline in capitals' },
        {
          path: 'type.labelSize',
          label: 'Label size',
          hint: 'Largest size in pixels; the labels are always capitals',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The full charge, its glow, the right label, the start of the highlighted word, the logo ring and the website button',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The end of the highlighted word blend, the other side of the logo ring and the website pill',
        },
        {
          link: ['colors.text', 'colors.muted'],
          label: 'Text color',
          hint: 'The headline, the batteries, the name and the quieter left label and tagline together',
        },
        {
          link: ['colors.background', 'colors.phone', 'colors.phoneEdge'],
          label: 'Background color',
          hint: 'The backdrop and the phones with it; set each in More options',
        },
      ],
      more: [
        {
          path: 'colors.low',
          label: 'Low charge color',
          hint: 'The nearly empty battery; the right battery turns from this to Primary as it charges',
        },
        { path: 'colors.text', label: 'Main text' },
        { path: 'colors.muted', label: 'Quiet text', hint: 'Left label and tagline' },
        { path: 'colors.background', label: 'Backdrop' },
        { path: 'colors.phone', label: 'Phone body' },
        { path: 'colors.phoneEdge', label: 'Phone outline and buttons' },
        { path: 'colors.cable', label: 'Charging cables' },
        { path: 'colors.plate', label: 'Logo plate', hint: 'Light card behind the logo' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the clip over another one',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; sits in the top corner, then glides to the centre and grows',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Lights up letter by letter under the logo; long names shrink, then wrap to two lines',
        },
        { path: 'tagline', label: 'Tagline', hint: 'Up to two lines under the name' },
        { path: 'website', label: 'Website', hint: 'Types into the pill with the arrow button' },
      ],
      more: [
        { path: 'type.nameSize', label: 'Name size', hint: 'Largest size in pixels' },
        { path: 'type.taglineSize', label: 'Tagline size', hint: 'Largest size in pixels' },
        { path: 'type.websiteSize', label: 'Website size', hint: 'Largest size in pixels' },
        {
          path: 'badge.height',
          label: 'Logo plate height',
          hint: 'In the corner, in pixels; wide logos get a wider plate',
        },
        {
          path: 'badge.endScale',
          label: 'End card logo growth',
          hint: 'How many times bigger the logo plate gets in the centre',
        },
        {
          path: 'badge.showPlate',
          label: 'Logo plate',
          hint: 'The light card with the coloured ring behind the logo',
        },
      ],
    },
    {
      title: 'Batteries',
      fields: [
        {
          path: 'battery.soloLevel',
          label: 'Left battery level',
          hint: 'Percent the phone going solo is stuck at',
        },
        {
          path: 'timing.chargeFrames',
          label: 'Charge length',
          hint: 'Frames for the right battery to charge to full; the end card follows it',
        },
      ],
      more: [
        {
          path: 'battery.startLevel',
          label: 'Right battery start',
          hint: 'Percent the right battery starts charging from',
        },
        { path: 'battery.showPercent', label: 'Show percentages' },
        {
          path: 'battery.glow',
          label: 'Charge glow',
          hint: 'Light behind the right phone; 0 turns it off',
        },
        {
          path: 'battery.flicker',
          label: 'Weak bolt flicker',
          hint: 'The left bolt fades in and out as if it cannot hold a charge',
        },
        { path: 'timing.plugAt', label: 'Plug in start', hint: 'Frame the cables start to rise' },
        {
          path: 'timing.fullHold',
          label: 'Hold at full',
          hint: 'Frames at 100 percent before the end card',
        },
      ],
    },
  ],
});
