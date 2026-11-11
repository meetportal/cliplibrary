import { defineControls } from '../../control-layout';
import type { ArchSaveTheDateProps } from './arch-save-the-date';

const CUE = 'Frames after the glide frames the title in the last arch, at 30 per second';

export const archSaveTheDateControls = defineControls<ArchSaveTheDateProps>({
  sections: [
    {
      title: 'Couple and date',
      fields: [
        {
          path: 'partnerOne',
          label: 'First name',
          hint: 'Before the joiner on the names line; long names move the second name to its own line',
        },
        { path: 'partnerTwo', label: 'Second name', hint: 'After the joiner' },
        { path: 'eventDate', label: 'Date', hint: 'Written as it should read, under the names' },
        { path: 'venue', label: 'Venue', hint: 'Venue and city in capitals; wraps to two lines' },
        { path: 'host', label: 'Hosts', hint: 'Script line at the foot, after the sign-off' },
      ],
      more: [
        { path: 'words.intro', label: 'Line above the names', hint: 'Leave empty to hide it' },
        { path: 'words.joiner', label: 'Joiner', hint: 'Between the two names, such as & or and' },
        { path: 'words.signOff', label: 'Sign-off', hint: 'Small capitals above the hosts' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.arch',
          label: 'Primary color',
          hint: 'The arches, their scalloped bands, rosettes and columns; lighter shades follow it',
        },
        {
          path: 'colors.script',
          label: 'Accent color',
          hint: 'Save the Date, its flourishes, the names and the hosts',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The small lines: intro, date, venue and sign-off',
        },
        { path: 'colors.sky', label: 'Background color', hint: 'The sky through the arches' },
      ],
      more: [
        { path: 'colors.cloud', label: 'Cloud color' },
        {
          path: 'colors.dusk',
          label: 'Sunset glow color',
          hint: 'Warms the lower sky and the clouds',
        },
        {
          path: 'colors.foliage',
          label: 'Greenery color',
          hint: 'Hills, leaves, stems and bud caps',
        },
        {
          path: 'colors.flowers',
          label: 'Flower color',
          hint: 'Roses and the flowers in the pots',
        },
        {
          path: 'colors.stone',
          label: 'Stone color',
          hint: 'Balustrade, floor and the haze behind the text',
        },
        { path: 'colors.crystal', label: 'Crystal color', hint: 'Chandelier bowls and drops' },
        { path: 'colors.gold', label: 'Gold color', hint: 'Chandelier rims, chain and arms' },
        {
          path: 'colors.jasmine',
          label: 'Jasmine color',
          hint: 'Hanging jasmine strings and rosette petals',
        },
        {
          path: 'showScenery',
          label: 'Show terrace and sky',
          hint: 'Turn off to see another layer through the arches',
        },
      ],
    },
    {
      title: 'Save the Date',
      fields: [
        { path: 'words.saveTop', label: 'Top word', hint: 'First script word' },
        { path: 'words.saveBottom', label: 'Bottom word', hint: 'Second script word' },
      ],
      more: [
        {
          path: 'words.saveJoiner',
          label: 'Small word',
          hint: 'Between the two; leave empty to hide it and the flourishes',
        },
        {
          path: 'lettering.titleSize',
          label: 'Size',
          hint: 'Largest size in pixels; long words shrink',
        },
        { path: 'lettering.top', label: 'Position', hint: 'Pixels from the top to the first word' },
        { path: 'timing.titleAt', label: 'Fades in at', hint: CUE },
        { path: 'timing.titleFrames', label: 'Fade length', hint: 'In frames' },
        { path: 'timing.flourishAt', label: 'Flourishes draw at', hint: CUE },
        { path: 'timing.flourishFrames', label: 'Flourish draw length', hint: 'In frames' },
      ],
    },
    {
      title: 'Lettering',
      fields: [
        { path: 'lettering.scriptFont', label: 'Script font', hint: 'Save the Date and the hosts' },
      ],
      more: [
        {
          path: 'lettering.capsFont',
          label: 'Capitals font',
          hint: 'Names, date, venue and the small lines',
        },
        {
          path: 'lettering.nameSize',
          label: 'Names size',
          hint: 'Largest size in pixels; long names shrink',
        },
        {
          path: 'lettering.detailSize',
          label: 'Small lines size',
          hint: 'Date, venue, intro and sign-off',
        },
        { path: 'lettering.hostSize', label: 'Hosts size', hint: 'Largest size in pixels' },
        {
          path: 'lettering.haze',
          label: 'Haze behind the text',
          hint: 'A soft stone mist in the sky behind the details; 0 turns it off',
        },
        { path: 'timing.detailsAt', label: 'Details start', hint: CUE },
        { path: 'timing.lineStagger', label: 'Line stagger', hint: 'Frames between lines' },
        {
          path: 'timing.wipeFrames',
          label: 'Wipe length',
          hint: 'Frames for one line to write in',
        },
      ],
    },
    {
      title: 'Arcade',
      fields: [
        {
          path: 'arcade.arches',
          label: 'Arches',
          hint: 'Arches in the glide, counting the last one; 2 starts just behind the last arch, more start deeper in the corridor',
        },
      ],
      more: [
        {
          path: 'arcade.dollyFrames',
          label: 'Glide length',
          hint: 'Frames until the last arch settles',
        },
        { path: 'arcade.chandelier', label: 'Chandeliers' },
        { path: 'arcade.garlands', label: 'Jasmine strings' },
        {
          path: 'arcade.sway',
          label: 'Sway',
          hint: 'Jasmine strings swing this many degrees either side and the chandeliers a fifth of it; 0 holds them still',
        },
        { path: 'arcade.rosettes', label: 'Rosettes' },
      ],
    },
    {
      title: 'Sky',
      fields: [
        {
          path: 'sky.duskStrength',
          label: 'Sunset glow',
          hint: '0 keeps the sky blue; the glow warms during the hold',
        },
      ],
      more: [
        { path: 'sky.birds', label: 'Birds', hint: 'How many birds cross the sky; 0 for none' },
        {
          path: 'sky.cloudDrift',
          label: 'Cloud drift',
          hint: 'Pixels per frame; 0 holds the clouds',
        },
        { path: 'timing.duskAt', label: 'Glow starts', hint: CUE },
      ],
    },
  ],
});
