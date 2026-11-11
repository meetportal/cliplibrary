import { defineControls } from '../../control-layout';
import type { PhoneSpinInProps } from './phone-spin-in';

const ROLE_HINT = 'Scroll to More options to set each part on its own';

export const phoneSpinInControls = defineControls<PhoneSpinInProps>({
  sections: [
    {
      title: 'Screen and copy',
      fields: [
        {
          path: 'screen',
          label: 'Phone screen',
          hint: 'A screenshot of your app; it fills the screen from the top and crops the rest',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it sits above the headline, or left of the phone in Split',
        },
        {
          path: 'headline',
          label: 'Headline',
          hint: 'Wraps on its own and shrinks to fit the lines allowed',
        },
        {
          path: 'website',
          label: 'Website',
          hint: 'Last line, under the headline; long addresses shrink to fit',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The website button, pill or underline and the light that catches the phone edges',
        },
        {
          link: ['colors.headline', 'colors.website'],
          label: 'Text color',
          hint: `The headline and the website. ${ROLE_HINT}`,
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: `Center and edges of the studio together. A dark color also dims the 3D studio. ${ROLE_HINT}`,
        },
      ],
      more: [
        {
          path: 'colors.plate',
          label: 'Surface color',
          hint: 'The plate behind the logo, when Logo plate is on',
        },
        { path: 'colors.headline', label: 'Headline color' },
        {
          path: 'colors.website',
          label: 'Website color',
          hint: 'Arrow and Underline styles; the pill picks black or white text for itself',
        },
        {
          path: 'colors.background',
          label: 'Background center',
          hint: 'A dark color also dims the 3D studio',
        },
        { path: 'colors.backgroundEdge', label: 'Background edges' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the phone and copy over another clip',
        },
      ],
    },
    {
      title: 'Phone and studio',
      fields: [
        { path: 'phone.finish', label: 'Phone finish' },
        {
          path: 'phone.spinTurns',
          label: 'Spin amount',
          hint: 'Turns the phone spins through as it rises; 0.25 is a quarter turn',
        },
      ],
      more: [
        {
          path: 'phone.restAngle',
          label: 'Resting angle',
          hint: 'How far the phone stays turned once it lands, in radians; positive turns the screen toward the copy',
        },
        {
          path: 'phone.startTip',
          label: 'Starting tip back',
          hint: 'How far the phone is tipped back as it rises; it straightens as it lands',
        },
        {
          path: 'phone.startLean',
          label: 'Starting lean',
          hint: 'How far the phone leans sideways as it rises; it levels out as it lands',
        },
        {
          path: 'phone.slideIn',
          label: 'Sideways slide',
          hint: 'How far out to the side the phone starts before sliding into place',
        },
        {
          path: 'phone.float',
          label: 'Idle float',
          hint: 'How far the phone drifts slowly upward across the clip, so it never sits dead still',
        },
        { path: 'phone.sway', label: 'Idle sway', hint: 'Gentle side to side turn' },
        {
          path: 'stage.cameraDistance',
          label: 'Camera distance',
          hint: 'Higher pulls the camera back so the phone looks smaller',
        },
        {
          path: 'stage.fieldOfView',
          label: 'Field of view',
          hint: 'Lower flattens perspective like a longer lens',
        },
        { path: 'stage.keyLight', label: 'Key light' },
        {
          path: 'stage.rimLight',
          label: 'Edge light',
          hint: 'Light from behind in the Primary color that catches the phone edges; 0 turns it off',
        },
        {
          path: 'stage.reflections',
          label: 'Reflections',
          hint: 'Strength of the studio highlights on the glass and frame',
        },
        { path: 'stage.shadow', label: 'Shadow strength' },
        { path: 'stage.shadowSoftness', label: 'Shadow softness' },
        { path: 'stage.cameraDrift', label: 'Camera drift', hint: 'Slow wandering camera' },
      ],
    },
    {
      title: 'Layout',
      fields: [
        {
          path: 'layout.arrangement',
          label: 'Arrangement',
          hint: 'Text left or right of the phone, or Split: logo left and headline right of a centered phone',
        },
        { path: 'layout.phoneSize', label: 'Phone size' },
      ],
      more: [
        {
          path: 'layout.phoneX',
          label: 'Phone distance from center',
          hint: 'Text left and Text right only; the phone moves away from the center and the copy follows it',
        },
        {
          path: 'layout.phoneY',
          label: 'Phone height',
          hint: 'Negative moves the phone down',
        },
        {
          path: 'layout.textInset',
          label: 'Side margin',
          hint: 'Least space in pixels between the frame edge and the copy; long copy grows out to it',
        },
        {
          path: 'layout.textWidth',
          label: 'Copy width',
          hint: 'Widest the headline may run, in pixels',
        },
        {
          path: 'layout.textGap',
          label: 'Gap to the phone',
          hint: 'Space in pixels between the phone and the copy; Split keeps it on both sides',
        },
      ],
    },
    {
      title: 'Type and logo',
      fields: [{ path: 'type.font', label: 'Headline font' }],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in pixels; long headlines shrink',
        },
        {
          path: 'type.headlineLines',
          label: 'Headline lines',
          hint: 'Most lines the headline may wrap to before it shrinks',
        },
        { path: 'type.websiteSize', label: 'Website size', hint: 'In pixels' },
        {
          path: 'type.websiteStyle',
          label: 'Website style',
          hint: 'Arrow puts a Primary button before it, Pill fills it with Primary, Underline draws a Primary bar under it',
        },
        {
          path: 'logoBox.size',
          label: 'Logo size',
          hint: 'Side of a square logo in pixels; wide logos grow wider and shorter',
        },
        {
          path: 'logoBox.plate',
          label: 'Logo plate',
          hint: 'A backing plate in the Surface color, so a dark logo reads on a dark studio',
        },
        { path: 'logoBox.padding', label: 'Plate padding', hint: 'In pixels' },
        {
          path: 'logoBox.roundness',
          label: 'Plate roundness',
          hint: '100 makes a pill or a circle, 0 a sharp rectangle',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.spinFrames',
          label: 'Spin-in length',
          hint: 'In frames; the phone rises, spins and lands over this time',
        },
        {
          path: 'timing.textStart',
          label: 'Copy entrance',
          hint: 'Frame the logo starts to arrive; the headline and website follow',
        },
      ],
      more: [
        {
          path: 'timing.textStagger',
          label: 'Copy stagger',
          hint: 'In frames, between the logo, headline and website',
        },
      ],
    },
  ],
});
