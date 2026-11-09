import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { PhoneSpinInProps } from '@/schemas';
import { contrastRatio } from './contrast';
import type { FittedText } from './fit-text';
import type { TypeFace } from './fonts';
import type { Reveal } from './reveal';
import type { LogoState } from './use-logo';

export type LogoSize = { width: number; height: number };

const LOGO_STRETCH = 0.65;

export const logoSize = (logo: LogoState, side: number, maxWidth: number): LogoSize | null => {
  if (logo === null) {
    return null;
  }
  const wide = side * logo.aspect ** LOGO_STRETCH;
  const width = Math.min(wide, maxWidth, side * 1.4 * logo.aspect);
  return { width, height: width / logo.aspect };
};

export const LogoMark = ({
  logo,
  size,
  box,
  plateColor,
  style,
}: {
  logo: LogoState;
  size: LogoSize | null;
  box: PhoneSpinInProps['logoBox'];
  plateColor: string;
  style: Reveal;
}) => {
  if (logo === null || size === null) {
    return null;
  }
  const padding = box.plate ? box.padding : 0;
  const outer = Math.min(size.width, size.height) + padding * 2;
  return (
    <div
      style={{
        ...style,
        padding,
        borderRadius: box.plate ? (box.roundness / 100) * (outer / 2) : 0,
        backgroundColor: box.plate ? plateColor : 'transparent',
      }}
    >
      <Img
        src={logo.src}
        style={{ display: 'block', width: size.width, height: size.height, objectFit: 'contain' }}
      />
    </div>
  );
};

export const HeadlineLines = ({
  fitted,
  face,
  color,
  styles,
}: {
  fitted: FittedText;
  face: TypeFace;
  color: string;
  styles: Reveal[];
}) => (
  <div
    style={{
      fontFamily: face.family,
      fontWeight: face.weight,
      fontSize: fitted.size,
      letterSpacing: `${face.tracking}em`,
      lineHeight: 1.06,
      color,
      whiteSpace: 'nowrap',
    }}
  >
    {fitted.lines.map((line, index) => (
      <div key={`${index}:${line}`} style={styles[index]}>
        {line}
      </div>
    ))}
  </div>
);

const onColor = (fill: string) =>
  contrastRatio(fill, '#ffffff') >= contrastRatio(fill, '#111111') ? '#ffffff' : '#111111';

const UNDERLINE_CONTRAST = 1.5;

const channel = (hex: string, at: number) => Number.parseInt(hex.slice(at, at + 2), 16);

const mixHex = (from: string, to: string, amount: number) =>
  `#${[1, 3, 5]
    .map((at) =>
      Math.round(channel(from, at) + (channel(to, at) - channel(from, at)) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

export const LINK_DECOR = { arrow: 2.5, pill: 2.2, underline: 0 } as const;

export const WebsiteLink = ({
  text,
  size,
  face,
  look,
  colors,
  style,
}: {
  text: string;
  size: number;
  face: TypeFace;
  look: PhoneSpinInProps['type']['websiteStyle'];
  colors: PhoneSpinInProps['colors'];
  style: Reveal;
}) => {
  const type: CSSProperties = {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontSize: size,
    letterSpacing: `${face.tracking}em`,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  };
  if (look === 'pill') {
    return (
      <div
        style={{
          ...style,
          ...type,
          color: onColor(colors.primary),
          backgroundColor: colors.primary,
          borderRadius: size * 2,
          padding: `${Math.round(size * 0.5)}px ${Math.round(size * 1.1)}px`,
        }}
      >
        {text}
      </div>
    );
  }
  if (look === 'underline') {
    const bar =
      contrastRatio(colors.primary, colors.background) >= UNDERLINE_CONTRAST
        ? colors.primary
        : mixHex(colors.primary, colors.website, 0.55);
    return (
      <div style={{ ...style, ...type, color: colors.website }}>
        {text}
        <div
          style={{
            height: Math.max(3, Math.round(size * 0.14)),
            marginTop: Math.round(size * 0.28),
            backgroundColor: bar,
            borderRadius: size,
          }}
        />
      </div>
    );
  }
  const circle = Math.round(size * 1.9);
  const stroke = onColor(colors.primary);
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', gap: Math.round(size * 0.6) }}>
      <svg width={circle} height={circle} viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="19" cy="19" r="19" fill={colors.primary} />
        <path
          d="M12 19h13M19.5 13l6 6-6 6"
          fill="none"
          stroke={stroke}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ ...type, color: colors.website }}>{text}</div>
    </div>
  );
};
