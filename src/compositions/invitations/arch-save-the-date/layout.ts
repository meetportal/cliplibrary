import type { ArchSaveTheDateProps } from '@/schemas';
import { balancedSplit, type Face, type Faces, fitSize, type Measurer } from './fonts';

const TEXT_WIDTH = 640;
const TITLE_WIDTH = 560;
const CAPS_TRACKING = 0.06;
const NAME_TRACKING = 0.04;

export type Row = {
  key: string;
  lines: string[];
  font: Face;
  size: number;
  y: number;
  lineHeight: number;
  tracking: number;
  caps: boolean;
  color: 'script' | 'text';
};

type Title = {
  top: { text: string; size: number; y: number };
  joiner: { text: string; size: number; y: number };
  bottom: { text: string; size: number; y: number };
  bottomY: number;
};

export type Layout = { title: Title; rows: Row[] };

const upper = (text: string) => text.toUpperCase();

const fitCaps = (measure: Measurer, text: string, font: Face, size: number, tracking: number) =>
  fitSize(measure, upper(text), font, size, tracking, TEXT_WIDTH);

const nameLines = (props: ArchSaveTheDateProps, measure: Measurer, font: Face) => {
  const joiner = props.words.joiner.trim();
  const one = [props.partnerOne, joiner, props.partnerTwo].filter((part) => part !== '').join(' ');
  const single = fitCaps(measure, one, font, props.lettering.nameSize, NAME_TRACKING);
  if (single >= props.lettering.nameSize * 0.8 || props.partnerTwo.trim() === '') {
    return { lines: [one], size: single };
  }
  const first = [props.partnerOne, joiner].filter((part) => part !== '').join(' ');
  const lines = [first, props.partnerTwo];
  const size = Math.min(
    ...lines.map((line) => fitCaps(measure, line, font, props.lettering.nameSize, NAME_TRACKING)),
  );
  return { lines, size };
};

const venueLines = (props: ArchSaveTheDateProps, measure: Measurer, font: Face) => {
  const base = props.lettering.detailSize;
  const single = fitCaps(measure, props.venue, font, base, CAPS_TRACKING);
  if (single >= base * 0.86) {
    return { lines: [props.venue], size: single };
  }
  const lines = balancedSplit(props.venue);
  const size = Math.min(...lines.map((line) => fitCaps(measure, line, font, base, CAPS_TRACKING)));
  return { lines, size };
};

export const buildLayout = (
  props: ArchSaveTheDateProps,
  faces: Faces,
  measure: Measurer,
): Layout => {
  const { lettering, words } = props;
  const titleFit = (text: string, size: number) =>
    fitSize(measure, text, faces.script, size, 0, TITLE_WIDTH);
  const topSize = titleFit(words.saveTop, lettering.titleSize);
  const bottomSize = titleFit(words.saveBottom, lettering.titleSize);
  const joinerSize = titleFit(words.saveJoiner, lettering.titleSize * 0.34);
  const topY = lettering.top;
  const joinerY = topY + topSize * 0.86;
  const bottomY = joinerY + joinerSize * 0.62;
  const title: Title = {
    top: { text: words.saveTop, size: topSize, y: topY },
    joiner: { text: words.saveJoiner, size: joinerSize, y: joinerY },
    bottom: { text: words.saveBottom, size: bottomSize, y: bottomY },
    bottomY: bottomY + bottomSize * 1.02,
  };
  const rows: Row[] = [];
  let cursor = title.bottomY + lettering.detailSize * 1.5;
  const push = (row: Omit<Row, 'y'>, gapAfter: number) => {
    if (row.lines.every((line) => line.trim() === '')) {
      return;
    }
    rows.push({ ...row, y: cursor });
    cursor += row.lines.length * row.size * row.lineHeight + gapAfter;
  };
  const detail = lettering.detailSize;
  push(
    {
      key: 'intro',
      lines: [words.intro],
      font: faces.caps,
      size: fitCaps(measure, words.intro, faces.caps, detail * 0.92, CAPS_TRACKING),
      lineHeight: 1.2,
      tracking: CAPS_TRACKING,
      caps: true,
      color: 'text',
    },
    detail * 0.35,
  );
  const names = nameLines(props, measure, faces.caps);
  push(
    {
      key: 'names',
      lines: names.lines,
      font: faces.caps,
      size: names.size,
      lineHeight: 1.12,
      tracking: NAME_TRACKING,
      caps: true,
      color: 'script',
    },
    detail * 0.45,
  );
  push(
    {
      key: 'date',
      lines: [props.eventDate],
      font: faces.caps,
      size: fitSize(measure, props.eventDate, faces.caps, detail, 0.02, TEXT_WIDTH),
      lineHeight: 1.3,
      tracking: 0.02,
      caps: false,
      color: 'text',
    },
    detail * 0.05,
  );
  const venue = venueLines(props, measure, faces.caps);
  push(
    {
      key: 'venue',
      lines: venue.lines,
      font: faces.caps,
      size: venue.size,
      lineHeight: 1.3,
      tracking: CAPS_TRACKING,
      caps: true,
      color: 'text',
    },
    detail * 1.1,
  );
  push(
    {
      key: 'signOff',
      lines: [words.signOff],
      font: faces.caps,
      size: fitCaps(measure, words.signOff, faces.caps, detail * 0.86, CAPS_TRACKING),
      lineHeight: 1.2,
      tracking: CAPS_TRACKING,
      caps: true,
      color: 'text',
    },
    detail * 0.05,
  );
  push(
    {
      key: 'host',
      lines: [props.host],
      font: faces.script,
      size: fitSize(measure, props.host, faces.script, lettering.hostSize, 0, TEXT_WIDTH),
      lineHeight: 1.25,
      tracking: 0,
      caps: false,
      color: 'script',
    },
    0,
  );
  return { title, rows };
};
