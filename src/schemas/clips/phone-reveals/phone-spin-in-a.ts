import {
  type PhoneSpinInProps,
  phoneSpinInMeta,
  phoneSpinInSchema,
} from '../../phone-spin-in-common';
import type { ClipMeta } from '../../registry';

export const phoneSpinInASchema = phoneSpinInSchema;

export type PhoneSpinInAProps = PhoneSpinInProps;

export const phoneSpinInADefaults: PhoneSpinInAProps = {
  screen: '{{Screen}}',
  logo: '{{Logo}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#2f5d46',
    headline: '#0b0b0c',
    website: '#0b0b0c',
    background: '#f4f4f2',
    backgroundEdge: '#e2e2dd',
    plate: '#ffffff',
  },
  showBackground: true,
  layout: {
    arrangement: 'text-left',
    phoneSize: 1.4,
    phoneX: 2.1,
    phoneY: -0.05,
    textInset: 170,
    textWidth: 720,
    textGap: 110,
  },
  type: {
    font: 'inter-tight',
    headlineSize: 92,
    headlineLines: 3,
    websiteSize: 30,
    websiteStyle: 'arrow',
  },
  logoBox: {
    size: 140,
    plate: false,
    padding: 20,
    roundness: 30,
  },
  phone: {
    finish: 'natural',
    spinTurns: 0.25,
    restAngle: 0.3,
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
    shadow: 0.16,
    shadowSoftness: 18,
    cameraDrift: 0.35,
  },
  timing: { spinFrames: 84, textStart: 36, textStagger: 8 },
};

export const phoneSpinInAMeta: ClipMeta = phoneSpinInMeta('a', {
  id: 'phone-spin-in-a',
  title: 'Phone Spin In A',
  description:
    'A 3D phone rises from below with a quarter spin and lands on the right of a light studio as your logo, headline and website rise in on the left.',
  theme: 'light',
  source: 'src/compositions/scenes/phone-reveals/phone-spin-in-a.tsx',
});
