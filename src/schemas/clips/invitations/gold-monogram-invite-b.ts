import {
  type GoldMonogramInviteProps,
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from '../../gold-monogram-invite-common';
import type { ClipMeta } from '../../registry';

export const goldMonogramInviteBSchema = goldMonogramInviteSchema;

export type GoldMonogramInviteBProps = GoldMonogramInviteProps;

export const goldMonogramInviteBDefaults: GoldMonogramInviteBProps = goldMonogramInviteDefaults({
  layout: 'center-then-aside',
  mandala: { pattern: 'lotus', size: 420, lineWidth: 1, spin: -3.5, ringGap: 18, ringDraw: 60 },
  monogram: { size: 150, heart: true, fillAt: 44, glintAt: 110 },
  type: {
    script: 'pinyon-script',
    serif: 'cormorant-garamond',
    namesSize: 128,
    lineSize: 40,
    dateSize: 40,
  },
  reveal: { start: 40, stagger: 18, glideAt: 140, glideFrames: 66 },
});

export const goldMonogramInviteBMeta: ClipMeta = goldMonogramInviteMeta('b', {
  id: 'gold-monogram-invite-b',
  title: 'Gold Monogram Invite B',
  description:
    'A thin gold lotus mandala draws itself ring by ring around a centred gold monogram, then the turning medallion glides left as the names in gold script, an invitation line, the date, the venue and a logo arrive on the right.',
  source: 'src/compositions/scenes/invitations/gold-monogram-invite-b.tsx',
  posterFrame: 390,
});
