import { defineControls } from '../../control-layout';
import type { AppIconRevealProps } from './app-icon-reveal';

export const appIconRevealControls = defineControls<AppIconRevealProps>({
  sections: [
    {
      title: 'Icon and name',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it fits inside the face of the icon without cropping',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Types in under the icon; long names shrink to stay on one line',
        },
        { path: 'name.font', label: 'Name font' },
      ],
      more: [
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        { path: 'name.tracking', label: 'Letter spacing', hint: 'Share of the name size' },
        { path: 'name.gap', label: 'Space above the name', hint: 'In pixels, below the icon' },
        {
          path: 'name.maxWidth',
          label: 'Widest name',
          hint: 'In pixels; a longer name shrinks to this width',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The blank back of the icon before it flips, and its edge',
        },
        {
          path: 'colors.face',
          label: 'Surface color',
          hint: 'The face of the icon behind the logo',
        },
        { path: 'colors.text', label: 'Text color', hint: 'The company name' },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'Sets the centre and the edges together; set each in More options for a soft vignette',
        },
      ],
      more: [
        { path: 'colors.background', label: 'Background centre' },
        { path: 'colors.backgroundEdge', label: 'Background edges' },
        { path: 'colors.shadow', label: 'Shadow color', hint: 'The soft shadow under the icon' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the reveal over another clip',
        },
      ],
    },
    {
      title: 'Icon',
      fields: [
        {
          path: 'tile.size',
          label: 'Icon size',
          hint: 'Height in pixels; the icon is square unless the logo is wide',
        },
        {
          path: 'tile.roundness',
          label: 'Corner roundness',
          hint: 'Share of the icon size; 50 makes a circle',
        },
        {
          path: 'tile.logoPadding',
          label: 'Logo padding',
          hint: 'Space around the logo, as a share of the icon size',
        },
      ],
      more: [
        {
          path: 'tile.widest',
          label: 'Widest icon',
          hint: 'How far the icon may stretch for a wide logo, as a multiple of its height; 1 keeps it square',
        },
        {
          path: 'tile.depth',
          label: 'Icon thickness',
          hint: 'In pixels, the edge you see while it flips; 0 makes it paper thin',
        },
        { path: 'tile.shadow', label: 'Shadow strength', hint: '0 turns the shadows off' },
        {
          path: 'layout.offsetY',
          label: 'Move up or down',
          hint: 'In pixels; negative moves the icon and name up',
        },
      ],
    },
    {
      title: 'Flip and typing',
      fields: [
        { path: 'timing.flipFrames', label: 'Flip length', hint: 'In frames, for the half turn' },
        {
          path: 'timing.letterFrames',
          label: 'Typing speed',
          hint: 'Frames between letters; long names type faster to finish in about a second',
        },
      ],
      more: [
        {
          path: 'timing.flipStart',
          label: 'Flip start',
          hint: 'Frame number the icon starts to turn',
        },
        {
          path: 'timing.typeDelay',
          label: 'Typing delay',
          hint: 'Frames after the icon turns edge-on before the first letter',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          path: 'life.float',
          label: 'Float',
          hint: 'In pixels, how far the icon bobs once it lands; 0 holds it still',
        },
        {
          path: 'life.shine',
          label: 'Shine',
          hint: 'The light that sweeps across the back before the flip; 0 turns it off',
        },
      ],
      more: [
        {
          path: 'life.lift',
          label: 'Lift while turning',
          hint: 'How much the icon grows toward you mid flip; 0 keeps its size',
        },
      ],
    },
  ],
});
