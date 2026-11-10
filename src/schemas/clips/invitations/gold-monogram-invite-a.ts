import {
  type GoldMonogramInviteProps,
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from '../../gold-monogram-invite-common';
import type { ClipMeta } from '../../registry';

export const goldMonogramInviteASchema = goldMonogramInviteSchema;

export type GoldMonogramInviteAProps = GoldMonogramInviteProps;

export const goldMonogramInviteADefaults: GoldMonogramInviteAProps = goldMonogramInviteDefaults({
  layout: 'split',
  mandala: { pattern: 'jewel', size: 430, lineWidth: 1, spin: 4, ringGap: 11, ringDraw: 56 },
  monogram: { size: 150, heart: true, fillAt: 44, glintAt: 290 },
  type: { script: 'great-vibes', serif: 'cinzel', namesSize: 124, lineSize: 36, dateSize: 38 },
  reveal: { start: 28, stagger: 30, glideAt: 150, glideFrames: 64 },
});

export const goldMonogramInviteAMeta: ClipMeta = goldMonogramInviteMeta('a', {
  id: 'gold-monogram-invite-a',
  title: 'Gold Monogram Invite A',
  description:
    "A thin gold jewel mandala draws itself ring by ring and keeps turning on the left around a gold monogram of the couple's initials, while the names in gold script, an invitation line, the date, the venue and a logo arrive row by row on the right.",
  source: 'src/compositions/scenes/invitations/gold-monogram-invite-a.tsx',
  posterFrame: 390,
});
