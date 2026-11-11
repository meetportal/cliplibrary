import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import type { ClipMeta } from '../../registry';

export const BRANDING_TICKER_HEADLINE_FONTS = ['playfair', 'fraunces', 'dm-serif'] as const;

export const BRANDING_TICKER_WORD_FONTS = ['poppins', 'sora', 'outfit'] as const;

export type BrandingTickerHeadlineFont = (typeof BRANDING_TICKER_HEADLINE_FONTS)[number];

export type BrandingTickerWordFont = (typeof BRANDING_TICKER_WORD_FONTS)[number];

export const brandingIsTickerSchema = z.object({
  logo: zImage(),
  companyName: z.string(),
  headline: zMultiline(),
  words: z.array(z.string()).min(2).max(16),
  callToAction: z.string(),
  website: z.string(),
  phone: z.string(),
  colors: z.object({
    primary: zColor(),
    text: zColor(),
    background: zColor(),
    backgroundEdge: zColor(),
    surface: zColor(),
    ink: zColor(),
  }),
  showBackground: z.boolean(),
  type: z.object({
    headlineFont: z.enum(BRANDING_TICKER_HEADLINE_FONTS),
    wordFont: z.enum(BRANDING_TICKER_WORD_FONTS),
    headlineSize: zSlider({ min: 60, max: 160 }),
    wordSize: zSlider({ min: 60, max: 160 }),
  }),
  ticker: z.object({
    cycleFrames: zSlider({ min: 120, max: 330 }),
    glide: zSlider({ min: 0.05, max: 0.5, step: 0.01 }),
    dimStrength: zSlider({ min: 0.08, max: 0.6, step: 0.01 }),
    underline: zSlider({ min: 0, max: 16 }),
  }),
  layout: z.object({
    left: zSlider({ min: 60, max: 260 }),
    top: zSlider({ min: 60, max: 420 }),
    offsetY: zSlider({ min: -400, max: 400 }),
    tileSize: zSlider({ min: 90, max: 200 }),
    nameSize: zSlider({ min: 18, max: 44 }),
    lightDrift: zSlider({ min: 0, max: 200 }),
  }),
  endCard: z.object({
    logoSize: zSlider({ min: 160, max: 380 }),
    nameSize: zSlider({ min: 30, max: 80 }),
    nameCaps: z.boolean(),
    buttonSize: zSlider({ min: 28, max: 60 }),
    contactSize: zSlider({ min: 28, max: 56 }),
    sheen: z.boolean(),
  }),
  timing: z.object({
    transitionFrames: zSlider({ min: 14, max: 40 }),
    stagger: zSlider({ min: 3, max: 14 }),
  }),
});

export type BrandingIsTickerProps = z.infer<typeof brandingIsTickerSchema>;

export const brandingIsTickerDefaults: BrandingIsTickerProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  headline: 'your brand\nis',
  words: [
    'character',
    'clarity',
    'rhythm',
    'memory',
    'warmth',
    'presence',
    'signal',
    'craft',
    'belief',
    'momentum',
    'legacy',
  ],
  callToAction: 'Let’s talk',
  website: '{{Website}}',
  phone: '{{Phone}}',
  colors: {
    primary: '#ff9658',
    text: '#f4ecdf',
    background: '#29233f',
    backgroundEdge: '#13101f',
    surface: '#f4ecdf',
    ink: '#231a33',
  },
  showBackground: true,
  type: { headlineFont: 'playfair', wordFont: 'poppins', headlineSize: 100, wordSize: 104 },
  ticker: { cycleFrames: 308, glide: 0.12, dimStrength: 0.2, underline: 7 },
  layout: { left: 160, top: 170, offsetY: 0, tileSize: 132, nameSize: 26, lightDrift: 90 },
  endCard: {
    logoSize: 264,
    nameSize: 54,
    nameCaps: true,
    buttonSize: 42,
    contactSize: 42,
    sheen: true,
  },
  timing: { transitionFrames: 24, stagger: 7 },
};

export const brandingIsTickerMeta: ClipMeta = {
  id: 'branding-is-ticker',
  title: 'Branding Is Ticker',
  description:
    'A dark brand-agency teaser: "your brand is" in a cream italic serif over a ticker of bold words that glides one word at a time into an underlined accent slot, character, clarity, rhythm and on, until it comes full circle. The logo tile in the corner then grows into a cream end card with your logo, name, a gradient Let’s talk button, your website and phone.',
  theme: 'dark',
  source: 'src/compositions/scenes/kinetic-type/branding-is-ticker.tsx',
  category: 'kinetic-type',
  tags: ['kinetic', 'headline', 'text', 'marquee', 'slide', 'logo', 'cta', 'end-card', 'minimal'],
  durationInFrames: 450,
  posterFrame: 140,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-11-archive-old-clips',
};
