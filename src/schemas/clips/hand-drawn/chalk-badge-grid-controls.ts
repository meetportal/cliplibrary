import { defineControls } from '../../control-layout';
import type { ChalkBadgeGridProps } from './chalk-badge-grid';

export const chalkBadgeGridControls = defineControls<ChalkBadgeGridProps>({
  sections: [
    {
      title: 'Badges',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Written on the blue ribbon in the middle of the board; long names shrink to fit',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Sits on a light plate in the bottom right badge under three sparkles',
        },
        {
          path: 'words',
          label: 'Words',
          hint: 'Ten short words, one per badge in reading order: script with swoosh, caps between lines, tape, framed caps, script under an arc, starburst, ring, speech bubble, arrow tag and script with dashes. An empty word leaves its badge off',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.warm', 'colors.pink'],
          label: 'Primary color',
          hint: 'The starburst, the warm script word and the pink sparkles and rays; words on the board are lifted so they always show',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The tape label, the arrow tag and the small diamonds',
        },
        {
          link: ['colors.accent', 'colors.highlight'],
          label: 'Accent color',
          hint: 'The ribbon, the frame and the blue script, plus the yellow lines, bubble and logo sparkles',
        },
        {
          link: ['colors.chalk', 'colors.ink'],
          label: 'Text color',
          hint: 'The white chalk and the dark letters on the tape, burst and ribbon; dark letters turn light on a dark fill',
        },
        {
          link: ['colors.board', 'colors.boardEdge', 'colors.grid'],
          label: 'Background color',
          hint: 'The chalkboard: its lighter middle, darker edges and the grid lines',
        },
      ],
      more: [
        { path: 'colors.primary', label: 'Starburst' },
        { path: 'colors.warm', label: 'Warm script word' },
        { path: 'colors.pink', label: 'Sparkles and rays' },
        { path: 'colors.accent', label: 'Ribbon, frame and blue script' },
        { path: 'colors.highlight', label: 'Yellow lines, bubble and logo sparkles' },
        { path: 'colors.chalk', label: 'Chalk' },
        { path: 'colors.ink', label: 'Dark letters on fills' },
        { path: 'colors.plate', label: 'Logo plate' },
        { path: 'colors.board', label: 'Board middle' },
        { path: 'colors.boardEdge', label: 'Board edges' },
        { path: 'colors.grid', label: 'Grid lines' },
        {
          path: 'showBackground',
          label: 'Show chalkboard',
          hint: 'Turn off to lay the badges over another clip',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [
        {
          path: 'layout.scale',
          label: 'Badge size',
          hint: 'Scales every badge around its own centre',
        },
        {
          path: 'logoBadge.height',
          label: 'Logo size',
          hint: 'Logo height in pixels; wide logos stop at 300 pixels across',
        },
      ],
      more: [
        {
          path: 'layout.spreadX',
          label: 'Column spacing',
          hint: 'How far apart the four columns sit, 1 is the default',
        },
        {
          path: 'layout.spreadY',
          label: 'Row spacing',
          hint: 'How far apart the three rows sit, 1 is the default',
        },
        {
          path: 'logoBadge.showPlate',
          label: 'Logo plate',
          hint: 'The light rounded plate behind the logo',
        },
      ],
    },
    {
      title: 'Sparkles and chalk',
      fields: [
        {
          path: 'ornaments.show',
          label: 'Ornaments',
          hint: 'Sparkles, rays, dashes, diamonds and the small extra strokes',
        },
        {
          path: 'board.grain',
          label: 'Chalk grain',
          hint: 'How dusty and broken the chalk looks, 0 is clean',
        },
      ],
      more: [
        {
          path: 'ornaments.twinkle',
          label: 'Twinkle',
          hint: 'How much the sparkles, rays and dashes move while the board holds',
        },
        { path: 'board.gridSize', label: 'Grid size', hint: 'Grid square size in pixels' },
        { path: 'board.gridOpacity', label: 'Grid strength', hint: '0 hides the grid' },
        { path: 'board.smudge', label: 'Smudges', hint: 'Cloudy chalk dust on the board' },
        {
          path: 'board.lightDrift',
          label: 'Light drift',
          hint: 'How far in pixels the soft light circles over the board during the clip',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          path: 'motion.drawSeconds',
          label: 'Draw time',
          hint: 'Seconds each badge takes to chalk in',
        },
        {
          path: 'motion.eraseAtEnd',
          label: 'Wipe clean at the end',
          hint: 'Erase the words and the ribbon before the loop while the logo stays; off holds the full board to the last frame',
        },
      ],
      more: [
        {
          path: 'motion.stagger',
          label: 'Stagger',
          hint: 'Frames between one badge starting and the next',
        },
      ],
    },
  ],
});
