import { z } from 'zod';
import { zMultiline, zSlider } from '@/schemas/control';

export const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export const SCALES = [
  'major',
  'minor',
  'dorian',
  'mixolydian',
  'lydian',
  'phrygian',
  'harmonic-minor',
  'major-pentatonic',
  'minor-pentatonic',
] as const;

export const LEAD_SOUNDS = ['soft-keys', 'pluck', 'bell', 'saw-lead', 'chip', 'flute'] as const;
export const CHORD_SOUNDS = ['warm-pad', 'electric-piano', 'organ', 'strings', 'glass'] as const;
export const BASS_SOUNDS = ['sub', 'round', 'acid', 'fm'] as const;
export const DRUM_KITS = ['808', 'lofi', 'electro', 'brush'] as const;

export const CHORD_RHYTHMS = ['sustain', 'quarters', 'offbeats', 'arpeggio'] as const;
export const CHORD_VOICINGS = ['triad', 'seventh', 'sus2'] as const;
export const BASS_PATTERNS = ['roots', 'eighths', 'octaves', 'walking', 'kick-locked'] as const;

export const STEPS_PER_BAR = 16;
export const MAX_BARS = 8;

const drumPattern = () =>
  z
    .string()
    .regex(/^[x.]{16}$/, 'A drum row is 16 steps of x (hit) or . (rest)')
    .describe('16 sixteenth-note steps of one bar, x is a hit and . is a rest');

const partBase = {
  enabled: z.boolean(),
  volume: zSlider({ min: -30, max: 6, step: 1 }).describe('Level in dB'),
};

export const melodyNoteSchema = z.object({
  step: z
    .number()
    .int()
    .min(0)
    .max(MAX_BARS * STEPS_PER_BAR - 1)
    .describe('Start, in sixteenth notes from the start of the loop'),
  pitch: z
    .number()
    .int()
    .min(-7)
    .max(14)
    .describe('Scale step from the key note: 0 is the key note, 7 is an octave up'),
  length: z.number().int().min(1).max(32).describe('Length in sixteenth notes'),
});

export const chordSchema = z.object({
  degree: zSlider({ min: 1, max: 7, step: 1 }).describe('Scale degree of the chord root, 1 to 7'),
  bars: zSlider({ min: 1, max: 4, step: 1 }),
});

export const songSchema = z.object({
  title: z.string().min(1).max(60),
  style: zMultiline()
    .max(300)
    .describe('Genre, mood and instruments in words, used for AI audio renders'),
  lyrics: zMultiline()
    .max(1200)
    .describe('Lyrics for AI audio renders; empty keeps the render instrumental'),
  tempo: zSlider({ min: 60, max: 180, step: 1 }).describe('Beats per minute'),
  key: z.enum(NOTE_NAMES),
  scale: z.enum(SCALES),
  swing: zSlider({ min: 0, max: 0.6, step: 0.05 }),
  bars: zSlider({ min: 1, max: MAX_BARS, step: 1 }).describe('Length of the loop in bars of 4/4'),
  repeats: zSlider({ min: 1, max: 16, step: 1 }).describe(
    'How many times the loop plays on export',
  ),
  chords: z.object({
    ...partBase,
    sound: z.enum(CHORD_SOUNDS),
    voicing: z.enum(CHORD_VOICINGS),
    rhythm: z.enum(CHORD_RHYTHMS),
    octave: zSlider({ min: 2, max: 5, step: 1 }),
    progression: z.array(chordSchema).min(1).max(8),
  }),
  melody: z.object({
    ...partBase,
    sound: z.enum(LEAD_SOUNDS),
    octave: zSlider({ min: 3, max: 6, step: 1 }),
    notes: z.array(melodyNoteSchema).max(128),
  }),
  bass: z.object({
    ...partBase,
    sound: z.enum(BASS_SOUNDS),
    pattern: z.enum(BASS_PATTERNS),
    octave: zSlider({ min: 1, max: 3, step: 1 }),
  }),
  drums: z.object({
    ...partBase,
    kit: z.enum(DRUM_KITS),
    kick: drumPattern(),
    snare: drumPattern(),
    hat: drumPattern(),
  }),
  mix: z.object({
    reverb: zSlider({ min: 0, max: 1, step: 0.05 }),
    echo: zSlider({ min: 0, max: 1, step: 0.05 }).describe('Echo on the melody'),
    warmth: zSlider({ min: 0, max: 1, step: 0.05 }).describe('Rolls off the highs'),
    master: zSlider({ min: -24, max: 0, step: 1 }).describe('Master level in dB'),
  }),
});

export type Song = z.infer<typeof songSchema>;
export type MelodyNote = z.infer<typeof melodyNoteSchema>;
export type DrumVoice = 'kick' | 'snare' | 'hat';

export const DRUM_VOICES: readonly DrumVoice[] = ['kick', 'snare', 'hat'];
