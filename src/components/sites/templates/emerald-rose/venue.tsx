import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { directionsUrl, mapEmbedUrl } from '@/sites/calendar';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { PillLink } from './pill-link';

export const Venue = ({ content }: { content: EmeraldRoseContent }) => {
  const { event, photos } = content;
  return (
    <section id="er-venue" className="scroll-mt-14">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-(--er-primary-deep) @3xl:h-64">
        {photos.reception === '' ? null : (
          // biome-ignore lint/performance/noImgElement: user photos come from arbitrary hosts and uploads
          <img src={photos.reception} alt="" className="absolute inset-0 size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-(--er-primary-deep)/55" />
        <div className="relative flex flex-col items-center text-(--er-bg)">
          <span className={cn(SCRIPT, 'text-3xl')}>our wedding</span>
          <span className={cn(CAPS, 'text-3xl tracking-[0.3em]')}>Details</span>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 @3xl:grid-cols-2">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className={cn(SCRIPT, 'text-6xl')}>The venue</h2>
          <span className={cn(CAPS, 'mt-3 text-lg')}>{event.venue}</span>
          <span className={cn(SERIF, 'mt-1 text-(--er-muted) text-lg italic')}>
            {event.address}
          </span>
          <p className={cn(SERIF, 'mt-5 max-w-md text-xl leading-relaxed')}>{event.venueNote}</p>
          {event.venueWebsite === '' ? null : (
            <PillLink href={event.venueWebsite} className="mt-6">
              Website
            </PillLink>
          )}
          {photos.venue === '' ? null : (
            // biome-ignore lint/performance/noImgElement: user photos come from arbitrary hosts and uploads
            <img
              src={photos.venue}
              alt={event.venue}
              className="mt-8 aspect-[4/3] w-full max-w-md rounded-sm object-cover shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)]"
            />
          )}
        </Reveal>
        <Reveal delay={150} className="flex flex-col items-center gap-5">
          <span
            className={cn(
              CAPS,
              'rounded-full bg-(--er-primary) px-6 py-2 text-(--er-bg) text-xs @3xl:mt-4',
            )}
          >
            Location
          </span>
          <iframe
            title={`Map of ${event.venue}`}
            src={mapEmbedUrl(event.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-square w-full max-w-md rounded-sm border border-(--er-accent)/40 bg-(--er-paper)"
          />
          <a
            href={directionsUrl(event.address)}
            target="_blank"
            rel="noreferrer"
            className={cn(
              CAPS,
              'flex items-center gap-2 text-(--er-text) text-xs underline-offset-4 hover:underline',
            )}
          >
            <MapPin className="size-4 text-(--er-secondary)" />
            Get directions
          </a>
        </Reveal>
      </div>
    </section>
  );
};
