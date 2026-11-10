import { Composition } from 'remotion';
import {
  type GoldMonogramInviteCProps,
  goldMonogramInviteCDefaults,
  goldMonogramInviteCMeta,
  goldMonogramInviteCSchema,
} from '@/schemas';
import { GoldMonogramInvite } from '../../invitations/gold-monogram-invite/gold-monogram-invite';
import type { SceneModule } from '../../scene-module';

const GoldMonogramInviteC = (props: GoldMonogramInviteCProps) => <GoldMonogramInvite {...props} />;

export const goldMonogramInviteCScene: SceneModule = {
  id: 'gold-monogram-invite-c',
  component: GoldMonogramInviteC,
  render: (key) => (
    <Composition
      key={key}
      id="gold-monogram-invite-c"
      component={GoldMonogramInviteC}
      schema={goldMonogramInviteCSchema}
      defaultProps={goldMonogramInviteCDefaults}
      durationInFrames={goldMonogramInviteCMeta.durationInFrames}
      fps={goldMonogramInviteCMeta.fps}
      width={goldMonogramInviteCMeta.width}
      height={goldMonogramInviteCMeta.height}
    />
  ),
};
