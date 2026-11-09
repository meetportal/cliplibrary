import { z } from 'zod';
import { zSlider } from './control';

export const PHONE_FINISHES = ['natural', 'black', 'white', 'blue', 'desert'] as const;

export type PhoneFinish = (typeof PHONE_FINISHES)[number];

export const phoneStageSchema = z.object({
  cameraDistance: zSlider({ min: 8, max: 30, step: 0.1 }),
  fieldOfView: zSlider({ min: 15, max: 60, step: 1 }),
  keyLight: zSlider({ min: 0, max: 4, step: 0.05 }),
  rimLight: zSlider({ min: 0, max: 4, step: 0.05 }),
  reflections: zSlider({ min: 0, max: 3, step: 0.05 }),
  shadow: zSlider({ min: 0, max: 0.6, step: 0.01 }),
  shadowSoftness: zSlider({ min: 1, max: 40, step: 1 }),
  cameraDrift: zSlider({ min: 0, max: 1, step: 0.01 }),
});

export type PhoneStage = z.infer<typeof phoneStageSchema>;
