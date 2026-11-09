import {
  type PhoneSpinInProps,
  phoneSpinInMeta,
  phoneSpinInSchema,
} from '../../phone-spin-in-common';
import type { ClipMeta } from '../../registry';

export const phoneSpinInBSchema = phoneSpinInSchema;

export type PhoneSpinInBProps = PhoneSpinInProps;

export const phoneSpinInBDefaults: PhoneSpinInBProps = {
  screen: '{{Screen}}',
  logo: '{{Logo}}',
  headline: '{{Headline}}',
  website: '{{Website}}',
  colors: {
    primary: '#e0a84a',
    headline: '#f4efe6',
    website: '#f4efe6',
    background: '#1a1a1e',
    backgroundEdge: '#060607',
    plate: '#f4efe6',
  },
  showBackground: true,
  layout: {
    arrangement: 'text-right',
    phoneSize: 1.4,
    phoneX: 2.1,
    phoneY: -0.05,
    textInset: 170,
    textWidth: 720,
    textGap: 110,
  },
  type: {
    font: 'instrument-serif',
    headlineSize: 108,
    headlineLines: 3,
    websiteSize: 28,
    websiteStyle: 'pill',
  },
  logoBox: {
    size: 160,
    plate: true,
    padding: 22,
    roundness: 100,
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
    keyLight: 1.8,
    rimLight: 2.4,
    reflections: 1.1,
    shadow: 0.3,
    shadowSoftness: 18,
    cameraDrift: 0.35,
  },
  timing: { spinFrames: 84, textStart: 36, textStagger: 8 },
};

export const phoneSpinInBMeta: ClipMeta = phoneSpinInMeta('b', {
  id: 'phone-spin-in-b',
  title: 'Phone Spin In B',
  description:
    'A titanium 3D phone rises with a quarter spin into a dark studio, its edges catching a light in your brand color, as a serif headline, your logo on a pill plate and your website rise in beside it.',
  theme: 'dark',
  source: 'src/compositions/scenes/phone-reveals/phone-spin-in-b.tsx',
});
