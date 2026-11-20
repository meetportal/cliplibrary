import { defineControls } from '../../control-layout';
import type { GrowthCallScreenProps } from './growth-call-screen';

export const growthCallScreenControls = defineControls<GrowthCallScreenProps>({
  sections: [
    {
      title: 'Caller',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Shown as the caller photo at the top; wide logos sit on a pill, square and round ones on a circle',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Caller ID under the logo; long names shrink to fit',
        },
        {
          path: 'headline',
          label: 'Highlighted caller line',
          hint: 'The big line in the Primary color, such as "Brand\'s Growth"; long lines break onto two lines',
        },
        {
          path: 'website',
          label: 'Website',
          hint: 'Appears on the filled bar once the call is answered; shrinks to fit beside the knob',
        },
      ],
      more: [
        {
          path: 'leadLine',
          label: 'Line above',
          hint: 'White line over the highlight; leave empty to hide it',
        },
        {
          path: 'trailLine',
          label: 'Line below',
          hint: 'Smaller line under the highlight; leave empty to hide it',
        },
        { path: 'caller.showLogo', label: 'Show logo' },
        {
          path: 'caller.plate',
          label: 'Logo plate',
          hint: 'A solid plate behind the logo so it reads on the dark screen',
        },
        {
          path: 'caller.logoSize',
          label: 'Logo size',
          hint: 'Plate height in pixels; a wide logo uses a slightly shorter pill',
        },
        { path: 'caller.showName', label: 'Show company name' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The highlighted caller line, the ripples, the glow and the bar once it fills',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The other lines, the company name, the action icons and their labels',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The whole screen behind everything',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The slide to answer bar before it fills',
        },
      ],
      more: [
        {
          path: 'colors.accent',
          label: 'Phone icon color',
          hint: 'The handset on the knob; darkened if it would fade into the knob',
        },
        { path: 'colors.knob', label: 'Knob color', hint: 'The round button that slides across' },
        { path: 'colors.plate', label: 'Logo plate color', hint: 'Shows when Logo plate is on' },
        {
          path: 'colors.label',
          label: 'Slide label color',
          hint: 'The resting "slide to answer" text; lifted if it would vanish on the bar',
        },
        {
          path: 'colors.shimmer',
          label: 'Shimmer color',
          hint: 'The light that sweeps across the slide label',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the call screen over another clip',
        },
        {
          path: 'glow',
          label: 'Glow behind the logo',
          hint: 'Percent of the Primary color mixed into a soft glow; 0 keeps the screen flat',
        },
      ],
    },
    {
      title: 'Ringing',
      fields: [
        {
          path: 'caller.ripples',
          label: 'Ripples',
          hint: 'Soft rings pulsing out of the logo each ring; 0 turns them off',
        },
        {
          path: 'shimmer.every',
          label: 'Ring rhythm',
          hint: 'In frames; how often the shimmer sweeps and the logo ripples and knob pulse ring out',
        },
      ],
      more: [
        {
          path: 'caller.rippleReach',
          label: 'Ripple reach',
          hint: 'How far each ripple travels, as a percent of the logo plate height',
        },
        {
          path: 'shimmer.width',
          label: 'Shimmer width',
          hint: 'Width of the light band, as a percent of the slide label',
        },
        { path: 'slideLabel', label: 'Slide label', hint: 'Text on the bar before the answer' },
      ],
    },
    {
      title: 'Answer',
      fields: [
        {
          path: 'answer.show',
          label: 'Answer the call',
          hint: 'Slides the knob across and shows the website; off keeps it ringing to the end',
        },
        {
          path: 'answer.at',
          label: 'Answer at',
          hint: 'Frame number the knob starts to slide',
        },
      ],
      more: [
        {
          path: 'answer.length',
          label: 'Slide length',
          hint: 'In frames; a late answer shortens the slide so the website still lands before the end',
        },
      ],
    },
    {
      title: 'Type and layout',
      fields: [
        { path: 'type.font', label: 'Font' },
        {
          path: 'layout.showActions',
          label: 'Show Remind Me and Message',
          hint: 'The two icons above the bar',
        },
      ],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Highlight size',
          hint: 'Largest size in pixels; long lines shrink or wrap below it',
        },
        {
          path: 'type.lineSize',
          label: 'Line size',
          hint: 'Line above, in pixels; the line below is three quarters of it',
        },
        { path: 'type.nameSize', label: 'Company name size', hint: 'In pixels' },
        { path: 'remindLabel', label: 'Left action label' },
        { path: 'messageLabel', label: 'Right action label' },
        {
          path: 'layout.barWidth',
          label: 'Bar width',
          hint: 'Percent of the screen width',
        },
        {
          path: 'layout.barY',
          label: 'Bar height on screen',
          hint: 'Centre of the bar in pixels from the top; the actions follow it',
        },
        {
          path: 'layout.callerY',
          label: 'Move caller up or down',
          hint: 'In pixels; kept clear of the top edge and the actions',
        },
      ],
    },
  ],
});
