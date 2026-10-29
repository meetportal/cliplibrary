import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { BotanicalSaveTheDateProps } from './botanical-save-the-date';

const CAPS = 'Shown in spaced capitals';
const ARRIVES = 'Frame number. The previous part fades out as this one arrives';

export const botanicalSaveTheDateControls = defineControls<BotanicalSaveTheDateProps>({
  sections: [
    {
      title: 'Couple',
      fields: [
        { path: 'partnerOne', label: 'First name', hint: CAPS },
        { path: 'partnerTwo', label: 'Second name', hint: CAPS },
      ],
      more: [
        { path: 'coupleIntro', label: 'Line above the names', hint: 'Leave empty to hide it' },
        {
          path: 'partnerJoiner',
          label: 'Word between the names',
          hint: 'In script. Leave empty to hide it',
        },
        { path: 'lettering.nameSize', label: 'Name size' },
        { path: 'lettering.partnerJoinerSize', label: 'Joining word size' },
        { path: 'lettering.introSize', label: 'Line above size' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'greenery',
          label: 'Primary color',
          hint: 'Stems and leaves of the sprigs and the leaves on the event frames',
        },
        {
          path: 'gold',
          label: 'Secondary color',
          hint: 'The fine gold lines: page border, short rules and event frames',
        },
        {
          ...LOOK.accent,
          label: 'Accent color',
          hint: 'Script lettering and the berries on the olive sprigs',
        },
        {
          link: ['look.ink', 'look.muted'],
          label: 'Text color',
          hint: 'All serif capitals; the small print keeps its lighter shade',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'The paper, center and corners',
        },
      ],
      more: [
        { ...LOOK.ink, label: 'Capitals color', hint: 'Poem, date, names, event details' },
        {
          ...LOOK.muted,
          label: 'Small print color',
          hint: 'Line above the names, event addresses and the sign-off',
        },
        { ...LOOK.background, label: 'Paper center' },
        { ...LOOK.backgroundEdge, label: 'Paper corners' },
      ],
    },
    {
      title: 'Poem',
      fields: [
        {
          path: 'poem',
          label: 'Poem',
          hint: 'One line per row. Rows alternate: serif capitals, then script',
        },
      ],
      more: [
        { path: 'lettering.poemSerifSize', label: 'Capital lines size' },
        { path: 'lettering.poemScriptSize', label: 'Script lines size' },
      ],
    },
    {
      title: 'Save the date',
      fields: [{ path: 'date', label: 'Date', hint: 'Shown under a short gold line' }],
      more: [
        { path: 'saveTop', label: 'Top word', hint: CAPS },
        {
          path: 'saveJoiner',
          label: 'Script word',
          hint: 'Tucked between the two big words. Leave empty to hide it',
        },
        { path: 'saveBottom', label: 'Bottom word', hint: CAPS },
        { path: 'lettering.saveSize', label: 'Big words size' },
        { path: 'lettering.saveWeight', label: 'Big words weight' },
        { path: 'lettering.saveScriptSize', label: 'Script word size' },
        { path: 'lettering.dateSize', label: 'Date size' },
      ],
    },
    {
      title: 'Event cards',
      fields: [
        {
          path: 'events',
          label: 'Events',
          hint: 'One to four cards, shown one after another between the couple and the closing',
          items: {
            title: 'Event name',
            time: 'Day and time',
            venue: 'Venue',
            address: 'Address',
            frame: 'Frame shape',
          },
        },
      ],
      more: [
        { path: 'cards.width', label: 'Frame width', hint: 'In pixels' },
        { path: 'cards.height', label: 'Frame height', hint: 'In pixels' },
        { path: 'cards.lineWidth', label: 'Frame line weight', hint: 'In pixels' },
        { path: 'cards.innerLine', label: 'Thin inner line' },
        { path: 'cards.leaves', label: 'Leaves on the frames' },
        {
          path: 'cards.drawFrames',
          label: 'Frame draw length',
          hint: 'In frames. The card text starts a quarter of the way through',
        },
        { path: 'lettering.cardTitleSize', label: 'Event name size' },
        { path: 'lettering.cardTextSize', label: 'Event details size' },
      ],
    },
    {
      title: 'Closing',
      fields: [{ path: 'familyName', label: 'Family name', hint: 'In script' }],
      more: [
        { path: 'closingLine', label: 'Closing line', hint: `${CAPS}. One line per row` },
        { path: 'signoff', label: 'Sign-off', hint: 'Small line above the family name' },
        { path: 'lettering.closingSize', label: 'Closing line size' },
        { path: 'lettering.signoffSize', label: 'Sign-off size' },
        { path: 'lettering.familySize', label: 'Family name size' },
      ],
    },
    {
      title: 'Sprigs',
      fields: [
        {
          path: 'sprigs.count',
          label: 'Sprigs',
          hint: 'Corners filled in order: top left, bottom right, top right, bottom left. 0 hides them',
        },
      ],
      more: [
        { path: 'sprigs.size', label: 'Sprig size' },
        { path: 'sprigs.sway', label: 'Sway', hint: 'In degrees. 0 holds them still' },
        { path: 'sprigs.swayPeriod', label: 'Sway cycle', hint: 'In frames for one full sway' },
        {
          path: 'sprigs.leafFill',
          label: 'Leaf tint',
          hint: '0 leaves only the outlines. Also the leaves on the event frames',
        },
        {
          path: 'sprigs.lineWidth',
          label: 'Line weight',
          hint: 'In pixels. The leaves on the event frames are drawn a little finer',
        },
        { path: 'sprigs.berries', label: 'Berries', hint: 'On the olive sprigs' },
        {
          path: 'sprigs.at',
          label: 'Sprigs start at',
          hint: 'Frame number. The border starts too',
        },
        { path: 'sprigs.stagger', label: 'Sprig stagger', hint: 'In frames between sprigs' },
        { path: 'sprigs.drawFrames', label: 'Grow length', hint: 'In frames for each sprig' },
      ],
    },
    {
      title: 'Lettering',
      fields: [
        { path: 'scriptFont', label: 'Script font' },
        { path: 'serifFont', label: 'Serif font' },
      ],
      more: [
        {
          path: 'lettering.capsTracking',
          label: 'Capitals spacing',
          hint: 'Letter spacing in em for the poem, date, event cards and closing. The big words and names keep their own',
        },
        { path: 'lettering.textWidth', label: 'Text width', hint: 'In pixels. Longer lines wrap' },
        {
          path: 'lettering.offsetY',
          label: 'Move text up or down',
          hint: 'In pixels. Moves the text and the event cards',
        },
      ],
    },
    {
      title: 'Page border',
      fields: [],
      more: [
        { path: 'border.show', label: 'Show border' },
        { path: 'border.inset', label: 'Distance from edge', hint: 'In pixels' },
        {
          path: 'border.width',
          label: 'Gold line weight',
          hint: 'In pixels. The border and the short rules under the date and titles',
        },
        { path: 'border.drawFrames', label: 'Border draw length', hint: 'In frames' },
      ],
    },
    {
      title: 'Background',
      fields: [],
      more: [
        LOOK.showBackdrop,
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.paper,
        { ...LOOK.paperLine, hint: 'Ruled and grid paper only' },
        LOOK.paperSpacing,
        { ...LOOK.paperMargin, hint: 'Drawn in the accent color' },
      ],
    },
    {
      title: 'Timing',
      fields: [],
      more: [
        { path: 'timing.poemAt', label: 'Poem at', hint: 'Frame number' },
        { path: 'timing.dateAt', label: 'Save the date at', hint: ARRIVES },
        { path: 'timing.coupleAt', label: 'Couple at', hint: ARRIVES },
        {
          path: 'timing.eventsAt',
          label: 'Event cards at',
          hint: `${ARRIVES}. The cards share the time until the closing`,
        },
        { path: 'timing.closingAt', label: 'Closing at', hint: ARRIVES },
        {
          path: 'timing.overlap',
          label: 'Hand-off overlap',
          hint: 'In frames the outgoing part starts fading before the next arrives',
        },
        { path: 'timing.lineStagger', label: 'Line stagger', hint: 'In frames between lines' },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['motion.float', 'motion.speed'],
});
