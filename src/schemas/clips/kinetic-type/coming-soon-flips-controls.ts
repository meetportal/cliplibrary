import { defineControls } from '../../control-layout';
import type { ComingSoonFlipsProps } from './coming-soon-flips';

export const comingSoonFlipsControls = defineControls<ComingSoonFlipsProps>({
  sections: [
    {
      title: 'Name and logo',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Sits under the logo on the lit wall at the end; long names shrink to one line. Leave empty if your logo already spells the name',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Painted on the wall and found by the light; wide, square and round logos all fit whole',
        },
      ],
      more: [
        {
          path: 'lockup.logoSize',
          label: 'Logo size',
          hint: 'In pixels: the side of a square logo; wide logos get the same area, up to Logo width',
        },
        {
          path: 'lockup.logoMaxWidth',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels, plate included',
        },
        {
          path: 'lockup.plate',
          label: 'Logo plate',
          hint: 'A soft rounded plate behind the logo, for a light logo on a pale wall',
        },
        { path: 'lockup.platePadding', label: 'Plate padding', hint: 'In pixels around the logo' },
        { path: 'lockup.nameFont', label: 'Name font' },
        {
          path: 'lockup.nameSize',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink to fit the width',
        },
        {
          path: 'lockup.nameGap',
          label: 'Space above the name',
          hint: 'In pixels, under the logo',
        },
        {
          path: 'lockup.y',
          label: 'Logo height on screen',
          hint: 'Share of the frame height for the middle of the logo and name',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The bright plates, the underline on dark plates and the solid title line; words on it turn dark or light to stay readable',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Words on the dark plates and the outlined title line',
        },
        {
          link: ['colors.background', 'colors.name'],
          label: 'Background color',
          hint: 'The dark plates, the wall in shadow and the name under the logo',
        },
        {
          path: 'colors.wall',
          label: 'Surface color',
          hint: 'The plaster wall where the light falls',
        },
      ],
      more: [
        { path: 'colors.background', label: 'Dark plate and shadow' },
        { path: 'colors.name', label: 'Name color', hint: 'The company name on the lit wall' },
        { path: 'colors.wallShade', label: 'Plaster patches', hint: 'The darker blotches' },
        { path: 'colors.speck', label: 'Plaster specks', hint: 'Small dots inside the patches' },
        { path: 'colors.plate', label: 'Logo plate color', hint: 'Shows when Logo plate is on' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to drop the word plates and layer the words over another clip; the wall and its shadow stay',
        },
        {
          path: 'grain',
          label: 'Film grain',
          hint: 'Strength of the moving grain over everything; 0 turns it off',
        },
      ],
    },
    {
      title: 'Words',
      fields: [
        {
          path: 'words',
          label: 'Words',
          hint: 'One word per hard cut, in order. Plate: Primary is the bright plate, Background the dark one. Font flicker stutters the word through the flicker fonts. The title and light take the frames that are left',
          items: {
            text: 'Word',
            plate: 'Plate',
            frames: 'Length in frames',
            flicker: 'Font flicker',
          },
        },
        { path: 'type.font', label: 'Word font' },
        {
          path: 'underline.show',
          label: 'Underline',
          hint: 'A bar that keeps growing under each word until the cut',
        },
      ],
      more: [
        {
          path: 'type.size',
          label: 'Word size',
          hint: 'Largest size in pixels; long words shrink to fit the width',
        },
        { path: 'type.tracking', label: 'Letter spacing', hint: 'Share of the word size' },
        {
          path: 'type.y',
          label: 'Word height on screen',
          hint: 'Share of the frame height for the middle of the capitals',
        },
        {
          path: 'type.flickerFonts',
          label: 'Flicker fonts',
          hint: 'The typefaces a flicker word cycles through, in order; Main is the word font',
        },
        {
          path: 'type.flickerHold',
          label: 'Flicker speed',
          hint: 'Frames each flicker font holds; 1 is the fastest',
        },
        {
          path: 'underline.width',
          label: 'Underline length',
          hint: 'Share of the word width it reaches at the cut; short words still get a bar that grows at least 4 pixels a frame',
        },
        {
          path: 'underline.startWidth',
          label: 'Underline start',
          hint: 'Share of its cut length as the word cuts in, never shorter than six times its thickness',
        },
        { path: 'underline.thickness', label: 'Underline thickness', hint: 'In pixels' },
        { path: 'underline.gap', label: 'Underline gap', hint: 'In pixels under the capitals' },
      ],
    },
    {
      title: 'Title',
      fields: [
        { path: 'title.top', label: 'Top line', hint: 'Shrinks to fit the width' },
        { path: 'title.bottom', label: 'Bottom line', hint: 'Shrinks to fit the width' },
      ],
      more: [
        { path: 'title.font', label: 'Title font' },
        { path: 'title.topSize', label: 'Top line size', hint: 'Largest size in pixels' },
        { path: 'title.bottomSize', label: 'Bottom line size', hint: 'Largest size in pixels' },
        { path: 'title.tracking', label: 'Letter spacing', hint: 'Share of each line size' },
        { path: 'title.gap', label: 'Line gap', hint: 'In pixels between the lines' },
        {
          path: 'title.outlined',
          label: 'Outlined line',
          hint: 'Which line is drawn as an outline in the text color; the other is solid primary',
        },
        { path: 'title.outline', label: 'Outline width', hint: 'In pixels' },
        {
          path: 'title.y',
          label: 'Title height on screen',
          hint: 'Share of the frame height for the top of the title; below the logo makes one lockup',
        },
        {
          path: 'title.spread',
          label: 'Track in spread',
          hint: 'How wide the letters start, as a multiple of their final spacing; 1 does not track',
        },
        { path: 'title.settleFrames', label: 'Track in length', hint: 'In frames' },
        {
          path: 'title.appearFrames',
          label: 'Letters appear over',
          hint: 'In frames, letters arrive in a shuffled order; 0 shows them all at once',
        },
        {
          path: 'title.flickerFrames',
          label: 'Letter flicker',
          hint: 'Frames each letter flickers as it arrives; 0 is off',
        },
        {
          path: 'title.seed',
          label: 'Letter order',
          hint: 'Shuffles the order the letters arrive',
        },
      ],
    },
    {
      title: 'Light',
      fields: [
        { path: 'light.slats', label: 'Light slats', hint: 'Number of beams in the window light' },
        {
          path: 'light.angle',
          label: 'Light angle',
          hint: 'Direction the beams travel, in degrees; 180 rolls flat blinds down the wall',
        },
      ],
      more: [
        { path: 'light.slatGap', label: 'Slat spacing', hint: 'In pixels between beams' },
        { path: 'light.softness', label: 'Beam softness', hint: 'In pixels; higher is softer' },
        { path: 'light.strength', label: 'Light strength' },
        {
          path: 'light.restWidth',
          label: 'Resting light width',
          hint: 'In pixels, how far the light opens over the logo at the end',
        },
        {
          path: 'light.titleMargin',
          label: 'Shadow around the title',
          hint: 'In pixels; the light stays this far from the title so it reads',
        },
        {
          path: 'light.sweepFrames',
          label: 'First sweep',
          hint: 'In frames for the beams to cross the wall',
        },
        {
          path: 'light.swing',
          label: 'Swing past the logo',
          hint: 'How far the light travels before it swings back; 1 crosses at an even speed and turns off the wall, lower turns it on the wall',
        },
        {
          path: 'light.settleFrames',
          label: 'Settle length',
          hint: 'In frames for the light to swing back and open over the logo',
        },
        {
          path: 'flashFrames',
          label: 'Wall flash',
          hint: 'Frames the whole lit wall flashes after the last word; 0 is off',
        },
        { path: 'wall.blotchScale', label: 'Plaster patch scale', hint: 'Higher is smaller' },
        { path: 'wall.blotchAmount', label: 'Plaster patches', hint: '0 is a plain wall' },
        { path: 'wall.speckAmount', label: 'Plaster specks' },
        { path: 'wall.seed', label: 'Plaster pattern', hint: 'Picks another pattern' },
      ],
    },
  ],
});
