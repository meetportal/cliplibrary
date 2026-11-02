'use client';

import { RotateCcw } from 'lucide-react';
import { type ReactNode, useMemo, useRef, useState } from 'react';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { AgentWorkspace } from '@/components/media-agent/agent-workspace';
import { HistoryActions } from '@/components/sites/editor/editor-actions';
import { Button } from '@/components/ui/button';
import { resolveClipControls } from '@/core/clip-controls';
import { useSavedDocument } from '@/lib/use-saved-document';
import { useUndoable } from '@/lib/use-undoable';
import { loopSteps, type MusicPreset, type Song, songControls, songSchema } from '@/music';
import { AiRenders } from './ai-renders';
import { ChordStrip } from './chord-strip';
import { DrumGrid } from './drum-grid';
import { renderSongWav } from './engine/render-wav';
import { useSongPlayer } from './engine/use-song-player';
import { PianoRoll } from './piano-roll';
import { Spectrum } from './spectrum';
import { TransportBar } from './transport-bar';
import { usePlayhead } from './use-playhead';

type Values = Record<string, unknown>;

const NO_FOCUS: readonly string[] = [];

const useLastValidSong = (values: Values, fallback: Song): Song => {
  const last = useRef(fallback);
  const parsed = songSchema.safeParse(values);
  if (parsed.success) {
    last.current = parsed.data;
  }
  return last.current;
};

const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const slug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'song';

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-2 rounded-xl border bg-background/60 p-3">
    <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{title}</h2>
    {children}
  </section>
);

export const MusicStudio = ({ preset }: { preset: MusicPreset }) => {
  const history = useUndoable<Values>(preset.song);
  const [exporting, setExporting] = useState(false);
  const [exportProblem, setExportProblem] = useState<string | null>(null);
  const storageKey = `neuclip-music:${preset.id}`;
  const clearSaved = useSavedDocument<Values>({
    key: storageKey,
    value: history.value,
    parse: (saved) => {
      const parsed = songSchema.safeParse(saved);
      return parsed.success ? parsed.data : null;
    },
    restore: history.reset,
  });
  const song = useLastValidSong(history.value, preset.song);
  const player = useSongPlayer(song);
  const step = usePlayhead(player.readStep, loopSteps(song));
  const sections = useMemo(() => resolveClipControls(songSchema, songControls), []);
  const edit = (next: Song) => history.set(next);

  const exportWav = () => {
    setExporting(true);
    setExportProblem(null);
    renderSongWav(song)
      .then((blob) => download(blob, `${slug(song.title)}.wav`))
      .catch((error: unknown) =>
        setExportProblem(error instanceof Error ? error.message : 'The export failed.'),
      )
      .finally(() => setExporting(false));
  };

  return (
    <AgentWorkspace
      kind="music"
      chatKey={storageKey}
      title={song.title}
      document={song}
      focus={NO_FOCUS}
      onChange={edit}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex shrink-0 flex-col gap-3 bg-muted/40 p-3 sm:p-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <TransportBar
            song={song}
            playing={player.playing}
            loading={player.loading}
            exporting={exporting}
            onToggle={player.toggle}
            onExport={exportWav}
            actions={
              <>
                <HistoryActions history={history} />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    clearSaved();
                    history.set(preset.song);
                  }}
                >
                  <RotateCcw />
                  <span className="sr-only sm:not-sr-only">Reset</span>
                </Button>
              </>
            }
          />
          {exportProblem === null ? null : (
            <p role="alert" className="text-destructive text-xs">
              Export failed: {exportProblem}
            </p>
          )}
          <Spectrum read={player.readSpectrum} playing={player.playing} />
          <Panel title="Chords">
            <ChordStrip song={song} step={step} />
          </Panel>
          <Panel title="Melody · click to add or remove a note">
            <PianoRoll song={song} step={step} onChange={edit} />
          </Panel>
          <Panel title="Drums · one bar, repeats every bar">
            <DrumGrid song={song} step={step} onChange={edit} />
          </Panel>
          <AiRenders
            song={song}
            onListen={() => {
              if (player.playing) {
                player.toggle();
              }
            }}
          />
        </div>
        <aside className="shrink-0 border-border border-t px-4 lg:w-[360px] lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <PropertiesPanel sections={sections} values={history.value} onChange={history.set} />
        </aside>
      </div>
    </AgentWorkspace>
  );
};
