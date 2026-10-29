import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type BotanicalSaveTheDateProps,
  botanicalSaveTheDateDefaults,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from '@/schemas';
import {
  ClosingBeat,
  CoupleBeat,
  PoemBeat,
  SaveTheDateBeat,
} from '../../invitations/botanical-save-the-date/beats';
import { EventCard } from '../../invitations/botanical-save-the-date/event-card';
import { type InviteType, isOnStage } from '../../invitations/botanical-save-the-date/lettering';
import { PageBorder } from '../../invitations/botanical-save-the-date/page-border';
import { Sprigs } from '../../invitations/botanical-save-the-date/sprigs';
import { inviteScriptFonts, inviteSerifFonts } from '../../invitations/fonts';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const BotanicalSaveTheDate = (props: BotanicalSaveTheDateProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { timing, lettering, look, cards, events } = props;
  const type: InviteType = {
    serif: inviteSerifFonts[props.serifFont],
    script: inviteScriptFonts[props.scriptFont],
    ink: look.ink,
    muted: look.muted,
    accent: look.accent,
    gold: props.gold,
    rule: props.border.width,
    tracking: lettering.capsTracking,
    stagger: timing.lineStagger,
    width: lettering.textWidth,
    offsetY: lettering.offsetY,
  };
  const exitBefore = (next: number) => next - timing.overlap;
  const beat = { frame, type, lettering };
  const poemEnd = exitBefore(timing.dateAt);
  const dateEnd = exitBefore(timing.coupleAt);
  const coupleEnd = exitBefore(timing.eventsAt);
  const span = (timing.closingAt - timing.eventsAt) / events.length;
  const leafInk = {
    color: props.greenery,
    fill: props.sprigs.leafFill,
    lineWidth: props.sprigs.lineWidth * 0.8,
  };
  return (
    <PromoLayer look={look} motion={props.motion}>
      <AbsoluteFill>
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          <PageBorder
            frame={frame}
            width={width}
            height={height}
            border={props.border}
            color={props.gold}
            start={props.sprigs.at}
          />
          <Sprigs
            frame={frame}
            width={width}
            height={height}
            sprigs={props.sprigs}
            color={props.greenery}
            accent={look.accent}
          />
        </svg>
        {isOnStage(frame, timing.poemAt, poemEnd) ? (
          <PoemBeat {...beat} start={timing.poemAt} end={poemEnd} poem={props.poem} />
        ) : null}
        {isOnStage(frame, timing.dateAt, dateEnd) ? (
          <SaveTheDateBeat
            {...beat}
            start={timing.dateAt}
            end={dateEnd}
            top={props.saveTop}
            joiner={props.saveJoiner}
            bottom={props.saveBottom}
            date={props.date}
          />
        ) : null}
        {isOnStage(frame, timing.coupleAt, coupleEnd) ? (
          <CoupleBeat
            {...beat}
            start={timing.coupleAt}
            end={coupleEnd}
            intro={props.coupleIntro}
            first={props.partnerOne}
            joiner={props.partnerJoiner}
            second={props.partnerTwo}
          />
        ) : null}
        {events.map((event, index) => {
          const start = Math.round(timing.eventsAt + span * index);
          const end = exitBefore(Math.round(timing.eventsAt + span * (index + 1)));
          return isOnStage(frame, start, end) ? (
            <EventCard
              key={`${index}:${event.title}`}
              event={event}
              frame={frame}
              start={start}
              end={end}
              cards={cards}
              type={type}
              leafInk={leafInk}
              lettering={lettering}
              center={[width / 2, height / 2 + lettering.offsetY]}
            />
          ) : null;
        })}
        {isOnStage(frame, timing.closingAt, undefined) ? (
          <ClosingBeat
            {...beat}
            start={timing.closingAt}
            line={props.closingLine}
            signoff={props.signoff}
            family={props.familyName}
          />
        ) : null}
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const botanicalSaveTheDateScene: SceneModule = {
  id: 'botanical-save-the-date',
  component: BotanicalSaveTheDate,
  render: (key) => (
    <Composition
      key={key}
      id="botanical-save-the-date"
      component={BotanicalSaveTheDate}
      schema={botanicalSaveTheDateSchema}
      defaultProps={botanicalSaveTheDateDefaults}
      durationInFrames={botanicalSaveTheDateMeta.durationInFrames}
      fps={botanicalSaveTheDateMeta.fps}
      width={botanicalSaveTheDateMeta.width}
      height={botanicalSaveTheDateMeta.height}
    />
  ),
};
