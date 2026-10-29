import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { MiniaturePanoramaProps } from './miniature-panorama';

const PHASE = '0 is day, 1 is sunset and 2 is night';

export const miniaturePanoramaControls = defineControls<MiniaturePanoramaProps>({
  sections: [
    {
      title: 'Invitation',
      fields: [
        {
          path: 'invite.show',
          label: 'Show invitation',
          hint: 'Off leaves just the moving painting, ready for your own text on top',
        },
        { path: 'invite.names', label: 'Names', hint: 'In the script font' },
        { path: 'invite.line', label: 'Line below the names', hint: 'Shown in spaced capitals' },
        { path: 'invite.date', label: 'Date', hint: 'Shown in spaced capitals' },
      ],
      more: [
        { path: 'invite.scriptFont', label: 'Names font' },
        { path: 'invite.serifFont', label: 'Capitals font', hint: 'For the line and the date' },
        { path: 'invite.namesSize', label: 'Names size', hint: 'In pixels' },
        { path: 'invite.lineSize', label: 'Line size', hint: 'In pixels' },
        { path: 'invite.dateSize', label: 'Date size', hint: 'In pixels' },
        {
          path: 'invite.tracking',
          label: 'Capitals spacing',
          hint: 'Letter spacing of the line and the date, as a share of the text size',
        },
        { path: 'invite.gap', label: 'Space between lines', hint: 'In pixels' },
        {
          path: 'invite.centerY',
          label: 'Text height',
          hint: 'Pixels from the top of the frame to the middle of the text block',
        },
        { path: 'invite.start', label: 'Text appears at', hint: 'Frame number' },
        {
          path: 'invite.halo',
          label: 'Night glow behind the text',
          hint: 'Soft glow that fades in as the text turns light after sunset, so it stays readable against the sky',
        },
        { path: 'invite.haloStrength', label: 'Night glow strength', hint: '0 turns the glow off' },
        {
          path: 'invite.rise',
          label: 'Rise distance',
          hint: 'How far each line rises as it fades in, in pixels; 0 only fades',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: [
            'sky.dayTop',
            'sky.dayHorizon',
            'sky.duskTop',
            'sky.duskHorizon',
            'sky.nightTop',
            'sky.nightHorizon',
          ],
          label: 'Background color',
          hint: 'The sky at day, sunset and night, top and horizon',
        },
        {
          link: ['trees.dark', 'trees.mid', 'trees.light', 'lake.pad'],
          label: 'Primary color',
          hint: 'Every green: trees, palms, bushes, the front hedge and the lotus pads',
        },
        {
          link: ['pavilions.stone', 'pavilions.shade', 'railing.marble', 'railing.shade'],
          label: 'Secondary color',
          hint: 'The domed pavilions and the marble railing',
        },
        {
          link: ['marigolds.orange', 'marigolds.yellow', 'procession.blanket', 'procession.canopy'],
          label: 'Accent color',
          hint: 'The marigold strings and the elephant blanket and canopy',
        },
        {
          link: ['invite.dayColor', 'invite.duskColor', 'invite.nightColor'],
          label: 'Text color',
          hint: 'The invitation text at day, sunset and night',
        },
      ],
      more: [
        { path: 'sky.dayTop', label: 'Day sky top' },
        { path: 'sky.dayHorizon', label: 'Day sky horizon' },
        { path: 'sky.duskTop', label: 'Sunset sky top' },
        { path: 'sky.duskHorizon', label: 'Sunset sky horizon' },
        { path: 'sky.nightTop', label: 'Night sky top' },
        { path: 'sky.nightHorizon', label: 'Night sky horizon' },
        {
          path: 'trees.dark',
          label: 'Dark green',
          hint: 'Cypress trees, tree crowns and the front hedge',
        },
        {
          path: 'trees.mid',
          label: 'Middle green',
          hint: 'Palm fronds, cypress stripes and bushes',
        },
        {
          path: 'trees.light',
          label: 'Light green',
          hint: 'Highlights, palm fronds and front leaves',
        },
        { path: 'lake.pad', label: 'Lotus pad color' },
        { path: 'pavilions.stone', label: 'Pavilion stone' },
        {
          path: 'pavilions.shade',
          label: 'Pavilion shadow',
          hint: 'Arches, eaves and plinth; the arches warm up when the lanterns come on',
        },
        { path: 'railing.marble', label: 'Railing marble' },
        {
          path: 'railing.shade',
          label: 'Railing shadow',
          hint: 'Under the top rail and the plinth',
        },
        { path: 'marigolds.orange', label: 'Orange marigolds' },
        { path: 'marigolds.yellow', label: 'Yellow marigolds' },
        { path: 'procession.blanket', label: 'Elephant blanket' },
        {
          path: 'procession.canopy',
          label: 'Elephant canopy',
          hint: 'The howdah seat and its dome',
        },
        { path: 'invite.dayColor', label: 'Day text color' },
        { path: 'invite.duskColor', label: 'Sunset text color' },
        {
          path: 'invite.nightColor',
          label: 'Night text color',
          hint: 'Takes over midway between sunset and night',
        },
      ],
    },
    {
      title: 'Day to night',
      fields: [
        {
          path: 'timelapse.enabled',
          label: 'Day to night time-lapse',
          hint: 'Off holds one time of day for the whole clip',
        },
      ],
      more: [
        { path: 'timelapse.hold', label: 'Time of day when off' },
        { path: 'timelapse.start', label: 'Sunset starts at', hint: 'Frame number' },
        { path: 'timelapse.dusk', label: 'Full sunset at', hint: 'Frame number' },
        { path: 'timelapse.night', label: 'Full night at', hint: 'Frame number' },
        {
          path: 'shade.duskTint',
          label: 'Sunset glow on the scene',
          hint: 'Tint the hills, trees and buildings take at sunset',
        },
        {
          path: 'shade.duskStrength',
          label: 'Sunset glow strength',
          hint: '0 leaves the scene untinted',
        },
        {
          path: 'shade.nightTint',
          label: 'Night shadow color',
          hint: 'Color the whole scene darkens toward at night',
        },
        {
          path: 'shade.nightStrength',
          label: 'Night darkness',
          hint: '0 keeps daytime colors at night',
        },
      ],
    },
    {
      title: 'Pan',
      fields: [
        {
          path: 'pan.speed',
          label: 'Pan speed',
          hint: 'Pixels per frame at the railing; far layers move slower, the front leaves faster',
        },
      ],
      more: [
        {
          path: 'pan.direction',
          label: 'Scenery moves',
          hint: 'The procession walks the other way',
        },
        {
          path: 'pan.parallax',
          label: 'Depth effect',
          hint: 'How much slower the far layers move; 0 slides everything together',
        },
      ],
    },
    {
      title: 'Baraat procession',
      fields: [{ path: 'procession.show', label: 'Show procession' }],
      more: [
        {
          path: 'procession.start',
          label: 'Enters at',
          hint: 'Frame number; it walks in from the edge',
        },
        {
          path: 'procession.speed',
          label: 'Walking speed',
          hint: 'Pixels per frame across the screen; the steps match the ground',
        },
        { path: 'procession.scale', label: 'Size' },
        {
          path: 'procession.walkers',
          label: 'Walkers',
          hint: 'The first two lead with lanterns, the rest follow the elephant',
        },
        { path: 'procession.elephant', label: 'Elephant color' },
        {
          path: 'procession.trim',
          label: 'Gold trim',
          hint: 'Blanket border, canopy posts and lanterns',
        },
        { path: 'procession.kurta', label: 'Clothes color', hint: 'Also the tusk' },
        { path: 'procession.turban', label: 'Turban color' },
        { path: 'procession.skin', label: 'Skin tone' },
      ],
    },
    {
      title: 'Lanterns and stars',
      fields: [{ path: 'lights.onAt', label: 'Lanterns light up at', hint: PHASE }],
      more: [
        {
          path: 'lights.glow',
          label: 'Lantern glow',
          hint: 'Halos of the diyas, pavilion lamps and procession lanterns',
        },
        { path: 'lights.flame', label: 'Flame color' },
        { path: 'stars.count', label: 'Stars', hint: 'They appear after sunset; 0 hides them' },
        { path: 'stars.color', label: 'Star color' },
      ],
    },
    {
      title: 'Sky and hills',
      fields: [],
      more: [
        { path: 'look.showBackdrop', label: 'Show sky', hint: 'Off leaves the sky transparent' },
        { path: 'sky.cloudCount', label: 'Clouds', hint: '0 hides them' },
        { path: 'sky.clouds', label: 'Cloud color' },
        { path: 'birds.count', label: 'Birds', hint: 'They fly off as night falls; 0 hides them' },
        { path: 'birds.color', label: 'Bird color' },
        { path: 'hills.far', label: 'Far hills' },
        { path: 'hills.near', label: 'Near hills' },
      ],
    },
    {
      title: 'Lake and garden',
      fields: [],
      more: [
        { path: 'lake.showSwans', label: 'Show swans' },
        {
          path: 'peacock.show',
          label: 'Show peacocks',
          hint: 'One sits on the railing every eight posts',
        },
        { path: 'lake.water', label: 'Water' },
        { path: 'lake.ripple', label: 'Ripples' },
        {
          path: 'lake.lotus',
          label: 'Flower color',
          hint: 'Lotus flowers and the flowers in the front bushes',
        },
        { path: 'lake.swan', label: 'Swan color' },
        { path: 'lake.beak', label: 'Swan beak' },
        { path: 'peacock.body', label: 'Peacock body' },
        { path: 'peacock.tail', label: 'Peacock tail' },
        { path: 'peacock.eyes', label: 'Tail eyes and crest' },
        {
          path: 'pavilions.gold',
          label: 'Gold',
          hint: 'Dome tips, pavilion lamps, diya bowls and beaks',
        },
        { path: 'trees.trunk', label: 'Tree trunks' },
        { path: 'path.sand', label: 'Path' },
        { path: 'path.pebbles', label: 'Pebbles and path edge' },
      ],
    },
    {
      title: 'Marigold strings',
      fields: [{ path: 'marigolds.show', label: 'Show marigold strings' }],
      more: [
        { path: 'marigolds.sway', label: 'Sway', hint: 'In degrees; 0 holds them still' },
        { path: 'marigolds.leaf', label: 'String and leaves' },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [
        MOTION.enter,
        MOTION.exit,
        MOTION.enterFrames,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Speeds up the pan, the time-lapse, the procession and the text; the entrance and exit keep their own length',
        },
      ],
    },
  ],
  hidden: [
    'look.background',
    'look.backgroundEdge',
    'look.ink',
    'look.muted',
    'look.accent',
    'look.grain',
    'look.liveGrain',
    'look.spotlight',
    'look.paper',
    'look.paperLine',
    'look.paperSpacing',
    'look.paperMargin',
    'motion.float',
  ],
});
