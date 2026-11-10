import { Composition } from 'remotion';
import {
  type GoldMonogramInviteAProps,
  goldMonogramInviteADefaults,
  goldMonogramInviteAMeta,
  goldMonogramInviteASchema,
} from '@/schemas';
import { GoldMonogramInvite } from '../../invitations/gold-monogram-invite/gold-monogram-invite';
import type { SceneModule } from '../../scene-module';

const GoldMonogramInviteA = (props: GoldMonogramInviteAProps) => <GoldMonogramInvite {...props} />;

export const goldMonogramInviteAScene: SceneModule = {
  id: 'gold-monogram-invite-a',
  component: GoldMonogramInviteA,
  render: (key) => (
    <Composition
      key={key}
      id="gold-monogram-invite-a"
      component={GoldMonogramInviteA}
      schema={goldMonogramInviteASchema}
      defaultProps={goldMonogramInviteADefaults}
      durationInFrames={goldMonogramInviteAMeta.durationInFrames}
      fps={goldMonogramInviteAMeta.fps}
      width={goldMonogramInviteAMeta.width}
      height={goldMonogramInviteAMeta.height}
    />
  ),
};
