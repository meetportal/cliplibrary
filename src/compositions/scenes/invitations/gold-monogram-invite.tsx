import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type GoldMonogramInviteProps,
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from '@/schemas';
import { inviteScriptFonts, inviteSerifFonts } from '../../invitations/fonts';
import { InviteBackdrop } from '../../invitations/gold-monogram-invite/backdrop';
import { GoldDust } from '../../invitations/gold-monogram-invite/dust';
import { Mandala } from '../../invitations/gold-monogram-invite/mandala';
import { Monogram } from '../../invitations/gold-monogram-invite/monogram';
import { Quote } from '../../invitations/gold-monogram-invite/quote';
import { Schedule } from '../../invitations/gold-monogram-invite/schedule';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const GoldMonogramInvite = ({
  quote,
  monogram,
  events,
  schedule,
  fonts,
  mandala,
  dust,
  gold,
  text,
  background,
  motion,
}: GoldMonogramInviteProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { fps } = useVideoConfig();
  const serif = inviteSerifFonts[fonts.serif];
  const script = inviteScriptFonts[fonts.script];
  return (
    <TransitionFrame motion={motion}>
      {background.show ? <InviteBackdrop background={background} /> : null}
      <Mandala frame={frame} fps={fps} mandala={mandala} gold={gold} dimAt={monogram.start} />
      <GoldDust frame={frame} start={monogram.start} dust={dust} color={gold.light} />
      <Quote
        frame={frame}
        quote={quote}
        gold={gold}
        color={text.cream}
        serif={serif}
        script={script}
      />
      <Monogram
        frame={frame}
        monogram={monogram}
        schedule={schedule}
        gold={gold}
        text={text}
        serif={serif}
        script={script}
      />
      <Schedule
        frame={frame}
        events={events}
        schedule={schedule}
        gold={gold}
        text={text}
        serif={serif}
        script={script}
      />
    </TransitionFrame>
  );
};

export const goldMonogramInviteScene: SceneModule = {
  id: 'gold-monogram-invite',
  component: GoldMonogramInvite,
  render: (key) => (
    <Composition
      key={key}
      id="gold-monogram-invite"
      component={GoldMonogramInvite}
      schema={goldMonogramInviteSchema}
      defaultProps={goldMonogramInviteDefaults}
      durationInFrames={goldMonogramInviteMeta.durationInFrames}
      fps={goldMonogramInviteMeta.fps}
      width={goldMonogramInviteMeta.width}
      height={goldMonogramInviteMeta.height}
    />
  ),
};
