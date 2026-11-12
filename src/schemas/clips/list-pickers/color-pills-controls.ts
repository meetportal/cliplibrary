import { defineControls } from '../../control-layout';
import type { ColorPillsProps } from './color-pills';

export const colorPillsControls = defineControls<ColorPillsProps>({
  sections: [
    {
      title: 'Pills',
      fields: [
        {
          path: 'pills',
          label: 'Pills',
          hint: 'Top to bottom, 2 to 7, visited by the cursor in order. Each pill color turns from the Primary color by its hue shift (degrees), lightness and vividness; side offset is pixels of zigzag',
          items: {
            label: 'Label',
            hue: 'Hue shift from Primary',
            shade: 'Lightness',
            vividness: 'Vividness',
            offset: 'Side offset',
          },
        },
        { path: 'type.size', label: 'Text size', hint: 'In pixels; many pills shrink to fit' },
      ],
      more: [
        { path: 'type.font', label: 'Font' },
        { path: 'type.bullet', label: 'Bullet dot', hint: 'The small dot before each label' },
        { path: 'pill.height', label: 'Pill height', hint: 'In pixels' },
        { path: 'pill.padding', label: 'Side padding', hint: 'In pixels, inside each pill' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The first pill; every other pill turns around the color wheel from it',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Pill labels and bullets; darkens on its own where a pill is too pale for it',
        },
        { path: 'colors.secondary', label: 'Secondary color', hint: 'The cursor dot' },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'Also the ring around the cursor',
        },
      ],
      more: [
        {
          path: 'palette.spread',
          label: 'Palette spread',
          hint: '0 makes every pill a shade of the Primary color; 1 is the full rainbow',
        },
        {
          path: 'palette.halo',
          label: 'Pill glow',
          hint: 'Soft colored glow around each pill; 0 turns it off',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the pills over another clip',
        },
        {
          path: 'glow.strength',
          label: 'Corner tint',
          hint: 'Soft tints in two corners, mixed from the pill colors; 0 turns them off',
        },
        { path: 'glow.drift', label: 'Corner tint drift', hint: 'How far the tints sway' },
      ],
    },
    {
      title: 'Cursor',
      fields: [
        {
          path: 'cursor.show',
          label: 'Show cursor',
          hint: 'Off leaves the pills still after they rise in',
        },
        {
          path: 'cursor.push',
          label: 'Push distance',
          hint: 'Pixels a pill slides right when the cursor touches it',
        },
        {
          path: 'cursor.grow',
          label: 'Pill grow',
          hint: 'How much the touched pill swells; the text keeps its size',
        },
      ],
      more: [
        { path: 'cursor.size', label: 'Cursor size', hint: 'Diameter in pixels' },
        {
          path: 'cursor.lift',
          label: 'Lift shadow',
          hint: 'Shadow under the touched pill; 0 turns it off',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [
        { path: 'layout.pitch', label: 'Row spacing', hint: 'Pixels from one pill to the next' },
        { path: 'layout.x', label: 'Horizontal position', hint: 'In pixels from center' },
      ],
      more: [{ path: 'layout.y', label: 'Vertical position', hint: 'In pixels from center' }],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.every',
          label: 'Time per pill',
          hint: 'Frames the cursor spends on each pill',
        },
        { path: 'timing.cursorAt', label: 'Cursor in at', hint: 'Frame number the cursor appears' },
      ],
      more: [
        {
          path: 'timing.move',
          label: 'Cursor move',
          hint: 'Frames to glide from one pill to the next',
        },
        {
          path: 'timing.entrance',
          label: 'Rise-in length',
          hint: 'Frames each pill takes to rise in',
        },
        {
          path: 'timing.stagger',
          label: 'Rise-in stagger',
          hint: 'Frames between pills rising in',
        },
      ],
    },
  ],
});
