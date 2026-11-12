import { useId } from 'react';
import { CARD } from './burn';
import { mixLab } from './color';
import {
  ARM_PATH,
  band,
  bandAxis,
  CUFF_FROM,
  CUFF_TO,
  INDEX_EDGE,
  KNUCKLE_LINES,
  PALM_PATH,
  SLEEVE_FROM,
  THUMB,
} from './hand-shape';
import { FILTER_REGION } from './overlay';

export type HandLook = { skin: string; cuff: string; sleeve: string };

const tones = (look: HandLook) => ({
  light: mixLab(look.skin, '#fff4e8', 0.34),
  shade: mixLab(look.skin, '#5a2812', 0.34),
  deep: mixLab(look.skin, '#3a160a', 0.45),
  nail: mixLab(look.skin, '#fff8f0', 0.6),
  palm: mixLab(look.skin, mixLab(look.skin, '#5a2812', 0.34), 0.41),
  cuffLight: mixLab(look.cuff, '#fff1c4', 0.5),
  cuffShade: mixLab(look.cuff, '#3a2608', 0.4),
  sleeveShade: mixLab(look.sleeve, '#2c2416', 0.22),
});

const Linear = ({
  id,
  from,
  to,
  stops,
}: {
  id: string;
  from: readonly [number, number];
  to: readonly [number, number];
  stops: readonly (readonly [number, string])[];
}) => (
  <linearGradient
    id={id}
    gradientUnits="userSpaceOnUse"
    x1={from[0]}
    y1={from[1]}
    x2={to[0]}
    y2={to[1]}
  >
    {stops.map(([offset, color]) => (
      <stop key={offset} offset={offset} stopColor={color} />
    ))}
  </linearGradient>
);

export const HandBack = ({ look }: { look: HandLook }) => {
  const id = useId().replace(/:/g, '');
  const tone = tones(look);
  const cuff = bandAxis(CUFF_FROM, CUFF_TO);
  const sleeve = bandAxis(SLEEVE_FROM, SLEEVE_FROM + 200);
  return (
    <g>
      <defs>
        <Linear
          id={`${id}-palm`}
          from={[-70, 190]}
          to={[-30, 440]}
          stops={[
            [0, tone.light],
            [0.4, look.skin],
            [1, tone.shade],
          ]}
        />
        <Linear
          id={`${id}-arm`}
          from={cuff.from}
          to={cuff.to}
          stops={[
            [0, tone.light],
            [0.5, look.skin],
            [1, tone.deep],
          ]}
        />
        <Linear
          id={`${id}-cuff`}
          from={cuff.from}
          to={cuff.to}
          stops={[
            [0, tone.cuffShade],
            [0.3, look.cuff],
            [0.55, tone.cuffLight],
            [1, tone.cuffShade],
          ]}
        />
        <Linear
          id={`${id}-sleeve`}
          from={sleeve.from}
          to={sleeve.to}
          stops={[
            [0, tone.sleeveShade],
            [0.6, look.sleeve],
            [1, tone.sleeveShade],
          ]}
        />
      </defs>
      <path d={ARM_PATH} fill={`url(#${id}-arm)`} />
      <path d={band(SLEEVE_FROM, 1100, 10)} fill={`url(#${id}-sleeve)`} />
      <path d={PALM_PATH} fill={`url(#${id}-palm)`} />
      {KNUCKLE_LINES.map((line) => (
        <path
          key={line}
          d={line}
          stroke={tone.shade}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.35}
        />
      ))}
      <path d={band(CUFF_FROM, CUFF_TO, 3)} fill={`url(#${id}-cuff)`} />
    </g>
  );
};

export const HandFront = ({ look }: { look: HandLook }) => {
  const id = useId().replace(/:/g, '');
  const tone = tones(look);
  return (
    <g>
      <defs>
        <Linear
          id={`${id}-thumb`}
          from={THUMB.light}
          to={THUMB.dark}
          stops={[
            [0, tone.light],
            [0.45, look.skin],
            [1, tone.shade],
          ]}
        />
        <linearGradient
          id={`${id}-root`}
          gradientUnits="userSpaceOnUse"
          x1={THUMB.root[0]}
          y1={THUMB.root[1]}
          x2={THUMB.rootEnd[0]}
          y2={THUMB.rootEnd[1]}
        >
          <stop offset={0} stopColor={tone.palm} stopOpacity={1} />
          <stop offset={0.55} stopColor={tone.palm} stopOpacity={0.75} />
          <stop offset={1} stopColor={tone.palm} stopOpacity={0} />
        </linearGradient>
        <Linear
          id={`${id}-index`}
          from={[-8, 186]}
          to={[11, 240]}
          stops={[
            [0, tone.light],
            [1, look.skin],
          ]}
        />
        <filter id={`${id}-shadow`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <clipPath id={`${id}-card`}>
          <rect width={CARD.width} height={CARD.height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-card)`} opacity={0.3} filter={`url(#${id}-shadow)`}>
        <path d={THUMB.path} transform="translate(6 14)" fill="#20160e" />
        <path d={INDEX_EDGE} transform="translate(4 8)" fill="#20160e" />
      </g>
      <path d={INDEX_EDGE} fill={`url(#${id}-index)`} />
      <path d={THUMB.path} fill={`url(#${id}-thumb)`} />
      <path d={THUMB.path} fill={`url(#${id}-root)`} />
      <ellipse
        cx={THUMB.nail[0]}
        cy={THUMB.nail[1]}
        rx={13}
        ry={8.5}
        transform={`rotate(${THUMB.angle} ${THUMB.nail[0]} ${THUMB.nail[1]})`}
        fill={tone.nail}
        opacity={0.75}
      />
      <path
        d={`M ${THUMB.knuckle[0] - 2} ${THUMB.knuckle[1] - 14} q 7 9 5 22`}
        stroke={tone.shade}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.35}
      />
    </g>
  );
};
