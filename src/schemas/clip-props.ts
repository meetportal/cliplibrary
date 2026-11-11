import type { ArcBurstWordmarkProps } from './clips/brand/arc-burst-wordmark';
import type { ChevronMarkAssembleProps } from './clips/brand/chevron-mark-assemble';
import type { DotMorphWordmarkProps } from './clips/brand/dot-morph-wordmark';
import type { DotRingLogoRevealProps } from './clips/brand/dot-ring-logo-reveal';
import type { BotanicalSaveTheDateProps } from './clips/invitations/botanical-save-the-date';
import type { GoldMonogramInviteProps } from './clips/invitations/gold-monogram-invite';
import type { AnniversaryKineticProps } from './clips/kinetic-type/anniversary-kinetic';
import type { ComingSoonFlipsProps } from './clips/kinetic-type/coming-soon-flips';
import type { DominoWordsProps } from './clips/kinetic-type/domino-words';
import type { TextRingsProps } from './clips/kinetic-type/text-rings';
import type { PillFanProps } from './clips/list-pickers/pill-fan';
import type { WordPickerProps } from './clips/list-pickers/word-picker';
import type { PhoneSpinInProps } from './clips/phone-reveals/phone-spin-in';
import type { MagnifierCaptionProps } from './clips/text-reveals/magnifier-caption';
import type { NeonSignFlickerProps } from './clips/text-reveals/neon-sign-flicker';

export interface ClipPropsMap {
  'anniversary-kinetic': AnniversaryKineticProps;
  'arc-burst-wordmark': ArcBurstWordmarkProps;
  'botanical-save-the-date': BotanicalSaveTheDateProps;
  'chevron-mark-assemble': ChevronMarkAssembleProps;
  'coming-soon-flips': ComingSoonFlipsProps;
  'domino-words': DominoWordsProps;
  'dot-morph-wordmark': DotMorphWordmarkProps;
  'dot-ring-logo-reveal': DotRingLogoRevealProps;
  'magnifier-caption': MagnifierCaptionProps;
  'gold-monogram-invite': GoldMonogramInviteProps;
  'neon-sign-flicker': NeonSignFlickerProps;
  'text-rings': TextRingsProps;
  'pill-fan': PillFanProps;
  'phone-spin-in': PhoneSpinInProps;
  'word-picker': WordPickerProps;
}

export type ClipId = keyof ClipPropsMap;

export type ClipProps<Id extends ClipId = ClipId> = ClipPropsMap[Id];
