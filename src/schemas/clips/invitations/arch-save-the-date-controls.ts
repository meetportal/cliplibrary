import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ArchSaveTheDateProps } from './arch-save-the-date';

const HIDE_EMPTY = 'Leave empty to hide the line';
const SIZE = 'In pixels';
const WORLD_Y = 'Pixels from the top of the frame once the camera has pushed in';

export const archSaveTheDateControls = defineControls<ArchSaveTheDateProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'copy.names', label: 'Couple names', hint: 'Start a new line to stack them' },
        { path: 'copy.date', label: 'Date' },
        { path: 'copy.venue', label: 'Venue', hint: 'Start a new line to split it in two' },
        {
          path: 'copy.family',
          label: 'Family name',
          hint: `The last line, in script. ${HIDE_EMPTY}`,
        },
      ],
      more: [
        {
          path: 'copy.title',
          label: 'Title',
          hint: `The large script line at the top. ${HIDE_EMPTY}`,
        },
        {
          path: 'copy.intro',
          label: 'Line above the names',
          hint: `Spaced capitals. ${HIDE_EMPTY}`,
        },
        {
          path: 'copy.closing',
          label: 'Sign-off',
          hint: `Small script line above the family name. ${HIDE_EMPTY}`,
        },
        { path: 'type.ornament', label: 'Gold divider', hint: 'Small diamond rule above the date' },
        { path: 'type.titleSize', label: 'Title size', hint: SIZE },
        { path: 'type.introSize', label: 'Line above the names size', hint: SIZE },
        { path: 'type.namesSize', label: 'Names size', hint: SIZE },
        { path: 'type.dateSize', label: 'Date size', hint: SIZE },
        { path: 'type.venueSize', label: 'Venue size', hint: SIZE },
        { path: 'type.closingSize', label: 'Sign-off size', hint: SIZE },
        { path: 'type.familySize', label: 'Family name size', hint: SIZE },
        {
          path: 'type.gap',
          label: 'Line spacing',
          hint: 'In pixels. Gaps between the title, names, date and sign-off groups are 2.5 times this',
        },
        {
          path: 'type.centerY',
          label: 'Text height',
          hint: 'Pixels from the top of the frame to the middle of the text',
        },
        {
          path: 'type.width',
          label: 'Text width',
          hint: 'In pixels. Longer lines wrap at this width',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['wall.trim', 'lanterns.metal', 'balcony.pot'],
          label: 'Primary color',
          hint: 'The gold trim around the arch, the brass lanterns and the plant urns',
        },
        {
          link: ['sky.top', 'sky.middle', 'sky.horizon', 'skyline.color', 'skyline.water'],
          label: 'Secondary color',
          hint: 'The sunset sky, the distant palace and the lake',
        },
        {
          link: ['balcony.marigold', 'balcony.marigoldDeep', 'petals.colorA', 'petals.colorB'],
          label: 'Accent color',
          hint: 'The marigold garlands, the flowers on the plants and the falling petals',
        },
        {
          link: ['type.scriptColor', 'type.inkColor', 'type.detailColor'],
          label: 'Text color',
          hint: 'Every line of the invitation and the gold divider',
        },
        {
          link: ['wall.color', 'wall.shade', 'wall.carving', 'balcony.stone', 'balcony.shade'],
          label: 'Surface color',
          hint: 'The sandstone wall, its carving and the balustrade',
        },
      ],
      more: [
        { path: 'wall.trim', label: 'Arch trim' },
        { path: 'lanterns.metal', label: 'Lantern brass', hint: 'Also the chains' },
        { path: 'balcony.pot', label: 'Plant urns' },
        { path: 'sky.top', label: 'Sky top' },
        { path: 'sky.middle', label: 'Sky middle', hint: 'Also the near edge of the lake' },
        { path: 'sky.horizon', label: 'Sky at the horizon' },
        { path: 'skyline.color', label: 'Palace and hills' },
        { path: 'skyline.water', label: 'Lake' },
        { path: 'balcony.marigold', label: 'Marigolds' },
        {
          path: 'balcony.marigoldDeep',
          label: 'Marigold centers',
          hint: 'Also every third garland bead and the bottom bead of each strand',
        },
        { path: 'petals.colorA', label: 'Petal color' },
        { path: 'petals.colorB', label: 'Second petal color', hint: 'Every third petal' },
        { path: 'type.scriptColor', label: 'Script text', hint: 'Title and family name' },
        { path: 'type.inkColor', label: 'Names and venue' },
        {
          path: 'type.detailColor',
          label: 'Details',
          hint: 'Line above the names, date, sign-off and the gold divider',
        },
        { path: 'wall.color', label: 'Wall' },
        {
          path: 'wall.shade',
          label: 'Wall shade',
          hint: 'Wall edges, the carved border, the inside of the arch, the ledges and brackets',
        },
        { path: 'wall.carving', label: 'Carving lines' },
        { path: 'balcony.stone', label: 'Balustrade' },
        { path: 'balcony.shade', label: 'Balustrade shade' },
        { path: 'sky.sun', label: 'Sun', hint: 'Also its glow and the reflection on the lake' },
        { path: 'sky.cloud', label: 'Clouds' },
        { path: 'lanterns.glass', label: 'Lantern light', hint: 'The lit glass and its glow' },
        { path: 'balcony.leaf', label: 'Leaves' },
        { path: 'balcony.leafDark', label: 'Dark leaves' },
      ],
    },
    {
      title: 'Fonts',
      fields: [
        { path: 'type.scriptFont', label: 'Script font', hint: 'Title, sign-off and family name' },
        {
          path: 'type.serifFont',
          label: 'Serif font',
          hint: 'Names, date, venue and the line above the names',
        },
      ],
    },
    {
      title: 'Camera push',
      fields: [
        {
          path: 'camera.zoomFrom',
          label: 'Starting zoom',
          hint: 'Share of full size the arch starts at. 1 starts fully pushed in',
        },
      ],
      more: [
        {
          path: 'camera.pushFrames',
          label: 'Push length',
          hint: 'In frames. The push eases in and lands softly',
        },
        {
          path: 'camera.drift',
          label: 'Slow drift',
          hint: 'Extra zoom added gently over the whole clip so the arch never stops. 0 holds still',
        },
        {
          path: 'camera.focusY',
          label: 'Push target',
          hint: 'Pixels from the top of the frame the camera pushes toward',
        },
      ],
    },
    {
      title: 'Lanterns',
      fields: [{ path: 'lanterns.count', label: 'Lanterns', hint: '0 removes them' }],
      more: [
        { path: 'lanterns.size', label: 'Lantern size' },
        { path: 'lanterns.hang', label: 'Hanging height', hint: `Top of the lanterns. ${WORLD_Y}` },
        {
          path: 'lanterns.spread',
          label: 'Spread',
          hint: 'Share of the arch width the lanterns spread across',
        },
        { path: 'lanterns.sway', label: 'Sway', hint: 'In degrees. 0 keeps them still' },
        { path: 'lanterns.swayFrames', label: 'Sway length', hint: 'Frames for one full swing' },
        { path: 'lanterns.glow', label: 'Glow', hint: '0 turns the soft halo off' },
      ],
    },
    {
      title: 'Petals',
      fields: [{ path: 'petals.count', label: 'Falling petals', hint: '0 removes them' }],
      more: [
        { path: 'petals.size', label: 'Petal size', hint: SIZE },
        { path: 'petals.fallSpeed', label: 'Fall speed', hint: 'Pixels per frame' },
        { path: 'petals.sway', label: 'Side to side drift', hint: SIZE },
        { path: 'petals.opacity', label: 'Petal opacity' },
      ],
    },
    {
      title: 'Sunset and palace',
      fields: [],
      more: [
        { path: 'sky.clouds', label: 'Clouds', hint: '0 clears the sky' },
        { path: 'sky.cloudSpeed', label: 'Cloud drift', hint: 'Pixels per frame' },
        { path: 'sky.cloudOpacity', label: 'Cloud opacity' },
        { path: 'sky.sunSize', label: 'Sun size', hint: 'Radius in pixels. 0 hides the sun' },
        { path: 'sky.sunX', label: 'Sun position', hint: 'Pixels from the left edge' },
        {
          path: 'skyline.show',
          label: 'Palace and lake',
          hint: 'Off shows only sky down to the balustrade',
        },
        { path: 'skyline.horizon', label: 'Horizon height', hint: WORLD_Y },
        { path: 'skyline.x', label: 'Palace position', hint: 'Pixels from the left edge' },
        { path: 'skyline.scale', label: 'Palace size' },
      ],
    },
    {
      title: 'Balustrade',
      fields: [],
      more: [
        {
          path: 'balcony.show',
          label: 'Show balustrade',
          hint: 'Also hides the garlands and plants',
        },
        { path: 'balcony.garland', label: 'Marigold garlands' },
        {
          path: 'balcony.plants',
          label: 'Potted plants',
          hint: 'Placed on the posts from the outside in',
        },
        { path: 'balcony.plantSize', label: 'Plant size' },
        { path: 'balcony.posts', label: 'Posts' },
        { path: 'balcony.rail', label: 'Rail height', hint: `Top of the rail. ${WORLD_Y}` },
      ],
    },
    {
      title: 'Arch window',
      fields: [],
      more: [
        { path: 'arch.width', label: 'Opening width', hint: SIZE },
        { path: 'arch.top', label: 'Arch top', hint: `Tip of the arch. ${WORLD_Y}` },
        {
          path: 'arch.point',
          label: 'Pointed top',
          hint: '1 is a round arch, higher is taller and more pointed',
        },
        {
          path: 'arch.lobes',
          label: 'Scallops',
          hint: 'Carved lobes on each side of the arch. 0 gives a plain curve',
        },
        { path: 'arch.sill', label: 'Window sill', hint: WORLD_Y },
        { path: 'arch.band', label: 'Carved border width', hint: SIZE },
        { path: 'wall.trimWidth', label: 'Gold trim width', hint: 'In pixels. 0 removes the trim' },
        { path: 'wall.beads', label: 'Carved beading', hint: 'Row of dots in the carved border' },
        { path: 'wall.rosettes', label: 'Rosettes', hint: 'Carved flowers above the arch' },
      ],
    },
    {
      title: 'Timing',
      fields: [],
      more: [
        { path: 'timing.textAt', label: 'Text starts at', hint: 'Frame number of the first line' },
        { path: 'timing.stagger', label: 'Time between lines', hint: 'In frames' },
      ],
    },
    {
      title: 'Background and motion',
      fields: [],
      more: [
        {
          ...LOOK.showBackdrop,
          label: 'Show sunset',
          hint: 'Off leaves the window open, so the arch frames the layer below',
        },
        {
          ...MOTION.speed,
          label: 'Ambient speed',
          hint: 'Speeds up the lantern sway, clouds, plants and petals. The push and text keep their timing',
        },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
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
