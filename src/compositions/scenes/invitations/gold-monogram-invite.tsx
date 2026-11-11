import { Composition } from 'remotion';
import {
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from '@/schemas';
import { GoldMonogramInvite } from '../../invitations/gold-monogram-invite/gold-monogram-invite';
import type { SceneModule } from '../../scene-module';

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
