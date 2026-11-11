import { defineControls } from '../../control-layout';
import type { BrandingIsTickerProps } from './branding-is-ticker';

export const brandingIsTickerControls = defineControls<BrandingIsTickerProps>({
  sections: [
    {
      title: 'Brand',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'On the corner tile, then on the end card; wide, square and round logos all fit',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Under the corner tile and under the logo on the end card; long names shrink to fit',
        },
        {
          path: 'website',
          label: 'Website',
          hint: 'First contact line on the end card. Leave empty to hide it',
        },
        {
          path: 'phone',
          label: 'Phone',
          hint: 'Second contact line on the end card. Leave empty to hide it',
        },
      ],
      more: [
        {
          path: 'layout.tileSize',
          label: 'Corner tile size',
          hint: 'Height in pixels; wide logos widen the tile up to three times its height',
        },
        {
          path: 'layout.nameSize',
          label: 'Corner name size',
          hint: 'In pixels; long names shrink to fit',
        },
        {
          path: 'endCard.logoSize',
          label: 'End card logo size',
          hint: 'Height in pixels of the gradient logo tile',
        },
        {
          path: 'endCard.nameSize',
          label: 'End card name size',
          hint: 'In pixels; long names shrink to fit the width',
        },
        {
          path: 'endCard.nameCaps',
          label: 'End card name in capitals',
          hint: 'The corner name is always in capitals',
        },
        {
          path: 'endCard.contactSize',
          label: 'Contact text size',
          hint: 'In pixels; the icon chips scale with it and long lines shrink to fit',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The word in the slot and its underline, the logo tile and button gradient and the contact icons; lifted automatically where it would be hard to read',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The headline, the corner name and, faded, the waiting words',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'Centre of the dark opening stage',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The corner tile and the end card it grows into',
        },
      ],
      more: [
        {
          path: 'colors.backgroundEdge',
          label: 'Background edge color',
          hint: 'Corners of the dark opening stage',
        },
        {
          path: 'colors.ink',
          label: 'End card text color',
          hint: 'The name and contact lines on the end card, and the button text when the button is light',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the opening over another clip; the end card always shows',
        },
      ],
    },
    {
      title: 'Words',
      fields: [
        {
          path: 'headline',
          label: 'Headline',
          hint: 'Italic lines above the ticker, one per line; long lines shrink to fit',
        },
        {
          path: 'words',
          label: 'Ticker words',
          hint: 'Each glides into the underlined slot in turn and the ticker comes back to the first; a comma is added after each',
        },
      ],
      more: [
        { path: 'type.headlineFont', label: 'Headline font' },
        {
          path: 'type.wordFont',
          label: 'Word font',
          hint: 'Also the name, button and contact lines',
        },
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'In pixels; long lines shrink to fit',
        },
        {
          path: 'type.wordSize',
          label: 'Word size',
          hint: 'In pixels; shrinks so the longest word fits the width',
        },
        {
          path: 'ticker.dimStrength',
          label: 'Waiting word strength',
          hint: 'How much the words outside the slot stand out from the background',
        },
        {
          path: 'ticker.underline',
          label: 'Underline thickness',
          hint: 'In pixels; 0 hides the underline',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        {
          path: 'callToAction',
          label: 'Button text',
          hint: 'Shown in capitals on the gradient button. Leave empty to hide the button',
        },
        {
          path: 'endCard.sheen',
          label: 'Button shine',
          hint: 'A soft light sweeps across the button while the end card holds',
        },
      ],
      more: [
        {
          path: 'endCard.buttonSize',
          label: 'Button text size',
          hint: 'In pixels; the button grows with it',
        },
        {
          path: 'timing.transitionFrames',
          label: 'Tile grow length',
          hint: 'In frames, how long the corner tile takes to grow into the end card',
        },
        {
          path: 'timing.stagger',
          label: 'End card stagger',
          hint: 'In frames between the logo, name, button and contact lines rising in',
        },
      ],
    },
    {
      title: 'Ticker and layout',
      fields: [
        {
          path: 'ticker.cycleFrames',
          label: 'Ticker length',
          hint: 'In frames until the ticker comes back to the first word and the end card starts; each word gets an equal share',
        },
        {
          path: 'ticker.glide',
          label: 'Glide',
          hint: 'How much the ticker keeps moving between words; low values pause on each word, high values glide evenly',
        },
      ],
      more: [
        {
          path: 'layout.left',
          label: 'Left margin',
          hint: 'In pixels; the corner tile, headline and slot line up on it',
        },
        { path: 'layout.top', label: 'Corner tile top', hint: 'In pixels from the top edge' },
        {
          path: 'layout.offsetY',
          label: 'Headline position',
          hint: 'In pixels; moves the headline and ticker up or down',
        },
        {
          path: 'layout.lightDrift',
          label: 'Light drift',
          hint: 'In pixels, how far the soft light wanders behind the words and the end card; 0 holds it still',
        },
      ],
    },
  ],
});
