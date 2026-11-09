import {
  type PhoneSpinInProps,
  phoneSpinInMeta,
  phoneSpinInSchema,
} from '../../phone-spin-in-common';
import type { ClipMeta } from '../../registry';

export const phoneSpinInCSchema = phoneSpinInSchema;

export type PhoneSpinInCProps = PhoneSpinInProps;

export const phoneSpinInCDefaults: PhoneSpinInCProps = {
  screen: '{{Screen}}',
  logo: '{{Logo}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#c8553d',
    headline: '#2a211b',
    website: '#2a211b',
    background: '#efe8de',
    backgroundEdge: '#dbd0c0',
    plate: '#ffffff',
  },
  showBackground: true,
  layout: {
    arrangement: 'split',
    phoneSize: 1.45,
    phoneX: 2.55,
    phoneY: -0.05,
    textInset: 130,
    textWidth: 620,
    textGap: 96,
  },
  type: {
    font: 'manrope',
    headlineSize: 76,
    headlineLines: 3,
    websiteSize: 28,
    websiteStyle: 'underline',
  },
  logoBox: {
    size: 190,
    plate: false,
    padding: 20,
    roundness: 30,
  },
  phone: {
    finish: 'desert',
    spinTurns: 0.25,
    restAngle: 0.16,
    startTip: 0.45,
    startLean: 0.25,
    slideIn: 1.5,
    float: 0.08,
    sway: 0.03,
  },
  stage: {
    cameraDistance: 14,
    fieldOfView: 30,
    keyLight: 2,
    rimLight: 0.6,
    reflections: 1.1,
    shadow: 0.18,
    shadowSoftness: 18,
    cameraDrift: 0.35,
  },
  timing: { spinFrames: 84, textStart: 36, textStagger: 8 },
};

export const phoneSpinInCMeta: ClipMeta = phoneSpinInMeta('c', {
  id: 'phone-spin-in-c',
  title: 'Phone Spin In C',
  description:
    'A 3D phone rises with a quarter spin into the center of a warm sand studio, and your logo and headline slide out from behind it to either side as it lands.',
  theme: 'light',
  source: 'src/compositions/scenes/phone-reveals/phone-spin-in-c.tsx',
});
