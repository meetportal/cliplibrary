import type { CSSProperties } from 'react';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { FONT_VARIABLES } from './fonts';

const mix = (color: string, other: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${amount}%, ${other})`;

export const emeraldRoseScope = ({ colors }: EmeraldRoseContent) => ({
  className: FONT_VARIABLES,
  style: {
    '--er-primary': colors.primary,
    '--er-secondary': colors.secondary,
    '--er-accent': colors.accent,
    '--er-bg': colors.background,
    '--er-text': colors.text,
    '--er-paper': mix(colors.background, colors.accent, 90),
    '--er-muted': mix(colors.text, colors.background, 70),
    '--er-leaf': mix(colors.primary, 'white', 85),
    '--er-leaf-vein': mix(colors.primary, 'black', 70),
    '--er-ivory-rose': mix(colors.background, colors.accent, 72),
    '--er-ivory-ink': mix(colors.accent, 'black', 70),
    '--er-rose-ink': mix(colors.secondary, 'black', 55),
    '--er-seal-light': mix(colors.secondary, 'white', 72),
    '--er-seal-ink': mix(colors.secondary, 'black', 45),
    '--er-primary-deep': mix(colors.primary, 'black', 75),
  } as CSSProperties,
});
