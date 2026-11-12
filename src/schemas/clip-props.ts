import type { BatteryChargeSuccessProps } from './clips/ad-reveals/battery-charge-success';
import type { BillboardReaderProps } from './clips/ad-reveals/billboard-reader';
import type { BurningPaperRevealProps } from './clips/ad-reveals/burning-paper-reveal';
import type { AppIconRevealProps } from './clips/brand/app-icon-reveal';
import type { ArcBurstWordmarkProps } from './clips/brand/arc-burst-wordmark';
import type { BrandRevealProps } from './clips/brand/brand-reveal';
import type { ChevronMarkAssembleProps } from './clips/brand/chevron-mark-assemble';
import type { DotMorphWordmarkProps } from './clips/brand/dot-morph-wordmark';
import type { DotRingLogoRevealProps } from './clips/brand/dot-ring-logo-reveal';
import type { ChalkBadgeProps } from './clips/hand-drawn/chalk-badge';
import type { ChalkBadgeGridProps } from './clips/hand-drawn/chalk-badge-grid';
import type { ArchSaveTheDateProps } from './clips/invitations/arch-save-the-date';
import type { BotanicalSaveTheDateProps } from './clips/invitations/botanical-save-the-date';
import type { GoldMonogramInviteProps } from './clips/invitations/gold-monogram-invite';
import type { AnniversaryKineticProps } from './clips/kinetic-type/anniversary-kinetic';
import type { BrandingIsTickerProps } from './clips/kinetic-type/branding-is-ticker';
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
  'branding-is-ticker': BrandingIsTickerProps;
  'app-icon-reveal': AppIconRevealProps;
  'arc-burst-wordmark': ArcBurstWordmarkProps;
  'arch-save-the-date': ArchSaveTheDateProps;
  'battery-charge-success': BatteryChargeSuccessProps;
  'billboard-reader': BillboardReaderProps;
  'burning-paper-reveal': BurningPaperRevealProps;
  'brand-reveal': BrandRevealProps;
  'botanical-save-the-date': BotanicalSaveTheDateProps;
  'chalk-badge': ChalkBadgeProps;
  'chalk-badge-grid': ChalkBadgeGridProps;
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
