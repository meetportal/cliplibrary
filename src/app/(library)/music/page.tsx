import { Music } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SongThumbnail } from '@/components/music/song-thumbnail';
import { shareMetadata } from '@/lib/share-metadata';
import { MUSIC_PRESETS } from '@/music';

export const metadata: Metadata = shareMetadata(
  'Music · Neuclip',
  'Compose songs with an AI agent, edit every note and render produced tracks.',
);

const MusicPage = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-5">
    <div className="flex flex-col gap-1">
      <h1 className="flex items-center gap-2 font-semibold text-2xl tracking-tight">
        <Music className="size-6 text-violet-500" />
        Music
      </h1>
      <p className="max-w-2xl text-muted-foreground text-sm">
        Start from a song, then ask the AI editor to compose, rearrange or restyle it. Every note,
        chord and drum hit stays editable, plays in the browser and exports to WAV, and an AI render
        turns the score into a produced track.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MUSIC_PRESETS.map((preset) => (
        <Link
          key={preset.id}
          href={`/music/${preset.id}`}
          className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-violet-500/60"
        >
          <div className="h-28 bg-gradient-to-br from-violet-500/10 via-background to-pink-500/10 p-4">
            <SongThumbnail song={preset.song} />
          </div>
          <div className="flex flex-col gap-1 p-4">
            <span className="font-medium group-hover:text-violet-500">{preset.title}</span>
            <span className="text-muted-foreground text-sm">{preset.description}</span>
            <span className="pt-1 text-muted-foreground text-xs">
              {preset.song.tempo} BPM · {preset.song.key} {preset.song.scale.replace('-', ' ')}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default MusicPage;
