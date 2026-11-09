import { magnifierCaptionControls } from '../../magnifier-caption-controls';

export const magnifierCaptionAControls = magnifierCaptionControls({
  primary: {
    link: ['colors.primary', 'colors.rim'],
    label: 'Primary color',
    hint: 'The keyword, its underline and glow, and the lens rim, handle outline and collar',
  },
  text: {
    link: ['colors.text', 'colors.glow'],
    label: 'Text color',
    hint: 'The caption, the company name and the glow of each word the lens finds',
  },
  background: {
    link: ['colors.background', 'colors.spotlight', 'colors.glass', 'colors.handle'],
    label: 'Background color',
    hint: 'The background and its soft middle glow, the glass inside the lens and the handle',
  },
});
