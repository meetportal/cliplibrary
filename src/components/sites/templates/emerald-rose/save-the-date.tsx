'use client';

import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { scrollToSection } from '../../kit/scroll-to-section';
import { SitePhoto } from '../../kit/site-photo';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { FloralCluster, WaxSeal } from './ornaments';

const ArchPhoto = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <div
    className={cn(
      'overflow-hidden rounded-t-[999px] border-(--er-paper) border-[6px] bg-(--er-paper) shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)]',
      className,
    )}
  >
    <SitePhoto src={src} alt={alt} className="size-full" emptyClassName="bg-(--er-primary)/15" />
  </div>
);

export const SaveTheDate = ({ content }: { content: EmeraldRoseContent }) => {
  const { couple, event, photos } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <section id="er-invitation" className="scroll-mt-14 px-5 pt-12 pb-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 @3xl:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <ArchPhoto
            src={photos.hero}
            alt={`${couple.firstName} and ${couple.secondName}`}
            className="aspect-[3/4] w-full"
          />
          <FloralCluster className="-bottom-10 -left-10 absolute w-48 rotate-[-8deg]" />
          <WaxSeal
            monogram={couple.monogram}
            className="-right-4 -bottom-6 absolute size-24 drop-shadow-lg"
          />
        </Reveal>
        <Reveal delay={150} className="flex flex-col items-center text-center">
          <span className={cn(CAPS, 'max-w-60 text-(--er-muted) text-[11px] leading-relaxed')}>
            Please join us for the wedding of
          </span>
          <h1 className="mt-4 flex flex-col items-center">
            <span className={cn(SCRIPT, 'text-6xl leading-none @3xl:text-7xl')}>
              {couple.firstName}
            </span>
            <span className={cn(SERIF, 'my-1 text-(--er-accent) text-4xl italic leading-none')}>
              &amp;
            </span>
            <span className={cn(SCRIPT, 'text-6xl leading-none @3xl:text-7xl')}>
              {couple.secondName}
            </span>
          </h1>
          {when === null ? null : (
            <div className="mt-8 flex items-center gap-5">
              <span className={cn(CAPS, 'w-24 border-(--er-accent) border-y py-2 text-xs')}>
                {when.weekday}
              </span>
              <span className="flex flex-col items-center">
                <span className={cn(SCRIPT, 'text-3xl text-(--er-secondary) leading-none')}>
                  {when.month}
                </span>
                <span className={cn(SERIF, 'font-medium text-7xl leading-none')}>{when.day}</span>
                <span className={cn(CAPS, 'text-sm')}>{when.year}</span>
              </span>
              <span className={cn(CAPS, 'w-24 border-(--er-accent) border-y py-2 text-xs')}>
                at {when.time}
              </span>
            </div>
          )}
          <span className={cn(CAPS, 'mt-8 text-sm')}>{event.venue}</span>
          <span className={cn(SERIF, 'mt-1 text-(--er-muted) text-lg italic')}>
            {event.address}
          </span>
          <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-3 rounded-sm border border-(--er-accent)/50 bg-(--er-paper) px-6 py-6">
            <span className={cn(SCRIPT, 'text-3xl')}>Kindly RSVP</span>
            <span className={cn(CAPS, 'text-(--er-muted) text-[10px]')}>by {event.rsvpBy}</span>
            <button
              type="button"
              onClick={() => scrollToSection('er-rsvp')}
              className={cn(
                CAPS,
                'mt-1 rounded-full bg-(--er-primary) px-6 py-2.5 text-(--er-bg) text-xs transition hover:brightness-125',
              )}
            >
              RSVP here
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
