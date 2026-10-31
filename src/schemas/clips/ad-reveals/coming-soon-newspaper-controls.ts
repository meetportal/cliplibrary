import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { ComingSoonNewspaperProps } from './coming-soon-newspaper';

const LINES_HINT = 'Each line is a row; long lines shrink to fit the page';
const PHOTO_HINT =
  'Printed in grainy black and white in the ink and paper colors. Leave empty for a plain gray block';
const FOCUS_HINT = 'Which part of the photo shows when it is cropped: 0 the top, 1 the bottom';
const ZOOM_HINT = '1 just fills the box; higher crops in around the center';
const BODY_HINT = 'Small italic copy; it wraps and is cut where the space ends';
const SPACED_HINT = 'Small spaced capitals; squeezed to fit the page width';
const FRAME_HINT = 'Frame number; the clip runs 264 frames at 24 fps';

export const comingSoonNewspaperControls = defineControls<ComingSoonNewspaperProps>({
  sections: [
    {
      title: 'Right page',
      fields: [
        {
          path: 'rightPage.headline',
          label: 'Big headline',
          hint: `Tall condensed capitals across the right page. ${LINES_HINT}`,
        },
        {
          path: 'rightPage.nameplate',
          label: 'Newspaper name',
          hint: 'Italic serif at the top of the right page',
        },
        { path: 'rightPage.photo', label: 'Right page photo', hint: PHOTO_HINT },
      ],
      more: [
        { path: 'rightPage.headlineSize', label: 'Big headline size' },
        { path: 'rightPage.dateline', label: 'Top line', hint: SPACED_HINT },
        { path: 'rightPage.body', label: 'Column copy', hint: `Beside the photo. ${BODY_HINT}` },
        {
          path: 'rightPage.footer',
          label: 'Footer',
          hint: 'Spaced capitals along the bottom of the right page',
        },
        { path: 'rightPage.photoFocus', label: 'Photo position', hint: FOCUS_HINT },
        { path: 'rightPage.photoZoom', label: 'Photo zoom', hint: ZOOM_HINT },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['ink.text', 'ink.headline', 'ink.photo'],
          label: 'Primary color',
          hint: 'The printed ink: headlines, names, rules, copy and the dark tones of both photos',
        },
        {
          path: 'ink.paper',
          label: 'Surface color',
          hint: 'Paper tint printed over the pages and the light tones of both photos',
        },
        {
          link: ['wordmark.color', 'wordmark.ruleColor'],
          label: 'Text color',
          hint: 'The closing wordmark and its divider line',
        },
        {
          path: 'dim.color',
          label: 'Background color',
          hint: 'The color the footage fades to under the wordmark',
        },
      ],
      more: [
        { path: 'ink.text', label: 'Text ink', hint: 'Names, top lines, rules and copy' },
        { path: 'ink.headline', label: 'Headline ink', hint: 'Both page headlines' },
        { path: 'ink.photo', label: 'Photo ink', hint: 'Darkest tone of both printed photos' },
        { path: 'wordmark.color', label: 'Wordmark color' },
        { path: 'wordmark.ruleColor', label: 'Divider line color' },
      ],
    },
    {
      title: 'Left page',
      fields: [
        {
          path: 'leftPage.brand',
          label: 'Brand name',
          hint: 'Large spaced serif at the top of the left page',
        },
        {
          path: 'leftPage.headline',
          label: 'Headline',
          hint: `Serif capitals under the name. ${LINES_HINT}`,
        },
        { path: 'leftPage.photo', label: 'Left page photo', hint: PHOTO_HINT },
      ],
      more: [
        { path: 'leftPage.headlineSize', label: 'Headline size' },
        { path: 'leftPage.dateline', label: 'Top line', hint: SPACED_HINT },
        { path: 'leftPage.kicker', label: 'Kicker', hint: 'Spaced capitals under the photo' },
        {
          path: 'leftPage.body',
          label: 'Column copy',
          hint: `Two columns at the foot. ${BODY_HINT}`,
        },
        { path: 'leftPage.photoFocus', label: 'Photo position', hint: FOCUS_HINT },
        { path: 'leftPage.photoZoom', label: 'Photo zoom', hint: ZOOM_HINT },
      ],
    },
    {
      title: 'Wordmark',
      fields: [
        {
          path: 'wordmark.brand',
          label: 'Brand',
          hint: 'Left of the divider; leave empty to hide it',
        },
        {
          path: 'wordmark.second',
          label: 'Second word',
          hint: 'Smaller, right of the divider; leave empty to hide it',
        },
      ],
      more: [
        { path: 'wordmark.size', label: 'Size', hint: 'Brand size in pixels' },
        {
          path: 'wordmark.secondSize',
          label: 'Second word size',
          hint: 'Share of the brand size',
        },
        { path: 'wordmark.tracking', label: 'Letter spacing', hint: 'In ems' },
        { path: 'wordmark.gap', label: 'Gap around the divider', hint: 'In pixels' },
        { path: 'wordmark.ruleHeight', label: 'Divider height', hint: 'In pixels; 0 hides it' },
        {
          path: 'wordmark.offsetY',
          label: 'Height offset',
          hint: 'In pixels from the center; negative moves it up',
        },
        { path: 'wordmark.start', label: 'Fade-in starts', hint: FRAME_HINT },
        { path: 'wordmark.fadeFrames', label: 'Fade-in length', hint: 'In frames' },
        {
          path: 'wordmark.rise',
          label: 'Rise',
          hint: 'How far it rises while it fades in, in pixels',
        },
      ],
    },
    {
      title: 'Fade to black',
      fields: [
        {
          path: 'dim.start',
          label: 'Fade starts',
          hint: `${FRAME_HINT}; she is out of frame from about 232`,
        },
      ],
      more: [
        { path: 'dim.frames', label: 'Fade length', hint: 'In frames' },
        {
          path: 'dim.amount',
          label: 'How dark',
          hint: '1 covers the footage completely; 0 keeps it visible behind the wordmark',
        },
      ],
    },
    {
      title: 'Print',
      fields: [],
      more: [
        {
          path: 'print.strength',
          label: 'Ink strength',
          hint: 'How solid the printing looks on the paper',
        },
        {
          path: 'print.shading',
          label: 'Follow the paper light',
          hint: 'Shades the print with the filmed paper so creases and shadows show; 0 keeps it flat',
        },
        {
          path: 'print.paperTint',
          label: 'Paper tint strength',
          hint: 'How strongly the surface color tints the paper',
        },
        {
          path: 'print.softness',
          label: 'Print softness',
          hint: 'Blurs the print to match the footage; 0 is sharp',
        },
        {
          path: 'print.fadeStart',
          label: 'Print fades out from',
          hint: 'Frame number; she starts lowering the paper at about 108 and the print is gone by 120',
        },
        {
          path: 'print.fadeFrames',
          label: 'Print fade length',
          hint: 'In frames; the fade always ends by frame 120, when the paper folds away',
        },
        { path: 'photos.contrast', label: 'Photo contrast', hint: '1 keeps the original contrast' },
        {
          path: 'photos.brightness',
          label: 'Photo brightness',
          hint: 'Below 1 darkens both printed photos',
        },
        { path: 'photos.grain', label: 'Photo grain', hint: '0 is smooth' },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.zoom',
          label: 'Push-in',
          hint: 'How close the camera drifts toward the paper while she reads; 1 stays wide',
        },
      ],
      more: [
        {
          path: 'camera.creep',
          label: 'Slow creep',
          hint: 'Extra zoom gained slowly while the camera is close; 0 holds still',
        },
        { path: 'camera.pushStart', label: 'Push-in starts', hint: FRAME_HINT },
        { path: 'camera.pushFrames', label: 'Push-in length', hint: 'In frames' },
        { path: 'camera.pullStart', label: 'Pull-out starts', hint: FRAME_HINT },
        { path: 'camera.pullFrames', label: 'Pull-out length', hint: 'In frames' },
        {
          path: 'camera.focusX',
          label: 'Focus across',
          hint: 'In pixels from the left of the footage; drifts toward the center while close',
        },
        {
          path: 'camera.focusY',
          label: 'Focus height',
          hint: 'In pixels from the top of the footage; drifts toward the center while close',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exit, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float', 'motion.speed'],
});
