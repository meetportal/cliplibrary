import type { FootageSpec, FootageTracking } from './footage-spec';

const IMAGE_MODEL = 'google/gemini-3-pro-image';
const VIDEO_MODEL = 'kwaivgi/kling-v3.0-pro';

const PERSON =
  'A young woman with long dark wavy hair, a light-wash oversized denim jacket over a fitted black top and light-blue straight-leg jeans stands facing the camera.';

const NEWSPAPER =
  'She holds a large open broadsheet newspaper up in front of her face with both hands, raised high so the top edge of the paper is level with the top of her head, hiding her whole face and eyes completely; only the very top of her hair shows above the paper. ' +
  'The open two-page spread is a wide rectangle that covers her from the top of her head down to her waist. ' +
  'Each page is a tall upright rectangle. The left page is angled slightly toward the camera and the right page faces the camera, so the two pages meet at a clear vertical centre fold. ' +
  'It is one single large folded sheet with exactly two pages: no extra sheets, no loose inner pages, no folded-back corners, and every edge of the spread is one clean straight line. ' +
  'The paper is crisp and new, held taut and flat, with no creases, wrinkles or fold lines other than the centre fold. ' +
  'Both pages are completely blank: plain matte white paper with no text, no print, no photos, no lines and no markings at all. ' +
  'Her fingertips grip the outer side edges of the pages.';

const FRAMING =
  'Shot straight on at chest height from about two metres away, framed from the top of her head to her knees, with the newspaper spread centred and about seventy percent of the frame wide.';

const SWAP =
  'Edit this photo: keep the woman, her clothes, her pose, the blank newspaper and its exact size, position, angle and lighting on the paper exactly the same, and keep the same camera framing. Replace only the background with';

const NO_TEXT = 'No readable text, shop names, signs, logos or brands anywhere.';

const SHOT =
  'Photorealistic vertical smartphone video, handheld with a very slight natural sway, no zoom and no camera moves. ' +
  'The woman stands still in the same spot, holding the open blank newspaper up in front of her face the whole time; the paper sways very gently with her breathing. ' +
  'The background stays alive with natural ambient motion. ' +
  'She never lowers, raises, folds or turns the paper and her face is never visible. ' +
  'The newspaper pages stay completely blank, plain matte white, with no text or print appearing on them at any time.';

const AVOID =
  'zoom, camera push, text on the newspaper, printed pages, headlines, letters, logos, face visible, eyes visible, lowering the newspaper, raising the newspaper, turning the newspaper, folded corner, walking toward the camera';

const kling = () => ({
  'atlas-cloud': { parameters: { negative_prompt: AVOID, cfg_scale: 0.6 } },
});

const FOLD: [string, number, string, number][] = [
  ['left', 1, 'right', 0],
  ['left', 2, 'right', 3],
];

type Corner = [number, number];
type Quad = [Corner, Corner, Corner, Corner];

const spread = (frame: number, left: Quad, right: Quad): FootageTracking => ({
  anchors: [{ frame, quads: { left, right } }],
  shared: FOLD,
});

const LOCATIONS = {
  park: 'a leafy city park: lush green trees and bushes, a paved path and a few blurred people strolling far behind her in soft overcast daylight.',
  lobby:
    'the glass entrance of a modern office building: tall clear glass doors and dark steel frames behind her, a polished stone floor and soft cool daylight.',
  cafe: 'a café storefront with a lush wall of hanging green ivy above a dark wooden window frame, a stone pavement and warm daylight.',
} as const;

type Location = keyof typeof LOCATIONS;

const swapStill = (name: Location) => ({
  name,
  model: IMAGE_MODEL,
  aspectRatio: '9:16',
  from: 'square',
  prompt: `${SWAP} ${LOCATIONS[name]} Photorealistic, natural light that matches the paper. ${NO_TEXT}`,
});

const clipShot = (name: string, background: string, tracking: FootageTracking) => ({
  name,
  model: VIDEO_MODEL,
  seconds: 3,
  firstFrame: name,
  prompt: `${SHOT} ${background}`,
  providerOptions: kling(),
  tracking,
});

export const newspaperCityCutsFootage: FootageSpec = {
  id: 'newspaper-city-cuts',
  aspectRatio: '9:16',
  resolution: '720p',
  width: 1080,
  height: 1920,
  fps: 24,
  stills: [
    {
      name: 'square',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      prompt:
        'Photorealistic vertical smartphone photo in a crowded city square at midday: towering buildings covered in huge glowing digital billboards that show only soft abstract colour gradients with no numbers or words, a dense crowd of tourists behind her, overcast daylight. ' +
        `${PERSON} ${NEWSPAPER} ${FRAMING} Subtle film grain. ${NO_TEXT}`,
    },
    swapStill('park'),
    swapStill('lobby'),
    swapStill('cafe'),
    {
      name: 'cover-photo',
      model: IMAGE_MODEL,
      aspectRatio: '3:4',
      publishWidth: 900,
      prompt:
        'Editorial jewelry campaign photograph, vertical, close-up: two hands gently clasped together, one resting over the other, wearing a slim gold band and a delicate gold ring with a single round diamond, against a soft warm beige linen backdrop. ' +
        'Warm natural window light, soft shadows, film tones. No text, no logos.',
    },
    {
      name: 'story-photo',
      model: IMAGE_MODEL,
      aspectRatio: '4:3',
      publishWidth: 700,
      prompt:
        'Editorial still life photograph, overhead at a slight angle: an open shallow wooden jewelry tray lined with cream velvet holding a neat row of gold rings, a fine gold chain and two small pearl earrings, on a warm oak table in soft daylight. ' +
        'Warm, calm tones. No text, no logos.',
    },
  ],
  shots: [
    clipShot(
      'square',
      'Behind her the crowd mills around and the billboard colours drift slowly.',
      spread(
        20,
        [
          [290, 777],
          [545, 777],
          [548, 1162],
          [268, 1158],
        ],
        [
          [545, 777],
          [818, 777],
          [826, 1160],
          [548, 1162],
        ],
      ),
    ),
    clipShot(
      'park',
      'Behind her the leaves rustle in a light breeze.',
      spread(
        10,
        [
          [293, 780],
          [547, 779],
          [543, 1166],
          [269, 1163],
        ],
        [
          [547, 779],
          [813, 778],
          [824, 1164],
          [543, 1166],
        ],
      ),
    ),
    clipShot(
      'lobby',
      'Behind her a person passes inside the glass lobby.',
      spread(
        10,
        [
          [286, 783],
          [548, 785],
          [548, 1170],
          [269, 1165],
        ],
        [
          [548, 785],
          [820, 787],
          [824, 1170],
          [548, 1170],
        ],
      ),
    ),
    clipShot(
      'cafe',
      'The ivy above moves slightly in a light breeze.',
      spread(
        10,
        [
          [284, 781],
          [548, 782],
          [548, 1167],
          [270, 1164],
        ],
        [
          [548, 782],
          [812, 785],
          [824, 1166],
          [548, 1167],
        ],
      ),
    ),
  ],
  plate: [
    { shot: 'square', from: 4, to: 47 },
    { shot: 'park', from: 6, to: 21 },
    { shot: 'lobby', from: 6, to: 21 },
    { shot: 'cafe', from: 6, to: 29 },
  ],
};
