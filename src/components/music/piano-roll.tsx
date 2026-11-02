'use client';

import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import {
  loopSteps,
  type MelodyNote,
  melodyMidi,
  noteName,
  type Song,
  STEPS_PER_BAR,
  scaleLength,
} from '@/music';

const TOP_PITCH = 14;
const BOTTOM_PITCH = -7;
const ROW_HEIGHT = 12;
const ROWS = TOP_PITCH - BOTTOM_PITCH + 1;
const NEW_NOTE_LENGTH = 2;
const MAX_NOTES = 128;

const label = (song: Song, pitch: number): string => {
  const midi = melodyMidi(song, pitch);
  return `${noteName(midi)}${Math.floor(midi / 12) - 1}`;
};

const covers = (note: MelodyNote, step: number, pitch: number): boolean =>
  note.pitch === pitch && step >= note.step && step < note.step + note.length;

export const PianoRoll = ({
  song,
  step,
  onChange,
}: {
  song: Song;
  step: number | null;
  onChange: (next: Song) => void;
}) => {
  const total = loopSteps(song);
  const notes = song.melody.notes.filter((note) => note.step < total);
  const octave = scaleLength(song.scale);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const at = Math.floor(((event.clientX - box.left) / box.width) * total);
    const pitch = TOP_PITCH - Math.floor((event.clientY - box.top) / ROW_HEIGHT);
    const hit = song.melody.notes.find((note) => covers(note, at, pitch));
    const next =
      hit === undefined
        ? [...song.melody.notes, { step: at, pitch, length: NEW_NOTE_LENGTH }]
            .sort((left, right) => left.step - right.step)
            .slice(0, MAX_NOTES)
        : song.melody.notes.filter((note) => note !== hit);
    onChange({ ...song, melody: { ...song.melody, notes: next } });
  };

  return (
    <div className={cn('flex', !song.melody.enabled && 'opacity-40')}>
      <div className="w-12 shrink-0 pr-1">
        {Array.from({ length: ROWS }, (_, row) => {
          const pitch = TOP_PITCH - row;
          return (
            <div
              key={pitch}
              style={{ height: ROW_HEIGHT }}
              className={cn(
                'flex items-center justify-end text-[9px] text-muted-foreground leading-none',
                pitch % octave === 0 && 'font-semibold text-foreground',
              )}
            >
              {label(song, pitch)}
            </div>
          );
        })}
      </div>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: the roll is a pointer surface; notes are also editable through the agent */}
      <div
        role="presentation"
        onClick={onClick}
        className="relative min-w-0 flex-1 cursor-crosshair overflow-hidden rounded-md border bg-background"
        style={{
          height: ROWS * ROW_HEIGHT,
          backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${(100 / total) * STEPS_PER_BAR}% - 1px), var(--color-border) calc(${(100 / total) * STEPS_PER_BAR}% - 1px), var(--color-border) ${(100 / total) * STEPS_PER_BAR}%), repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW_HEIGHT - 1}px, color-mix(in oklab, var(--color-border) 45%, transparent) ${ROW_HEIGHT - 1}px, color-mix(in oklab, var(--color-border) 45%, transparent) ${ROW_HEIGHT}px)`,
        }}
      >
        {Array.from({ length: ROWS }, (_, row) => TOP_PITCH - row)
          .filter((pitch) => pitch % octave === 0)
          .map((pitch) => (
            <div
              key={pitch}
              className="absolute inset-x-0 bg-violet-500/5"
              style={{ top: (TOP_PITCH - pitch) * ROW_HEIGHT, height: ROW_HEIGHT }}
            />
          ))}
        {notes.map((note) => (
          <div
            key={`${note.step}:${note.pitch}`}
            data-note={`${note.step}:${note.pitch}`}
            className="absolute rounded-[3px] bg-gradient-to-r from-violet-500 to-pink-500 shadow-sm ring-1 ring-white/30"
            style={{
              left: `${(note.step / total) * 100}%`,
              width: `${(Math.min(note.length, total - note.step) / total) * 100}%`,
              top: (TOP_PITCH - note.pitch) * ROW_HEIGHT + 1,
              height: ROW_HEIGHT - 2,
            }}
          />
        ))}
        {step === null ? null : (
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-foreground/70"
            style={{ left: `${(step / total) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};
