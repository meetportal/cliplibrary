import { defineControls } from '../../control-layout';
import type { BatteryChargeSuccessProps } from './battery-charge-success';

export const batteryChargeSuccessControls = defineControls<BatteryChargeSuccessProps>({
  sections: [
    {
      title: 'Name and end card',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Glows above the battery and changes colour as it charges; long names shrink, then wrap to two lines',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; rises in on a light plate under the full battery',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'One line under the logo at the end; long lines wrap to two and shrink',
        },
        { path: 'website', label: 'Website', hint: 'Last line of the end card' },
      ],
      more: [
        {
          path: 'type.nameSize',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        { path: 'type.nameTracking', label: 'Name letter spacing', hint: 'Share of the name size' },
        { path: 'type.uppercase', label: 'Name in capitals' },
        { path: 'type.taglineSize', label: 'Tagline size', hint: 'Largest size in pixels' },
        { path: 'type.websiteSize', label: 'Website size', hint: 'Largest size in pixels' },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Tallest the logo gets, in pixels; square and round logos use this height',
        },
        {
          path: 'lockup.logoWidth',
          label: 'Logo width',
          hint: 'Widest the logo gets, in pixels; wide logos use this width',
        },
        {
          path: 'lockup.showPlate',
          label: 'Logo plate',
          hint: 'The light rounded plate behind the logo, so dark logos read on the dark background',
        },
        { path: 'colors.plate', label: 'Logo plate color' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.charged',
          label: 'Primary color',
          hint: 'The full charge: the liquid, the glow, the name once charging starts, the rings and the website',
        },
        {
          path: 'colors.empty',
          label: 'Secondary color',
          hint: 'The empty battery: its warning glow and the name before the cables connect',
        },
        {
          link: ['colors.background', 'colors.beam'],
          label: 'Background color',
          hint: 'Sets the backdrop and the soft light above the battery together; set each in More options',
        },
      ],
      more: [
        {
          link: [
            'cables.leftTop.color',
            'cables.leftBottom.color',
            'cables.rightTop.color',
            'cables.rightBottom.color',
            'cables.bottom.color',
          ],
          label: 'All cable lights',
          hint: 'One colour for every cable stripe, dot and travelling light',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Cable labels, the percentage and the tagline',
        },
        { path: 'colors.background', label: 'Backdrop' },
        { path: 'colors.beam', label: 'Light above the battery' },
        { path: 'colors.shell', label: 'Battery outline and plugs' },
        { path: 'colors.body', label: 'Battery inside' },
        { path: 'colors.wire', label: 'Cable wire' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the battery over another clip',
        },
      ],
    },
    {
      title: 'Cables',
      fields: [
        {
          path: 'cables.leftTop.label',
          label: 'Upper left cable',
          hint: 'Plugs in first, above the left cable',
        },
        { path: 'cables.rightTop.label', label: 'Upper right cable' },
        { path: 'cables.leftBottom.label', label: 'Lower left cable' },
        { path: 'cables.rightBottom.label', label: 'Lower right cable' },
        {
          path: 'cables.bottom.label',
          label: 'Bottom cable',
          hint: 'Runs down the cable under the battery',
        },
      ],
      more: [
        { path: 'cables.leftTop.color', label: 'Upper left light' },
        { path: 'cables.rightTop.color', label: 'Upper right light' },
        { path: 'cables.leftBottom.color', label: 'Lower left light' },
        { path: 'cables.rightBottom.color', label: 'Lower right light' },
        { path: 'cables.bottom.color', label: 'Bottom light' },
        {
          path: 'type.labelSize',
          label: 'Label size',
          hint: 'Largest size in pixels; long labels shrink to fit beside the battery',
        },
        {
          path: 'motion.sway',
          label: 'Sway',
          hint: 'How much the loose plugs and the wires drift; 0 holds them still',
        },
        {
          path: 'motion.pulses',
          label: 'Lights per cable',
          hint: 'Lights that run along each cable into the battery; 0 turns them off',
        },
      ],
    },
    {
      title: 'Battery and charge',
      fields: [
        {
          path: 'battery.glow',
          label: 'Glow',
          hint: 'The light around the battery; 0 turns it off',
        },
        {
          path: 'timing.chargeFrames',
          label: 'Charge length',
          hint: 'Frames from 0 to 100 percent; the end card moves with it',
        },
      ],
      more: [
        { path: 'type.percentSize', label: 'Percentage size', hint: 'In pixels' },
        {
          path: 'battery.width',
          label: 'Battery width',
          hint: 'In pixels; the side cables follow it',
        },
        { path: 'battery.height', label: 'Battery height', hint: 'In pixels' },
        {
          path: 'battery.centerY',
          label: 'Battery height on screen',
          hint: 'Centre in pixels from the top; the name follows it',
        },
        { path: 'battery.roundness', label: 'Corner roundness', hint: 'In pixels' },
        {
          path: 'battery.lowTint',
          label: 'Low charge tint',
          hint: 'The liquid starts as a lighter tint of the Primary color, its hue turned by this many degrees; 0 keeps the same hue',
        },
        { path: 'motion.wave', label: 'Liquid wave', hint: '0 makes the surface flat' },
        { path: 'motion.bubbles', label: 'Bubbles' },
        {
          path: 'motion.rings',
          label: 'Full charge rings',
          hint: 'Two rings pulse out at 100 percent',
        },
        {
          path: 'timing.plugAt',
          label: 'Plug in start',
          hint: 'Frame the plugs start to swing up',
        },
        {
          path: 'timing.plugFrames',
          label: 'Plug in length',
          hint: 'Frames for each plug to swing in',
        },
        {
          path: 'timing.fullHold',
          label: 'Hold at full',
          hint: 'Frames at 100 percent before the cables drop and the end card rises',
        },
      ],
    },
  ],
});
