import type { ReactNode } from 'react';
import type { TechStackIcon } from '@/schemas';
import type { Faces } from './fonts';
import type { PillBox } from './layout';
import { type PillColors, withAlpha } from './palette';

type PillProps = {
  box: PillBox;
  title: string;
  detail: string;
  colors: PillColors;
  faces: Faces;
  icon: TechStackIcon;
  rim: number;
  shadow: number;
  shadowColor: string;
  lead?: ReactNode;
};

const Glyph = ({ icon, size, color }: { icon: TechStackIcon; size: number; color: string }) => {
  if (icon === 'none') {
    return null;
  }
  const half = size / 2;
  const stroke = Math.max(1.5, size * 0.15);
  const arm = half - stroke / 2;
  return (
    <svg
      width={size}
      height={size}
      style={{ flexShrink: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      {icon === 'dot' ? (
        <circle cx={half} cy={half} r={size * 0.3} fill={color} />
      ) : (
        [90, 30, 150].map((angle) => {
          const radians = (angle * Math.PI) / 180;
          const dx = Math.cos(radians) * arm;
          const dy = Math.sin(radians) * arm;
          return (
            <line
              key={angle}
              x1={half - dx}
              y1={half - dy}
              x2={half + dx}
              y2={half + dy}
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          );
        })
      )}
    </svg>
  );
};

export const Pill = ({
  box,
  title,
  detail,
  colors,
  faces,
  icon,
  rim,
  shadow,
  shadowColor,
  lead,
}: PillProps) => {
  const border = Math.max(1.5, box.height * 0.022);
  const hasDetail = detail.trim() !== '';
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -box.height / 2,
        width: box.width,
        height: box.height,
        boxSizing: 'border-box',
        borderRadius: box.height / 2,
        border: `${border.toFixed(2)}px solid ${withAlpha(colors.rim, rim)}`,
        backgroundColor: colors.fill,
        backgroundImage: `linear-gradient(180deg, ${withAlpha('#ffffff', rim * 0.22)} 0%, ${withAlpha('#ffffff', 0)} 55%)`,
        boxShadow: `0 ${(box.height * 0.14).toFixed(1)}px ${(box.height * 0.42).toFixed(1)}px ${withAlpha(shadowColor, shadow * 0.32)}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: box.padLeft,
        gap: box.iconGap,
        color: colors.text,
        whiteSpace: 'nowrap',
      }}
    >
      {lead ?? <Glyph icon={icon} size={box.icon} color={colors.text} />}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: faces.title.family,
            fontWeight: faces.title.weight,
            fontSize: box.titleSize,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          {title.trim()}
        </div>
        {hasDetail ? (
          <div
            style={{
              fontFamily: faces.detail.family,
              fontWeight: faces.detail.weight,
              fontSize: box.detailSize,
              lineHeight: 1.2,
            }}
          >
            {detail.trim()}
          </div>
        ) : null}
      </div>
    </div>
  );
};
