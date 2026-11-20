import { defineControls } from '../../control-layout';
import type { AppScreensPromoProps } from './app-screens-promo';

const ROLE_HINT = 'Scroll to More options to set each part on its own';
const SCREEN_HINT =
  'A portrait screenshot of your app (about 9 by 19.5); it fills the screen from the top and crops the rest';

export const appScreensPromoControls = defineControls<AppScreensPromoProps>({
  sections: [
    {
      title: 'Screens and name',
      fields: [
        {
          path: 'screen1',
          label: 'Main screen',
          hint: `${SCREEN_HINT}. Centre of the fan, the second feature and the front phone at the end`,
        },
        {
          path: 'screen2',
          label: 'Second screen',
          hint: `${SCREEN_HINT}. Left of the fan, the front phone of the first feature`,
        },
        {
          path: 'screen3',
          label: 'Third screen',
          hint: `${SCREEN_HINT}. Right of the fan, the big phone of the second feature`,
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it fills the app icon at the start and sits above the name at the end',
        },
        {
          path: 'companyName',
          label: 'App name',
          hint: 'Beside the app icon at the start and as the title of the end card; long names wrap and shrink',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The accent bars, the pills on the app icon and empty phone screens',
        },
        {
          link: ['colors.text', 'colors.line', 'colors.badge'],
          label: 'Text color',
          hint: `The app name, captions, their lines and the store badges. ${ROLE_HINT}`,
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The backdrop; its soft rounded shapes follow it',
        },
        { path: 'colors.phone', label: 'Surface color', hint: 'The phone bodies' },
      ],
      more: [
        { path: 'colors.text', label: 'Title color', hint: 'The app name and caption titles' },
        { path: 'colors.line', label: 'Line color', hint: 'The caption lines and the tagline' },
        {
          path: 'colors.badge',
          label: 'Badge color',
          hint: 'Fill of the store badges; their words turn black or white to stay readable',
        },
        {
          path: 'colors.tile',
          label: 'App icon color',
          hint: 'The app icon behind the logo at the start and the logo plate on the end card',
        },
        {
          path: 'backdrop.shapeDepth',
          label: 'Shape depth',
          hint: 'How much the rounded backdrop shapes stand out from the background; 0 hides them',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the phones and copy over another clip',
        },
      ],
    },
    {
      title: 'Captions and end card',
      fields: [
        {
          path: 'feature1.title',
          label: 'First feature',
          hint: 'Left of the first pair of phones',
        },
        {
          path: 'feature2.title',
          label: 'Second feature',
          hint: 'Right of the second pair of phones',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Under the app name on the end card; leave empty to hide it',
        },
      ],
      more: [
        {
          path: 'feature1.line',
          label: 'First feature line',
          hint: 'One sentence under the first feature; leave empty to hide it',
        },
        {
          path: 'feature2.line',
          label: 'Second feature line',
          hint: 'One sentence under the second feature; leave empty to hide it',
        },
        { path: 'type.font', label: 'Title font' },
        {
          path: 'type.nameSize',
          label: 'App name size',
          hint: 'Largest size in pixels, at the start and on the end card; long names wrap and shrink',
        },
        {
          path: 'type.captionSize',
          label: 'Feature size',
          hint: 'Largest size in pixels of the feature titles; long titles shrink',
        },
        {
          path: 'type.lineSize',
          label: 'Line size',
          hint: 'In pixels, for the feature lines and the tagline',
        },
        {
          path: 'badges.show',
          label: 'Store badges',
          hint: 'Two badges under the tagline on the end card',
        },
        { path: 'badges.appStoreTop', label: 'First badge small line' },
        { path: 'badges.appStore', label: 'First badge' },
        { path: 'badges.playTop', label: 'Second badge small line' },
        { path: 'badges.play', label: 'Second badge' },
      ],
    },
    {
      title: 'Phones, app icon and timing',
      fields: [
        {
          path: 'phones.size',
          label: 'Phone size',
          hint: '1 is the standard size; every phone grows or shrinks together; near the top the biggest phones move toward the middle and stop growing so they stay in the frame',
        },
        {
          path: 'timing.riseFrames',
          label: 'Phone rise length',
          hint: 'In frames, how long each set of phones takes to rise into place',
        },
      ],
      more: [
        {
          path: 'phones.tilt',
          label: 'Phone tilt',
          hint: 'In degrees, how far the feature phones lean; the fan uses about half of it',
        },
        {
          path: 'phones.fanSpread',
          label: 'Fan spread',
          hint: 'In pixels, how far the side phones slide out from behind the main one',
        },
        {
          path: 'phones.float',
          label: 'Idle float',
          hint: 'In pixels, how far the phones bob and sway while they rest; at 0 they still drift slowly upward',
        },
        { path: 'phones.shadow', label: 'Phone shadow', hint: '0 turns the shadows off' },
        {
          path: 'tile.size',
          label: 'App icon size',
          hint: 'In pixels; a wide logo makes the icon wider and shorter',
        },
        {
          path: 'tile.tilt',
          label: 'App icon turn',
          hint: 'In degrees, how far the icon stays turned toward the name once it lands',
        },
        {
          path: 'tile.roundness',
          label: 'App icon roundness',
          hint: 'Corner radius as a share of the icon side',
        },
        {
          path: 'tile.logoPadding',
          label: 'Logo padding',
          hint: 'Space around the logo inside the icon, as a share of its side',
        },
        {
          path: 'timing.textStagger',
          label: 'Text stagger',
          hint: 'In frames, between the lines of each caption and the end card',
        },
        {
          path: 'backdrop.drift',
          label: 'Backdrop drift',
          hint: 'Speed of the slow drift of the backdrop shapes; 0 holds them still',
        },
      ],
    },
  ],
});
