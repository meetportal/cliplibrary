import { defineControls } from '../../control-layout';
import type { GoingLiveTeaserProps } from './going-live-teaser';

const SHRINKS = 'Shrinks or wraps to fit the width';

export const goingLiveTeaserControls = defineControls<GoingLiveTeaserProps>({
  sections: [
    {
      title: 'Teaser words',
      fields: [
        {
          path: 'words.opener',
          label: 'First word',
          hint: `Revealed by the sliding bar. ${SHRINKS}`,
        },
        {
          path: 'words.glitch',
          label: 'Glitch line',
          hint: `Second beat, with the colour split. ${SHRINKS}`,
        },
      ],
      more: [
        {
          path: 'words.punchTwo',
          label: 'Last punch',
          hint: `The echo stack just before your name. ${SHRINKS}`,
        },
        { path: 'words.bridge', label: 'Small word', hint: 'Third beat, as the sheets leave' },
        { path: 'words.panel', label: 'Dashboard line', hint: 'Over the rising dashboard panel' },
        { path: 'words.light', label: 'Wipe line', hint: 'Revealed by the curved wipe' },
        {
          path: 'words.lightAccent',
          label: 'Wipe line accent',
          hint: 'Follows the wipe line in the Primary color; leave empty to skip',
        },
        { path: 'words.punchOne', label: 'First punch', hint: `First echo stack. ${SHRINKS}` },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The curved wipe, accent words, echo stripes, rings and glows',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The flash, the smoke, echo stripes, the colour split and the underline',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Every word, the name, tagline and contacts',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The sliding bar, the flying sheets, echo stripes and the logo plate',
        },
        {
          link: ['colors.background', 'colors.backgroundEdge', 'colors.panel'],
          label: 'Background color',
          hint: 'The stage, its dark edges and the dashboard panel together',
        },
      ],
      more: [
        { path: 'colors.background', label: 'Stage centre' },
        {
          path: 'colors.backgroundEdge',
          label: 'Stage edge',
          hint: 'Also outlines the echo stacks',
        },
        { path: 'colors.panel', label: 'Dashboard panel' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer over another clip',
        },
      ],
    },
    {
      title: 'Brand',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Types in after the last punch; shrinks to one line',
        },
        { path: 'logo', label: 'Logo', hint: 'Wide, square or round; it settles into the plate' },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Spaced capitals under the logo, up to two lines',
        },
      ],
      more: [
        { path: 'website', label: 'Website', hint: 'Under the tagline; leave empty to hide' },
        { path: 'phone', label: 'Phone', hint: 'Bottom left; leave empty to hide' },
        { path: 'email', label: 'Email', hint: 'Bottom right; leave empty to hide' },
        {
          path: 'endCard.accentLastWord',
          label: 'Accent last tagline word',
          hint: 'Shows the last word in the Primary color',
        },
        {
          path: 'endCard.underline',
          label: 'Underline the accent word',
          hint: 'Needs the accent on',
        },
        { path: 'endCard.icons', label: 'Contact icons' },
        {
          path: 'endCard.name',
          label: 'Name on the end card',
          hint: 'Repeats the company name between the logo and the tagline',
        },
        {
          path: 'endCard.plate',
          label: 'Logo plate',
          hint: 'The arch that builds behind the logo; keeps dark logos readable',
        },
        {
          path: 'endCard.logoWidth',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels',
        },
        {
          path: 'endCard.logoHeight',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels',
        },
      ],
    },
    {
      title: 'Effects',
      fields: [
        {
          path: 'effects.echoes',
          label: 'Echo layers',
          hint: 'Copies behind each punch; 0 turns them off',
        },
        {
          path: 'effects.push',
          label: 'Slow push',
          hint: 'How fast the words grow while they hold; the end card grows by the same share, up to 5%. 0 holds them still',
        },
      ],
      more: [
        { path: 'effects.echoGap', label: 'Echo spacing', hint: 'Pixels between echo layers' },
        { path: 'effects.glitch', label: 'Glitch strength', hint: '0 shows the glitch line clean' },
        {
          path: 'effects.pulse',
          label: 'Flash strength',
          hint: 'The Secondary color flash on each punch; 0 turns it off',
        },
        { path: 'effects.smoke', label: 'Smoke', hint: 'Around the wipe line; 0 turns it off' },
        { path: 'effects.sheets', label: 'Flying sheets', hint: 'Around the glitch line' },
        {
          path: 'effects.arcs',
          label: 'Rings',
          hint: 'Thin Primary rings in the corners early on and widening over the logo at the end; off also stills those holds',
        },
      ],
    },
    {
      title: 'Type and layout',
      fields: [
        { path: 'type.font', label: 'Font' },
        {
          path: 'type.caps',
          label: 'Words in capitals',
          hint: 'Off shows the teaser words as typed',
        },
      ],
      more: [
        {
          path: 'type.wordSize',
          label: 'Word size',
          hint: 'Largest size in pixels; long words shrink',
        },
        {
          path: 'type.punchSize',
          label: 'Punch size',
          hint: 'Largest size of the echo stacks, in pixels',
        },
        { path: 'type.nameSize', label: 'Name size', hint: 'Largest size in pixels' },
        { path: 'type.taglineSize', label: 'Tagline size', hint: 'Largest size in pixels' },
        {
          path: 'type.contactSize',
          label: 'Contact size',
          hint: 'Website, phone and email, in pixels',
        },
        {
          path: 'layout.wordY',
          label: 'Word position',
          hint: 'Pixels from the top to the middle of the words',
        },
        {
          path: 'layout.logoY',
          label: 'Logo position',
          hint: 'Pixels from the top to the middle of the plate',
        },
        { path: 'layout.taglineY', label: 'Tagline position', hint: 'Pixels from the top' },
        {
          path: 'layout.contactsY',
          label: 'Contacts position',
          hint: 'Pixels from the top to the phone and email',
        },
      ],
    },
  ],
});
