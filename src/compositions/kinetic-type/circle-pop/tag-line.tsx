import { Easing, useCurrentFrame } from 'remotion';
import type { CirclePopProps } from '@/schemas';
import { squigglePath } from './blob';
import { LINE_FACE } from './fonts';
import { pixelTween } from './pixel-tween';
import type { CirclePopBeat } from './timeline';

const RISE = 44;
const SQUIGGLE_HEIGHT = 22;
const SQUIGGLE_STROKE = 9;
const settle = Easing.bezier(0.22, 0.9, 0.3, 1);

export const TagLine = ({
  text,
  top,
  settings,
  beat,
  ink,
  accent,
  maxWidth,
  lineAt,
}: {
  text: string;
  top: number;
  settings: CirclePopProps['line'];
  beat: CirclePopBeat;
  ink: string;
  accent: string;
  maxWidth: number;
  lineAt: number;
}) => {
  const frame = useCurrentFrame();
  const shown = beat.lineIn * (1 - beat.lineOut);
  if (shown <= 0 || text.trim() === '') {
    return null;
  }
  const rise = RISE - pixelTween(frame, [lineAt, lineAt + 18], 0, RISE, settle);
  const draw = beat.drawIn - beat.lineOut;
  const pad = SQUIGGLE_STROKE;
  return (
    <div
      style={{
        position: 'absolute',
        left: -maxWidth / 2,
        top: top + rise,
        width: maxWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: settings.size * 0.55,
      }}
    >
      <div
        style={{
          fontFamily: LINE_FACE.family,
          fontWeight: LINE_FACE.weight,
          fontSize: settings.size,
          lineHeight: 1.2,
          color: ink,
          opacity: shown,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        {text}
      </div>
      {settings.squiggle && draw > 0.01 ? (
        <svg
          width={settings.squiggleWidth + 2 * pad}
          height={SQUIGGLE_HEIGHT + 2 * pad}
          viewBox={`${-pad} ${-pad} ${settings.squiggleWidth + 2 * pad} ${SQUIGGLE_HEIGHT + 2 * pad}`}
        >
          <title>Squiggle</title>
          <path
            d={squigglePath(settings.squiggleWidth, SQUIGGLE_HEIGHT, beat.squiggle)}
            fill="none"
            stroke={accent}
            strokeWidth={SQUIGGLE_STROKE}
            strokeLinecap="butt"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${draw} 2`}
          />
        </svg>
      ) : null}
    </div>
  );
};
