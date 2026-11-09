import { defineControls } from './control-layout';
import type { DominoWordsProps } from './domino-words-common';

export const dominoWordsControls = defineControls<DominoWordsProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'headline',
          label: 'Domino sentence',
          hint: 'Split into word dominoes in order; the last word or two land as the glowing punchline',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Under the logo at the top; shrinks to fit the width',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'At the top from the first frame; wide, square and round logos all fit',
        },
        {
          path: 'website',
          label: 'Website',
          hint: 'Footer line at the bottom. Leave empty to hide it',
        },
      ],
      more: [
        { path: 'brand.top', label: 'Logo top', hint: 'In pixels from the top edge' },
        {
          path: 'brand.logoHeight',
          label: 'Logo height',
          hint: 'In pixels for a square logo; wide logos stop at half the frame width',
        },
        {
          path: 'brand.plate',
          label: 'Logo plate',
          hint: 'A Surface color plate behind the logo so it reads on any background',
        },
        {
          path: 'brand.nameSize',
          label: 'Company name size',
          hint: 'In pixels; long names shrink to fit',
        },
        { path: 'brand.footerSize', label: 'Website size', hint: 'In pixels' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The ball, the punchline word and the floor glow under it; lifted toward Text color when too dark to read',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The floor line',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Fallen words, the company name and the website. Tile look: the fallen tiles',
        },
        { path: 'colors.background', label: 'Background color' },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The logo plate and the stripe on the striped ball',
        },
      ],
      more: [
        {
          path: 'colors.idle',
          label: 'Standing word color',
          hint: 'Outlines, or tiles in the tile look, of words still waiting to fall',
        },
        {
          path: 'colors.backgroundEdge',
          label: 'Background edge color',
          hint: 'The top of the backdrop and its side shading',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the dominoes over another clip; the reflection needs it on',
        },
      ],
    },
    {
      title: 'Dominoes',
      fields: [
        {
          path: 'words.look',
          label: 'Domino look',
          hint: 'Outline fills in as each word falls; Tile prints words on solid tiles; Neon lights each word up as it falls',
        },
        { path: 'words.font', label: 'Font' },
      ],
      more: [
        { path: 'words.caps', label: 'Capitals', hint: 'Shows the sentence in capital letters' },
        {
          path: 'words.size',
          label: 'Word size',
          hint: 'In pixels for the last domino; words shrink when they would stand too tall',
        },
        {
          path: 'words.growth',
          label: 'Size build',
          hint: 'How much smaller the first domino is than the last, as a share; 0 makes them equal',
        },
        {
          path: 'words.letters',
          label: 'Letters per domino',
          hint: 'Words are grouped up to about this many letters; a longer single word stands alone',
        },
        {
          path: 'words.spacing',
          label: 'Domino spacing',
          hint: 'Gap to the next domino as a share of the falling word; wider gaps lie flatter',
        },
        {
          path: 'words.padding',
          label: 'Breathing room',
          hint: 'Space around each word as a share of its size, so fallen words never touch',
        },
        {
          path: 'words.outline',
          label: 'Outline width',
          hint: 'In pixels, for standing words in the outline and neon looks',
        },
        {
          path: 'words.firstLit',
          label: 'First word lit',
          hint: 'Shows the first domino filled in before the ball hits it',
        },
        {
          path: 'words.lightFrames',
          label: 'Light-up length',
          hint: 'In frames, how long a word takes to fill in once it starts falling',
        },
        {
          path: 'words.glow',
          label: 'Glow',
          hint: 'Glow of the punchline, and of every lit word in the neon look; 0 turns it off',
        },
      ],
    },
    {
      title: 'Chain reaction',
      fields: [
        {
          path: 'timing.chainFrames',
          label: 'Chain length',
          hint: 'In frames, from the first hit until the last domino starts to fall',
        },
      ],
      more: [
        {
          path: 'timing.hitAt',
          label: 'First hit at',
          hint: 'Frame number the ball reaches the first word',
        },
        {
          path: 'timing.lastFrames',
          label: 'Last word fall',
          hint: 'In frames, how long the punchline takes to topple flat',
        },
        {
          path: 'timing.settle',
          label: 'Landing bounce',
          hint: 'In degrees, how far the punchline rebounds when it hits the floor; 0 lands dead',
        },
      ],
    },
    {
      title: 'Ball',
      fields: [{ path: 'pusher.style', label: 'Ball style' }],
      more: [
        { path: 'pusher.show', label: 'Show ball', hint: 'Off still tips the first word on time' },
        { path: 'pusher.radius', label: 'Ball size', hint: 'Radius in pixels' },
        {
          path: 'pusher.rebound',
          label: 'Rebound',
          hint: 'Share of its speed the ball keeps rolling back after the hit; 0 stops it dead',
        },
      ],
    },
    {
      title: 'Floor and camera',
      fields: [
        {
          path: 'floor.reflection',
          label: 'Reflection',
          hint: 'Strength of the mirror image in the floor; 0 turns it off',
        },
      ],
      more: [
        { path: 'floor.y', label: 'Floor height', hint: 'In pixels from the top' },
        { path: 'floor.thickness', label: 'Floor line width', hint: 'In pixels' },
        { path: 'floor.glow', label: 'Floor glow', hint: '0 draws a plain line' },
        {
          path: 'floor.trail',
          label: 'Light trail',
          hint: 'Lights the floor in Primary color under the chain as it falls',
        },
        {
          path: 'floor.reflectionDepth',
          label: 'Reflection depth',
          hint: 'In pixels below the floor',
        },
        {
          path: 'floor.shadow',
          label: 'Floor shadows',
          hint: 'Soft shadows under each word; 0 turns them off',
        },
        {
          path: 'camera.frontAt',
          label: 'Follow position',
          hint: 'Where the falling words sit across the frame while the camera follows, as a share of the width',
        },
        {
          path: 'camera.pullDelay',
          label: 'Pull back at',
          hint: 'In frames after the last word lands; below 0 starts the pull back while it falls',
        },
        { path: 'camera.pullFrames', label: 'Pull back length', hint: 'In frames' },
        {
          path: 'camera.margin',
          label: 'End frame margin',
          hint: 'In pixels on each side of the whole fallen sentence',
        },
      ],
    },
  ],
});
