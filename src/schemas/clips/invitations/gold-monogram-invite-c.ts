import {
  type GoldMonogramInviteProps,
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from '../../gold-monogram-invite-common';
import type { ClipMeta } from '../../registry';

export const goldMonogramInviteCSchema = goldMonogramInviteSchema;

export type GoldMonogramInviteCProps = GoldMonogramInviteProps;

export const goldMonogramInviteCDefaults: GoldMonogramInviteCProps = goldMonogramInviteDefaults({
  layout: 'twin-mandalas',
  mandala: { pattern: 'sunburst', size: 520, lineWidth: 1, spin: 3, ringGap: 16, ringDraw: 52 },
  monogram: { size: 112, heart: true, fillAt: 44, glintAt: 280 },
  type: { script: 'parisienne', serif: 'marcellus', namesSize: 118, lineSize: 32, dateSize: 34 },
  reveal: { start: 50, stagger: 28, glideAt: 150, glideFrames: 64 },
});

export const goldMonogramInviteCMeta: ClipMeta = goldMonogramInviteMeta('c', {
  id: 'gold-monogram-invite-c',
  title: 'Gold Monogram Invite C',
  description:
    'Two thin gold half mandalas draw themselves ring by ring at the edges and turn in opposite directions around a centred card: a gold monogram in a ring, the names in gold script, an invitation line, the date, the venue and a logo.',
  source: 'src/compositions/scenes/invitations/gold-monogram-invite-c.tsx',
  posterFrame: 390,
});
