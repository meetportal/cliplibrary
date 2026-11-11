import { defineControls } from '../../control-layout';
import type { BillboardReaderProps } from './billboard-reader';

export const billboardReaderControls = defineControls<BillboardReaderProps>({
  sections: [
    {
      title: 'Billboard copy',
      fields: [
        {
          path: 'headline',
          label: 'Headline',
          hint: 'First headline line on the board in the text colour; long lines wrap to two and shrink',
        },
        {
          path: 'headlineAccent',
          label: 'Headline accent',
          hint: 'Second headline line in the Primary color, the words you want remembered',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Smaller line under the headline rule; wraps to up to three lines',
        },
      ],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in board pixels (the board is 2048 wide); both lines share one size, and very short lines grow up to a third bigger',
        },
        { path: 'type.taglineSize', label: 'Tagline size', hint: 'Largest size in board pixels' },
        {
          path: 'type.uppercase',
          label: 'Capitals',
          hint: 'Sets the headline and the company name in capitals',
        },
        {
          path: 'board.brackets',
          label: 'Corner marks',
          hint: 'The two Primary color corner marks on the board',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.accent',
          label: 'Primary color',
          hint: 'Headline accent, the rule under it, the corner marks and the badge on the hero; lifted automatically if too dark to read on the board',
        },
        {
          path: 'colors.suit',
          label: 'Secondary color',
          hint: 'The hero suit and helmet',
        },
        {
          path: 'colors.board',
          label: 'Surface color',
          hint: 'The billboard face; its frame is a darker shade of it',
        },
        {
          link: ['colors.text', 'colors.tagline'],
          label: 'Text color',
          hint: 'First headline line and the company name, with the tagline in its softer shade; set each in More options',
        },
        {
          link: ['colors.skyTop', 'colors.skyHorizon'],
          label: 'Background color',
          hint: 'The dusk sky from the top down to the haze at the horizon; the haze also tints the city and lights',
        },
      ],
      more: [
        { path: 'colors.text', label: 'Headline and name' },
        { path: 'colors.tagline', label: 'Tagline' },
        { path: 'colors.trim', label: 'Gloves, boots and belt' },
        { path: 'colors.cape', label: 'Cape' },
        { path: 'colors.skyTop', label: 'Sky top' },
        { path: 'colors.skyHorizon', label: 'Horizon haze' },
        { path: 'colors.ocean', label: 'Ocean' },
        { path: 'colors.roofs', label: 'Roofs', hint: 'Also shades the trees, streets and road' },
        { path: 'colors.walls', label: 'House walls', hint: 'Also the beach and the tower' },
        { path: 'colors.lamp', label: 'Lamp light' },
        {
          path: 'showBackground',
          label: 'Show sky and city',
          hint: 'Turn off to float the billboard over another clip',
        },
      ],
    },
    {
      title: 'Name and logo',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Bottom right of the board under the logo; long names shrink, then wrap to two lines',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; sits on a light plate above the name',
        },
      ],
      more: [
        { path: 'type.nameSize', label: 'Name size', hint: 'Largest size in board pixels' },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Tallest the logo gets in board pixels, so square and round logos fill it; wide logos stop at 560 wide',
        },
        {
          path: 'lockup.showPlate',
          label: 'Logo plate',
          hint: 'The light rounded plate behind the logo, so dark logos read on the board',
        },
        { path: 'colors.plate', label: 'Logo plate color' },
      ],
    },
    {
      title: 'Hero and lamps',
      fields: [
        {
          path: 'reader.show',
          label: 'Show the hero',
          hint: 'The caped reader sitting on top of the board',
        },
        {
          path: 'board.lampGlow',
          label: 'Lamp glow',
          hint: 'How bright the three lamp pools on the board get; 0 turns them off',
        },
      ],
      more: [
        {
          path: 'board.lampsAt',
          label: 'Lamps on at',
          hint: 'Frame the first lamp warms up; the other two follow 6 frames apart',
        },
        {
          path: 'reader.flipAt',
          label: 'Page turn at',
          hint: 'Frame the hero turns the newspaper to the inside pages; the turn takes 1 second',
        },
        {
          path: 'reader.kick',
          label: 'Foot swing',
          hint: 'How much the dangling boots swing; 0 holds them still',
        },
        { path: 'city.traffic', label: 'Traffic', hint: 'Cars driving along the coast road' },
        {
          path: 'city.surf',
          label: 'Surf',
          hint: 'Brightness of the wave lines rolling in; 0 turns them off',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.orbit',
          label: 'Orbit',
          hint: 'Degrees the camera swings around the board on its way up',
        },
        {
          path: 'camera.rise',
          label: 'Rise',
          hint: 'Degrees above the board the camera ends; it starts 10 degrees below',
        },
      ],
      more: [
        {
          path: 'camera.endDistance',
          label: 'End distance',
          hint: 'How close the camera ends to the board; it starts 54 away',
        },
        { path: 'camera.fieldOfView', label: 'Field of view', hint: 'Vertical, in degrees' },
      ],
    },
  ],
});
