import type { BotanicalSaveTheDateProps } from '@/schemas';
import type { Faces } from './fonts';
import { balancedSplit, fitSize, type Measurer } from './measure';

const TEXT_WIDTH = 760;
const VERSE_WIDTH = 640;
const SAVE_WIDTH = 640;
const LOGO_WIDTH = 330;
const SAVE_LEADING = 0.84;
const SPLIT_AT = 18;
const MAX_VERSE_LINES = 4;

export const CAPS_LEADING = 1.3;
export const SCRIPT_LEADING = 1.2;
export const NAME_TRACKING = 0.04;
export const DATE_TRACKING = 0.06;
export const SAVE_TRACKING = -0.01;

type VerseLine = { text: string; kind: 'caps' | 'script'; size: number; y: number };

type Row = { text: string; size: number; y: number };

export type CardLayout = {
  verse: VerseLine[];
  save: { size: number; topY: number; bottomY: number; joinerSize: number; joinerY: number };
  date: Row;
  intro: Row;
  names: { size: number; firstY: number; secondY: number; joinerSize: number };
  venue: Row[];
  logo: { y: number; height: number; maxWidth: number };
};

const verseLines = (verse: string): string[] => {
  const typed = verse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  if (typed.length > 1) {
    return typed.slice(0, MAX_VERSE_LINES);
  }
  const single = typed[0] ?? '';
  return single.length > SPLIT_AT ? balancedSplit(single) : [single];
};

const upper = (text: string) => text.toUpperCase();

export const buildLayout = (
  props: BotanicalSaveTheDateProps,
  faces: Faces,
  measure: Measurer,
): CardLayout => {
  const { lettering, words } = props;
  const tracking = lettering.tracking;
  const lines = verseLines(props.verse);
  const kinds = lines.map((_, index) =>
    lines.length === 1 || index % 2 === 1 ? ('script' as const) : ('caps' as const),
  );
  const capsVerse = Math.min(
    ...lines.map((line, index) =>
      kinds[index] === 'caps'
        ? fitSize(
            measure,
            upper(line),
            faces.caps.body,
            lettering.capsSize * 1.3,
            tracking,
            VERSE_WIDTH,
          )
        : Number.POSITIVE_INFINITY,
    ),
  );
  const scriptVerse = Math.min(
    ...lines.map((line, index) =>
      kinds[index] === 'script'
        ? fitSize(measure, line, faces.script, lettering.scriptSize, 0, VERSE_WIDTH)
        : Number.POSITIVE_INFINITY,
    ),
  );
  const saveSize = Math.min(
    fitSize(
      measure,
      upper(words.saveTop),
      faces.display.bold,
      lettering.saveSize,
      SAVE_TRACKING,
      SAVE_WIDTH,
    ),
    fitSize(
      measure,
      upper(words.saveBottom),
      faces.display.bold,
      lettering.saveSize,
      SAVE_TRACKING,
      SAVE_WIDTH,
    ),
  );
  const top = lettering.top;
  const slot = saveSize * SAVE_LEADING * 2;
  const verseHeights = kinds.map((kind) =>
    kind === 'caps' ? capsVerse * CAPS_LEADING : scriptVerse * SCRIPT_LEADING,
  );
  const verseTotal = verseHeights.reduce((sum, height) => sum + height, 0);
  let verseY = top + slot / 2 - verseTotal / 2;
  const verse = lines.map((text, index) => {
    const kind = kinds[index] ?? 'script';
    const line = { text, kind, size: kind === 'caps' ? capsVerse : scriptVerse, y: verseY };
    verseY += verseHeights[index] ?? 0;
    return line;
  });
  const joinerSize = saveSize * 0.5;
  const save = {
    size: saveSize,
    topY: top,
    bottomY: top + saveSize * SAVE_LEADING,
    joinerSize,
    joinerY: top + saveSize * SAVE_LEADING - joinerSize * 0.66,
  };
  const dateSize = fitSize(
    measure,
    upper(props.date),
    faces.caps.strong,
    lettering.capsSize * 1.45,
    DATE_TRACKING,
    TEXT_WIDTH,
  );
  const date = { text: props.date, size: dateSize, y: top + slot + dateSize * 0.45 };
  const introSize = fitSize(
    measure,
    upper(words.intro),
    faces.caps.body,
    lettering.capsSize * 0.9,
    tracking,
    TEXT_WIDTH,
  );
  const introY = date.y + dateSize * CAPS_LEADING + 30;
  const intro = { text: words.intro, size: introSize, y: introY };
  const namesTop = words.intro.trim() === '' ? introY : introY + introSize * CAPS_LEADING + 10;
  const firstWidth = fitSize(
    measure,
    upper(props.partnerOne),
    faces.display.name,
    lettering.nameSize,
    NAME_TRACKING,
    TEXT_WIDTH,
  );
  const secondUnit =
    measure(upper(props.partnerTwo), faces.display.name, 100, NAME_TRACKING) +
    measure(`${words.joiner} `, faces.script, 90, 0);
  const nameSize = Math.min(
    firstWidth,
    secondUnit > 0 ? (TEXT_WIDTH / secondUnit) * 100 : firstWidth,
  );
  const names = {
    size: nameSize,
    firstY: namesTop,
    secondY: namesTop + nameSize * 1.08,
    joinerSize: nameSize * 0.9,
  };
  const venueTop = names.secondY + nameSize * 1.08 + 24;
  const single = fitSize(
    measure,
    upper(props.venue),
    faces.caps.body,
    lettering.capsSize,
    tracking,
    TEXT_WIDTH,
  );
  const venueLines =
    single >= lettering.capsSize * 0.8 ? [props.venue.trim()] : balancedSplit(props.venue);
  const venueSize = Math.min(
    ...venueLines.map((line) =>
      fitSize(measure, upper(line), faces.caps.body, lettering.capsSize, tracking, TEXT_WIDTH),
    ),
  );
  const venue = venueLines.map((text, index) => ({
    text,
    size: venueSize,
    y: venueTop + index * venueSize * CAPS_LEADING,
  }));
  const logoTop = venueTop + venueLines.length * venueSize * CAPS_LEADING + 26;
  return {
    verse,
    save,
    date,
    intro,
    names,
    venue,
    logo: { y: logoTop, height: lettering.logoHeight, maxWidth: LOGO_WIDTH },
  };
};
