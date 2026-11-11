import { defineControls } from '../../control-layout';
import type { AnniversaryKineticProps } from './anniversary-kinetic';

const WORD_HINT = 'One beat of the teaser; long words shrink to fit the width';

export const anniversaryKineticControls = defineControls<AnniversaryKineticProps>({
  sections: [
    {
      title: 'Anniversary',
      fields: [
        {
          path: 'years',
          label: 'Years',
          hint: 'The big number after "Turning" and inside the badge, such as 25',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Tracked capitals under the badge; the first letter takes the Primary color',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Above the badge on the end card; wide, square and round logos all fit',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Last line of the end card. Leave empty to hide it',
        },
        {
          path: 'founded',
          label: 'Founded line',
          hint: 'Between the two rules under the name, shown in capitals. Leave empty to hide it',
        },
      ],
      more: [
        {
          path: 'badgeLine',
          label: 'Badge line',
          hint: 'Small capitals inside the badge under the number',
        },
        {
          path: 'milestone.ordinal',
          label: 'Ordinal ending',
          hint: 'Adds st, nd, rd or th after a whole number in the badge',
        },
        { path: 'badge.size', label: 'Badge size', hint: 'Diameter in pixels' },
        {
          path: 'badge.ring',
          label: 'Badge ring width',
          hint: 'In pixels; 0 hides the outer ring',
        },
        { path: 'badge.dots', label: 'Badge dots', hint: 'Number of dashes in the inner ring' },
        {
          path: 'badge.spin',
          label: 'Dot ring spin',
          hint: 'Degrees per frame the inner ring turns on the end card; 0 holds it still',
        },
        {
          path: 'brand.logoHeight',
          label: 'Logo height',
          hint: 'In pixels for a wide logo; square and round logos stand 30% taller, and wide logos stop at 60% of the frame width',
        },
        {
          path: 'brand.plate',
          label: 'Logo plate',
          hint: 'A soft light plate behind the logo, for logos that need one',
        },
        {
          path: 'brand.nameCaps',
          label: 'Company name in capitals',
          hint: 'Shows the name in capital letters, as the design does',
        },
        {
          path: 'brand.nameSize',
          label: 'Company name size',
          hint: 'In pixels; long names shrink to fit',
        },
        {
          path: 'brand.nameTracking',
          label: 'Company name spacing',
          hint: 'Letter spacing of the name, as a share of its size',
        },
        {
          path: 'brand.taglineSize',
          label: 'Tagline size',
          hint: 'In pixels; the founded line is 60% of it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The word "come", the badge number and dots, the first letter of the name and the rules',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The repeated "Look", colour sweeps, the gradient end, the noise and the band edge',
        },
        { path: 'colors.text', label: 'Text color', hint: 'Words on the dark beats' },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The dark beats; also the words on the light beats and the badge ring',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The light beats and the end card',
        },
      ],
      more: [
        { path: 'colors.deep', label: 'Lean in background', hint: 'Behind the stacked "Lean in!"' },
        {
          path: 'colors.plum',
          label: 'Plum background',
          hint: 'Behind "to share" and the second "Look"',
        },
        {
          path: 'colors.highlight',
          label: 'Highlight color',
          hint: 'The start of the "We’ve got" gradient and the top edge of the band',
        },
        { path: 'colors.name', label: 'Company name color', hint: 'The name and the founded line' },
        { path: 'colors.muted', label: 'Tagline color' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the words over another clip',
        },
      ],
    },
    {
      title: 'Words',
      fields: [
        { path: 'news.bigNews', label: 'Big news', hint: WORD_HINT },
        { path: 'journey.howFar', label: 'How far', hint: WORD_HINT },
      ],
      more: [
        { path: 'opening.intro', label: 'Opening word', hint: 'Glitches in on the first frame' },
        {
          path: 'opening.leanIn',
          label: 'Stacked line',
          hint: 'Repeated in a wave on the teal beat',
        },
        {
          path: 'opening.leanInRepeats',
          label: 'Stacked line repeats',
          hint: 'How many times the stacked line repeats',
        },
        { path: 'news.weveGot', label: 'Gradient words', hint: 'Whips in with a colour gradient' },
        { path: 'news.soGood', label: 'Shrinking words', hint: 'Shrinks on the light beat' },
        { path: 'news.toShare', label: 'Rising words', hint: WORD_HINT },
        {
          path: 'news.withYou',
          label: 'Dropping words',
          hint: 'The last letter springs up into place',
        },
        {
          path: 'journey.look',
          label: 'Repeated word',
          hint: 'Repeats on a diagonal, then shows alone',
        },
        { path: 'journey.weve', label: 'Typed word', hint: 'Typed over its own giant outline' },
        {
          path: 'journey.come',
          label: 'Accent word',
          hint: 'In the Primary color on the light beat',
        },
        { path: 'journey.and', label: 'Quick word', hint: WORD_HINT },
        { path: 'journey.still', label: 'Held word', hint: WORD_HINT },
        {
          path: 'journey.going',
          label: 'Whipped stack',
          hint: 'Three lines whip in from the right',
        },
        { path: 'journey.strong', label: 'Rising stack', hint: 'Three offset lines rise in' },
        {
          path: 'milestone.turning',
          label: 'Before the number',
          hint: 'Drops in letter by letter',
        },
        { path: 'milestone.today', label: 'After the number', hint: 'Typed onto the slanted band' },
      ],
    },
    {
      title: 'Values',
      fields: [{ path: 'values.first', label: 'First value', hint: 'Slab capitals that punch in' }],
      more: [
        { path: 'values.second', label: 'Second value', hint: 'Tracks in on the band' },
        {
          path: 'values.third',
          label: 'Third value',
          hint: 'Glitches on a light flash, then the band',
        },
        {
          path: 'values.fourth',
          label: 'Fourth value',
          hint: 'Fades in letter by letter, then glitches out',
        },
        { path: 'type.font', label: 'Word font' },
        { path: 'type.valueFont', label: 'Value font' },
        { path: 'type.size', label: 'Word size', hint: 'In pixels; long words shrink to fit' },
        {
          path: 'type.valueSize',
          label: 'Value size',
          hint: 'In pixels; long values shrink to fit',
        },
      ],
    },
    {
      title: 'Effects and timing',
      fields: [
        {
          path: 'effects.glitch',
          label: 'Glitch strength',
          hint: 'How far the shredded slices jump; 0 turns the glitches off',
        },
      ],
      more: [
        {
          path: 'effects.noise',
          label: 'Noise bursts',
          hint: 'Strength of the noise flashes; 0 turns them off',
        },
        {
          path: 'effects.streaks',
          label: 'Streaks',
          hint: 'Strength of the diagonal streaks; 0 turns them off',
        },
        {
          path: 'effects.outlines',
          label: 'Giant outlines',
          hint: 'Strength of the huge outline letters and arcs behind some words',
        },
        {
          path: 'effects.stars',
          label: 'Specks',
          hint: 'Number of faint specks in the background',
        },
        {
          path: 'effects.grain',
          label: 'Film grain',
          hint: 'Faint flickering grain over the background so held words never sit dead still; 0 turns it off',
        },
        { path: 'effects.bandTilt', label: 'Band tilt', hint: 'In degrees' },
        {
          path: 'timing.pace',
          label: 'Word pace',
          hint: 'Above 1 holds each word longer and shortens the end card; below 1 is snappier',
        },
        {
          path: 'timing.endBuild',
          label: 'End card build',
          hint: 'In frames, how long the badge, name and tagline take to arrive',
        },
      ],
    },
  ],
});
