import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import type { SiteBodyProps } from '../../site-view';
import { Countdown } from './countdown';
import { CAPS, SCRIPT } from './fonts';
import { GoodToKnow } from './good-to-know';
import { LoveStory } from './love-story';
import { RingsBand, WaxSeal } from './ornaments';
import { RsvpCard } from './rsvp-card';
import { SaveTheDate } from './save-the-date';
import { Schedule } from './schedule';
import { SiteNav } from './site-nav';
import { Venue } from './venue';

const Footer = ({ content }: { content: EmeraldRoseContent }) => {
  const when = describeEventDate(content.event.startsAt);
  return (
    <footer className="flex flex-col items-center gap-3 bg-(--er-primary-deep) px-5 py-14 text-(--er-bg)">
      <WaxSeal monogram={content.couple.monogram} className="size-20" />
      <span className={cn(SCRIPT, 'text-4xl')}>
        {content.couple.firstName} &amp; {content.couple.secondName}
      </span>
      {when === null ? null : (
        <span className={cn(CAPS, 'text-(--er-accent) text-xs')}>
          {when.day} {when.month} {when.year}
        </span>
      )}
    </footer>
  );
};

export const EmeraldRoseBody = ({ content }: SiteBodyProps<EmeraldRoseContent>) => (
  <div className="@container min-h-full bg-(--er-bg) text-(--er-text) antialiased">
    <SiteNav monogram={content.couple.monogram} />
    <SaveTheDate content={content} />
    <RingsBand />
    <LoveStory content={content} />
    <Venue content={content} />
    <Schedule content={content} />
    <GoodToKnow content={content} />
    <RingsBand />
    <Countdown content={content} />
    <RsvpCard content={content} />
    <Footer content={content} />
  </div>
);
