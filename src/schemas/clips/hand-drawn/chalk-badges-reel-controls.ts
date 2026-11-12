import { defineControls } from '../../control-layout';
import type { ChalkBadgesReelProps } from './chalk-badges-reel';

export const chalkBadgesReelControls = defineControls<ChalkBadgesReelProps>({
  sections: [
    {
      title: 'Badges',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Written across the top of the board from the badge sheet until the logo lands on the end card; long names shrink to fit',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Lands on a light plate at the top of the end card; wide, square and round logos all fit',
        },
        {
          path: 'opener.left',
          label: 'Opening word, left',
          hint: 'Script word written before the ampersand in the opening pair',
        },
        {
          path: 'opener.right',
          label: 'Opening word, right',
          hint: 'Script word written after the ampersand in the opening pair',
        },
        {
          path: 'words',
          label: 'Badge words',
          hint: 'Six short words in reading order: script with swash, tape label, starburst, ribbon, speech bubble and sun ring. Long words shrink inside their badge',
        },
      ],
      more: [
        {
          path: 'spotlight.first',
          label: 'First close-up',
          hint: 'Which badge (1 to 6) is drawn big on its own first, after the sheet is wiped',
        },
        {
          path: 'spotlight.second',
          label: 'Second close-up',
          hint: 'Badge number for the second close-up',
        },
        {
          path: 'spotlight.third',
          label: 'Third close-up',
          hint: 'Badge number for the third close-up',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The starburst, the website underline, the badge sparkles and the sun rays; letters on it turn light or dark to stay readable',
        },
        {
          link: ['colors.secondary', 'colors.ribbon'],
          label: 'Secondary color',
          hint: 'The tape label and the ribbon banner',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'The end card headline, the speech bubble and the opening sparkles; lifted on dark boards so it always shows',
        },
        {
          link: ['colors.chalk', 'colors.ink'],
          label: 'Text color',
          hint: 'The white chalk and the dark letters on the tape, burst and ribbon',
        },
        {
          link: ['colors.board', 'colors.boardEdge', 'colors.grid'],
          label: 'Background color',
          hint: 'The chalkboard: its lighter middle, darker edges and the grid lines',
        },
      ],
      more: [
        { path: 'colors.secondary', label: 'Tape label' },
        { path: 'colors.ribbon', label: 'Ribbon banner' },
        { path: 'colors.chalk', label: 'Chalk' },
        { path: 'colors.ink', label: 'Dark letters on fills' },
        { path: 'colors.plate', label: 'Logo plate' },
        { path: 'colors.board', label: 'Board middle' },
        { path: 'colors.boardEdge', label: 'Board edges and text shadow' },
        { path: 'colors.grid', label: 'Grid lines' },
        {
          path: 'showBackground',
          label: 'Show chalkboard',
          hint: 'Turn off to lay the chalk over another clip',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        {
          path: 'endCard.lineOne',
          label: 'Headline, first line',
          hint: 'Smaller line above the big one',
        },
        {
          path: 'endCard.lineTwo',
          label: 'Headline, big line',
          hint: 'The largest line of the end card',
        },
        { path: 'endCard.tagline', label: 'Tagline', hint: 'Line under the big headline' },
        {
          path: 'endCard.website',
          label: 'Website',
          hint: 'Last line, underlined in the Primary color',
        },
      ],
      more: [
        {
          path: 'layout.headlineScale',
          label: 'Headline size',
          hint: 'Scales the end card lines; long lines still shrink to fit',
        },
        {
          path: 'layout.logoHeight',
          label: 'Logo size',
          hint: 'Logo height in pixels for wide logos; square and round logos are drawn 1.3 times taller, and no logo grows wider than 3.4 times this',
        },
        {
          path: 'layout.showPlate',
          label: 'Logo plate',
          hint: 'The light rounded plate behind the logo',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [
        { path: 'layout.badgeScale', label: 'Badge size', hint: 'Size of the badges on the sheet' },
        {
          path: 'layout.spotlightScale',
          label: 'Close-up size',
          hint: 'How big each close-up badge is drawn',
        },
      ],
    },
    {
      title: 'Chalk and board',
      fields: [],
      more: [
        {
          path: 'motion.ornaments',
          label: 'Ornaments',
          hint: 'Sparkles, rays, slashes and small extra strokes',
        },
        {
          path: 'motion.twinkle',
          label: 'Twinkle',
          hint: 'How much the sparkles and rays move during holds',
        },
        {
          path: 'board.grain',
          label: 'Chalk grain',
          hint: 'How dusty and broken the chalk looks, 0 is clean',
        },
        { path: 'board.gridSize', label: 'Grid size', hint: 'Grid square size in pixels' },
        { path: 'board.gridOpacity', label: 'Grid strength', hint: '0 hides the grid' },
        { path: 'board.smudge', label: 'Smudges', hint: 'Cloudy chalk dust on the board' },
        {
          path: 'board.lightDrift',
          label: 'Light drift',
          hint: 'How far in pixels the soft light travels across the board during the clip',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [
        {
          path: 'motion.eraseAtEnd',
          label: 'Wipe clean at the end',
          hint: 'Erase the end card in the last half second so the loop starts on a clean board; off holds it to the last frame',
        },
      ],
    },
  ],
});
