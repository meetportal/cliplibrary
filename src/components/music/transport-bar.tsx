'use client';

import { Download, Loader2, Pause, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { type Song, songSeconds } from '@/music';

const clock = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;

interface TransportBarProps {
  song: Song;
  playing: boolean;
  loading: boolean;
  exporting: boolean;
  onToggle: () => void;
  onExport: () => void;
  actions: ReactNode;
}

export const TransportBar = ({
  song,
  playing,
  loading,
  exporting,
  onToggle,
  onExport,
  actions,
}: TransportBarProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <Button
      type="button"
      size="icon-lg"
      aria-label={playing ? 'Stop' : 'Play'}
      onClick={onToggle}
      disabled={loading}
      className="rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg hover:opacity-90"
    >
      {loading ? <Loader2 className="animate-spin" /> : playing ? <Pause /> : <Play />}
    </Button>
    <div className="min-w-0 flex-1">
      <h1 className="truncate font-semibold text-lg tracking-tight">{song.title}</h1>
      <p className="text-muted-foreground text-xs">
        {song.tempo} BPM · {song.key} {song.scale.replace('-', ' ')} · {song.bars} bar loop ·{' '}
        {clock(songSeconds(song))} on export
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-1">
      {actions}
      <Button type="button" size="sm" variant="outline" onClick={onExport} disabled={exporting}>
        {exporting ? <Loader2 className="animate-spin" /> : <Download />}
        WAV
      </Button>
    </div>
  </div>
);
