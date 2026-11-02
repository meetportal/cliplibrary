import { cn } from '@/lib/utils';
import { DRUM_VOICES, type DrumVoice, type Song, STEPS_PER_BAR } from '@/music';

const LABELS: Record<DrumVoice, string> = { kick: 'Kick', snare: 'Snare', hat: 'Hat' };

const toggled = (pattern: string, step: number): string =>
  `${pattern.slice(0, step)}${pattern[step] === 'x' ? '.' : 'x'}${pattern.slice(step + 1)}`;

export const DrumGrid = ({
  song,
  step,
  onChange,
}: {
  song: Song;
  step: number | null;
  onChange: (next: Song) => void;
}) => {
  const current = step === null ? null : step % STEPS_PER_BAR;
  return (
    <div className={cn('flex flex-col gap-1', !song.drums.enabled && 'opacity-40')}>
      {DRUM_VOICES.map((voice) => (
        <div key={voice} className="flex items-center gap-1">
          <span className="w-11 shrink-0 text-muted-foreground text-xs">{LABELS[voice]}</span>
          {Array.from({ length: STEPS_PER_BAR }, (_, index) => {
            const on = song.drums[voice][index] === 'x';
            return (
              <button
                key={index}
                type="button"
                aria-label={`${LABELS[voice]} step ${index + 1}`}
                aria-pressed={on}
                onClick={() =>
                  onChange({
                    ...song,
                    drums: { ...song.drums, [voice]: toggled(song.drums[voice], index) },
                  })
                }
                className={cn(
                  'h-7 min-w-0 flex-1 rounded-sm border transition-colors',
                  index % 4 === 0 ? 'bg-muted/70' : 'bg-muted/30',
                  on && 'border-pink-500 bg-pink-500/80',
                  current === index && 'ring-2 ring-violet-500/70',
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
