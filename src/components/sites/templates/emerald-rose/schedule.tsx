import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { Reveal } from './reveal';

export const Schedule = ({ content }: { content: EmeraldRoseContent }) => {
  const { schedule, photos, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <section
      id="er-schedule"
      className="relative scroll-mt-14 overflow-hidden bg-(--er-primary-deep) px-5 py-20 text-(--er-bg)"
    >
      {photos.schedule === '' ? null : (
        // biome-ignore lint/performance/noImgElement: user photos come from arbitrary hosts and uploads
        <img src={photos.schedule} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-(--er-primary-deep)/70 via-(--er-primary)/85 to-(--er-primary-deep)/95" />
      <Reveal className="relative mx-auto flex max-w-xl flex-col items-center">
        <h2 className="flex flex-col items-center">
          <span className={cn(CAPS, 'text-2xl tracking-[0.25em]')}>Order of the</span>
          <span className={cn(SCRIPT, '-mt-2 text-6xl')}>day</span>
        </h2>
        {when === null ? null : (
          <span className={cn(CAPS, 'mt-3 text-(--er-accent) text-sm')}>
            {when.day} {when.month} {when.year}
          </span>
        )}
        <ol className="relative mt-10 w-full">
          <span className="absolute top-3 bottom-3 left-[6.75rem] w-px bg-(--er-accent)/60" />
          {schedule.map((moment, index) => (
            <li key={index} className="relative flex items-center gap-6 py-4">
              <span className={cn(SERIF, 'w-24 shrink-0 text-right text-2xl italic')}>
                {moment.time}
              </span>
              <span className="relative z-10 size-3.5 shrink-0 rounded-full border-2 border-(--er-accent) bg-(--er-primary)" />
              <span className={cn(CAPS, 'text-sm')}>{moment.title}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
};
