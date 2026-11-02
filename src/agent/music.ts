import { resolveClipControls } from '@/core/clip-controls';
import type { ControlSectionView } from '@/core/types';
import { NOTE_NAMES, SCALES, songControls, songSchema } from '@/music';
import { type ControlPathTarget, controlFieldGuide, describeControlPath } from './control-guide';

let sections: ControlSectionView[] | null = null;

const musicSections = (): ControlSectionView[] => {
  sections ??= resolveClipControls(songSchema, songControls);
  return sections;
};

const NOTE_PATH = /^\/melody\/notes(?:\/(\d+|-))?/;

export const describeMusicPath = (path: string): ControlPathTarget => {
  const note = NOTE_PATH.exec(path);
  if (note !== null) {
    const index = note[1];
    return {
      section: 'Melody',
      field: index === undefined || index === '-' ? 'Notes' : `Note ${Number(index) + 1}`,
    };
  }
  return describeControlPath(musicSections(), '', path);
};

const COMPOSING_GUIDE = `How the score works:
- The loop is "bars" bars of 4/4. Every bar has 16 steps (sixteenth notes), so a loop has bars * 16 steps. The loop repeats "repeats" times on export.
- Keys are ${NOTE_NAMES.join(', ')}. Scales are ${SCALES.join(', ')}.
- chords.progression is a list of { degree, bars }. degree is the scale degree of the chord root (1 is the home chord, in a minor key 1 6 3 7 is i VI III VII). It cycles across the loop, so the bars of the progression should usually add up to the loop length.
- melody.notes is a list of { step, pitch, length }. step is the start in sixteenths from the loop start (0 to bars * 16 - 1), pitch is a scale step from the key note (0 is the key note, 7 an octave up, negative goes below), and length is in sixteenths. Notes past the loop are ignored. Keep notes in time order and do not overlap them.
- A good melody uses chord tones on beats (steps 0, 4, 8, 12 of each bar), moves mostly by step, leaves some rests, repeats and varies a short motif, and lands on the key note at the end of the loop.
- Drum rows are 16 characters per bar, x for a hit and . for a rest. Kick on 1 and 3 with snare on 2 and 4 is "x.......x......." and "....x.......x...".
- To write a new piece, replace whole values such as /chords/progression or /melody/notes in one editMedia call, and set tempo, key, scale, sounds and style to match the genre.
- style and lyrics only feed the "Render with AI" audio button; the in-browser score ignores them. Keep style a short comma-separated description of genre, mood and instruments. Write lyrics only when asked; leave them empty for instrumentals.`;

export const musicInstructions = (title: string, rules: string, jsonSchema: string): string =>
  `You are the composing agent for the song "${title}" in a browser music studio.
The document is a song score that the studio plays with synthesizers: tempo, key and scale, a chord progression, a melody, a bass pattern, drum steps and a mix. You compose and arrange by editing it.

${COMPOSING_GUIDE}

${rules}

Field guide (label: path, with hints):
${controlFieldGuide(musicSections(), '')}
  - Melody notes: /melody/notes, a list of { step, pitch, length }

Song JSON schema: ${jsonSchema}`;
