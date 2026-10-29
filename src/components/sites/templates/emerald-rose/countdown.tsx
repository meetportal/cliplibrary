'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { downloadEventCalendar } from '../../kit/calendar-download';
import { Reveal } from '../../kit/reveal';
import { COUNTDOWN_UNITS, useCountdown } from '../../kit/use-countdown';
import { CAPS, SCRIPT, SERIF } from './fonts';

const downloadCalendar = (content: EmeraldRoseContent): void => {
  const { couple, event } = content;
  downloadEventCalendar({
    title: `${couple.firstName} & ${couple.secondName}'s wedding`,
    startsAt: event.startsAt,
    hours: 8,
    location: `${event.venue}, ${event.address}`,
  });
};

export const Countdown = ({ content }: { content: EmeraldRoseContent }) => {
  const parts = useCountdown(content.event.startsAt);
  return (
    <section className="px-5 py-16">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <span className={cn(SCRIPT, 'text-5xl')}>Counting down</span>
        <div className="flex items-start gap-2 @md:gap-4">
          {COUNTDOWN_UNITS.map((unit, index) => (
            <div key={unit.key} className="flex items-start gap-2 @md:gap-4">
              {index === 0 ? null : (
                <span className={cn(SERIF, 'text-(--er-accent) text-4xl leading-none')}>:</span>
              )}
              <span className="flex w-14 flex-col items-center @md:w-20">
                <span
                  className={cn(
                    SERIF,
                    'font-medium text-4xl tabular-nums leading-none @md:text-5xl',
                    unit.key === 'seconds' && 'text-(--er-accent)',
                  )}
                >
                  {parts === null ? '--' : String(parts[unit.key]).padStart(2, '0')}
                </span>
                <span className={cn(CAPS, 'mt-2 text-(--er-muted) text-[9px]')}>{unit.label}</span>
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadCalendar(content)}
          className={cn(
            CAPS,
            'flex items-center gap-2 rounded-full bg-(--er-primary) px-6 py-2.5 text-(--er-bg) text-xs transition hover:brightness-125',
          )}
        >
          <CalendarPlus className="size-4" />
          Add to calendar
        </button>
      </Reveal>
    </section>
  );
};
