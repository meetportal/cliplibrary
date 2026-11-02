import { loopSteps, type Song } from '@/music';

const TOP = 14;
const ROWS = 22;

export const SongThumbnail = ({ song }: { song: Song }) => {
  const total = loopSteps(song);
  return (
    <svg
      viewBox={`0 0 ${total} ${ROWS}`}
      preserveAspectRatio="none"
      aria-hidden
      className="h-full w-full"
    >
      {song.melody.notes
        .filter((note) => note.step < total)
        .map((note) => (
          <rect
            key={`${note.step}:${note.pitch}`}
            x={note.step}
            y={TOP - note.pitch}
            width={Math.max(0.6, Math.min(note.length, total - note.step) - 0.3)}
            height={0.8}
            rx={0.3}
            className="fill-violet-500"
          />
        ))}
    </svg>
  );
};
