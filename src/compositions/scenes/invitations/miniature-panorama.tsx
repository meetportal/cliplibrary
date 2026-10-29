import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type MiniaturePanoramaProps,
  miniaturePanoramaDefaults,
  miniaturePanoramaMeta,
  miniaturePanoramaSchema,
} from '@/schemas';
import { Foliage, GardenPath } from '../../invitations/miniature-panorama/foreground';
import { Garden } from '../../invitations/miniature-panorama/garden';
import { Hills } from '../../invitations/miniature-panorama/hills';
import { InviteText, inviteBand } from '../../invitations/miniature-panorama/invite-text';
import { Lake } from '../../invitations/miniature-panorama/lake';
import { Marigolds } from '../../invitations/miniature-panorama/marigolds';
import { dayPhase, lightAmount, makeShade } from '../../invitations/miniature-panorama/palette';
import { Procession } from '../../invitations/miniature-panorama/procession';
import { Railing } from '../../invitations/miniature-panorama/railing';
import { Birds, Clouds, SkyGradient, Stars } from '../../invitations/miniature-panorama/sky';
import { FRAME_HEIGHT, FRAME_WIDTH, type World } from '../../invitations/miniature-panorama/strip';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const LAYER = { position: 'absolute', left: 0, top: 0 } as const;

const MiniaturePanorama = (props: MiniaturePanoramaProps) => {
  const { invite, pan, timelapse, sky, lights, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const phase = dayPhase(frame, timelapse);
  const heading = pan.direction === 'left' ? 1 : -1;
  const band = inviteBand(invite);
  const world: World = {
    frame,
    phase,
    shade: makeShade(phase, props.shade),
    lights: lightAmount(phase, lights.onAt),
    pan: frame * pan.speed * heading,
    parallax: pan.parallax,
  };
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill>
        {look.showBackdrop ? <SkyGradient sky={sky} phase={phase} /> : null}
        <svg
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
          style={LAYER}
          aria-hidden="true"
        >
          <Stars stars={props.stars} world={world} band={band} />
          <Clouds sky={sky} world={world} />
          <Birds birds={props.birds} world={world} heading={heading} band={band} />
          <Hills hills={props.hills} world={world} />
          <Garden pavilions={props.pavilions} trees={props.trees} lights={lights} world={world} />
          <Lake lake={props.lake} world={world} />
          <Railing
            railing={props.railing}
            peacock={props.peacock}
            lights={lights}
            gold={props.pavilions.gold}
            world={world}
          />
          <GardenPath path={props.path} world={world} />
          <Procession
            procession={props.procession}
            lights={lights}
            panSpeed={pan.speed}
            heading={heading}
            world={world}
          />
          <Foliage trees={props.trees} flower={props.lake.lotus} world={world} />
        </svg>
        <InviteText invite={invite} frame={frame} phase={phase} />
        <svg
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
          style={LAYER}
          aria-hidden="true"
        >
          <Marigolds marigolds={props.marigolds} world={world} />
        </svg>
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const miniaturePanoramaScene: SceneModule = {
  id: 'miniature-panorama',
  component: MiniaturePanorama,
  render: (key) => (
    <Composition
      key={key}
      id="miniature-panorama"
      component={MiniaturePanorama}
      schema={miniaturePanoramaSchema}
      defaultProps={miniaturePanoramaDefaults}
      durationInFrames={miniaturePanoramaMeta.durationInFrames}
      fps={miniaturePanoramaMeta.fps}
      width={miniaturePanoramaMeta.width}
      height={miniaturePanoramaMeta.height}
    />
  ),
};
