import { defineControls } from './control-layout';
import type { GoldMonogramInviteProps } from './gold-monogram-invite-common';

const FRAMES = 'In frames, at 30 per second';

export const goldMonogramInviteControls = defineControls<GoldMonogramInviteProps>({
  sections: [
    {
      title: 'Couple',
      fields: [
        {
          path: 'partnerOne',
          label: 'First name',
          hint: 'Written first in the gold script; its first letter starts the monogram',
        },
        {
          path: 'partnerTwo',
          label: 'Second name',
          hint: 'Written after the joiner; its first letter ends the monogram',
        },
      ],
      more: [
        {
          path: 'monogramLetters',
          label: 'Monogram letters',
          hint: 'Up to three letters in the ring; leave empty to use the first letter of each name',
        },
        { path: 'joiner', label: 'Joiner', hint: 'Between the two names, such as & or and' },
        {
          path: 'eyebrow',
          label: 'Line above the names',
          hint: 'Small capitals; leave empty to hide it',
        },
        {
          path: 'monogram.heart',
          label: 'Heart on the ring',
          hint: 'A small gold heart at the top of the ring',
        },
        {
          path: 'monogram.size',
          label: 'Monogram size',
          hint: 'Letter height in pixels; two letters shrink to fit the ring',
        },
        {
          path: 'monogram.fillAt',
          label: 'Monogram gold fill',
          hint: `${FRAMES}, when the outlined letters finish filling with gold`,
        },
        {
          path: 'monogram.glintAt',
          label: 'Glint',
          hint: `${FRAMES}, when one sweep of light crosses the monogram`,
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The gold: mandala, monogram, ring, heart, names, divider, date and dust. Dark picks are lifted so they read on the dark background',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The line above the names, the invitation line and the venue',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The middle of the backdrop; the edges fall darker',
        },
        { path: 'colors.surface', label: 'Surface color', hint: 'The plate behind the logo' },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the invitation over another clip',
        },
      ],
    },
    {
      title: 'Details',
      fields: [
        {
          path: 'invitationLine',
          label: 'Invitation line',
          hint: 'A short line under the names; wraps to two lines and shrinks if it needs more',
        },
        {
          path: 'eventDate',
          label: 'Date',
          hint: 'In gold capitals; long dates shrink to one line',
        },
        {
          path: 'venue',
          label: 'Venue and city',
          hint: 'Wraps to two lines and shrinks if it needs more',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Host, planner or venue mark at the foot; wide, square or round. Leave empty to hide it',
        },
      ],
      more: [
        {
          path: 'logoPlate.plate',
          label: 'Plate behind the logo',
          hint: 'Keeps dark logos readable on the dark backdrop; turn off for a light logo',
        },
        { path: 'logoPlate.width', label: 'Logo width', hint: 'Widest the logo may be, in pixels' },
        {
          path: 'logoPlate.height',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels',
        },
        {
          path: 'reveal.start',
          label: 'Details start',
          hint: `${FRAMES}, when the line above the names arrives; with Center then aside the details follow the glide instead`,
        },
        {
          path: 'reveal.stagger',
          label: 'Row stagger',
          hint: `${FRAMES}, between one row of details and the next`,
        },
      ],
    },
    {
      title: 'Mandala',
      fields: [
        {
          path: 'mandala.pattern',
          label: 'Pattern',
          hint: 'Jewel has spirals and flowers, Lotus long pointed petals, Sunburst rays and arcs',
        },
        {
          path: 'layout',
          label: 'Layout',
          hint: 'Split puts the mandala left and the details right; Center then aside starts centred and glides left; Twin mandalas frames a centred card',
        },
      ],
      more: [
        { path: 'mandala.size', label: 'Mandala size', hint: 'Radius in pixels' },
        { path: 'mandala.lineWidth', label: 'Line weight', hint: 'Multiplies every gold line' },
        {
          path: 'mandala.spin',
          label: 'Turning speed',
          hint: 'Degrees per second; negative turns the other way, 0 holds it still',
        },
        {
          path: 'mandala.ringGap',
          label: 'Ring stagger',
          hint: `${FRAMES}, between one ring starting and the next`,
        },
        {
          path: 'mandala.ringDraw',
          label: 'Ring draw length',
          hint: `${FRAMES}, for one ring to draw all the way round`,
        },
        { path: 'dust.count', label: 'Gold dust', hint: 'How many specks rise; 0 turns it off' },
        { path: 'dust.size', label: 'Dust size', hint: 'Speck radius in pixels' },
        { path: 'dust.rise', label: 'Dust speed', hint: 'Pixels per frame' },
        { path: 'reveal.glideAt', label: 'Glide start', hint: `${FRAMES}; Center then aside only` },
        {
          path: 'reveal.glideFrames',
          label: 'Glide length',
          hint: `${FRAMES}; Center then aside only`,
        },
      ],
    },
    {
      title: 'Type',
      fields: [
        { path: 'type.script', label: 'Script font', hint: 'The names' },
        {
          path: 'type.serif',
          label: 'Serif font',
          hint: 'The monogram, the line above the names, the invitation line, date and venue',
        },
      ],
      more: [
        {
          path: 'type.namesSize',
          label: 'Names size',
          hint: 'Largest size in pixels; long names shrink or take two lines',
        },
        { path: 'type.lineSize', label: 'Invitation line size', hint: 'Largest size in pixels' },
        {
          path: 'type.dateSize',
          label: 'Date size',
          hint: 'Largest size in pixels; the venue follows at four fifths',
        },
      ],
    },
  ],
});
