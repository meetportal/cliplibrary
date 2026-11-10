import { Composition } from 'remotion';
import {
  type GoldMonogramInviteBProps,
  goldMonogramInviteBDefaults,
  goldMonogramInviteBMeta,
  goldMonogramInviteBSchema,
} from '@/schemas';
import { GoldMonogramInvite } from '../../invitations/gold-monogram-invite/gold-monogram-invite';
import type { SceneModule } from '../../scene-module';

const GoldMonogramInviteB = (props: GoldMonogramInviteBProps) => <GoldMonogramInvite {...props} />;

export const goldMonogramInviteBScene: SceneModule = {
  id: 'gold-monogram-invite-b',
  component: GoldMonogramInviteB,
  render: (key) => (
    <Composition
      key={key}
      id="gold-monogram-invite-b"
      component={GoldMonogramInviteB}
      schema={goldMonogramInviteBSchema}
      defaultProps={goldMonogramInviteBDefaults}
      durationInFrames={goldMonogramInviteBMeta.durationInFrames}
      fps={goldMonogramInviteBMeta.fps}
      width={goldMonogramInviteBMeta.width}
      height={goldMonogramInviteBMeta.height}
    />
  ),
};
