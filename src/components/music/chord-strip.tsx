import { cn } from '@/lib/utils';
import { chordDegreeAtBar, chordName, type Song, STEPS_PER_BAR } from '@/music';

export const ChordStrip = ({ song, step }: { song: Song; step: number | null }) => {
  const current = step === null ? null : Math.floor(step / STEPS_PER_BAR);
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(3.5rem,1fr))] gap-1 sm:ml-12">
      {Array.from({ length: song.bars }, (_, bar) => {
        const degree = chordDegreeAtBar(song, bar);
        return (
          <div
            key={bar}
            className={cn(
              'flex h-9 min-w-0 flex-col justify-center rounded-md border bg-background px-2 transition-colors',
              current === bar && 'border-violet-500 bg-violet-500/10',
            )}
          >
            <span className="truncate font-semibold text-sm">{chordName(song, degree)}</span>
            <span className="text-[10px] text-muted-foreground">Bar {bar + 1}</span>
          </div>
        );
      })}
    </div>
  );
};
