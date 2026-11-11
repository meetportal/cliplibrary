import { defineControls } from '../../control-layout';
import type { MagnifierCaptionProps } from './magnifier-caption';

const FRAMES = 'Frame number, at 30 per second';

export const magnifierCaptionControls = defineControls<MagnifierCaptionProps>({
  sections: [
    {
      title: 'Caption',
      fields: [
        {
          path: 'headline',
          label: 'Caption',
          hint: 'The lens finds it one word at a time and the last word is the keyword; it wraps to at most three lines, and a line break starts a new line',
        },
        {
          path: 'caption.keyword',
          label: 'Keyword style',
          hint: 'How the last word is marked in the caption: an underline, a marker highlight or only its colour',
        },
      ],
      more: [
        {
          path: 'caption.flyWords',
          label: 'Words fly up',
          hint: 'Each found word lifts out of the lens and flies into its place in the caption instead of typing in',
        },
        {
          path: 'caption.typing',
          label: 'Typing pace',
          hint: 'Frames between letters; long words type faster to keep up with the lens',
        },
        {
          path: 'caption.top',
          label: 'Caption position',
          hint: 'Pixels from the top of the frame to the first line',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.rim'],
          label: 'Primary color',
          hint: 'The keyword, its underline and glow, and the lens rim, handle outline and collar',
        },
        {
          link: ['colors.text', 'colors.glow'],
          label: 'Text color',
          hint: 'The caption, the company name and the glow of each word the lens finds',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The honeycomb cells and their words, and the website line',
        },
        {
          link: ['colors.background', 'colors.spotlight', 'colors.glass', 'colors.handle'],
          label: 'Background color',
          hint: 'The background and its soft middle glow, the glass inside the lens and the handle',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The plate behind the logo',
        },
      ],
      more: [
        {
          path: 'colors.primary',
          label: 'Keyword color',
          hint: 'The last word, its underline or highlight and its glow in the lens; dark or pale picks are lifted so they stay readable',
        },
        { path: 'colors.rim', label: 'Lens rim', hint: 'Also the handle outline and collar' },
        { path: 'colors.text', label: 'Caption color', hint: 'Also the company name' },
        {
          path: 'colors.glow',
          label: 'Found word glow',
          hint: 'The glow behind each word the lens finds, before the keyword',
        },
        { path: 'colors.background', label: 'Background' },
        {
          path: 'colors.spotlight',
          label: 'Spotlight',
          hint: 'Soft glow in the middle of the background',
        },
        { path: 'colors.glass', label: 'Glass', hint: 'Behind the sharp cells inside the lens' },
        { path: 'colors.handle', label: 'Handle' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to lay the magnifier and caption over another clip',
        },
      ],
    },
    {
      title: 'Logo and name',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it fits the logo box whole',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Under the logo; long names shrink to one line',
        },
        { path: 'website', label: 'Website', hint: 'Last line; long addresses shrink' },
      ],
      more: [
        {
          path: 'brand.plate',
          label: 'Plate behind the logo',
          hint: 'Keeps dark logos readable; turn off for a logo made for this background',
        },
        {
          path: 'brand.logoWidth',
          label: 'Logo size',
          hint: 'Width of a 4:1 logo in pixels; square and round logos get the same area, so every shape reads at the same weight',
        },
        {
          path: 'brand.logoHeight',
          label: 'Logo height limit',
          hint: 'Tallest a square or round logo may be, in pixels',
        },
        {
          path: 'brand.y',
          label: 'Logo position',
          hint: 'Pixels from the top to the middle of the logo',
        },
        { path: 'type.nameSize', label: 'Name size', hint: 'Largest size in pixels' },
        { path: 'type.websiteSize', label: 'Website size', hint: 'Largest size in pixels' },
      ],
    },
    {
      title: 'Magnifier',
      fields: [{ path: 'lens.radius', label: 'Lens size', hint: 'Radius in pixels' }],
      more: [
        {
          path: 'lens.magnify',
          label: 'Magnification',
          hint: 'How much larger the cells look through the glass; 1 shows them sharp at the same size',
        },
        {
          path: 'lens.x',
          label: 'Resting position across',
          hint: 'Pixels from the left; the lens starts and ends here',
        },
        {
          path: 'lens.y',
          label: 'Resting position down',
          hint: 'Pixels from the top; the lens starts and ends here',
        },
        { path: 'lens.tilt', label: 'Tilt', hint: 'Resting angle of the handle, in degrees' },
        {
          path: 'lens.sway',
          label: 'Wander',
          hint: 'How far the lens shifts and tilts as it travels; 0 keeps it at its resting spot',
        },
        { path: 'lens.handle', label: 'Handle length', hint: 'In pixels; 0 hides the handle' },
        { path: 'lens.rimWidth', label: 'Rim thickness', hint: 'In pixels' },
        { path: 'lens.glint', label: 'Glass glint', hint: 'Strength of the white shine' },
      ],
    },
    {
      title: 'Honeycomb',
      fields: [
        {
          path: 'cells.words',
          label: 'Background words',
          hint: 'One per line, scattered over the cells the lens passes; the first sits under the lens at rest',
        },
      ],
      more: [
        { path: 'cells.shape', label: 'Cell shape' },
        { path: 'cells.blur', label: 'Blur', hint: 'Blur of the cells outside the lens' },
        {
          path: 'cells.size',
          label: 'Caption cell size',
          hint: 'Radius of the cells holding the caption words',
        },
        {
          path: 'cells.spread',
          label: 'Path spread',
          hint: 'How far apart the caption words sit; higher makes the honeycomb travel further',
        },
        {
          path: 'cells.seed',
          label: 'Layout',
          hint: 'Pick another number for another honeycomb',
        },
        {
          path: 'type.cellSize',
          label: 'Cell word size',
          hint: 'Largest size in pixels; long words shrink to fit their cell',
        },
      ],
    },
    {
      title: 'Type',
      fields: [{ path: 'type.caption', label: 'Caption font' }],
      more: [
        {
          path: 'type.body',
          label: 'Body font',
          hint: 'The cell words, the company name and the website',
        },
        {
          path: 'type.captionSize',
          label: 'Caption size',
          hint: 'Largest size in pixels; long captions shrink to fit three lines',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [],
      more: [
        { path: 'timing.firstWord', label: 'First word found', hint: FRAMES },
        {
          path: 'timing.lastWord',
          label: 'Keyword found',
          hint: `${FRAMES}; the words between are spread evenly`,
        },
        {
          path: 'timing.returnAt',
          label: 'Lens heads home',
          hint: `${FRAMES}; until then it drifts with the keyword`,
        },
        {
          path: 'timing.returnFrames',
          label: 'Return length',
          hint: 'In frames, until the lens settles at rest',
        },
        {
          path: 'timing.glide',
          label: 'Speed over each word',
          hint: 'Pixels per frame the honeycomb still moves as a word passes under the lens; lower lingers longer',
        },
      ],
    },
  ],
});
