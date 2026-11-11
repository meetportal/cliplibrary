import { defineControls } from '../../control-layout';
import type { DotRingLogoRevealProps } from './dot-ring-logo-reveal';

const ROLE_HINT = 'Scroll to More options to set each part on its own';

const SURFACE = {
  path: 'colors.plate',
  label: 'Surface color',
  hint: 'The plate behind the logo; Plate style only',
} as const;

export const dotRingLogoRevealControls = defineControls<DotRingLogoRevealProps>({
  sections: [
    {
      title: 'Logo and name',
      fields: [
        { path: 'logo', label: 'Logo', hint: 'Wide, square or round; it fits the logo box' },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Written out under the logo; long names shrink to fit one line',
        },
        { path: 'name.font', label: 'Name font' },
      ],
      more: [
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        { path: 'name.tracking', label: 'Letter spacing', hint: 'Share of the name size' },
        { path: 'name.gap', label: 'Space above the name', hint: 'In pixels, below the logo' },
        {
          path: 'name.stopSize',
          label: 'Full stop size',
          hint: 'Size of the resting dot, as a share of the name size',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The dot, its comet and the full stop',
        },
        {
          link: ['colors.text', 'colors.ring'],
          label: 'Text color',
          hint: `The company name and the drawn ring. ${ROLE_HINT}`,
        },
        { path: 'colors.background', label: 'Background color' },
      ],
      more: [
        SURFACE,
        { path: 'colors.text', label: 'Name color' },
        {
          path: 'colors.ring',
          label: 'Ring color',
          hint: 'Also the badge outline in Frame style',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the reveal over another clip',
        },
      ],
    },
    {
      title: 'Ring',
      fields: [
        {
          path: 'ring.handoff',
          label: 'Ring to logo',
          hint: 'Bloom thins the ring away as the logo grows out of it, Plate fills it into a backing plate, Frame keeps it as an outline around the logo',
        },
        { path: 'ring.size', label: 'Ring size', hint: 'Diameter in pixels while it draws' },
        {
          path: 'ring.thickness',
          label: 'Stroke thickness',
          hint: 'In pixels; also the dot size',
        },
      ],
      more: [
        {
          path: 'ring.frameThickness',
          label: 'Frame outline thickness',
          hint: 'In pixels, the ring slims to this; Frame style only',
        },
      ],
    },
    {
      title: 'Logo box',
      fields: [
        { path: 'logoBox.width', label: 'Logo width', hint: 'Widest the logo may be, in pixels' },
        {
          path: 'logoBox.height',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels',
        },
      ],
      more: [
        {
          path: 'logoBox.padding',
          label: 'Plate and frame padding',
          hint: 'Space around the logo in pixels; Plate and Frame styles',
        },
        {
          path: 'logoBox.roundness',
          label: 'Plate and frame roundness',
          hint: '100 makes a pill or a circle, 0 a sharp rectangle',
        },
        {
          path: 'layout.offsetY',
          label: 'Move up or down',
          hint: 'In pixels; negative moves the whole lockup up',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        { path: 'timing.ringFrames', label: 'Ring draw length', hint: 'In frames' },
        {
          path: 'timing.nameFrames',
          label: 'Name write length',
          hint: 'In frames, while the dot slides along the name',
        },
      ],
      more: [
        {
          path: 'timing.start',
          label: 'Ring start',
          hint: 'Frame the ring starts drawing; the dot waits until then',
        },
        {
          path: 'timing.pause',
          label: 'Dot hang',
          hint: 'In frames, the dot hangs at the top of its hop before it falls',
        },
      ],
    },
  ],
});
