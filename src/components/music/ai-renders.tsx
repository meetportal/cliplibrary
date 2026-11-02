'use client';

import { Download, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAccessGate } from '@/components/auth/access-gate';
import { Button } from '@/components/ui/button';
import type { RenderLength, Song } from '@/music';

interface Render {
  id: number;
  url: string;
  length: RenderLength;
  title: string;
}

const LENGTH_LABELS: Record<RenderLength, string> = { clip: '30 s clip', song: 'Full song' };

const fileName = (render: Render): string =>
  `${render.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${render.length}-${render.id}.mp3`;

const problemOf = async (response: Response): Promise<string> => {
  try {
    const body: unknown = await response.json();
    if (typeof body === 'object' && body !== null && 'problem' in body) {
      return String(body.problem);
    }
  } catch {
    return 'The AI render failed. Try again.';
  }
  return 'The AI render failed. Try again.';
};

export const AiRenders = ({ song, onListen }: { song: Song; onListen: () => void }) => {
  const [renders, setRenders] = useState<Render[]>([]);
  const [busy, setBusy] = useState<RenderLength | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const { ready, guard, dialog } = useAccessGate();
  const urls = useRef<string[]>([]);

  useEffect(
    () => () => {
      for (const url of urls.current) {
        URL.revokeObjectURL(url);
      }
    },
    [],
  );

  const render = async (length: RenderLength) => {
    setBusy(length);
    setProblem(null);
    try {
      const response = await fetch('/api/music/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song, length }),
      });
      if (!response.ok) {
        setProblem(await problemOf(response));
        return;
      }
      const audio = await response.blob();
      if (audio.size === 0) {
        setProblem('The music model returned no audio. Try again.');
        return;
      }
      const url = URL.createObjectURL(new Blob([audio], { type: 'audio/mpeg' }));
      urls.current.push(url);
      setRenders((current) => [{ id: Date.now(), url, length, title: song.title }, ...current]);
    } catch {
      setProblem('Could not reach the server.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-1.5 font-semibold text-sm">
            <Sparkles className="size-4 text-violet-500" />
            AI audio render
          </h2>
          <p className="text-muted-foreground text-xs">
            Google Lyria turns this score&apos;s style, tempo, key, chords and lyrics into a
            produced track.
          </p>
        </div>
        {(['clip', 'song'] as const).map((length) => (
          <Button
            key={length}
            type="button"
            size="sm"
            variant={length === 'clip' ? 'default' : 'outline'}
            disabled={busy !== null || !ready}
            onClick={() => guard(() => render(length).catch(() => setBusy(null)))}
          >
            {busy === length ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {LENGTH_LABELS[length]}
          </Button>
        ))}
      </div>
      {busy === null ? null : (
        <p className="text-muted-foreground text-xs">
          Composing with Lyria. A clip takes about 30 seconds, a full song can take a few minutes.
        </p>
      )}
      {problem === null ? null : <p className="text-destructive text-xs">{problem}</p>}
      {renders.map((item) => (
        <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 p-2">
          <span className="w-24 shrink-0 text-muted-foreground text-xs">
            {LENGTH_LABELS[item.length]}
          </span>
          <audio controls src={item.url} onPlay={onListen} className="h-9 min-w-0 flex-1" />
          <Button asChild size="icon-sm" variant="ghost" aria-label="Download render">
            <a href={item.url} download={fileName(item)}>
              <Download />
            </a>
          </Button>
        </div>
      ))}
      {dialog}
    </section>
  );
};
