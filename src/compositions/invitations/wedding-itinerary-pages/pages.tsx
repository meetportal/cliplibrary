import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import type { ItineraryEvent, ItineraryPalette, WeddingItineraryPagesProps } from '@/schemas';
import { pixelTween, settle, tween } from '../../promo/timing';
import { inviteScriptFonts, inviteSerifFonts } from '../fonts';
import { MonogramRing } from './monogram-ring';
import { DIVIDER_HEIGHT, Divider, FadeTitle, TITLE_LEADING, TypedLine } from './page-text';
import { PaperScene } from './paper-scene';
import { type StackItem, splitLines, stackTops, typeSlots } from './timeline';

type PageProps = {
  props: WeddingItineraryPagesProps;
  frame: number;
  arrive: number;
  leave: number;
};

const RING_ROOM = 36;

const MONOGRAM_RISE = 34;

const Page = ({
  palette,
  props,
  frame,
  arrive,
  leave,
  header,
  title,
  titleSize,
  groups,
  delay,
}: PageProps & {
  palette: ItineraryPalette;
  header?: { height: number; render: (top: number) => ReactNode };
  title: string;
  titleSize: number;
  groups: string[][];
  delay: number;
}) => {
  const { type, layout, timing } = props;
  const titleStart = arrive + timing.titleDelay + delay;
  const slots = typeSlots(groups, arrive + timing.typeDelay + delay, timing);
  const lineHeight = Math.round(type.lineSize * type.lineSpacing);
  const titleLines = Math.max(1, splitLines(title).length);
  const items: StackItem[] = [
    ...(header ? [{ height: header.height, gap: 0 }] : []),
    { height: Math.round(titleLines * titleSize * TITLE_LEADING), gap: 0 },
    ...(layout.divider ? [{ height: DIVIDER_HEIGHT, gap: Math.round(layout.titleGap * 0.4) }] : []),
    ...slots.map((slot, index) => ({
      height: lineHeight,
      gap: index === 0 ? layout.titleGap : slot.groupStart ? layout.blockGap : 0,
    })),
  ];
  const tops = stackTops(items, layout.centerY);
  const offset = header ? 1 : 0;
  const titleTop = tops[offset] ?? 0;
  const lineOffset = offset + 1 + (layout.divider ? 1 : 0);
  return (
    <AbsoluteFill>
      <PaperScene
        palette={palette}
        frame={frame}
        arrive={arrive}
        leave={leave}
        scenery={props.scenery}
      />
      <AbsoluteFill style={{ opacity: 1 - leave }}>
        {header ? header.render(tops[0] ?? 0) : null}
        <FadeTitle
          text={title}
          top={titleTop}
          size={titleSize}
          family={inviteScriptFonts[type.scriptFont]}
          color={palette.titleColor}
          start={titleStart}
          frame={frame}
        />
        {layout.divider ? (
          <Divider
            top={tops[offset + 1] ?? 0}
            width={layout.dividerWidth}
            color={palette.accent}
            start={titleStart + 8}
            frame={frame}
          />
        ) : null}
        {slots.map((slot, index) => (
          <TypedLine
            key={index}
            slot={slot}
            top={tops[lineOffset + index] ?? 0}
            height={lineHeight}
            size={type.lineSize}
            family={inviteSerifFonts[type.serifFont]}
            weight={type.serifWeight}
            tracking={type.tracking}
            color={palette.textColor}
            frame={frame}
            timing={timing}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CoverPage = (page: PageProps) => {
  const { cover, ring, type, timing } = page.props;
  const ringStart = page.arrive + ring.start;
  const monogramStart = ringStart + Math.round(ring.drawFrames * 0.35);
  const box = 2 * (ring.radius + RING_ROOM);
  const opacity = tween(
    page.frame,
    [monogramStart, monogramStart + MONOGRAM_RISE - 6],
    [0, 1],
    settle,
  );
  const rise = pixelTween(
    page.frame,
    [monogramStart, monogramStart + MONOGRAM_RISE],
    [type.monogramSize * 0.16, 0],
    settle,
  );
  return (
    <Page
      {...page}
      palette={cover}
      title={cover.names}
      titleSize={type.namesSize}
      groups={[[cover.dates], [cover.hashtag]].map((group) => group.filter((line) => line.trim()))}
      delay={timing.coverDelay}
      header={{
        height: box,
        render: (top) => (
          <>
            <MonogramRing
              cy={top + box / 2}
              radius={ring.radius}
              width={ring.width}
              leaves={ring.leaves}
              ringColor={cover.accent}
              leafColor={cover.greenery}
              start={ringStart}
              drawFrames={ring.drawFrames}
              frame={page.frame}
            />
            {opacity > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: Math.round(top + box / 2 - type.monogramSize * 0.6) + rise,
                  height: Math.round(type.monogramSize * 1.2),
                  lineHeight: `${Math.round(type.monogramSize * 1.2)}px`,
                  textAlign: 'center',
                  fontFamily: inviteSerifFonts[type.serifFont],
                  fontSize: type.monogramSize,
                  fontWeight: type.serifWeight,
                  color: cover.titleColor,
                  opacity,
                  whiteSpace: 'pre',
                }}
              >
                {cover.monogram}
              </div>
            ) : null}
          </>
        ),
      }}
    />
  );
};

export const EventPage = ({ event, ...page }: PageProps & { event: ItineraryEvent }) => (
  <Page
    {...page}
    palette={event}
    title={event.name}
    titleSize={page.props.type.titleSize}
    groups={[[event.date], splitLines(event.venue), splitLines(event.schedule)].map((group) =>
      group.filter((line) => line.trim()),
    )}
    delay={0}
  />
);

export const ClosingPage = (page: PageProps) => {
  const { closing, type } = page.props;
  return (
    <Page
      {...page}
      palette={closing}
      title={closing.message}
      titleSize={type.messageSize}
      groups={[[closing.rsvp], [closing.hosts]].map((group) => group.filter((line) => line.trim()))}
      delay={0}
    />
  );
};
