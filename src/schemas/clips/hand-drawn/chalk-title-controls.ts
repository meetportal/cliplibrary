import { defineControls } from '../../control-layout';
import type { ChalkTitleProps } from './chalk-title';

export const chalkTitleControls = defineControls<ChalkTitleProps>({
  sections: [
    {
      title: 'Words on the board',
      fields: [
        {
          path: 'titleStart',
          label: 'First word',
          hint: 'Written left of the ampersand; long words shrink so both sides stay balanced',
        },
        {
          path: 'titleEnd',
          label: 'Second word',
          hint: 'Written right of the ampersand, sitting a little higher',
        },
        {
          path: 'caption',
          label: 'Company name',
          hint: 'Small spaced line written under the title',
        },
      ],
      more: [
        {
          path: 'title.font',
          label: 'Handwriting',
          hint: 'The brush script both words are written in',
        },
        {
          path: 'title.size',
          label: 'Word size',
          hint: 'Largest size in pixels; long words shrink below it to fit beside the ampersand',
        },
        {
          path: 'title.gap',
          label: 'Space around the ampersand',
          hint: 'Pixels between each word and the ampersand',
        },
        {
          path: 'title.raiseEnd',
          label: 'Second word lift',
          hint: 'Pixels the second word sits above the first; 0 lines them up',
        },
        {
          path: 'title.offsetY',
          label: 'Title height',
          hint: 'Moves the whole title up (negative) or down in pixels',
        },
        { path: 'byline.show', label: 'Show company name', hint: 'Turn off for the title alone' },
        { path: 'byline.size', label: 'Company name size', hint: 'Largest size in pixels' },
        {
          path: 'byline.tracking',
          label: 'Company name spacing',
          hint: 'Space between its letters, in ems',
        },
        {
          path: 'byline.gap',
          label: 'Company name distance',
          hint: 'Pixels from the bottom of the title to the company name',
        },
        {
          path: 'byline.uppercase',
          label: 'Company name in capitals',
          hint: 'Writes the company name in capital letters',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The sparkles and the line behind the ampersand; lifted automatically if it would not show on the board',
        },
        {
          path: 'colors.chalk',
          label: 'Text color',
          hint: 'The chalk of the words, the ampersand, the company name and the dust',
        },
        {
          link: ['colors.board', 'colors.boardEdge', 'colors.grid'],
          label: 'Background color',
          hint: 'The chalkboard: its lighter middle, darker edges and the grid lines',
        },
      ],
      more: [
        { path: 'colors.board', label: 'Board middle' },
        { path: 'colors.boardEdge', label: 'Board edges' },
        { path: 'colors.grid', label: 'Grid lines' },
        {
          path: 'showBackground',
          label: 'Show chalkboard',
          hint: 'Turn off to write the title over another clip',
        },
      ],
    },
    {
      title: 'Ampersand',
      fields: [
        { path: 'ampersand.font', label: 'Ampersand style', hint: 'The typeface of the big &' },
        {
          path: 'ampersand.size',
          label: 'Ampersand size',
          hint: 'In pixels; it shrinks a little when long words shrink',
        },
      ],
      more: [
        {
          path: 'ampersand.dropLine',
          label: 'Colored drop line',
          hint: 'A thin line in the primary color offset behind the ampersand',
        },
      ],
    },
    {
      title: 'Sparkles',
      fields: [
        { path: 'sparkles.show', label: 'Sparkles', hint: 'Three sparkles above the ampersand' },
        {
          path: 'sparkles.twinkle',
          label: 'Sparkle twinkle',
          hint: 'How much the sparkles pulse, turn and glow while the title holds; 0 keeps them still',
        },
      ],
      more: [{ path: 'sparkles.size', label: 'Sparkle size', hint: '1 is the standard size' }],
    },
    {
      title: 'Chalkboard',
      fields: [
        {
          path: 'board.dust',
          label: 'Chalk dust',
          hint: 'Dust shed while writing and motes drifting up while it holds; 0 turns them off',
        },
        {
          path: 'board.grain',
          label: 'Chalk grain',
          hint: 'How dusty and broken the chalk strokes look',
        },
      ],
      more: [
        {
          path: 'board.lightDrift',
          label: 'Light drift',
          hint: 'How far the soft light on the board circles during the clip, in pixels; 0 holds it still',
        },
        { path: 'board.gridSize', label: 'Grid size', hint: 'Pixels between grid lines' },
        { path: 'board.gridOpacity', label: 'Grid strength', hint: '0 hides the grid' },
        {
          path: 'board.smudge',
          label: 'Smudges',
          hint: 'Erased chalk clouds on the board; 0 is a clean board',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          path: 'motion.writeSeconds',
          label: 'Writing time',
          hint: 'Seconds to write each word and the ampersand; the sparkles and company name follow',
        },
        {
          path: 'motion.eraseAtEnd',
          label: 'Erase at the end',
          hint: 'Wipe the board right to left in the last second so the clip loops',
        },
      ],
      more: [
        {
          path: 'motion.smear',
          label: 'Erased smear',
          hint: 'How strongly the wiped title stays as a faint smear; 0 wipes it clean. Needs Erase at the end',
        },
      ],
    },
  ],
});
