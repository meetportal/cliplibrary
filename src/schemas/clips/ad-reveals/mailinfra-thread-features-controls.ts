import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { MailinfraThreadFeaturesProps } from './mailinfra-thread-features';

const FRAMES = 'In frames';

export const mailinfraThreadFeaturesControls = defineControls<MailinfraThreadFeaturesProps>({
  sections: [
    {
      title: 'Feature titles',
      fields: [
        {
          path: 'titles',
          label: 'Titles on the thread',
          hint: 'One stop per title, top to bottom. Each stop holds for its own length, so more or longer stops leave less time for the end card',
          items: {
            top: 'Big line',
            bottom: 'Second line',
            hold: 'Hold length (frames)',
            tilt: 'Resting tilt (degrees)',
            spider: 'Spider on this title',
            spiderX: 'Spider left to right',
            spiderY: 'Spider top to bottom',
            sideWeb: 'Side web',
            caught: 'Caught emails',
            dew: 'Dew drops',
            goldDots: 'Gold bokeh dots',
          },
        },
      ],
      more: [
        {
          path: 'titleStyle.topSize',
          label: 'Big line size',
          hint: 'In pixels; long lines shrink to fit the width limit',
        },
        { path: 'titleStyle.bottomSize', label: 'Second line size', hint: 'In pixels' },
        {
          path: 'titleStyle.maxWidth',
          label: 'Width limit',
          hint: 'In pixels; a line wider than this is set smaller',
        },
        { path: 'titleStyle.lineGap', label: 'Gap between lines', hint: 'In pixels' },
        {
          path: 'titleStyle.depth',
          label: 'Extrusion depth',
          hint: 'In pixels at the big line size; 0 leaves flat letters',
        },
        {
          path: 'titleStyle.swing',
          label: 'Swing on arrival',
          hint: 'In degrees; how far each title rocks when the camera lands on it. 0 turns it off',
        },
        {
          path: 'titleStyle.centerY',
          label: 'Title height on screen',
          hint: 'In pixels from the top of the frame to the middle of each title',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: [
            'colors.titleFace',
            'colors.titleHighlight',
            'colors.titleSide',
            'colors.titleDepth',
            'colors.accent',
            'colors.arrow',
            'web.spiderMark',
            'web.seal',
            'look.bokehGold',
          ],
          label: 'Primary color',
          hint: 'Gold titles and their extruded sides, highlighted words, the logo dot, the button arrow, spider markings, email seals and gold bokeh',
        },
        {
          link: [
            'colors.logo',
            'colors.logoEnd',
            'colors.button',
            'colors.buttonEnd',
            'look.bokehViolet',
            'look.bokehBlue',
          ],
          label: 'Secondary color',
          hint: 'Logo badge, website button and the blurred violet and blue lights',
        },
        {
          link: ['web.silk', 'web.envelope'],
          label: 'Accent color',
          hint: 'Silk thread, cocoons, side webs, dew drops, the orb web and the caught emails',
        },
        {
          link: ['colors.text', 'colors.logoMark', 'colors.buttonText'],
          label: 'Text color',
          hint: 'Opening headline, label, brand name, statement, tagline, the envelope in the logo and the button text',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Backdrop from top to bottom and the dark vignette',
        },
      ],
      more: [
        { path: 'colors.titleFace', label: 'Title face' },
        {
          path: 'colors.titleHighlight',
          label: 'Title rim light',
          hint: 'Thin bright edge on the top left of every letter',
        },
        {
          path: 'colors.titleSide',
          label: 'Title side, front',
          hint: 'Extruded side right behind the face',
        },
        {
          path: 'colors.titleDepth',
          label: 'Title side, back',
          hint: 'The side fades to this color at its deepest point',
        },
        { path: 'colors.titleShadow', label: 'Title shadow', hint: 'Soft shadow under each title' },
        {
          path: 'colors.accent',
          label: 'Highlighted words',
          hint: 'Highlighted word in the opening headline and the statement, and the logo dot',
        },
        { path: 'colors.text', label: 'Text' },
        { path: 'colors.logo', label: 'Logo badge, top' },
        { path: 'colors.logoEnd', label: 'Logo badge, bottom' },
        { path: 'colors.logoMark', label: 'Logo envelope' },
        { path: 'colors.button', label: 'Button, left' },
        { path: 'colors.buttonEnd', label: 'Button, right' },
        { path: 'colors.buttonText', label: 'Button text' },
        { path: 'colors.arrow', label: 'Button arrow circle' },
        { path: 'colors.arrowIcon', label: 'Button arrow' },
        { path: 'web.silk', label: 'Silk' },
        { path: 'web.envelope', label: 'Caught email paper' },
        { path: 'look.background', label: 'Background top' },
        {
          path: 'look.backgroundEdge',
          label: 'Background bottom',
          hint: 'Also colors the vignette',
        },
      ],
    },
    {
      title: 'Opening',
      fields: [
        {
          path: 'opening.headline',
          label: 'Headline',
          hint: 'Each line is a row; shown beside the spider before the first whip',
        },
      ],
      more: [
        {
          path: 'opening.highlight',
          label: 'Highlighted word',
          hint: 'Word or words of the headline in the highlight color; leave empty for none',
        },
        {
          path: 'opening.showLabel',
          label: 'Show brand label',
          hint: 'Logo and name above the headline',
        },
        { path: 'opening.label', label: 'Brand label' },
        { path: 'opening.headlineSize', label: 'Headline size', hint: 'In pixels' },
        {
          path: 'opening.side',
          label: 'Text side',
          hint: 'Which side of the thread the text sits on',
        },
        {
          path: 'opening.textY',
          label: 'Text height',
          hint: 'In pixels from the top of the frame',
        },
        {
          path: 'opening.spiderStop',
          label: 'Spider stops at',
          hint: 'In pixels from the top of the frame',
        },
        {
          path: 'opening.dropFrames',
          label: 'Thread drop length',
          hint: 'In frames; the spider follows the thread down and settles a little later',
        },
        {
          path: 'opening.hold',
          label: 'Opening length',
          hint: 'In frames before the first whip down the thread',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        { path: 'endCard.brandName', label: 'Brand name' },
        { path: 'endCard.statement', label: 'Statement', hint: 'Each line is a row' },
        { path: 'endCard.tagline', label: 'Italic tagline' },
        { path: 'endCard.buttonLabel', label: 'Website button' },
      ],
      more: [
        {
          path: 'endCard.highlight',
          label: 'Highlighted word',
          hint: 'Word or words of the statement in the highlight color; leave empty for none',
        },
        { path: 'endCard.showLogo', label: 'Show logo' },
        { path: 'endCard.showButton', label: 'Show website button' },
        {
          path: 'endCard.brandSize',
          label: 'Brand name size',
          hint: 'In pixels; the logo scales with it',
        },
        { path: 'endCard.statementSize', label: 'Statement size', hint: 'In pixels' },
        { path: 'endCard.taglineSize', label: 'Tagline size', hint: 'In pixels' },
        { path: 'endCard.buttonSize', label: 'Button size', hint: 'Button text size in pixels' },
        {
          path: 'endCard.contentY',
          label: 'Text block height',
          hint: 'In pixels from the top of the frame to the brand name',
        },
        {
          path: 'endCard.stagger',
          label: 'Delay between items',
          hint: 'In frames; logo, statement, tagline and button arrive one after another',
        },
      ],
    },
    {
      title: 'Silk and spiders',
      fields: [{ path: 'web.spiderSize', label: 'Spider size', hint: 'Every spider in the clip' }],
      more: [
        {
          path: 'web.crawl',
          label: 'Spider crawl',
          hint: 'In pixels; how far the spiders wander. 0 keeps them still',
        },
        { path: 'web.spiderBody', label: 'Spider body' },
        { path: 'web.spiderSheen', label: 'Spider sheen', hint: 'Light side of the body' },
        { path: 'web.spiderMark', label: 'Spider markings and eyes' },
        { path: 'web.threadX', label: 'Thread position', hint: 'In pixels from the left edge' },
        { path: 'web.threadWidth', label: 'Thread thickness', hint: 'In pixels' },
        {
          path: 'web.glint',
          label: 'Glint on the thread',
          hint: 'A light that runs down the silk',
        },
        { path: 'web.strands', label: 'Cocoon strands' },
        {
          path: 'web.reach',
          label: 'Cocoon length',
          hint: 'In pixels the cocoon reaches above and below each title',
        },
        { path: 'web.seal', label: 'Email seal' },
        {
          path: 'endCard.showSpider',
          label: 'Spider on the orb web',
          hint: 'Drops down the thread to the web after the dive',
        },
        {
          path: 'endCard.webY',
          label: 'Orb web height',
          hint: 'In pixels from the top of the end card to the web center',
        },
        { path: 'endCard.webSize', label: 'Orb web size', hint: 'Radius in pixels' },
        { path: 'endCard.webFrames', label: 'Orb web draw length', hint: FRAMES },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.whipFrames',
          label: 'Whip length',
          hint: 'In frames for each whip down to the next title',
        },
      ],
      more: [
        {
          path: 'camera.diveFrames',
          label: 'Dive length',
          hint: 'In frames for the final dive to the end card',
        },
        {
          path: 'camera.spacing',
          label: 'Distance between stops',
          hint: 'In pixels of thread; longer whips move faster',
        },
        {
          path: 'camera.blur',
          label: 'Motion blur',
          hint: 'Vertical smear during the whips; 0 turns it off',
        },
        {
          path: 'camera.parallax',
          label: 'Background depth',
          hint: 'How fast the blurred lights move compared to the thread',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          ...LOOK.showBackdrop,
          hint: 'Off leaves the thread, titles and end card over transparency',
        },
      ],
      more: [
        { path: 'look.bokeh', label: 'Bokeh strength', hint: '0 hides the blurred lights' },
        { path: 'look.vignette', label: 'Vignette', hint: 'Darkens the top and bottom edges' },
        { path: 'look.bokehViolet', label: 'Violet lights' },
        { path: 'look.bokehBlue', label: 'Blue lights' },
        {
          path: 'look.bokehGold',
          label: 'Gold dots',
          hint: 'Shown on titles with Gold bokeh dots on',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exit, MOTION.exitFrames, MOTION.speed],
    },
  ],
  hidden: ['motion.float'],
});
