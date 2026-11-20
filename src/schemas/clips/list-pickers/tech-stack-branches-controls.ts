import { defineControls } from '../../control-layout';
import type { TechStackBranchesProps } from './tech-stack-branches';

const ROLE_HINT = 'More options sets each part on its own';

export const techStackBranchesControls = defineControls<TechStackBranchesProps>({
  sections: [
    {
      title: 'Root and logo',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Big line on the root pill, beside the logo chip; long names shrink to stay on one line',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Small line under the company name; leave empty for a one-line root pill',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it sits on a chip at the left end of the root pill, before the name. Leave empty for a text-only root',
        },
      ],
      more: [
        {
          path: 'brand.logoWidth',
          label: 'Logo chip width',
          hint: 'Widest the logo chip may be, in pixels',
        },
        {
          path: 'brand.logoHeight',
          label: 'Logo chip size',
          hint: 'Height of the logo chip as a share of the root pill height',
        },
        {
          path: 'brand.plate',
          label: 'Logo chip',
          hint: 'A rounded chip behind the logo so dark and light logos both read; it stays on when the logo would not read on the root pill',
        },
        { path: 'colors.plate', label: 'Logo chip color', hint: 'Shows when Logo chip is on' },
        {
          path: 'brand.gap',
          label: 'Logo gap',
          hint: 'Space between the logo chip and the company name, in pixels',
        },
        {
          path: 'layout.y',
          label: 'Shift up or down',
          hint: 'Moves the root and the wheel centre, in pixels; it stops at the margins',
        },
        {
          path: 'layout.margin',
          label: 'Margins',
          hint: 'Left inset of the root pill and the space kept clear at the right and top edges, in pixels',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.root'],
          label: 'Primary color',
          hint: `The root pill and the highlighted pill level with it. ${ROLE_HINT}`,
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The other pills on the wheel; they blend to the primary color as they pass the root',
        },
        {
          link: ['colors.text', 'colors.lines'],
          label: 'Text color',
          hint: `Pill text and the connecting lines. Text switches to a readable shade on pale pills. ${ROLE_HINT}`,
        },
        {
          link: ['background.top', 'background.glow', 'background.bottom'],
          label: 'Background color',
          hint: `The whole wash behind the tree. ${ROLE_HINT}`,
        },
      ],
      more: [
        { path: 'colors.primary', label: 'Highlighted pill color' },
        { path: 'colors.root', label: 'Root pill color' },
        { path: 'colors.text', label: 'Pill text color' },
        {
          path: 'colors.lines',
          label: 'Line color',
          hint: 'The branch line and the dashed arc; takes the primary color on pale backgrounds so it still shows',
        },
        { path: 'background.top', label: 'Background top left' },
        { path: 'background.glow', label: 'Background glow', hint: 'The warm glow on the right' },
        { path: 'background.bottom', label: 'Background bottom' },
        {
          path: 'background.drift',
          label: 'Background drift',
          hint: 'How much the wash slowly moves; 0 holds it still',
        },
        {
          path: 'background.show',
          label: 'Show background',
          hint: 'Turn off to layer the tree over another clip',
        },
      ],
    },
    {
      title: 'Wheel items',
      fields: [
        {
          path: 'items',
          label: 'Items',
          hint: 'Each item takes its turn level with the root; 4 to 8 items, more items switch faster',
          items: { title: 'Item', detail: 'Detail line' },
        },
        { path: 'pills.font', label: 'Font', hint: 'Used by every pill, the root included' },
      ],
      more: [
        {
          path: 'pills.titleSize',
          label: 'Item size',
          hint: 'Largest size in pixels; the root is a little bigger',
        },
        { path: 'pills.detailSize', label: 'Detail size', hint: 'Largest size in pixels' },
        {
          path: 'pills.height',
          label: 'Pill height',
          hint: 'In pixels; text shrinks to fit a short pill',
        },
        {
          path: 'pills.icon',
          label: 'Pill icon',
          hint: 'The small mark at the start of every pill',
        },
        {
          path: 'pills.rim',
          label: 'Glass rim',
          hint: 'The light edge and top sheen of each pill; 0 turns it off',
        },
        {
          path: 'pills.shadow',
          label: 'Shadow',
          hint: 'Soft shadow under the pills; 0 turns it off',
        },
      ],
    },
    {
      title: 'Wheel and branch',
      fields: [
        {
          path: 'wheel.spacing',
          label: 'Item spacing',
          hint: 'Distance between pills on the wheel, in pixels',
        },
        {
          path: 'wheel.curve',
          label: 'Curve',
          hint: 'How far the pills above and below swing right, as a share of the room the frame leaves; 0 makes a straight column and 1 reaches the right margin',
        },
      ],
      more: [
        {
          path: 'wheel.sideScale',
          label: 'Side pill size',
          hint: 'Size of the pills away from the root, as a share of the highlighted one',
        },
        {
          path: 'wheel.fade',
          label: 'Side pill fade',
          hint: 'How much the outer pills fade; 0 keeps them solid',
        },
        {
          path: 'wheel.dashes',
          label: 'Dashed arc',
          hint: 'Strength of the dashed arc through the wheel; 0 hides it',
        },
        {
          path: 'branch.reach',
          label: 'Branch length',
          hint: 'Length of the line from the root pill to the wheel, in pixels; a longer line moves the wheel right',
        },
        {
          path: 'branch.width',
          label: 'Line width',
          hint: 'Thickness of the branch line, in pixels',
        },
        {
          path: 'branch.pulse',
          label: 'Branch pulse',
          hint: 'A light that runs down the branch as each item arrives; 0 turns it off',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.interval',
          label: 'Frames per item',
          hint: 'How long each item stays level with the root; the wheel keeps ticking to the last frame',
        },
        {
          path: 'timing.intro',
          label: 'Opening spin',
          hint: 'Frames the wheel takes to spin in and land on the first item',
        },
      ],
      more: [
        {
          path: 'timing.spin',
          label: 'Spin distance',
          hint: 'How many items the opening spin passes',
        },
        {
          path: 'timing.swing',
          label: 'Move frames',
          hint: 'Frames each tick to the next item takes',
        },
        {
          path: 'timing.drift',
          label: 'Wheel drift',
          hint: 'Slow creep between ticks so the wheel never stops; higher is livelier',
        },
        {
          path: 'timing.returnToFirst',
          label: 'End on first item',
          hint: 'The wheel starts on whichever item lets every tick play and still end with the first item level with the root; off, it starts on the first item and ends wherever the ticks stop',
        },
      ],
    },
  ],
});
