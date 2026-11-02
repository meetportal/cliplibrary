import { brightLaunch } from './bright-launch';
import { cinematicDawn } from './cinematic-dawn';
import { firstDance } from './first-dance';
import { lofiSunset } from './lofi-sunset';
import type { MusicPreset } from './notes';
import { pixelQuest } from './pixel-quest';
import { synthwaveDrive } from './synthwave-drive';

export type { MusicPreset } from './notes';

export const MUSIC_PRESETS: readonly MusicPreset[] = [
  lofiSunset,
  brightLaunch,
  synthwaveDrive,
  firstDance,
  cinematicDawn,
  pixelQuest,
];

export const findMusicPreset = (id: string): MusicPreset | undefined =>
  MUSIC_PRESETS.find((preset) => preset.id === id);
