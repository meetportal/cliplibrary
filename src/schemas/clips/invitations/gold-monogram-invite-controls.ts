import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { GoldMonogramInviteProps } from './gold-monogram-invite';

const AT_SPEED_ONE = 'Frame number at animation speed 1';

export const goldMonogramInviteControls = defineControls<GoldMonogramInviteProps>({
  sections: [
    {
      title: 'Quote',
      fields: [
        {
          path: 'quote.text',
          label: 'Quote',
          hint: 'Each new line starts a new line on screen. Words rise in one by one',
        },
        {
          path: 'quote.scriptPhrase',
          label: 'Script phrase',
          hint: 'Part of the quote set in gold script. Leave empty to keep the whole quote in serif',
        },
      ],
      more: [
        { path: 'quote.size', label: 'Quote size', hint: 'In pixels' },
        {
          path: 'quote.scriptScale',
          label: 'Script phrase size',
          hint: 'Relative to the quote size',
        },
        { path: 'quote.x', label: 'Quote left edge', hint: 'In pixels from the left of the frame' },
        { path: 'quote.width', label: 'Quote box width', hint: 'In pixels' },
        { path: 'quote.start', label: 'First word appears at', hint: AT_SPEED_ONE },
        {
          path: 'quote.wordStagger',
          label: 'Delay between words',
          hint: 'In frames. 0 raises every word together',
        },
        { path: 'quote.end', label: 'Quote fades out at', hint: AT_SPEED_ONE },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['gold.dark', 'gold.light'],
          label: 'Primary color',
          hint: 'The gold of the mandala, monogram, script words, event names, dividers and dust; keeps the shine between its light and deep tones',
        },
        {
          link: ['text.cream', 'text.muted'],
          label: 'Text color',
          hint: 'The quote, the eyebrow, the event dates and the time and venue lines',
        },
        {
          link: ['background.color', 'background.edge'],
          label: 'Background color',
          hint: 'The backdrop and its darker edges together',
        },
      ],
      more: [
        {
          path: 'gold.dark',
          label: 'Deep gold',
          hint: 'Lower and shaded side of every gold shape',
        },
        {
          path: 'gold.light',
          label: 'Champagne gold',
          hint: 'Lit side of every gold shape. Also colors the rising dust',
        },
        {
          path: 'text.cream',
          label: 'Main text color',
          hint: 'Quote, eyebrow and event dates. Also tints the glint across the monogram',
        },
        { path: 'text.muted', label: 'Detail text color', hint: 'The time and venue lines' },
        { path: 'background.color', label: 'Backdrop color' },
        {
          path: 'background.edge',
          label: 'Edge color',
          hint: 'Color the backdrop fades to at the edges of the frame',
        },
      ],
    },
    {
      title: 'Monogram',
      fields: [
        { path: 'monogram.first', label: 'First initial' },
        { path: 'monogram.second', label: 'Second initial' },
        { path: 'monogram.names', label: 'Names', hint: 'Gold script line under the monogram' },
      ],
      more: [
        {
          path: 'monogram.eyebrow',
          label: 'Line above',
          hint: 'Spaced capitals above the monogram. Leave empty to hide it',
        },
        { path: 'monogram.showHeart', label: 'Heart between initials' },
        { path: 'monogram.initialSize', label: 'Initials size', hint: 'In pixels' },
        {
          path: 'monogram.spacing',
          label: 'Space between initials',
          hint: 'Gap from the center to each initial, as a share of the initials size. Keep it above 0.1 so the heart fits',
        },
        {
          path: 'monogram.ringRadius',
          label: 'Ring size',
          hint: 'Radius of the double ring in pixels',
        },
        { path: 'monogram.namesSize', label: 'Names size', hint: 'In pixels' },
        { path: 'monogram.eyebrowSize', label: 'Line above size', hint: 'In pixels' },
        {
          path: 'monogram.start',
          label: 'Monogram starts at',
          hint: `${AT_SPEED_ONE}. The mandala dims and the dust starts rising here too`,
        },
        {
          path: 'monogram.drawFrames',
          label: 'Drawing length',
          hint: 'Frames the ring and initials take to draw. The fill, names and glint follow it',
        },
        {
          path: 'monogram.glint',
          label: 'Light glint',
          hint: 'One sweep of light across the monogram',
        },
        { path: 'monogram.glintFrames', label: 'Glint length', hint: 'In frames' },
      ],
    },
    {
      title: 'Events',
      fields: [
        {
          path: 'events',
          label: 'Events',
          hint: 'One to four rows, revealed top to bottom. Time and venue share one line',
          items: { title: 'Event name', date: 'Date', time: 'Time', venue: 'Venue' },
        },
      ],
      more: [
        {
          path: 'schedule.start',
          label: 'Events start at',
          hint: `${AT_SPEED_ONE}. The monogram starts shrinking aside here`,
        },
        { path: 'schedule.stagger', label: 'Delay between events', hint: 'In frames' },
        { path: 'schedule.titleSize', label: 'Event name size', hint: 'In pixels' },
        { path: 'schedule.detailSize', label: 'Date and venue size', hint: 'In pixels' },
        {
          path: 'schedule.centerX',
          label: 'Events column center',
          hint: 'In pixels from the left of the frame',
        },
        { path: 'schedule.rowGap', label: 'Space between events', hint: 'In pixels' },
        { path: 'schedule.shrinkFrames', label: 'Monogram move length', hint: 'In frames' },
        {
          path: 'schedule.monogramScale',
          label: 'Monogram size beside events',
          hint: 'Share of its full size',
        },
        {
          path: 'schedule.monogramX',
          label: 'Monogram center beside events',
          hint: 'In pixels from the left of the frame',
        },
        {
          path: 'schedule.monogramY',
          label: 'Monogram height beside events',
          hint: 'Center in pixels from the top of the frame',
        },
      ],
    },
    {
      title: 'Lettering',
      fields: [
        {
          path: 'fonts.script',
          label: 'Script font',
          hint: 'Script phrase, names and event names',
        },
        {
          path: 'fonts.serif',
          label: 'Serif font',
          hint: 'Quote, initials, eyebrow, dates and venues',
        },
      ],
    },
    {
      title: 'Mandala and dust',
      fields: [
        {
          path: 'mandala.spin',
          label: 'Mandala spin',
          hint: 'In degrees per second. Negative turns it the other way, 0 holds it still',
        },
        {
          path: 'dust.count',
          label: 'Gold dust',
          hint: 'Number of rising specks. 0 turns them off',
        },
      ],
      more: [
        { path: 'mandala.radius', label: 'Mandala size', hint: 'Radius in pixels' },
        {
          path: 'mandala.x',
          label: 'Mandala center across',
          hint: 'In pixels from the left. Below 0 tucks it past the left edge',
        },
        { path: 'mandala.y', label: 'Mandala center height', hint: 'In pixels from the top' },
        { path: 'mandala.lineWidth', label: 'Mandala line width', hint: 'In pixels' },
        {
          path: 'mandala.drawFrames',
          label: 'Mandala drawing length',
          hint: 'Frames from the first ring to the last ring finishing',
        },
        {
          path: 'mandala.restOpacity',
          label: 'Mandala brightness later',
          hint: 'Opacity it dims to once the monogram starts. 1 keeps it bright',
        },
        { path: 'dust.size', label: 'Dust speck size', hint: 'In pixels' },
        {
          path: 'dust.rise',
          label: 'Dust rise speed',
          hint: 'Fastest specks in pixels per frame; the slowest rise at about a third of it. 0 lets them hover',
        },
      ],
    },
    {
      title: 'Background',
      fields: [{ path: 'background.show', label: 'Show background' }],
      more: [
        {
          path: 'background.vignette',
          label: 'Edge darkening',
          hint: 'How far the edge color reaches in from the sides, top and bottom. 0 is flat',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [
        {
          ...MOTION.speed,
          hint: 'Speeds up every beat, the mandala spin and the dust; the entrance and exit keep their own length',
        },
        { ...MOTION.enter, label: 'Intro transition', hint: 'How the whole frame appears' },
        { ...MOTION.enterFrames, label: 'Intro length' },
        {
          ...MOTION.exit,
          label: 'Outro transition',
          hint: 'How the whole frame leaves at the end',
        },
        { ...MOTION.exitFrames, label: 'Outro length' },
      ],
    },
  ],
  hidden: ['motion.float'],
});
