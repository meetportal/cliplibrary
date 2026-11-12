import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import { mixLab } from './color';

export type BackdropLook = { top: string; left: string; right: string; floor: string };

const V = '520 830';

export const Backdrop = ({ look, scale }: { look: BackdropLook; scale: number }) => {
  const id = useId().replace(/:/g, '');
  const topGlow = mixLab(look.top, '#ffffff', 0.08);
  const topDeep = mixLab(look.top, '#000000', 0.14);
  const floorLift = mixLab(look.floor, '#ffffff', 0.1);
  const floorDeep = mixLab(look.floor, '#000000', 0.12);
  const leftDeep = mixLab(look.left, look.top, 0.25);
  return (
    <AbsoluteFill style={{ backgroundColor: look.floor }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        aria-hidden="true"
        style={{ transform: `scale(${scale})`, transformOrigin: '520px 830px' }}
      >
        <defs>
          <radialGradient id={`${id}-top`} gradientUnits="userSpaceOnUse" cx={560} cy={480} r={760}>
            <stop offset={0} stopColor={topGlow} />
            <stop offset={0.55} stopColor={look.top} />
            <stop offset={1} stopColor={topDeep} />
          </radialGradient>
          <linearGradient
            id={`${id}-left`}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={980}
            x2={520}
            y2={830}
          >
            <stop offset={0} stopColor={look.left} />
            <stop offset={1} stopColor={leftDeep} />
          </linearGradient>
          <linearGradient
            id={`${id}-floor`}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={1100}
            x2={0}
            y2={1920}
          >
            <stop offset={0} stopColor={floorLift} />
            <stop offset={1} stopColor={floorDeep} />
          </linearGradient>
        </defs>
        <polygon points={`0 0 1080 0 1080 500 ${V} 0 470`} fill={`url(#${id}-top)`} />
        <polygon points={`0 470 ${V} 0 1430`} fill={`url(#${id}-left)`} />
        <polygon points={`1080 500 ${V} 1080 1180`} fill={look.right} />
        <polygon points={`0 1430 ${V} 1080 1180 1080 1920 0 1920`} fill={`url(#${id}-floor)`} />
      </svg>
    </AbsoluteFill>
  );
};
