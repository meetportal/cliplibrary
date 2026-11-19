import { defineControls } from '../../control-layout';
import type { FilmDustProps } from './film-dust';

export const filmDustControls = defineControls<FilmDustProps>({
  sections: [
    {
      title: 'Title',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'The big serif line in the middle of the film; long names shrink to fit the width limit',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'The italic line under the name, between the two rules. Leave empty to hide it',
        },
        {
          path: 'title.show',
          label: 'Show title',
          hint: 'Turn off to keep only the dust, hairs and scratches',
        },
      ],
      more: [
        {
          path: 'title.nameSize',
          label: 'Name size',
          hint: 'In pixels; long names shrink to fit and very short ones grow to fill the frame',
        },
        {
          path: 'title.taglineSize',
          label: 'Tagline size',
          hint: 'In pixels; long taglines shrink to fit',
        },
        {
          path: 'title.tracking',
          label: 'Name letter spacing',
          hint: 'Space between the letters of the name, as a share of its size',
        },
        {
          path: 'title.gap',
          label: 'Line spacing',
          hint: 'In pixels, from the foot of the name to the top of the tagline letters; tightens when a long name shrinks',
        },
        {
          path: 'title.maxWidth',
          label: 'Title width limit',
          hint: 'In pixels; the name and the tagline with its rules shrink to stay inside it',
        },
        {
          path: 'title.centerY',
          label: 'Title position',
          hint: 'Centre of the title, in pixels from the top',
        },
        {
          path: 'title.rules',
          label: 'Tagline rules',
          hint: 'The two thin Primary lines either side of the tagline',
        },
        {
          path: 'title.ruleWidth',
          label: 'Rule length',
          hint: 'In pixels at the full tagline size',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The tagline and its rules; lifted lighter when too dark to read on the film',
        },
        { path: 'colors.text', label: 'Text color', hint: 'The company name' },
        {
          path: 'colors.dust',
          label: 'Secondary color',
          hint: 'The light dust, hairs, specks and scratches; turns darker on a light plate so the dust stays visible',
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'The film plate and its slightly darker corners together; set each in More options',
        },
      ],
      more: [
        {
          path: 'colors.background',
          label: 'Plate centre color',
          hint: 'The film plate around the title; the name turns darker or lighter to stay readable on it',
        },
        {
          path: 'colors.backgroundEdge',
          label: 'Background edge color',
          hint: 'The darker corners of the plate; on a dark plate it also colours the dark specks, on a light plate they turn a darker shade of the plate',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to lay the dust and title over another clip',
        },
      ],
    },
    {
      title: 'Dust',
      fields: [
        {
          path: 'dust.amount',
          label: 'Amount',
          hint: 'How many marks come and go; 1 is about 20 on screen at once, 0 turns them off',
        },
        {
          path: 'dust.opacity',
          label: 'Strength',
          hint: 'How bright each mark gets at its peak',
        },
        {
          path: 'dust.scratches',
          label: 'Scratches',
          hint: 'How often a thin vertical scratch flashes down the film; 0 turns them off',
        },
      ],
      more: [
        { path: 'dust.size', label: 'Mark size', hint: 'Scales every hair, speck and scratch' },
        {
          path: 'dust.life',
          label: 'Mark life',
          hint: 'In frames, how long a hair stays before it fades; specks last about half as long',
        },
        {
          path: 'dust.hairs',
          label: 'Hairs share',
          hint: 'Share of the marks that are hairs and fibres; the rest are round specks',
        },
        {
          path: 'dust.darkSpecks',
          label: 'Dark specks share',
          hint: 'Share of the specks that are dark; they only show over bright parts such as the title or a light plate',
        },
        {
          path: 'dust.seed',
          label: 'Pattern',
          hint: 'Pick another number for a different scatter of marks',
        },
      ],
    },
    {
      title: 'Gate weave',
      fields: [
        {
          path: 'weave.radius',
          label: 'Weave',
          hint: 'Radius of the slow circle the title drifts in, in pixels (12 travels 24 px top to bottom); 0 holds it still',
        },
        {
          path: 'weave.breathing',
          label: 'Breathing',
          hint: 'How much the title grows and shrinks over the loop, as a share of its size',
        },
      ],
    },
  ],
});
