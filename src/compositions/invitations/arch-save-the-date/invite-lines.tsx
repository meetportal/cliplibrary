import type { CSSProperties } from 'react';
import type { ArchSaveTheDateProps } from '@/schemas';
import { FadeIn } from '../../promo/typography';
import { inviteScriptFonts, inviteSerifFonts } from '../fonts';

type Copy = ArchSaveTheDateProps['copy'];
type Type = ArchSaveTheDateProps['type'];

interface Line {
  key: keyof Copy;
  group: number;
  style: CSSProperties;
  size: number;
}

const linesFor = (type: Type): Line[] => {
  const script = inviteScriptFonts[type.scriptFont];
  const serif = inviteSerifFonts[type.serifFont];
  const scriptLine = (size: number, color: string): CSSProperties => ({
    fontFamily: script,
    fontSize: size,
    lineHeight: 1.12,
    fontWeight: 400,
    color,
  });
  const serifLine = (
    size: number,
    color: string,
    tracking: number,
    weight: number,
  ): CSSProperties => ({
    fontFamily: serif,
    fontSize: size,
    lineHeight: 1.12,
    fontWeight: weight,
    letterSpacing: `${tracking}em`,
    color,
  });
  return [
    {
      key: 'title',
      group: 0,
      size: type.titleSize,
      style: scriptLine(type.titleSize, type.scriptColor),
    },
    {
      key: 'intro',
      group: 1,
      size: type.introSize,
      style: serifLine(type.introSize, type.detailColor, 0.32, 500),
    },
    {
      key: 'names',
      group: 1,
      size: type.namesSize,
      style: serifLine(type.namesSize, type.inkColor, 0.01, 500),
    },
    {
      key: 'date',
      group: 2,
      size: type.dateSize,
      style: serifLine(type.dateSize, type.detailColor, 0.14, 600),
    },
    {
      key: 'venue',
      group: 2,
      size: type.venueSize,
      style: serifLine(type.venueSize, type.inkColor, 0.04, 500),
    },
    {
      key: 'closing',
      group: 3,
      size: type.closingSize,
      style: scriptLine(type.closingSize, type.detailColor),
    },
    {
      key: 'family',
      group: 3,
      size: type.familySize,
      style: scriptLine(type.familySize, type.scriptColor),
    },
  ];
};

const Ornament = ({ color }: { color: string }) => (
  <svg
    aria-hidden="true"
    width={240}
    height={18}
    viewBox="0 0 240 18"
    style={{ display: 'block', margin: '0 auto 10px' }}
  >
    <line x1={8} y1={9} x2={100} y2={9} stroke={color} strokeWidth={1.5} />
    <line x1={140} y1={9} x2={232} y2={9} stroke={color} strokeWidth={1.5} />
    <path d="M 120 1 L 128 9 L 120 17 L 112 9 Z" fill={color} />
    <circle cx={104} cy={9} r={2.5} fill={color} />
    <circle cx={136} cy={9} r={2.5} fill={color} />
  </svg>
);

export const InviteLines = ({
  copy,
  type,
  timing,
}: {
  copy: Copy;
  type: Type;
  timing: ArchSaveTheDateProps['timing'];
}) => {
  const visible = linesFor(type).filter((line) => copy[line.key].trim().length > 0);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: type.centerY - 1200,
        height: 2400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {visible.map((line, index) => {
        const previous = visible[index - 1];
        const gap =
          previous === undefined
            ? 0
            : previous.group === line.group
              ? type.gap
              : Math.round(type.gap * 2.5);
        return (
          <FadeIn
            key={line.key}
            start={timing.textAt + index * timing.stagger}
            distance={Math.round(Math.min(40, Math.max(18, line.size * 0.3)))}
            style={{ marginTop: gap, width: type.width, textAlign: 'center' }}
          >
            {line.key === 'date' && type.ornament ? <Ornament color={type.detailColor} /> : null}
            <div style={{ ...line.style, whiteSpace: 'pre-line' }}>{copy[line.key]}</div>
          </FadeIn>
        );
      })}
    </div>
  );
};
