'use client';

import { CalendarPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { calendarFile } from '@/sites/calendar';
import { type CountdownParts, countdownParts, parseLocalDateTime } from '@/sites/event-date';
import { slugify } from '@/sites/slug';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { Reveal } from './reveal';

const UNITS: { key: keyof CountdownParts; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

const useNow = (): Date | null => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const downloadCalendar = (content: EmeraldRoseContent): void => {
  const { couple, event } = content;
  const title = `${couple.firstName} & ${couple.secondName}'s wedding`;
  const file = calendarFile(
    {
      id: slugify(`${title} ${event.startsAt}`),
      title,
      startsAt: event.startsAt,
      hours: 8,
      location: `${event.venue}, ${event.address}`,
      description: window.location.href,
    },
    new Date(),
  );
  if (file === null) {
    return;
  }
  const url = URL.createObjectURL(new Blob([file], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(title)}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};

export const Countdown = ({ content }: { content: EmeraldRoseContent }) => {
  const now = useNow();
  const target = parseLocalDateTime(content.event.startsAt);
  const parts = now === null || target === null ? null : countdownParts(target, now);
  return (
    <section className="px-5 py-16">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <span className={cn(SCRIPT, 'text-5xl')}>Counting down</span>
        <div className="flex items-start gap-2 @md:gap-4">
          {UNITS.map((unit, index) => (
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
