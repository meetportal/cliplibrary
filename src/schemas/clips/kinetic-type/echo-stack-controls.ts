import { defineControls } from '../../control-layout';
import type { EchoStackProps } from './echo-stack';

export const echoStackControls = defineControls<EchoStackProps>({
  sections: [
    {
      title: 'Line',
      fields: [
        {
          path: 'line',
          label: 'Line',
          hint: 'Repeated on every row of the stack, with the middle row on the band; long lines shrink to fit the width',
        },
        { path: 'type.font', label: 'Font' },
        {
          path: 'type.size',
          label: 'Text size',
          hint: 'Largest size in pixels; long lines shrink below it to fit the width',
        },
      ],
      more: [
        { path: 'type.caps', label: 'All capitals' },
        {
          path: 'type.tracking',
          label: 'Letter spacing',
          hint: 'Extra space between letters, as a share of the text size',
        },
        {
          path: 'type.maxWidth',
          label: 'Widest line',
          hint: 'In pixels, including the band around the middle row; a longer line shrinks until it fits',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The band behind the middle row; lifted automatically where it would vanish into the background, and its text turns dark or light to stay readable',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The echo rows above and below the band',
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'Sets the centre and the edges together; set each in More options for a soft vignette',
        },
      ],
      more: [
        {
          path: 'colors.background',
          label: 'Background centre color',
          hint: 'Centre of the backdrop',
        },
        {
          path: 'colors.backgroundEdge',
          label: 'Background edge color',
          hint: 'Color the backdrop fades to at the corners',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the stack over another clip',
        },
      ],
    },
    {
      title: 'Stack',
      fields: [
        {
          path: 'stack.lines',
          label: 'Rows',
          hint: 'Odd numbers keep the band in the middle; nine rows run past the top and bottom',
        },
        {
          path: 'stack.spacing',
          label: 'Row spacing',
          hint: 'Distance between rows as a multiple of the text size; rows stay a little further apart when a long line shrinks',
        },
        {
          path: 'stack.echoOpacity',
          label: 'Echo strength',
          hint: 'Lower it to make the echo rows quieter than the band',
        },
      ],
    },
    {
      title: 'Band',
      fields: [
        { path: 'band.show', label: 'Show band', hint: 'Off shows the middle row in Primary text' },
        {
          path: 'band.pulse',
          label: 'Pulse',
          hint: 'How much the band swells as each cascade passes it; 0 keeps it still',
        },
      ],
      more: [
        {
          path: 'band.padding',
          label: 'Band padding',
          hint: 'Space around the text as a share of the text size; wider at the sides',
        },
        {
          path: 'band.breath',
          label: 'Breath',
          hint: 'How much the band swells and settles while it is alone at the end and start; 0 keeps it still',
        },
        {
          path: 'band.radius',
          label: 'Corner rounding',
          hint: 'As a share of the band height; 0.5 makes a pill',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          path: 'motion.stagger',
          label: 'Cascade gap',
          hint: 'Frames between one row and the next, coming in and going out',
        },
        {
          path: 'motion.riseFrames',
          label: 'Rise length',
          hint: 'Frames each echo takes to rise into its row',
        },
        {
          path: 'motion.drift',
          label: 'Drift',
          hint: 'How far in pixels the whole stack floats up and back over the clip; 0 holds it still',
        },
      ],
      more: [
        {
          path: 'motion.startDelay',
          label: 'Start delay',
          hint: 'Frames the band shows alone before the first echo',
        },
        {
          path: 'motion.rise',
          label: 'Rise distance',
          hint: 'Pixels each echo rises as it arrives',
        },
        {
          path: 'motion.exitFrames',
          label: 'Exit length',
          hint: 'Frames each echo takes to slide down and blur away',
        },
        {
          path: 'motion.exitDrop',
          label: 'Exit slide',
          hint: 'Pixels each echo slides down as it leaves',
        },
        {
          path: 'motion.exitBlur',
          label: 'Exit blur',
          hint: 'Blur in pixels when an echo is gone',
        },
        {
          path: 'motion.endHold',
          label: 'End hold',
          hint: 'Frames the band shows alone after the last echo has gone, shorter for a short line; the full stack holds for the rest',
        },
      ],
    },
  ],
});
