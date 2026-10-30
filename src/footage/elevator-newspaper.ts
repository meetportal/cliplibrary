import type { FootageSpec } from './footage-spec';

const IMAGE_MODEL = 'google/gemini-3-pro-image';
const VIDEO_MODEL = 'kwaivgi/kling-v3.0-pro';

const ELEVATOR =
  'a modern elevator car with dark graphite brushed-steel wall panels, a dark ceiling with small round recessed downlights, a polished steel handrail at hip height across the back wall, small glowing red LED floor displays on a dark panel on the left wall and a pale grey marble floor. ' +
  'Every wall, including the back wall behind her head and shoulders, is matte dark graphite, with no mirrors, windows or light panels, so the white paper stands out clearly against dark walls.';

const NEWSPAPER =
  'She holds a large open tabloid newspaper up in front of her face with both hands, at chest and face height, hiding her face completely; only the top of her cap shows above the paper. ' +
  'The newspaper is big: the open two-page spread is roughly square, about as tall as it is wide, and covers her from the top of her head down to her waist. ' +
  'Each page is a tall upright rectangle, much taller than it is wide. The left page is swung toward the camera and the right page faces the camera, so the two pages meet in a clear V at the vertical centre fold. ' +
  'The paper is held taut and flat with straight, crisp edges and no curl. ' +
  'Both pages are completely blank: plain matte white paper with no text, no print, no photos, no lines and no markings at all. ' +
  'Her fingertips grip the outer side edges of the pages.';

const PERSON =
  'A slim young woman in a fitted white t-shirt, black straight-leg jeans and a plain light denim-blue baseball cap with no logo stands centred inside the elevator, facing the camera.';

const BLANK =
  'The newspaper pages stay completely blank, plain matte white, with no text or print appearing on them at any time.';

const AVOID =
  'camera movement, zoom, text on the newspaper, printed pages, headlines, letters, logos, people walking, face visible, eyes visible, lowering the newspaper, raising the newspaper, turning the newspaper';

const kling = (negativePrompt: string) => ({
  'atlas-cloud': { parameters: { negative_prompt: negativePrompt, cfg_scale: 0.7 } },
});

export const elevatorNewspaperFootage: FootageSpec = {
  id: 'elevator-newspaper',
  aspectRatio: '9:16',
  resolution: '1080p',
  width: 1080,
  height: 1920,
  fps: 24,
  stills: [
    {
      name: 'wide-open',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      prompt: `Photorealistic vertical smartphone photo shot straight on from the landing outside ${ELEVATOR} The brushed stainless steel elevator doors are fully open and frame the car on both sides. ${PERSON} ${NEWSPAPER} The newspaper spread is about sixty percent of the frame wide. Her whole body is visible from cap to shoes. Soft natural light, subtle film grain, no text or logos anywhere.`,
    },
    {
      name: 'wide-closed',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      from: 'wide-open',
      prompt:
        'Edit this photo: keep the exact same camera, framing, lighting, landing and elevator frame, but show the brushed stainless steel elevator doors fully closed, meeting in the middle, so nobody inside is visible. No text.',
    },
    {
      name: 'close',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      from: 'wide-open',
      prompt:
        'Edit this photo into a close-up of the same moment: the camera stands inside the elevator about one metre in front of the same woman at chest height. ' +
        'The same open blank newspaper spread fills about eighty-five percent of the frame width and the middle half of the frame height, with a little dark graphite wall visible on both sides of it. ' +
        'Her denim-blue cap shows above the paper, her hands grip the outer edges, her white t-shirt and the top of her black jeans show below. ' +
        'Both pages stay completely blank matte white with crisp straight edges. No text, no logos.',
    },
    {
      name: 'cover-photo',
      model: IMAGE_MODEL,
      aspectRatio: '3:4',
      publishWidth: 900,
      prompt:
        'Editorial jewelry campaign photograph, vertical, extreme close-up: a woman’s hand in a loose fist, knuckles toward the camera, large in the frame and filling the upper middle third, wearing a chunky wide silver pavé diamond wrap ring on the middle finger. ' +
        'A glossy dark red cherry hangs from the bottom of the fist on its stem down into the lower third. ' +
        'A deep burgundy knit sweater sleeve covers the left edge and the lower part of the frame; the rest of the background is a soft pale lilac-white wall in diffused daylight. ' +
        'Soft film tones. No text, no logos.',
    },
    {
      name: 'store-photo',
      model: IMAGE_MODEL,
      aspectRatio: '4:3',
      publishWidth: 700,
      prompt:
        'Full-bleed grainy black and white photograph, filling the whole frame edge to edge with no border, no frame and no margin: the front of a minimal new jewelry boutique, a plain white wall, a white door with a slim vertical handle on the left and a small blank white plaque on the wall to the right. ' +
        'Flat soft daylight, low contrast. No people, no text, no logos.',
    },
  ],
  shots: [
    {
      name: 'wide',
      model: VIDEO_MODEL,
      seconds: 3,
      firstFrame: 'wide-closed',
      lastFrame: 'wide-open',
      prompt:
        'Photorealistic vertical smartphone video, static locked-off tripod shot, no camera movement. ' +
        'The closed brushed steel elevator doors slide open from the middle at a steady pace over about two seconds, revealing the woman already standing still at the back of the car, holding the open blank newspaper up in front of her face with its top edge above her eyes, exactly as in the final frame. ' +
        'She stays standing in exactly the same spot the whole time; she does not walk, step or move her feet, and the paper only sways very gently. ' +
        `She never lowers, raises or turns the paper and her face is never visible. ${BLANK}`,
      providerOptions: kling(
        `${AVOID}, walking, stepping, moving toward the camera, folded corner`,
      ),
      tracking: {
        anchor: {
          frame: 38,
          left: [
            [331, 766],
            [564, 792],
            [572, 1096],
            [359, 1056],
          ],
          right: [
            [564, 792],
            [772, 752],
            [790, 1074],
            [572, 1096],
          ],
        },
        doors: { band: [395, 425], doorway: [120, 960] },
      },
    },
    {
      name: 'close',
      model: VIDEO_MODEL,
      seconds: 5,
      firstFrame: 'close',
      prompt:
        'Photorealistic vertical smartphone video, close-up, the camera is held almost perfectly still. ' +
        'The woman stands still holding the open blank newspaper up in front of her face; the paper sways very gently with her breathing and her fingers shift slightly. ' +
        `She never lowers, raises or turns the paper and her face is never visible. ${BLANK}`,
      providerOptions: kling(`${AVOID}, doors`),
      tracking: {
        anchor: {
          frame: 30,
          left: [
            [49, 654],
            [559, 718],
            [550, 1410],
            [78, 1335],
          ],
          right: [
            [559, 718],
            [1020, 659],
            [1019, 1375],
            [550, 1410],
          ],
        },
      },
    },
  ],
  plate: [
    { shot: 'wide', from: 0, to: 38 },
    { shot: 'close', from: 0, to: 36 },
    { shot: 'wide', from: 34, to: 0, step: 2 },
  ],
};
