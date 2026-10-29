import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { BotanicalEvent, BotanicalSaveTheDateProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { frameShape } from './frame-shapes';
import { easeOutQuad, pathData, timeToReach } from './geometry';
import { LeafCluster, type LeafInk, leafOpening } from './leaf';
import { Caps, EXIT_FRAMES, GoldRule, type InviteType, Rise } from './lettering';

type Cards = BotanicalSaveTheDateProps['cards'];

const INNER_GAP = 16;

const FrameLine = ({
  shape,
  width,
  height,
  progress,
  color,
  lineWidth,
}: {
  shape: BotanicalEvent['frame'];
  width: number;
  height: number;
  progress: number;
  color: string;
  lineWidth: number;
}) => {
  if (progress <= 0 || width <= 0 || height <= 0) {
    return null;
  }
  const { line } = frameShape(shape, width, height);
  const done = progress >= 1;
  return (
    <path
      d={`${pathData(line.points)}${done ? ' Z' : ''}`}
      fill="none"
      stroke={color}
      strokeWidth={lineWidth}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeDasharray={done ? undefined : `${line.total} ${line.total}`}
      strokeDashoffset={done ? undefined : line.total * (1 - progress)}
    />
  );
};

export const EventCard = ({
  event,
  frame,
  start,
  end,
  cards,
  type,
  leafInk,
  lettering,
  center,
}: {
  event: BotanicalEvent;
  frame: number;
  start: number;
  end: number;
  cards: Cards;
  type: InviteType;
  leafInk: LeafInk;
  lettering: BotanicalSaveTheDateProps['lettering'];
  center: [number, number];
}) => {
  const { width, height } = useVideoConfig();
  const shape = frameShape(event.frame, cards.width, cards.height);
  const draw = Math.max(1, cards.drawFrames);
  const progress = easeOutQuad(Math.min(1, Math.max(0, (frame - start) / draw)));
  const fade = tween(frame, [end, end + EXIT_FRAMES], [0, 1], smooth);
  const textAt = start + Math.round(draw * 0.25);
  const step = type.stagger;
  const [cx, cy] = center;
  return (
    <AbsoluteFill>
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', inset: 0, opacity: 1 - fade }}
        aria-hidden="true"
      >
        <g transform={`translate(${cx} ${cy})`}>
          <FrameLine
            shape={event.frame}
            width={cards.width}
            height={cards.height}
            progress={progress}
            color={type.gold}
            lineWidth={cards.lineWidth}
          />
          {cards.innerLine ? (
            <FrameLine
              shape={event.frame}
              width={cards.width - INNER_GAP * 2}
              height={cards.height - INNER_GAP * 2}
              progress={progress}
              color={type.gold}
              lineWidth={cards.lineWidth * 0.45}
            />
          ) : null}
          {cards.leaves
            ? shape.anchors.map((anchor) => {
                const share = (shape.line.cumulative[anchor.index] ?? 0) / shape.line.total;
                const point = shape.line.points[anchor.index] ?? [0, 0];
                return (
                  <LeafCluster
                    key={anchor.index}
                    at={point}
                    direction={anchor.direction}
                    size={anchor.size}
                    open={leafOpening(frame, start + draw * timeToReach(share) + 2)}
                    ink={leafInk}
                  />
                );
              })
            : null}
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: cx - cards.width / 2,
          top: cy - cards.height / 2 + shape.textShift,
          width: cards.width,
          height: cards.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: cards.width * 0.84,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Rise start={textAt} end={end} distance={22}>
            <Caps text={event.title} size={lettering.cardTitleSize} type={type} weight={600} />
          </Rise>
          <GoldRule
            frame={frame}
            start={textAt + step}
            end={end}
            width={lettering.cardTitleSize * 1.4}
            type={type}
            margin={lettering.cardTextSize * 0.9}
          />
          {[event.time, event.venue, event.address].map((text, index) =>
            text.length > 0 ? (
              <Rise
                key={`${index}:${text}`}
                start={textAt}
                end={end}
                delay={step * (index + 1) + 4}
                distance={16}
                style={{ marginTop: index === 0 ? 0 : lettering.cardTextSize * 0.2 }}
              >
                <Caps
                  text={text}
                  size={lettering.cardTextSize * (index === 2 ? 0.86 : 1)}
                  type={type}
                  color={index === 2 ? type.muted : type.ink}
                  tracking={type.tracking * 0.5}
                />
              </Rise>
            ) : null,
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
