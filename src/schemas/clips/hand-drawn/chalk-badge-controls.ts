import { defineControls } from '../../control-layout';
import type { ChalkBadgeProps } from './chalk-badge';

export const chalkBadgeControls = defineControls<ChalkBadgeProps>({
  sections: [
    {
      title: 'Words on the board',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'The big chalk word in the middle; long names shrink to stay on one line',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Small spaced capitals typed in along the top of the board',
        },
        {
          path: 'word.font',
          label: 'Handwriting',
          hint: 'The brush script the name is written in',
        },
      ],
      more: [
        {
          path: 'word.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink below it to fit the width',
        },
        {
          path: 'word.maxWidth',
          label: 'Name width',
          hint: 'Widest the written name may get in pixels before it shrinks',
        },
        {
          path: 'word.rise',
          label: 'Name height',
          hint: 'Moves the name, its underline and sparkles up (negative) or down in pixels',
        },
        { path: 'caption.size', label: 'Tagline size', hint: 'Largest size in pixels' },
        {
          path: 'caption.tracking',
          label: 'Tagline spacing',
          hint: 'Space between the tagline letters, in ems',
        },
        { path: 'caption.top', label: 'Tagline position', hint: 'Pixels from the top edge' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The two sparkles; lifted automatically if it would not show on the board',
        },
        {
          path: 'colors.chalk',
          label: 'Text color',
          hint: 'The chalk of the name, the underline, the tagline and the dust',
        },
        {
          link: ['colors.board', 'colors.boardEdge', 'colors.grid'],
          label: 'Background color',
          hint: 'The chalkboard: its lighter middle, darker edges and the grid lines',
        },
        {
          path: 'colors.plate',
          label: 'Surface color',
          hint: 'The rounded plate behind the logo',
        },
      ],
      more: [
        { path: 'colors.board', label: 'Board middle' },
        { path: 'colors.boardEdge', label: 'Board edges' },
        { path: 'colors.grid', label: 'Grid lines' },
        {
          path: 'showBackground',
          label: 'Show chalkboard',
          hint: 'Turn off to write the badge over another clip',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        { path: 'logo', label: 'Logo', hint: 'Wide, square or round; drawn in under the name' },
      ],
      more: [
        { path: 'lockup.show', label: 'Show logo', hint: 'Turn off for the name alone' },
        {
          path: 'lockup.height',
          label: 'Logo size',
          hint: 'Height of a square or round logo in pixels; wide logos are drawn a little shorter',
        },
        {
          path: 'lockup.bottom',
          label: 'Logo position',
          hint: 'Pixels from the bottom edge to the bottom of the logo plate',
        },
        {
          path: 'lockup.showPlate',
          label: 'Logo plate',
          hint: 'A rounded plate behind the logo so dark logos read on the board',
        },
      ],
    },
    {
      title: 'Underline and sparkles',
      fields: [
        { path: 'swoosh.show', label: 'Underline', hint: 'The chalk swoosh drawn under the name' },
        { path: 'sparkles.show', label: 'Sparkles' },
      ],
      more: [
        {
          path: 'swoosh.loop',
          label: 'Underline loop',
          hint: 'Curl the swoosh into a small loop after the last letter',
        },
        {
          path: 'swoosh.thickness',
          label: 'Underline weight',
          hint: 'Stroke thickness as a share of the name size',
        },
        { path: 'sparkles.size', label: 'Sparkle size', hint: '1 is the standard size' },
        {
          path: 'sparkles.twinkle',
          label: 'Sparkle twinkle',
          hint: 'How much the sparkles pulse and turn while the badge holds; 0 keeps them still',
        },
      ],
    },
    {
      title: 'Chalkboard',
      fields: [
        {
          path: 'board.dust',
          label: 'Chalk dust',
          hint: 'Faint motes drifting up from the writing; 0 turns them off',
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
          hint: 'Seconds to write the name; the underline, sparkles and logo follow',
        },
        {
          path: 'motion.eraseAtEnd',
          label: 'Wipe clean at the end',
          hint: 'Erase the board left to right in the last second so the clip loops',
        },
      ],
    },
  ],
});
