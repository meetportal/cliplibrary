import { defineControls } from '../../control-layout';
import type { CtaEndCardProps } from './cta-end-card';

export const ctaEndCardControls = defineControls<CtaEndCardProps>({
  sections: [
    {
      title: 'Card',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; sits on the plate at the top',
        },
        {
          path: 'headline.name',
          label: 'Company name',
          hint: 'The accent word in the headline, underlined once it lands',
        },
        { path: 'tagline', label: 'Tagline', hint: 'One short line under the headline' },
        { path: 'website', label: 'Website', hint: 'The last line, under the buttons' },
      ],
      more: [
        { path: 'headline.lead', label: 'Words before the name', hint: 'Empty hides them' },
        { path: 'headline.tail', label: 'Words after the name', hint: 'Empty hides them' },
        {
          path: 'lockup.size',
          label: 'Logo size',
          hint: 'Height of a square logo in pixels; wide logos come out wider and a little shorter',
        },
        { path: 'lockup.maxWidth', label: 'Logo max width', hint: 'In pixels' },
        {
          path: 'lockup.plate',
          label: 'Logo plate',
          hint: 'The soft rounded card behind the logo',
        },
        {
          path: 'lockup.padding',
          label: 'Plate padding',
          hint: 'Space around the logo, in pixels',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The company name, its underline and the first button; text on the button picks dark or light ink by itself',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The headline and the second button label',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The tagline and the website line',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The logo plate and the second button',
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'The backdrop, light in the middle and a little deeper at the edges',
        },
      ],
      more: [
        { path: 'colors.background', label: 'Background center' },
        { path: 'colors.backgroundEdge', label: 'Background edge', hint: 'Color at the corners' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the card over another clip',
        },
      ],
    },
    {
      title: 'Buttons',
      fields: [
        {
          path: 'primaryButton.label',
          label: 'First button',
          hint: 'Big word on the filled button',
        },
        {
          path: 'secondaryButton.label',
          label: 'Second button',
          hint: 'Big word on the outlined button',
        },
      ],
      more: [
        {
          path: 'primaryButton.caption',
          label: 'First button caption',
          hint: 'Small line above the big word; empty hides it',
        },
        {
          path: 'secondaryButton.caption',
          label: 'Second button caption',
          hint: 'Small line above the big word; empty hides it',
        },
        { path: 'secondaryButton.show', label: 'Show second button' },
        { path: 'buttons.height', label: 'Button height', hint: 'In pixels' },
        { path: 'buttons.labelSize', label: 'Button text size', hint: 'In pixels' },
        { path: 'buttons.gap', label: 'Button gap', hint: 'Space between the buttons, in pixels' },
      ],
    },
    {
      title: 'Type',
      fields: [
        {
          path: 'type.size',
          label: 'Headline size',
          hint: 'In pixels; a long headline shrinks to fit the width',
        },
        { path: 'type.font', label: 'Headline font' },
      ],
      more: [
        { path: 'type.maxWidth', label: 'Headline max width', hint: 'In pixels' },
        { path: 'type.taglineSize', label: 'Tagline size', hint: 'In pixels' },
        { path: 'type.websiteSize', label: 'Website size', hint: 'In pixels' },
        {
          path: 'type.websiteTracking',
          label: 'Website letter spacing',
          hint: 'In ems; 0 is normal spacing',
        },
        { path: 'type.uppercaseWebsite', label: 'Website in capitals' },
        { path: 'underline.show', label: 'Name underline' },
        { path: 'underline.thickness', label: 'Underline thickness', hint: 'In pixels' },
        {
          path: 'layout.offsetY',
          label: 'Vertical position',
          hint: 'Moves the whole card up (negative) or down, in pixels',
        },
        { path: 'layout.spacing', label: 'Line spacing', hint: 'Scales the gaps between rows' },
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          path: 'motion.stagger',
          label: 'Stagger',
          hint: 'Frames between each word and row arriving',
        },
      ],
      more: [
        {
          path: 'motion.start',
          label: 'Start delay',
          hint: 'Frames before the headline starts; the logo is there from the first frame',
        },
        {
          path: 'motion.rise',
          label: 'Rise distance',
          hint: 'How far each line rises in, in pixels',
        },
        {
          path: 'motion.sheen',
          label: 'Button shine',
          hint: 'A soft light that sweeps the first button while the card holds; 0 turns it off',
        },
        {
          path: 'motion.drift',
          label: 'Background drift',
          hint: 'How far the soft light in the background wanders; 0 holds it still',
        },
        {
          path: 'motion.exit',
          label: 'Fade out at the end',
          hint: 'Off by default so the finished card holds to the end; on, everything but the logo fades in the last half second for a seamless loop',
        },
      ],
    },
  ],
});
