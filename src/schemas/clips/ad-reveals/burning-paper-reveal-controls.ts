import { defineControls } from '../../control-layout';
import type { BurningPaperRevealProps } from './burning-paper-reveal';

export const burningPaperRevealControls = defineControls<BurningPaperRevealProps>({
  sections: [
    {
      title: 'Card copy',
      fields: [
        {
          path: 'headlineIntro',
          label: 'Intro line',
          hint: 'Small handwritten line above the headline in the Primary color',
        },
        {
          path: 'headline',
          label: 'Headline',
          hint: 'The big serif word or two on the card; long headlines shrink to fit one line',
        },
        {
          path: 'headlineAccent',
          label: 'Accent line',
          hint: 'Handwritten line under the underline on the right, revealed last by the flame',
        },
      ],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in pixels on a card 740 wide; longer headlines shrink below it',
        },
        {
          path: 'type.scriptSize',
          label: 'Handwriting size',
          hint: 'Largest size of the intro and accent lines; long lines shrink to fit',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.accent',
          label: 'Primary color',
          hint: 'The intro line, the underline and the accent line; darkened or lifted automatically if it would not read on the paper',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The headline and the company name',
        },
        {
          link: ['colors.paper', 'colors.border'],
          label: 'Surface color',
          hint: 'The paper card, with its thin inner border in a darker shade',
        },
        {
          link: ['colors.backTop', 'colors.backLeft', 'colors.backRight', 'colors.backFloor'],
          label: 'Background color',
          hint: 'The four folded planes behind the card: the top wall, the pale left wedge, the right wedge and the floor',
        },
      ],
      more: [
        { path: 'colors.paper', label: 'Paper' },
        { path: 'colors.border', label: 'Card border line' },
        { path: 'colors.backTop', label: 'Top wall' },
        { path: 'colors.backLeft', label: 'Left wedge' },
        { path: 'colors.backRight', label: 'Right wedge' },
        { path: 'colors.backFloor', label: 'Floor' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to float the card and hand over another clip',
        },
      ],
    },
    {
      title: 'Name and logo',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Spaced capitals beside the logo along the bottom of the card; long names move under the logo and shrink to fit',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; sits at the bottom left of the card before the name',
        },
      ],
      more: [
        { path: 'type.nameSize', label: 'Name size', hint: 'Largest size in pixels' },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Height of square and round logos in pixels; wide logos are drawn shorter and stop at 3.6 times this width',
        },
        {
          path: 'lockup.showPlate',
          label: 'Logo plate',
          hint: 'A rounded plate behind the logo, for light logos on a light card or dark logos on a dark one',
        },
        { path: 'colors.plate', label: 'Logo plate color' },
      ],
    },
    {
      title: 'Fire',
      fields: [
        {
          path: 'fire.height',
          label: 'Flame height',
          hint: 'How tall the flames rise along the burning edge; 0 leaves only the glowing edge',
        },
        {
          path: 'burn.sweepSeconds',
          label: 'Burn time',
          hint: 'Seconds the flame takes to reach the right edge of the card at a steady pace; the fire then shrinks on the edge for about 4 seconds and the card holds',
        },
      ],
      more: [
        {
          path: 'burn.startAt',
          label: 'Start point',
          hint: 'How much of the card is already there at the first frame, from 0.05 (a sliver) to 0.8',
        },
        {
          path: 'burn.slant',
          label: 'Edge slant',
          hint: 'How far the bottom of the burning edge runs ahead of its top, in pixels; negative leans the other way',
        },
        {
          path: 'burn.jag',
          label: 'Edge raggedness',
          hint: 'How torn the burning edge looks; 0 is a straight line',
        },
        {
          path: 'fire.glow',
          label: 'Fire glow',
          hint: 'Warm light the fire casts on the paper and the wall; 0 turns it off',
        },
        { path: 'fire.sparks', label: 'Sparks', hint: 'How many sparks fly up; 0 turns them off' },
        { path: 'fire.smoke', label: 'Smoke', hint: 'How thick the smoke is; 0 turns it off' },
        {
          path: 'colors.flame',
          label: 'Flame color',
          hint: 'The body of the flames; the core is a pale tint and the edge a deeper shade of it',
        },
        { path: 'colors.smoke', label: 'Smoke color' },
      ],
    },
    {
      title: 'Hand and backdrop',
      fields: [
        {
          path: 'hand.show',
          label: 'Show the hand',
          hint: 'The hand holding the card from the lower left, with its thumb on the card',
        },
        {
          path: 'camera.pullBack',
          label: 'Backdrop pull back',
          hint: 'How much bigger the folded backdrop starts before it eases back behind the held card while the flame burns; 0 holds it still',
        },
      ],
      more: [
        { path: 'colors.skin', label: 'Skin color' },
        { path: 'colors.cuff', label: 'Bracelet color' },
        { path: 'colors.sleeve', label: 'Sleeve color' },
        {
          path: 'camera.tilt',
          label: 'Card tilt',
          hint: 'Degrees the card and hand are turned; negative lifts the right side',
        },
      ],
    },
  ],
});
