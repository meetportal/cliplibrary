import { defineControls } from '../../control-layout';
import type { CirclePopProps } from './circle-pop';

export const circlePopControls = defineControls<CirclePopProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Pops in on the circle, then fills the screen; long names wrap to two or three lines and shrink to fit',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Rises in under the name once the screen is filled. Leave empty to hide it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The ripple ring of the pop and the waving squiggle under the tagline; shifted lighter or darker when it would blend into the text or background',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The company name and the tagline; darkened or lightened when it would not read on the circle',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The circle, and the whole screen once it floods',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'Behind the circle before it floods and after it shrinks back',
        },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the circle over another clip',
        },
      ],
    },
    {
      title: 'Name',
      fields: [
        { path: 'name.font', label: 'Font' },
        {
          path: 'name.tilt',
          label: 'Tilt',
          hint: 'In degrees; positive leans the name clockwise, 0 keeps it level',
        },
      ],
      more: [
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels on the filled screen; long names shrink below it',
        },
        {
          path: 'name.centerY',
          label: 'Height on screen',
          hint: 'Centre of the circle and the name, as a share of the frame height from the top',
        },
      ],
    },
    {
      title: 'Circle',
      fields: [
        {
          path: 'circle.size',
          label: 'Circle size',
          hint: 'Diameter in pixels once it has popped',
        },
        {
          path: 'circle.wobble',
          label: 'Wobble',
          hint: 'How wavy the edge gets after the pop; 0 keeps a plain circle',
        },
      ],
      more: [
        { path: 'circle.lobes', label: 'Waves on the edge' },
        {
          path: 'circle.wobbleSpeed',
          label: 'Wobble speed',
          hint: 'How fast the waves travel round the edge; 0 holds them still',
        },
        {
          path: 'circle.echo',
          label: 'Echo blob',
          hint: 'How strongly the soft Primary tinted blob behind the name shows once the screen is filled; 0 hides it',
        },
        { path: 'ripple.show', label: 'Ripple ring', hint: 'The ring that bursts out of the pop' },
        { path: 'ripple.width', label: 'Ripple thickness', hint: 'In pixels at the start' },
        {
          path: 'ripple.reach',
          label: 'Ripple reach',
          hint: 'How far the ring travels, as a multiple of the circle radius',
        },
      ],
    },
    {
      title: 'Tagline',
      fields: [
        { path: 'line.size', label: 'Tagline size', hint: 'In pixels' },
        {
          path: 'line.squiggle',
          label: 'Squiggle',
          hint: 'The waving Primary line under the tagline',
        },
      ],
      more: [
        { path: 'line.gap', label: 'Gap under the name', hint: 'In pixels' },
        { path: 'line.squiggleWidth', label: 'Squiggle width', hint: 'In pixels' },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.floodAt',
          label: 'Flood at',
          hint: 'Frame the circle starts bursting to fill the screen',
        },
        { path: 'timing.floodFrames', label: 'Flood length', hint: 'In frames' },
      ],
      more: [
        {
          path: 'timing.popFrames',
          label: 'Pop length',
          hint: 'In frames, from the half-size circle to full size',
        },
        {
          path: 'timing.collapseFrames',
          label: 'Shrink back length',
          hint: 'In frames at the end, as the screen shrinks back into the half-size circle the clip starts on',
        },
      ],
    },
  ],
});
