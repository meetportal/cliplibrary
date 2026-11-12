import { useId } from 'react';
import { Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import { CARD, hash } from './burn';
import { alpha, mixLab } from './color';
import { type Face, HEADLINE_FACE, NAME_FACE, SCRIPT_FACE } from './fonts';
import type { CardLayout, Line } from './layout';
import { type LogoBox, usableImage } from './use-logo-aspect';

export type CardLook = {
  paper: string;
  border: string;
  text: string;
  accent: string;
  flame: string;
  logo: string;
  logoBox: LogoBox | null;
  plate: string;
  showPlate: boolean;
  glow: number;
  front: number;
  heat: number;
};

const SCRIPT_TILT = -4;
const PLATE_PAD = 10;
const FULL_BOX: LogoBox = { x: 0, y: 0, w: 1, h: 1 };

const Text = ({
  line,
  face,
  color,
  tilt = 0,
  pivot = 'left bottom',
  tracking = 0,
}: {
  line: Line;
  face: Face;
  color: string;
  tilt?: number;
  pivot?: string;
  tracking?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: line.left,
      top: line.top,
      fontFamily: face.family,
      fontWeight: face.weight,
      fontSize: line.size,
      lineHeight: 1,
      letterSpacing: `${tracking}em`,
      color,
      whiteSpace: 'nowrap',
      transform: tilt === 0 ? undefined : `rotate(${tilt}deg)`,
      transformOrigin: pivot,
    }}
  >
    {line.text}
  </div>
);

const BLOTCHES = Array.from({ length: 46 }, (_, index) => ({
  key: index,
  x: hash(index * 3.7) * CARD.width,
  y: hash(index * 5.3 + 1) * CARD.height,
  r: 26 + 70 * hash(index * 7.1 + 2),
  stretch: 0.6 + 0.8 * hash(index * 2.3 + 3),
  strength: 0.05 + 0.07 * hash(index * 1.9 + 4),
}));

const Grain = ({ paper }: { paper: string }) => {
  const id = useId().replace(/:/g, '');
  const shade = mixLab(paper, '#6d6250', 0.5);
  return (
    <svg
      aria-hidden="true"
      width={CARD.width}
      height={CARD.height}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <defs>
        <radialGradient id={`${id}-blotch`}>
          <stop offset={0} stopColor={shade} stopOpacity={1} />
          <stop offset={1} stopColor={shade} stopOpacity={0} />
        </radialGradient>
      </defs>
      {BLOTCHES.map((blotch) => (
        <ellipse
          key={blotch.key}
          cx={blotch.x}
          cy={blotch.y}
          rx={blotch.r}
          ry={blotch.r * blotch.stretch}
          fill={`url(#${id}-blotch)`}
          opacity={blotch.strength}
        />
      ))}
    </svg>
  );
};

const Heat = ({ look }: { look: CardLook }) => {
  const id = useId().replace(/:/g, '');
  const strength = 0.42 * look.glow * look.heat;
  if (look.glow <= 0) {
    return null;
  }
  const warm = mixLab(look.flame, '#ffb070', 0.4);
  return (
    <svg
      aria-hidden="true"
      width={CARD.width}
      height={CARD.height}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={look.front - 300}
          y1={0}
          x2={look.front}
          y2={0}
        >
          <stop offset={0} stopColor={warm} stopOpacity={0} />
          <stop offset={0.6} stopColor={warm} stopOpacity={strength * 0.35} />
          <stop offset={1} stopColor={warm} stopOpacity={strength} />
        </linearGradient>
      </defs>
      <rect width={CARD.width} height={CARD.height} fill={`url(#${id})`} />
    </svg>
  );
};

export const Card = ({
  layout,
  look,
  clip,
}: {
  layout: CardLayout;
  look: CardLook;
  clip: string;
}) => {
  const { logo } = layout;
  const showLogo = logo !== null && usableImage(look.logo);
  const box = look.logoBox ?? FULL_BOX;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: CARD.width,
        height: CARD.height,
        backgroundColor: look.paper,
        clipPath: clip,
        overflow: 'hidden',
      }}
    >
      <Grain paper={look.paper} />
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          width: CARD.width - 40,
          height: CARD.height - 40,
          border: `2px solid ${alpha(look.border, 0.9)}`,
          boxSizing: 'border-box',
        }}
      />
      <Text line={layout.intro} face={SCRIPT_FACE} color={look.accent} tilt={SCRIPT_TILT} />
      <Text line={layout.headline} face={HEADLINE_FACE} color={look.text} />
      <svg
        aria-hidden="true"
        width={CARD.width}
        height={CARD.height}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <path
          d={`M ${layout.underline.x1} ${layout.underline.y + 3} Q ${(layout.underline.x1 + layout.underline.x2) / 2} ${layout.underline.y - 5} ${layout.underline.x2} ${layout.underline.y - 3}`}
          stroke={look.accent}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <Text
        line={layout.accent}
        face={SCRIPT_FACE}
        color={look.accent}
        tilt={SCRIPT_TILT}
        pivot="right top"
      />
      {showLogo ? (
        <>
          {look.showPlate ? (
            <div
              style={{
                position: 'absolute',
                left: logo.left - PLATE_PAD,
                top: logo.top - PLATE_PAD,
                width: logo.width + PLATE_PAD * 2,
                height: logo.height + PLATE_PAD * 2,
                borderRadius: 14,
                backgroundColor: look.plate,
              }}
            />
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: logo.left,
              top: logo.top,
              width: logo.width,
              height: logo.height,
              overflow: 'hidden',
            }}
          >
            <Img
              src={resolveCustom(look.logo)}
              style={{
                position: 'absolute',
                left: (-box.x * logo.width) / box.w,
                top: (-box.y * logo.height) / box.h,
                width: logo.width / box.w,
                height: logo.height / box.h,
              }}
            />
          </div>
        </>
      ) : null}
      <Text line={layout.name} face={NAME_FACE} color={look.text} tracking={layout.name.tracking} />
      <Heat look={look} />
    </div>
  );
};
