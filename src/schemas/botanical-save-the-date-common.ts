import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from './control';
import { defineControls } from './control-layout';
import type { ClipMeta, ClipVariant } from './registry';

export const BOTANICAL_DISPLAY_FONTS = ['bodoni-moda', 'playfair-display', 'cormorant'] as const;

export type BotanicalDisplayFont = (typeof BOTANICAL_DISPLAY_FONTS)[number];

export const BOTANICAL_CAPS_FONTS = ['cinzel', 'marcellus', 'cormorant'] as const;

export type BotanicalCapsFont = (typeof BOTANICAL_CAPS_FONTS)[number];

export const BOTANICAL_SCRIPT_FONTS = ['great-vibes', 'pinyon-script', 'parisienne'] as const;

export type BotanicalScriptFont = (typeof BOTANICAL_SCRIPT_FONTS)[number];

export const BOTANICAL_FRAMES = ['none', 'arch', 'hexagon'] as const;

export const BOTANICAL_REVEALS = ['soft-type', 'block-cursor'] as const;

const frameNumber = () => zSlider({ min: 0, max: 360 });

export const botanicalSaveTheDateSchema = z.object({
  partnerOne: z.string(),
  partnerTwo: z.string(),
  logo: zImage(),
  verse: zMultiline(),
  date: z.string(),
  venue: z.string(),
  words: z.object({
    saveTop: z.string(),
    saveJoiner: z.string(),
    saveBottom: z.string(),
    intro: z.string(),
    joiner: z.string(),
  }),
  colors: z.object({
    leaf: zColor(),
    script: zColor(),
    ink: zColor(),
    background: zColor(),
    surface: zColor(),
    petal: zColor(),
    heart: zColor(),
    gold: zColor(),
    ghost: zColor(),
    line: zColor(),
  }),
  showBackground: z.boolean(),
  backdrop: z.object({
    frame: z.enum(BOTANICAL_FRAMES),
    wash: z.boolean(),
    washOpacity: zSlider({ min: 0, max: 1, step: 0.01 }),
    lineWidth: zSlider({ min: 1, max: 10, step: 0.5 }),
  }),
  florals: z.object({
    size: zSlider({ min: 0.6, max: 1.3, step: 0.01 }),
    sway: zSlider({ min: 0, max: 6, step: 0.1 }),
    swayPeriod: zSlider({ min: 60, max: 400 }),
    slide: zSlider({ min: 0, max: 500 }),
    enterFrames: zSlider({ min: 8, max: 60 }),
    stagger: zSlider({ min: 0, max: 40 }),
    goldLines: z.boolean(),
  }),
  lettering: z.object({
    displayFont: z.enum(BOTANICAL_DISPLAY_FONTS),
    capsFont: z.enum(BOTANICAL_CAPS_FONTS),
    scriptFont: z.enum(BOTANICAL_SCRIPT_FONTS),
    reveal: z.enum(BOTANICAL_REVEALS),
    nameSize: zSlider({ min: 60, max: 180 }),
    saveSize: zSlider({ min: 80, max: 220 }),
    capsSize: zSlider({ min: 22, max: 60 }),
    scriptSize: zSlider({ min: 40, max: 130 }),
    tracking: zSlider({ min: 0, max: 0.3, step: 0.01 }),
    top: zSlider({ min: 380, max: 800, step: 2 }),
    logoHeight: zSlider({ min: 50, max: 200, step: 2 }),
  }),
  timing: z.object({
    verseAt: frameNumber(),
    eraseAt: frameNumber(),
    saveAt: frameNumber(),
    dateAt: frameNumber(),
    venueAt: frameNumber(),
    logoAt: frameNumber(),
    typeFrames: zSlider({ min: 8, max: 90 }),
    lineStagger: zSlider({ min: 0, max: 30 }),
    eraseFrames: zSlider({ min: 6, max: 40 }),
  }),
});

export type BotanicalSaveTheDateProps = z.infer<typeof botanicalSaveTheDateSchema>;

export const botanicalSaveTheDateMeta = (
  variant: ClipVariant,
  extra: Pick<ClipMeta, 'id' | 'title' | 'description' | 'source' | 'posterFrame'>,
): ClipMeta => ({
  ...extra,
  category: 'invitations',
  tags: ['wedding', 'invitation', 'floral', 'typing', 'text'],
  theme: 'light',
  durationInFrames: 390,
  fps: 30,
  width: 1080,
  height: 1920,
  batch: '2026-11-09-archive-classic-clips',
  variantOf: 'botanical-save-the-date',
  variant,
});

const FRAMES = 'Frame number, at 30 per second';

export const botanicalSaveTheDateControls = defineControls<BotanicalSaveTheDateProps>({
  sections: [
    {
      title: 'Couple',
      fields: [
        {
          path: 'partnerOne',
          label: 'First name',
          hint: 'First line of names; both lines shrink together to fit',
        },
        {
          path: 'partnerTwo',
          label: 'Second name',
          hint: 'Second line, after the script joiner',
        },
        {
          path: 'logo',
          label: 'Crest or logo',
          hint: 'Wide, square or round; it fits a small box at the foot of the card',
        },
      ],
      more: [
        { path: 'words.intro', label: 'Line above the names', hint: 'Leave empty to hide it' },
        { path: 'words.joiner', label: 'Joiner', hint: 'Script word before the second name' },
        {
          path: 'lettering.nameSize',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        {
          path: 'lettering.logoHeight',
          label: 'Crest height',
          hint: 'Tallest the crest may be, in pixels; wide logos get less height',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.leaf',
          label: 'Primary color',
          hint: 'The watercolour leaves and stems of both sprays',
        },
        {
          path: 'colors.script',
          label: 'Accent color',
          hint: 'The script words: the verse script lines, "the" and the joiner',
        },
        {
          path: 'colors.ink',
          label: 'Text color',
          hint: 'Names, SAVE the DATE, the date, the capitals and the cursor',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The blush page' },
      ],
      more: [
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The watercolour wash, the arch card or the panel inside the hexagon',
        },
        { path: 'colors.petal', label: 'Petal color', hint: 'Outer petals of the blossoms' },
        { path: 'colors.heart', label: 'Blossom heart color', hint: 'Centres of the blossoms' },
        {
          path: 'colors.gold',
          label: 'Gold color',
          hint: 'Gold line leaves, flecks and the streak in the wash',
        },
        { path: 'colors.ghost', label: 'Shadow leaf color', hint: 'Pale leaves behind each spray' },
        { path: 'colors.line', label: 'Frame line color', hint: 'Arch border or hexagon line' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the card over another clip',
        },
      ],
    },
    {
      title: 'Message',
      fields: [
        {
          path: 'verse',
          label: 'Verse',
          hint: 'Types in, then erases for SAVE the DATE. Lines alternate capitals and script; a long line splits in two',
        },
        { path: 'date', label: 'Date', hint: 'Under SAVE the DATE, in capitals' },
        { path: 'venue', label: 'Venue', hint: 'Under the names; wraps to two lines' },
      ],
      more: [
        { path: 'words.saveTop', label: 'Top word', hint: 'Bold word above the script' },
        { path: 'words.saveJoiner', label: 'Script word', hint: 'Small script between the two' },
        { path: 'words.saveBottom', label: 'Bottom word', hint: 'Bold word below the script' },
        {
          path: 'lettering.saveSize',
          label: 'SAVE the DATE size',
          hint: 'Largest size in pixels; long words shrink',
        },
        { path: 'timing.verseAt', label: 'Verse starts', hint: FRAMES },
        { path: 'timing.eraseAt', label: 'Verse erases', hint: FRAMES },
        { path: 'timing.saveAt', label: 'SAVE the DATE appears', hint: FRAMES },
        { path: 'timing.dateAt', label: 'Date types', hint: FRAMES },
        { path: 'timing.venueAt', label: 'Venue types', hint: FRAMES },
        { path: 'timing.logoAt', label: 'Crest appears', hint: FRAMES },
        { path: 'timing.typeFrames', label: 'Typing length', hint: 'Frames to type one line' },
        { path: 'timing.lineStagger', label: 'Line stagger', hint: 'Frames between verse lines' },
        { path: 'timing.eraseFrames', label: 'Erase length', hint: 'In frames' },
      ],
    },
    {
      title: 'Sprays and card',
      fields: [
        {
          path: 'florals.size',
          label: 'Spray size',
          hint: 'Scale of both corner sprays',
        },
        {
          path: 'backdrop.frame',
          label: 'Card frame',
          hint: 'None, a cream arch card or a gold hexagon that draws on',
        },
      ],
      more: [
        { path: 'florals.sway', label: 'Sway', hint: 'In degrees either side; 0 holds still' },
        { path: 'florals.swayPeriod', label: 'Sway period', hint: 'Frames per full sway' },
        {
          path: 'florals.slide',
          label: 'Fly-in distance',
          hint: 'Pixels each spray travels from its corner',
        },
        { path: 'florals.enterFrames', label: 'Fly-in length', hint: 'In frames' },
        {
          path: 'florals.stagger',
          label: 'Second spray delay',
          hint: 'Frames between the top and bottom sprays',
        },
        {
          path: 'florals.goldLines',
          label: 'Gold line leaves',
          hint: 'Gold outline leaves and flecks inside each spray',
        },
        { path: 'backdrop.wash', label: 'Watercolour wash', hint: 'Peach ribbon behind the text' },
        { path: 'backdrop.washOpacity', label: 'Wash strength', hint: '0 to 1' },
        { path: 'backdrop.lineWidth', label: 'Frame line width', hint: 'In pixels' },
      ],
    },
    {
      title: 'Lettering',
      fields: [
        { path: 'lettering.displayFont', label: 'Names font', hint: 'Also SAVE the DATE' },
        { path: 'lettering.scriptFont', label: 'Script font' },
      ],
      more: [
        {
          path: 'lettering.capsFont',
          label: 'Capitals font',
          hint: 'Verse capitals, line above the names, date and venue',
        },
        {
          path: 'lettering.reveal',
          label: 'Typing style',
          hint: 'How the verse, date and venue type in: Soft type fades each letter in; Block cursor sweeps a dark block over them',
        },
        { path: 'lettering.capsSize', label: 'Capitals size', hint: 'In pixels' },
        { path: 'lettering.scriptSize', label: 'Script size', hint: 'Verse script, in pixels' },
        { path: 'lettering.tracking', label: 'Capitals spacing', hint: 'Share of the size' },
        {
          path: 'lettering.top',
          label: 'Text position',
          hint: 'Pixels from the top to SAVE the DATE',
        },
      ],
    },
  ],
});
