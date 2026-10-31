import type { FootageSpec } from './footage-spec';

const IMAGE_MODEL = 'google/gemini-3-pro-image';
const VIDEO_MODEL = 'kwaivgi/kling-v3.0-pro';

const WALL =
  'a plain wall of large pale honey-beige limestone blocks on an old city building, laid in long even courses with thin recessed joints and one wide horizontal stone ledge at shoulder height, on an overcast day with soft even daylight. ' +
  'There are no windows, doors, signs, posters or text on the wall.';

const PERSON =
  'A slim woman with long straight light-brown hair, in a loose cream linen blazer over a cream camisole and matching wide-leg cream linen trousers, stands centred close in front of the wall, facing the camera, framed from just above her head to her knees.';

const NEWSPAPER =
  'She holds a large open broadsheet newspaper raised high in front of her face with both hands, as if reading it: the top edge of the paper is level with the top of her head, so her whole face and head are hidden behind it and only her hair shows at the sides. Her face is never visible. ' +
  'The open two-page spread is about half the frame wide and covers her from the top of her head down to her waist. ' +
  'Each page is a tall upright rectangle. Both pages face the camera almost flat, meeting in a shallow V at the vertical centre fold. ' +
  'It is one single large folded sheet with exactly two pages: no extra sheets, no loose inner pages, no folded-back corners, and every edge of the spread is one clean straight line. ' +
  'The paper is held taut and flat with no curl and no horizontal crease. ' +
  'Both pages are completely blank: plain matte warm-white paper with no text, no print, no photos, no lines and no markings at all. ' +
  'Her fingertips grip the outer side edges of the pages.';

const AVOID =
  'camera movement, zoom, text on the newspaper, printed pages, headlines, letters, logos, extra people, turning the newspaper around';

const FOLD: [string, number, string, number][] = [
  ['left', 1, 'right', 0],
  ['left', 2, 'right', 3],
];

const kling = (negativePrompt: string) => ({
  'atlas-cloud': { parameters: { negative_prompt: negativePrompt, cfg_scale: 0.7 } },
});

export const comingSoonNewspaperFootage: FootageSpec = {
  id: 'coming-soon-newspaper',
  aspectRatio: '9:16',
  resolution: '1080p',
  width: 1080,
  height: 1920,
  fps: 24,
  stills: [
    {
      name: 'reading',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      prompt: `Photorealistic vertical smartphone photo shot straight on at chest height, locked off on a tripod, in front of ${WALL} ${PERSON} ${NEWSPAPER} Muted warm beige and cream tones, subtle film grain, no text or logos anywhere.`,
    },
    {
      name: 'campaign-photo',
      model: IMAGE_MODEL,
      aspectRatio: '3:4',
      publishWidth: 900,
      prompt:
        'Editorial fashion campaign photograph, vertical: a woman in a loose cream linen blazer walks past a pale limestone wall, seen from the side at waist height, her hand holding a folded newspaper against her hip, her face turned away. ' +
        'Soft overcast daylight, muted beige and cream tones, gentle film grain. No text, no logos.',
    },
  ],
  shots: [
    {
      name: 'walkoff',
      model: VIDEO_MODEL,
      seconds: 10,
      firstFrame: 'reading',
      prompt:
        'Photorealistic vertical smartphone video, static locked-off tripod shot, the camera never moves. ' +
        'For the first three seconds the woman stands perfectly still, holding the open blank newspaper up in front of her face; the paper barely sways with her breathing. ' +
        'Then she calmly lowers the newspaper, revealing her face with dark sunglasses, closes and folds it in half, tucks it under her arm against her hip and walks out of the frame to the left at an unhurried pace, leaving only the empty limestone wall. ' +
        'The newspaper pages stay completely blank with no text or print at any time.',
      providerOptions: kling(`${AVOID}, walking toward the camera, running, camera cut`),
      tracking: {
        anchors: [
          {
            frame: 0,
            range: [0, 120],
            quads: {
              left: [
                [255, 772],
                [542, 792],
                [547, 1268],
                [252, 1272],
              ],
              right: [
                [542, 792],
                [815, 762],
                [832, 1258],
                [547, 1268],
              ],
            },
          },
        ],
        shared: FOLD,
      },
    },
  ],
  plate: [{ shot: 'walkoff', from: 0, to: 240 }],
};
