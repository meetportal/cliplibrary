import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { FloralCluster, WaxSeal } from './ornaments';
import { PillLink } from './pill-link';

export const RsvpCard = ({ content }: { content: EmeraldRoseContent }) => {
  const { couple, rsvp, event } = content;
  return (
    <section id="er-rsvp" className="scroll-mt-14 bg-(--er-primary) px-5 py-16">
      <Reveal className="relative mx-auto max-w-lg">
        <FloralCluster className="-top-12 -right-8 absolute z-10 w-48 rotate-12" />
        <div className="rounded-sm border-(--er-accent) border-[3px] bg-(--er-paper) p-1.5 shadow-2xl">
          <div className="flex flex-col items-center gap-5 border border-(--er-accent)/60 px-6 py-12 text-center @md:px-10">
            <h2 className={cn(SCRIPT, 'text-6xl')}>RSVP</h2>
            <span className={cn(CAPS, 'text-(--er-muted) text-[10px]')}>
              Kindly reply by {event.rsvpBy}
            </span>
            <p className={cn(SERIF, 'text-xl leading-relaxed')}>{rsvp.message}</p>
            {rsvp.link === '' ? null : (
              <PillLink href={rsvp.link} className="mt-2 px-8 py-3">
                {rsvp.buttonLabel}
              </PillLink>
            )}
            <WaxSeal monogram={couple.monogram} className="mt-4 size-20" />
          </div>
        </div>
      </Reveal>
    </section>
  );
};
