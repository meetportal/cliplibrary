import type { FootageSpec } from './footage-spec';

const IMAGE_MODEL = 'google/gemini-3-pro-image';
const VIDEO_MODEL = 'kwaivgi/kling-v3.0-pro';

const SCENE =
  'Photorealistic vertical smartphone video frame, shot straight on from the landing outside a modern elevator, camera at chest height on a tripod. ' +
  'The elevator car has warm dark bronze brushed-steel walls on all three sides, including a dark bronze back wall with no window or light panel, a polished steel handrail, small round ceiling downlights and a small red LED floor display above a steel button panel on the left wall. ' +
  'The elevator doors are brushed stainless steel.';

const PERSON =
  'A young woman stands centred inside the elevator, facing the camera, in a fitted black t-shirt and wide-leg mid-blue jeans, with a beige baseball cap. ' +
  'She holds a large open broadsheet newspaper up high in front of her face with both hands, completely hiding her face and eyes; only the crown of the cap shows above the top edge of the paper. ' +
  'The newspaper is open as a two-page spread, about half the frame wide, its two pages angled slightly toward the camera in a shallow V at the centre fold. ' +
  'The paper is held taut and flat: each page is a crisp flat rectangle with straight edges, no creases, no curl and no sag. ' +
  'Both pages are completely blank: plain matte white paper with no text, no print, no photos, no lines and no markings at all. ' +
  'Her fingertips grip the outer side edges of the pages; the rest of the pages are clear.';

const BLANK =
  'The newspaper pages stay completely blank, plain matte white, with no text or print appearing on them at any time.';

export const elevatorNewspaperFootage: FootageSpec = {
  id: 'elevator-newspaper',
  aspectRatio: '9:16',
  resolution: '1080p',
  width: 1080,
  height: 1920,
  fps: 24,
  stills: [
    {
      name: 'doors-open',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      prompt: `${SCENE} The elevator doors are fully open. ${PERSON} Soft natural light, subtle film grain, no text or logos anywhere in the image.`,
    },
    {
      name: 'doors-closed',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      from: 'doors-open',
      prompt:
        'Edit this photo: keep the exact same camera, framing, landing, lighting and elevator frame, but show the brushed stainless steel elevator doors fully closed, meeting in the middle, so nobody inside is visible. Keep the red floor display if it is visible. No text.',
    },
    {
      name: 'ring-hand',
      model: IMAGE_MODEL,
      aspectRatio: '3:4',
      publishWidth: 900,
      prompt:
        'Editorial jewelry campaign photograph: a close-up of an elegant hand with almond nails and stacked chunky silver rings, gently holding a glossy dark red cherry by its stem, against a deep plum velvet background with soft warm window light from the upper left. ' +
        'Shallow depth of field, rich film tones, lots of calm dark space in the lower half of the frame. No text, no logos.',
    },
    {
      name: 'boutique',
      model: IMAGE_MODEL,
      aspectRatio: '4:3',
      publishWidth: 700,
      prompt:
        'Minimal black and white photograph of an empty, bright jewelry boutique interior: arched white walls, a long pale stone counter, two small glass display cases and soft daylight. ' +
        'Clean, calm, newspaper photo look with fine grain. No people, no text, no logos.',
    },
  ],
  shots: [
    {
      name: 'hold-and-close',
      model: VIDEO_MODEL,
      seconds: 5,
      firstFrame: 'doors-open',
      lastFrame: 'doors-closed',
      prompt:
        'Photorealistic vertical smartphone video, static locked-off tripod shot, no camera movement. ' +
        'For the first three seconds the elevator stays open and the woman stands still inside, holding the open blank newspaper raised high in front of her face; the paper sways very gently with her breathing. ' +
        'Then the brushed steel elevator doors slide closed from both sides at a steady pace until they meet in the middle. ' +
        `She never lowers, raises or turns the paper and her face is never visible. ${BLANK}`,
      providerOptions: {
        'atlas-cloud': {
          parameters: {
            negative_prompt:
              'camera movement, zoom, text on the newspaper, printed pages, headlines, letters, logos, people walking, face visible, eyes visible, lowering the newspaper, raising the newspaper',
            cfg_scale: 0.7,
          },
        },
      },
    },
  ],
  plate: [
    { shot: 'hold-and-close', from: 120, to: 46, step: 2 },
    { shot: 'hold-and-close', from: 45, to: 1 },
    { shot: 'hold-and-close', from: 0, to: 45 },
    { shot: 'hold-and-close', from: 47, to: 119, step: 2 },
  ],
  tracking: {
    search: [250, 600, 850, 1160],
    doorBand: [395, 425],
    doorway: [170, 920],
    foldBand: [470, 630],
  },
};
