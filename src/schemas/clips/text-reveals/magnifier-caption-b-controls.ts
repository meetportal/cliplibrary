import { magnifierCaptionControls } from '../../magnifier-caption-controls';

export const magnifierCaptionBControls = magnifierCaptionControls({
  primary: {
    path: 'colors.primary',
    label: 'Primary color',
    hint: 'The keyword, its marker highlight and its glow in the lens',
  },
  text: {
    link: ['colors.text', 'colors.rim', 'colors.handle'],
    label: 'Text color',
    hint: 'The caption, the company name and the ink of the magnifier: rim, collar and handle',
  },
  background: {
    link: ['colors.background', 'colors.spotlight', 'colors.glass'],
    label: 'Background color',
    hint: 'The paper, its soft middle light and the glass inside the lens',
  },
});
