import type { GoldMonogramInviteProps } from '@/schemas';
import { pixelTween, smooth } from '../../promo/timing';
import { MonogramMark, markPadding } from './monogram-mark';
import { goldText, riseIn } from './reveal';

const EYEBROW_GAP = 26;

const NAMES_GAP = 18;

export const Monogram = ({
  frame,
  monogram,
  schedule,
  gold,
  text,
  serif,
  script,
}: {
  frame: number;
  monogram: GoldMonogramInviteProps['monogram'];
  schedule: GoldMonogramInviteProps['schedule'];
  gold: GoldMonogramInviteProps['gold'];
  text: GoldMonogramInviteProps['text'];
  serif: string;
  script: string;
}) => {
  const start = monogram.start;
  const side = Math.ceil(monogram.ringRadius + markPadding) * 2;
  const eyebrowHeight = Math.round(monogram.eyebrowSize * 1.4);
  const namesHeight = Math.round(monogram.namesSize * 1.25);
  const height = eyebrowHeight + EYEBROW_GAP + side + NAMES_GAP + namesHeight;
  const width = Math.max(side, Math.round(monogram.namesSize * 9));
  const eyebrow = riseIn(frame, start, Math.round(monogram.eyebrowSize * 0.8));
  const names = riseIn(
    frame,
    start + monogram.drawFrames * 1.35,
    Math.round(monogram.namesSize * 0.35),
  );
  const travelX = schedule.monogramX - 960;
  const travelY = schedule.monogramY - 540;
  const distance = Math.max(1, Math.round(Math.hypot(travelX, travelY)));
  const moveRange: [number, number] = [schedule.start, schedule.start + schedule.shrinkFrames];
  const moved = pixelTween(frame, moveRange, [0, distance], smooth) / distance;
  const scale = 1 + (schedule.monogramScale - 1) * moved;
  const left = Math.round(960 + travelX * moved - width / 2);
  const top = Math.round(540 + travelY * moved - height / 2);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${scale.toFixed(4)})`,
        transformOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          height: eyebrowHeight,
          marginBottom: EYEBROW_GAP,
          opacity: eyebrow.opacity,
          transform: `translateY(${eyebrow.offset}px)`,
          fontFamily: serif,
          fontSize: monogram.eyebrowSize,
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: '0.42em',
          marginRight: '-0.42em',
          textTransform: 'uppercase',
          color: text.cream,
          whiteSpace: 'nowrap',
        }}
      >
        {monogram.eyebrow}
      </div>
      <div style={{ width: side, height: side }}>
        <MonogramMark
          frame={frame}
          monogram={monogram}
          gold={gold}
          glintColor={text.cream}
          serif={serif}
        />
      </div>
      <div
        style={{
          height: namesHeight,
          marginTop: NAMES_GAP,
          opacity: names.opacity,
          transform: `translateY(${names.offset}px)`,
          fontFamily: script,
          fontSize: monogram.namesSize,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ display: 'inline-block', ...goldText(gold.light, gold.dark) }}>
          {monogram.names}
        </span>
      </div>
    </div>
  );
};
