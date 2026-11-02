'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { arrangeSong, loopSeconds, type Song, stepSeconds } from '@/music';
import { buildRig, type Rig, rigKey } from './rig';

type Tone = typeof import('tone');

export interface SongPlayer {
  playing: boolean;
  loading: boolean;
  toggle: () => void;
  readStep: () => number | null;
  readSpectrum: () => Float32Array | null;
}

interface Live {
  tone: Tone;
  rig: Rig;
  key: string;
}

const RELEASE_MS = 2500;

const schedule = (live: Live, song: Song) => {
  const transport = live.tone.getTransport();
  transport.cancel(0);
  const loop = loopSeconds(song);
  for (const event of arrangeSong(song)) {
    transport.schedule((time) => live.rig.play(event, time), event.time);
  }
  transport.loop = true;
  transport.loopStart = 0;
  transport.loopEnd = loop;
  if (transport.seconds >= loop) {
    transport.seconds = 0;
  }
};

export const useSongPlayer = (song: Song): SongPlayer => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const live = useRef<Live | null>(null);
  const latest = useRef(song);
  latest.current = song;
  const loaded = useRef<Tone | null>(null);

  useEffect(() => {
    import('tone')
      .then((tone) => {
        loaded.current = tone;
      })
      .catch(() => undefined);
  }, []);

  const sync = useCallback(async (next: Song) => {
    const current = live.current;
    if (current === null) {
      return;
    }
    const key = rigKey(next);
    if (key !== current.key) {
      const rig = await buildRig(current.tone, next);
      const old = current.rig;
      live.current = { ...current, rig, key };
      setTimeout(() => old.dispose(), RELEASE_MS);
    }
    if (live.current !== null) {
      schedule(live.current, next);
    }
  }, []);

  useEffect(() => {
    if (playing) {
      sync(song).catch(() => undefined);
    }
  }, [song, playing, sync]);

  const start = useCallback(async () => {
    setLoading(true);
    const preloaded = loaded.current;
    const resumed = preloaded?.start();
    const tone = preloaded ?? (await import('tone'));
    await (resumed ?? tone.start());
    if (live.current === null) {
      const rig = await buildRig(tone, latest.current);
      live.current = { tone, rig, key: rigKey(latest.current) };
    }
    schedule(live.current, latest.current);
    tone.getTransport().start('+0.05');
    setLoading(false);
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    const current = live.current;
    if (current !== null) {
      const transport = current.tone.getTransport();
      transport.stop();
      transport.seconds = 0;
    }
    setPlaying(false);
  }, []);

  useEffect(
    () => () => {
      const current = live.current;
      if (current !== null) {
        current.tone.getTransport().stop();
        current.tone.getTransport().cancel(0);
        current.rig.dispose();
        live.current = null;
      }
    },
    [],
  );

  const toggle = useCallback(() => {
    if (playing) {
      stop();
    } else {
      start().catch(() => setLoading(false));
    }
  }, [playing, start, stop]);

  const readStep = useCallback(() => {
    const current = live.current;
    if (current === null || !playing) {
      return null;
    }
    const seconds = current.tone.getTransport().seconds;
    return Math.max(0, Math.floor(seconds / stepSeconds(latest.current)));
  }, [playing]);

  const readSpectrum = useCallback(() => {
    const value = live.current?.rig.meter.getValue();
    return value instanceof Float32Array ? value : null;
  }, []);

  return { playing, loading, toggle, readStep, readSpectrum };
};
