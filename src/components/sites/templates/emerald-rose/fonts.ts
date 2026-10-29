import { Cinzel, Cormorant_Garamond, Pinyon_Script } from 'next/font/google';

const script = Pinyon_Script({ weight: '400', subsets: ['latin'], variable: '--font-er-script' });

const serif = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-er-serif',
});

const caps = Cinzel({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-er-caps' });

export const FONT_VARIABLES = `${script.variable} ${serif.variable} ${caps.variable}`;

export const SCRIPT = 'font-[family-name:var(--font-er-script)]';
export const SERIF = 'font-[family-name:var(--font-er-serif)]';
export const CAPS = 'font-[family-name:var(--font-er-caps)] uppercase tracking-[0.18em]';
