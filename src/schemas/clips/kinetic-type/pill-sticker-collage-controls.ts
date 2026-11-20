import { defineControls } from '../../control-layout';
import type { PillStickerCollageProps } from './pill-sticker-collage';

export const pillStickerCollageControls = defineControls<PillStickerCollageProps>({
  sections: [
    {
      title: 'Words and brand',
      fields: [
        {
          path: 'headline',
          label: 'Headline',
          hint: 'Each word pops in as its own sticker, in reading order; words of one or two letters become round stickers',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Lands last as the biggest sticker, under the last headline row; long names wrap onto two lines and move the logo under the name',
        },
        {
          path: 'website',
          label: 'Website',
          hint: 'White sticker under the name with an arrow badge. Leave empty to hide both',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Sits on a white sticker beside the name, or under it for long names: a disc for square and round logos, a wide pill for wide ones',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.glow'],
          label: 'Primary color',
          hint: 'Filled stickers, the name sticker, accent words, the starburst, the website arrow and the tint of the corner glow',
        },
        {
          link: ['colors.surface', 'colors.ink'],
          label: 'Surface color',
          hint: 'White stickers, the logo plate, the badges and the ring around the name, with their dark text and arrows',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Words on filled and outlined stickers and the outline lines; adjusted to stay readable',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The backdrop and its corner glow, which is a soft tint of this color toward Primary',
        },
      ],
      more: [
        {
          path: 'colors.primary',
          label: 'Sticker fill color',
          hint: 'Filled stickers and accent words',
        },
        {
          path: 'colors.glow',
          label: 'Glow color',
          hint: 'The color the top-right glow tints toward; it stays a soft tint of the background so text over it keeps reading',
        },
        { path: 'colors.surface', label: 'White sticker color' },
        {
          path: 'colors.ink',
          label: 'White sticker text color',
          hint: 'Words, arrows and the hash on white stickers; adjusted to stay readable',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the stickers over another clip',
        },
      ],
    },
    {
      title: 'Stickers',
      fields: [
        {
          path: 'type.wordSize',
          label: 'Word size',
          hint: 'Text size of the headline stickers in pixels; stickers grow with it',
        },
        {
          path: 'stickers.badges',
          label: 'Badges',
          hint: 'Round arrow, starburst, hash and arrow badges slotted between the words. 0 shows words only',
        },
      ],
      more: [
        { path: 'type.font', label: 'Font', hint: 'Used on every sticker' },
        {
          path: 'stickers.tilt',
          label: 'Tilt',
          hint: 'Largest tilt in degrees; long stickers tilt a little less. 0 keeps them level',
        },
        { path: 'stickers.outline', label: 'Outline width', hint: 'In pixels' },
        {
          path: 'stickers.shadow',
          label: 'Shadow',
          hint: 'Darkness of the soft shadow under filled stickers. 0 turns it off',
        },
        {
          path: 'stickers.rowWidth',
          label: 'Row width',
          hint: 'In pixels, how wide a row of stickers may grow before the next row starts; capped so rows stay in frame',
        },
        {
          path: 'stickers.rowSpacing',
          label: 'Row spacing',
          hint: 'Distance between rows as a share of the sticker height; below 1 rows overlap',
        },
        {
          path: 'stickers.scatter',
          label: 'Scatter',
          hint: 'In pixels, how far rows swing left and right; short rows swing further, every row stays in frame',
        },
      ],
    },
    {
      title: 'Brand stickers',
      fields: [
        {
          path: 'type.nameSize',
          label: 'Name size',
          hint: 'Text size of the company name sticker in pixels',
        },
        {
          path: 'brand.logoSize',
          label: 'Logo plate size',
          hint: 'Height of the logo sticker as a share of the name sticker',
        },
      ],
      more: [
        { path: 'type.websiteSize', label: 'Website size', hint: 'Text size in pixels' },
        {
          path: 'brand.lift',
          label: 'Vertical offset',
          hint: 'In pixels, moves the last headline row and the brand stickers under it up (negative) or down; kept inside the frame',
        },
        {
          path: 'brand.websiteArrow',
          label: 'Website arrow',
          hint: 'A round arrow badge pointing at the website',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.interval',
          label: 'Time between stickers',
          hint: 'In frames; long headlines go faster so the name always lands by frame 220',
        },
      ],
      more: [
        {
          path: 'timing.popFrames',
          label: 'Pop length',
          hint: 'In frames, for each sticker to grow from a dot and settle; most of the growth happens in the first third',
        },
        {
          path: 'timing.brandPause',
          label: 'Pause before the name',
          hint: 'In frames, after the last headline sticker',
        },
        {
          path: 'timing.settleFrames',
          label: 'Drift easing',
          hint: 'In frames; longer smooths the drift and its stop',
        },
        {
          path: 'timing.spin',
          label: 'Badge motion',
          hint: 'Degrees per frame the starburst turns; arrows nudge along with it. 0 holds the badges still',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          path: 'backdrop.glow',
          label: 'Glow strength',
          hint: 'How far the corner glow tints toward Glow color, up to the most that keeps text readable. 0 leaves a flat background',
        },
      ],
      more: [
        {
          path: 'backdrop.reach',
          label: 'Glow reach',
          hint: 'How far across the frame the glow spreads from the top-right corner',
        },
        {
          path: 'backdrop.drift',
          label: 'Glow drift',
          hint: 'How much the glow sways over time. 0 holds it still',
        },
        {
          path: 'backdrop.dither',
          label: 'Dither',
          hint: 'Fine static noise that hides banding in the glow. 0 turns it off',
        },
      ],
    },
  ],
});
