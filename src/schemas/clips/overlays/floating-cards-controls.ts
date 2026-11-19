import { defineControls } from '../../control-layout';
import type { FloatingCardsProps } from './floating-cards';

export const floatingCardsControls = defineControls<FloatingCardsProps>({
  sections: [
    {
      title: 'Cards',
      fields: [
        {
          path: 'cards',
          label: 'Cards',
          hint: 'One to four cards, arriving in this order. Position is the card centre in pixels on the 1920 by 1080 frame; tilt is degrees; colour picks one of the three card colours; highlight paints the number in that colour',
          items: {
            label: 'Label',
            value: 'Number',
            icon: 'Icon',
            tone: 'Card color',
            highlight: 'Color the number',
            x: 'Across',
            y: 'Down',
            tilt: 'Tilt',
          },
        },
        {
          path: 'card.size',
          label: 'Card size',
          hint: 'Scales every card, its text and its icon together',
        },
      ],
      more: [
        {
          path: 'layout.x',
          label: 'Move all across',
          hint: 'Pixels; shifts every card sideways together',
        },
        {
          path: 'layout.y',
          label: 'Move all down',
          hint: 'Pixels; shifts every card up or down together',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.secondary', 'colors.accent'],
          label: 'Primary color',
          hint: 'The highlighted card (the coloured number and its icon); the other two card colours turn with it and keep their spacing',
        },
        {
          link: ['colors.value', 'colors.label'],
          label: 'Text color',
          hint: 'The numbers, with the small labels in a lighter shade of it',
        },
        { path: 'colors.surface', label: 'Surface color', hint: 'The card fill' },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'The backdrop, a little darker toward the corners',
        },
      ],
      more: [
        {
          path: 'colors.primary',
          label: 'Primary card color',
          hint: 'Cards set to Primary: icon tile and, when highlighted, the number',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary card color',
          hint: 'Cards set to Secondary: icon tile and, when highlighted, the number',
        },
        {
          path: 'colors.accent',
          label: 'Accent card color',
          hint: 'Cards set to Accent: icon tile and, when highlighted, the number',
        },
        { path: 'colors.value', label: 'Number color', hint: 'Numbers that are not highlighted' },
        { path: 'colors.label', label: 'Label color', hint: 'The small line above each number' },
        { path: 'colors.background', label: 'Background centre' },
        { path: 'colors.backgroundEdge', label: 'Background corners' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to float the cards over another clip; they then sink and fade at the end instead of dipping the frame',
        },
        {
          path: 'colors.fade',
          label: 'End dip color',
          hint: 'The colour the whole frame dips to at the end, with the background on',
        },
      ],
    },
    {
      title: 'Text',
      fields: [
        { path: 'type.font', label: 'Font' },
        {
          path: 'type.valueSize',
          label: 'Number size',
          hint: 'Pixels at card size 1; long text shrinks to fit the widest card',
        },
      ],
      more: [{ path: 'type.labelSize', label: 'Label size', hint: 'Pixels at card size 1' }],
    },
    {
      title: 'Float',
      fields: [
        {
          path: 'float.height',
          label: 'Float height',
          hint: 'Pixels each card bobs up and down; 0 holds them still',
        },
        {
          path: 'float.cycle',
          label: 'Float cycle',
          hint: 'Frames for one full bob; the cards bob a quarter cycle apart',
        },
      ],
      more: [
        {
          path: 'float.sway',
          label: 'Sway',
          hint: 'Degrees each card rocks with its bob',
        },
        {
          path: 'float.depth',
          label: 'Lift shadow',
          hint: 'How much the shadow softens and drops as a card floats up; 0 keeps it fixed',
        },
      ],
    },
    {
      title: 'Card style',
      fields: [
        { path: 'card.radius', label: 'Corner radius', hint: 'Pixels at card size 1' },
        { path: 'card.shadow', label: 'Shadow', hint: 'Strength of the soft shadow; 0 is flat' },
      ],
      more: [
        { path: 'card.padding', label: 'Padding', hint: 'Pixels inside the card edge' },
        { path: 'card.icon', label: 'Icon tile size', hint: 'Pixels at card size 1' },
        {
          path: 'card.minWidth',
          label: 'Narrowest card',
          hint: 'Pixels; short text still gets a card at least this wide',
        },
        {
          path: 'card.maxWidth',
          label: 'Widest card',
          hint: 'Pixels; longer text shrinks to stay inside it',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.stagger',
          label: 'Stagger',
          hint: 'Frames between one card starting to rise in and the next',
        },
        {
          path: 'timing.entrance',
          label: 'Rise-in length',
          hint: 'Frames each card takes to drift up into place',
        },
      ],
      more: [
        {
          path: 'timing.lead',
          label: 'Head start',
          hint: 'Frames of the first card rise already done on the first frame, so the clip never opens empty',
        },
        {
          path: 'timing.rise',
          label: 'Rise distance',
          hint: 'Pixels each card travels up as it arrives',
        },
        {
          path: 'timing.exit',
          label: 'End dip',
          hint: 'Frames of the dip at the very end; 0 holds the floating cards to the last frame',
        },
      ],
    },
  ],
});
