import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type WeddingItineraryPagesProps,
  weddingItineraryPagesDefaults,
  weddingItineraryPagesMeta,
  weddingItineraryPagesSchema,
} from '@/schemas';
import { ClosingPage, CoverPage, EventPage } from '../../invitations/wedding-itinerary-pages/pages';
import {
  backgroundAt,
  pageArrival,
  pageLeave,
  pageVisible,
} from '../../invitations/wedding-itinerary-pages/timeline';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const WeddingItineraryPages = (props: WeddingItineraryPagesProps) => {
  const { cover, events, closing, timing, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const count = events.length + 2;
  const colors = [cover.background, ...events.map((event) => event.background), closing.background];
  const page = (index: number) => ({
    props,
    frame,
    arrive: pageArrival(index, timing),
    leave: pageLeave(frame, index, count, timing),
  });
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? (
        <AbsoluteFill style={{ background: backgroundAt(frame, colors, timing) }}>
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(255, 255, 255, ${look.glow}) 0%, rgba(255, 255, 255, 0) 58%)`,
            }}
          />
        </AbsoluteFill>
      ) : null}
      {pageVisible(frame, 0, count, timing) ? <CoverPage {...page(0)} /> : null}
      {events.map((event, index) =>
        pageVisible(frame, index + 1, count, timing) ? (
          <EventPage key={index} event={event} {...page(index + 1)} />
        ) : null,
      )}
      {pageVisible(frame, count - 1, count, timing) ? <ClosingPage {...page(count - 1)} /> : null}
    </TransitionFrame>
  );
};

export const weddingItineraryPagesScene: SceneModule = {
  id: 'wedding-itinerary-pages',
  component: WeddingItineraryPages,
  render: (key) => (
    <Composition
      key={key}
      id="wedding-itinerary-pages"
      component={WeddingItineraryPages}
      schema={weddingItineraryPagesSchema}
      defaultProps={weddingItineraryPagesDefaults}
      durationInFrames={weddingItineraryPagesMeta.durationInFrames}
      fps={weddingItineraryPagesMeta.fps}
      width={weddingItineraryPagesMeta.width}
      height={weddingItineraryPagesMeta.height}
    />
  ),
};
