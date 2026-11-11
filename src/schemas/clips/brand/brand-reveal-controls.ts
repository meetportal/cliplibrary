import { defineControls } from '../../control-layout';
import type { BrandRevealProps } from './brand-reveal';

export const brandRevealControls = defineControls<BrandRevealProps>({
  sections: [
    {
      title: 'Logo and name',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it sits inside the halo, which stretches into a pill for a wide logo. Leave empty for a plain ring',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Rises in letter by letter beside the halo; long names shrink to stay on one line',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'One line under the name; long lines wrap onto two. Leave empty to hide it',
        },
      ],
      more: [
        {
          path: 'eyebrow',
          label: 'Eyebrow',
          hint: 'Small spaced capitals above the name; leave empty to hide it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The halo that draws around the logo and the dot that circles it; a very pale colour is deepened just enough to show on the background',
        },
        { path: 'colors.text', label: 'Text color', hint: 'The company name' },
        {
          link: ['colors.eyebrow', 'colors.tagline'],
          label: 'Secondary color',
          hint: 'The eyebrow and the tagline; set each in More options',
        },
        {
          path: 'colors.plate',
          label: 'Surface color',
          hint: 'The plate behind the logo inside the halo',
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'Sets the centre and the edges together; set each in More options for a soft vignette',
        },
      ],
      more: [
        { path: 'colors.eyebrow', label: 'Eyebrow color' },
        { path: 'colors.tagline', label: 'Tagline color' },
        { path: 'colors.background', label: 'Background centre' },
        { path: 'colors.backgroundEdge', label: 'Background edges' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the reveal over another clip',
        },
      ],
    },
    {
      title: 'Halo',
      fields: [
        {
          path: 'halo.size',
          label: 'Halo size',
          hint: 'Height of the logo plate in pixels; the halo is round unless the logo is wide',
        },
        { path: 'dot.show', label: 'Show orbiting dot' },
      ],
      more: [
        { path: 'halo.thickness', label: 'Halo thickness', hint: 'In pixels' },
        {
          path: 'halo.gap',
          label: 'Space inside the halo',
          hint: 'In pixels, between the plate and the halo',
        },
        {
          path: 'halo.logoPadding',
          label: 'Logo padding',
          hint: 'Share of the plate height kept clear around the logo',
        },
        {
          path: 'halo.widest',
          label: 'Widest halo',
          hint: 'Times the halo height; how far it may stretch for a wide logo',
        },
        { path: 'dot.size', label: 'Dot size', hint: 'In pixels' },
        {
          path: 'dot.distance',
          label: 'Dot distance',
          hint: 'In pixels, from the outside of the halo',
        },
        {
          path: 'dot.orbit',
          label: 'Dot orbit speed',
          hint: 'Degrees of a lap per second; 0 parks the dot where the halo closes',
        },
      ],
    },
    {
      title: 'Type',
      fields: [
        { path: 'name.font', label: 'Name font' },
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
      ],
      more: [
        { path: 'name.tracking', label: 'Name letter spacing', hint: 'Share of the name size' },
        { path: 'name.gap', label: 'Space between halo and name', hint: 'In pixels' },
        {
          path: 'name.maxWidth',
          label: 'Widest lockup',
          hint: 'In pixels, halo and name together; a longer name shrinks to fit',
        },
        { path: 'eyebrowStyle.size', label: 'Eyebrow size', hint: 'In pixels' },
        {
          path: 'eyebrowStyle.tracking',
          label: 'Eyebrow letter spacing',
          hint: 'Share of the eyebrow size',
        },
        { path: 'eyebrowStyle.gap', label: 'Space above the name', hint: 'In pixels' },
        { path: 'taglineStyle.size', label: 'Tagline size', hint: 'In pixels' },
        { path: 'taglineStyle.gap', label: 'Space below the name', hint: 'In pixels' },
        {
          path: 'taglineStyle.maxWidth',
          label: 'Tagline width',
          hint: 'In pixels; a longer tagline wraps onto a second line',
        },
      ],
    },
    {
      title: 'Timing and layout',
      fields: [
        {
          path: 'timing.drawFrames',
          label: 'Halo draw length',
          hint: 'In frames for a round halo; a pill around a wide logo takes a little longer',
        },
        {
          path: 'layout.offsetY',
          label: 'Vertical position',
          hint: 'In pixels from the centre; negative moves the lockup up',
        },
      ],
      more: [
        {
          path: 'timing.start',
          label: 'Start',
          hint: 'Frame number when the eyebrow appears; the halo starts 4 frames later',
        },
        {
          path: 'timing.letterFrames',
          label: 'Letter stagger',
          hint: 'Frames between letters; long names go faster so they finish in time',
        },
        {
          path: 'timing.taglineDelay',
          label: 'Tagline delay',
          hint: 'Frames after the last letter starts',
        },
        {
          path: 'layout.lightDrift',
          label: 'Light drift',
          hint: 'In pixels; how far the soft light behind the lockup sways. 0 holds it still',
        },
      ],
    },
  ],
});
