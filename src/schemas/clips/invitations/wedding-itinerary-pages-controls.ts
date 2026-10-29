import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { WeddingItineraryPagesProps } from './wedding-itinerary-pages';

const SCENE_HINT =
  'Garden: rolling hills and a domed pavilion. Garlands: marigold strands over a low seat with bolsters. Lights: string lights, stars and a dhol. Mandap: four pillars under a floral arch';

export const weddingItineraryPagesControls = defineControls<WeddingItineraryPagesProps>({
  sections: [
    {
      title: 'Cover',
      fields: [
        { path: 'cover.names', label: 'Couple names', hint: 'Fades in under the ring in script' },
        { path: 'cover.dates', label: 'Dates line', hint: 'Types on under the names' },
        { path: 'cover.hashtag', label: 'Hashtag', hint: 'Types on last. Leave empty to hide it' },
      ],
      more: [
        { path: 'cover.monogram', label: 'Monogram', hint: 'Sits inside the ring' },
        { path: 'cover.scene', label: 'Cover scene', hint: SCENE_HINT },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['cover.titleColor', 'closing.titleColor'],
          label: 'Primary color',
          hint: 'The script names, monogram and closing message on the cover and closing pages',
        },
        {
          link: ['cover.textColor', 'closing.textColor'],
          label: 'Text color',
          hint: 'Typed lines and their caret on the cover and closing pages',
        },
        {
          link: ['cover.accent', 'closing.accent'],
          label: 'Accent color',
          hint: 'The monogram ring, dividers, pavilion finial and flowers on the cover and closing pages',
        },
        {
          link: ['cover.background', 'closing.background'],
          label: 'Background color',
          hint: 'Page color of the cover and closing pages. Event pages set their own under Event pages',
        },
      ],
      more: [
        { path: 'cover.background', label: 'Cover page color' },
        { path: 'cover.titleColor', label: 'Cover names and monogram color' },
        { path: 'cover.textColor', label: 'Cover typed text color', hint: 'Also the caret' },
        {
          path: 'cover.accent',
          label: 'Cover ring and divider color',
          hint: 'Also the flowers and finial',
        },
        { path: 'cover.greenery', label: 'Cover leaves and hills color' },
        {
          path: 'cover.structure',
          label: 'Cover pavilion color',
          hint: 'Also the seat, drum or mandap if you change the scene',
        },
        { path: 'closing.background', label: 'Closing page color' },
        { path: 'closing.titleColor', label: 'Closing message color' },
        { path: 'closing.textColor', label: 'Closing typed text color', hint: 'Also the caret' },
        { path: 'closing.accent', label: 'Closing divider and flower color' },
        { path: 'closing.greenery', label: 'Closing hills color' },
        { path: 'closing.structure', label: 'Closing pavilion color' },
      ],
    },
    {
      title: 'Event pages',
      fields: [
        {
          path: 'events',
          label: 'Events',
          hint: `One page each, in order, between the cover and the closing page (1 to 5). Each extra page adds one page length, so stretch the clip in the timeline to show it. ${SCENE_HINT}`,
          items: {
            name: 'Title',
            date: 'Date line',
            venue: 'Venue lines',
            schedule: 'Schedule lines',
            scene: 'Scene at the bottom',
            background: 'Page color',
            textColor: 'Typed text and caret color',
            titleColor: 'Title color',
            accent: 'Accent color (divider, marigolds, lights, flowers)',
            greenery: 'Greenery color',
            structure: 'Seat, drum, mandap or pavilion color',
          },
        },
      ],
    },
    {
      title: 'Closing page',
      fields: [
        {
          path: 'closing.message',
          label: 'Message',
          hint: 'Fades in in script. Use new lines to break it',
        },
        { path: 'closing.hosts', label: 'Hosts', hint: 'Types on last' },
      ],
      more: [
        {
          path: 'closing.rsvp',
          label: 'RSVP line',
          hint: 'Types on first. Leave empty to hide it',
        },
        { path: 'closing.scene', label: 'Closing scene', hint: SCENE_HINT },
      ],
    },
    {
      title: 'Fonts',
      fields: [
        {
          path: 'type.scriptFont',
          label: 'Script font',
          hint: 'Names, event titles and the closing message',
        },
        { path: 'type.serifFont', label: 'Serif font', hint: 'Typed lines and the monogram' },
      ],
      more: [
        { path: 'type.titleSize', label: 'Event title size', hint: 'In pixels' },
        { path: 'type.namesSize', label: 'Couple names size', hint: 'In pixels' },
        { path: 'type.messageSize', label: 'Closing message size', hint: 'In pixels' },
        { path: 'type.lineSize', label: 'Typed line size', hint: 'In pixels' },
        { path: 'type.monogramSize', label: 'Monogram size', hint: 'In pixels' },
        {
          path: 'type.serifWeight',
          label: 'Serif weight',
          hint: 'Fonts without that weight use their nearest one',
        },
        { path: 'type.tracking', label: 'Typed letter spacing', hint: 'In em' },
        {
          path: 'type.lineSpacing',
          label: 'Typed line spacing',
          hint: 'Times the typed line size',
        },
      ],
    },
    {
      title: 'Pages and typing',
      fields: [
        {
          path: 'timing.pageFrames',
          label: 'Page length',
          hint: 'Frames from one page arriving to the next. The clip stays 620 frames, so longer pages need a longer clip in the timeline',
        },
        { path: 'timing.charFrames', label: 'Frames per letter', hint: 'Lower types faster' },
      ],
      more: [
        {
          path: 'timing.transitionFrames',
          label: 'Page turn length',
          hint: 'In frames. The page color eases and the old page fades over this',
        },
        {
          path: 'timing.titleDelay',
          label: 'Title delay',
          hint: 'Frames after a page arrives before its title fades in',
        },
        {
          path: 'timing.typeDelay',
          label: 'Typing delay',
          hint: 'Frames after a page arrives before the first line types',
        },
        {
          path: 'timing.coverDelay',
          label: 'Cover wait',
          hint: 'Extra frames the cover names and lines wait for the ring',
        },
        { path: 'timing.lineGap', label: 'Pause between lines', hint: 'In frames' },
        {
          path: 'timing.caretHold',
          label: 'Caret linger',
          hint: 'Frames the caret blinks after the last line before it fades',
        },
        { path: 'timing.caretBlink', label: 'Caret blink length', hint: 'Frames per blink' },
      ],
    },
    {
      title: 'Monogram ring',
      fields: [],
      more: [
        { path: 'ring.radius', label: 'Ring size', hint: 'Radius in pixels' },
        { path: 'ring.width', label: 'Ring line width', hint: 'In pixels, tapering at both ends' },
        { path: 'ring.leaves', label: 'Leaf sprigs' },
        { path: 'ring.start', label: 'Ring starts drawing at', hint: 'Frame number' },
        {
          path: 'ring.drawFrames',
          label: 'Ring draw length',
          hint: 'In frames. The monogram fades in a third of the way through',
        },
      ],
    },
    {
      title: 'Scenes',
      fields: [],
      more: [
        {
          path: 'scenery.scale',
          label: 'Scene size',
          hint: 'Scales every scene from the bottom center',
        },
        {
          path: 'scenery.shadow',
          label: 'Paper shadow',
          hint: '0 turns the cut-paper shadows off',
        },
        {
          path: 'scenery.drift',
          label: 'Layer drift',
          hint: 'Slow side to side parallax between the layers. 0 holds them still',
        },
        {
          path: 'scenery.sway',
          label: 'Garland sway and twinkle',
          hint: 'Swaying strands and swags, twinkling lights and stars. 0 holds them still',
        },
        {
          path: 'scenery.riseFrames',
          label: 'Rise length',
          hint: 'Frames the back layer takes to rise in from below. Each nearer layer takes 4 frames longer',
        },
        {
          path: 'scenery.riseDelay',
          label: 'Rise delay',
          hint: 'Frames after a page arrives before its back layer rises. Nearer layers follow 6 frames apart',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [
        {
          path: 'layout.centerY',
          label: 'Text block center',
          hint: 'In pixels from the top. Every page centers its text here',
        },
        { path: 'layout.titleGap', label: 'Gap under the title', hint: 'In pixels' },
        {
          path: 'layout.blockGap',
          label: 'Gap between line groups',
          hint: 'In pixels, between the date, venue and schedule',
        },
        { path: 'layout.divider', label: 'Divider under titles' },
        { path: 'layout.dividerWidth', label: 'Divider width', hint: 'In pixels' },
      ],
    },
    {
      title: 'Background',
      fields: [],
      more: [
        {
          ...LOOK.showBackdrop,
          label: 'Show page colors',
          hint: 'Off leaves the pages transparent over other layers',
        },
        {
          path: 'look.glow',
          label: 'Top glow',
          hint: 'Soft light fading down from the top of every page',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Speeds up the pages, typing and scenes. The entrance and exit keep their own length',
        },
      ],
    },
  ],
  hidden: ['motion.float'],
});
