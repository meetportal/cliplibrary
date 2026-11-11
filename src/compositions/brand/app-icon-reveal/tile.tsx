import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { AppIconRevealProps } from '@/schemas';
import { resolveCustom } from '../../kit/resolve-custom';
import { alpha, mix } from './color';
import { entrance, flipAngle, floatOffset, shineProgress, type Timeline } from './timeline';
import { usableImage } from './use-logo-aspect';

const EDGE_SHADE = 0.24;
const TURN_SHADE = 0.2;

const Logo = ({
  props,
  size,
  width,
}: {
  props: AppIconRevealProps;
  size: number;
  width: number;
}) => {
  const inset = (size * props.tile.logoPadding) / 100;
  const box: CSSProperties = {
    position: 'absolute',
    left: inset,
    top: inset,
    width: width - inset * 2,
    height: size - inset * 2,
  };
  return usableImage(props.logo) ? (
    <Img src={resolveCustom(props.logo)} style={{ ...box, objectFit: 'contain' }} />
  ) : (
    <div
      style={{
        ...box,
        boxSizing: 'border-box',
        borderRadius: size * 0.12,
        border: `4px dashed ${alpha(props.colors.text, 0.3)}`,
      }}
    />
  );
};

const Shine = ({
  size,
  width,
  progress,
  amount,
}: {
  size: number;
  width: number;
  progress: number;
  amount: number;
}) => {
  if (amount <= 0 || progress <= 0 || progress >= 1) {
    return null;
  }
  const band = size * 0.42;
  const travel = -band * 1.6 + (width + band * 2.2) * progress;
  return (
    <div
      style={{
        position: 'absolute',
        left: travel,
        top: -size * 0.5,
        width: band,
        height: size * 2,
        transform: 'rotate(18deg)',
        backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${(0.5 * amount).toFixed(3)}) 50%, rgba(255,255,255,0) 100%)`,
      }}
    />
  );
};

export const Tile = ({
  frame,
  line,
  props,
  centerX,
  centerY,
  tileWidth,
}: {
  frame: number;
  line: Timeline;
  props: AppIconRevealProps;
  centerX: number;
  centerY: number;
  tileWidth: number;
}) => {
  const { tile, colors, life } = props;
  const size = tile.size;
  const angle = flipAngle(frame, line);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const front = angle > Math.PI / 2;
  const enter = entrance(frame);
  const lift = sin * life.lift;
  const scale = enter.scale * (1 + lift);
  const float = floatOffset(frame, line, life.float);
  const faceWidth = tileWidth * Math.abs(cos);
  const edgeWidth = tile.depth * sin;
  const total = Math.max(0.01, faceWidth + edgeWidth);
  const radius = (size * tile.roundness) / 100;
  const radiusX = Math.min(total / 2, (radius * total) / tileWidth);
  const turnShade = (1 - Math.abs(cos)) * TURN_SHADE;
  const offsetY = size * (0.07 + lift * 0.6) - float * 0.5;
  const blur = size * (0.16 + lift * 0.9) - float * 0.4;
  const offsetX = size * (0.035 + sin * 0.07);
  const shadows = [
    `${offsetX.toFixed(1)}px ${offsetY.toFixed(1)}px ${Math.max(0, blur).toFixed(1)}px ${alpha(colors.shadow, tile.shadow * 0.42 * (1 - lift))}`,
    ...(props.showBackground
      ? [
          `${(-size * 0.03).toFixed(1)}px ${(-size * 0.03).toFixed(1)}px ${(size * 0.08).toFixed(1)}px ${alpha('#ffffff', 0.55 * tile.shadow)}`,
        ]
      : []),
  ];
  const strip = (
    <div
      key="edge"
      style={{
        width: edgeWidth,
        height: '100%',
        flexShrink: 0,
        backgroundImage: `linear-gradient(90deg, ${mix(colors.primary, '#000000', EDGE_SHADE)} 0 50%, ${mix(colors.face, '#000000', EDGE_SHADE)} 50% 100%)`,
      }}
    />
  );
  const face = (
    <div
      key="face"
      style={{
        position: 'relative',
        width: faceWidth,
        height: '100%',
        flexShrink: 0,
        overflow: 'hidden',
        backgroundColor: front ? colors.face : colors.primary,
        backgroundImage: front
          ? undefined
          : `linear-gradient(160deg, ${mix(colors.primary, '#ffffff', 0.2)} 0%, ${colors.primary} 55%, ${mix(colors.primary, '#000000', 0.12)} 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: tileWidth,
          height: size,
          transform: `scaleX(${Math.abs(cos).toFixed(4)})`,
          transformOrigin: '0 0',
        }}
      >
        {front ? (
          <Logo props={props} size={size} width={tileWidth} />
        ) : (
          <Shine
            size={size}
            width={tileWidth}
            progress={shineProgress(frame, line)}
            amount={life.shine}
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.05) 100%)`,
          backgroundColor: alpha('#000000', turnShade),
        }}
      />
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: centerX - total / 2,
        top: centerY - size / 2,
        width: total,
        height: size,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: `${radiusX.toFixed(2)}px / ${radius.toFixed(2)}px`,
        transform: `translateY(${float.toFixed(3)}px) scale(${scale.toFixed(4)})`,
        opacity: enter.opacity,
        boxShadow: shadows.join(', '),
      }}
    >
      {front ? [strip, face] : [face, strip]}
    </div>
  );
};
