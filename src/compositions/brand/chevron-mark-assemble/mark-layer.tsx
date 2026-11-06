import { useId } from 'react';
import type { FieldState } from './field';
import type { Poses } from './poses';

const CORNER = 1.5 * Math.SQRT2;

type PieceStyle = { ink: string; flip: number };

export type PieceStyles = {
  chevron: PieceStyle;
  first: PieceStyle;
  second: PieceStyle;
  keystone: string;
};

export type Blur = { x: number; y: number };

export type PieceBlurs = { first: Blur | null; second: Blur | null };

const BlurFilter = ({ id, blur }: { id: string; blur: Blur | null }) =>
  blur === null ? null : (
    <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation={`${blur.x.toFixed(2)} ${blur.y.toFixed(2)}`} />
    </filter>
  );

const chevronPoints = (s: number, arms: number): string =>
  [
    [0.5 * s, 1.5 * s - arms * s],
    [1.5 * s, 1.5 * s - arms * s],
    [1.5 * s, 1.5 * s],
    [1.5 * s - arms * s, 1.5 * s],
    [1.5 * s - arms * s, 0.5 * s],
    [0.5 * s, 0.5 * s],
  ]
    .map(([x, y]) => `${(x ?? 0).toFixed(2)},${(y ?? 0).toFixed(2)}`)
    .join(' ');

const MarkPieces = ({
  poses,
  styles,
  blurs,
  blurId,
}: {
  poses: Poses;
  styles: PieceStyles;
  blurs: PieceBlurs;
  blurId: string;
}) => {
  const { cell: s, piece: d, chevron, first, second } = poses;
  const corner = CORNER * s;
  const border = 0.17 * d;
  return (
    <>
      {chevron.opacity > 0 ? (
        <g
          opacity={chevron.opacity}
          transform={`scale(${styles.chevron.flip} 1) translate(0 ${corner}) scale(${chevron.scale}) translate(0 ${-corner}) rotate(45)`}
        >
          <polygon points={chevronPoints(s, chevron.arms)} fill={styles.chevron.ink} />
        </g>
      ) : null}
      <g filter={blurs.first ? `url(#${blurId}-first)` : undefined}>
        <g
          transform={`translate(${first.x} ${first.y}) scale(${styles.first.flip} 1) rotate(${first.angle})`}
        >
          <rect x={-d / 2} y={-d / 2} width={d} height={d} fill={styles.first.ink} />
        </g>
      </g>
      {poses.secondVisible ? (
        <g filter={blurs.second ? `url(#${blurId}-second)` : undefined}>
          <g
            transform={`translate(${second.x} ${second.y}) scale(${styles.second.flip} 1) rotate(${second.angle})`}
          >
            <rect x={-d / 2} y={-d / 2} width={d} height={d} fill={styles.second.ink} />
            {poses.keystone > 0 ? (
              <rect
                x={-d / 2 + border}
                y={-d / 2 + border}
                width={d - 2 * border}
                height={d - 2 * border}
                fill={styles.keystone}
                opacity={poses.keystone}
              />
            ) : null}
          </g>
        </g>
      ) : null}
    </>
  );
};

export const MarkLayer = ({
  width,
  height,
  field,
  markTransform,
  poses,
  styleOn,
  onTop,
  blurs,
}: {
  width: number;
  height: number;
  field: FieldState;
  markTransform: string;
  poses: Poses;
  styleOn: (color: string) => PieceStyles;
  onTop: PieceStyles | null;
  blurs: PieceBlurs;
}) => {
  const clipId = useId().replace(/:/g, '');
  const { overlay } = field;
  const iris = overlay?.iris ?? null;
  const pieces = (styles: PieceStyles) => (
    <g transform={markTransform}>
      <MarkPieces poses={poses} styles={styles} blurs={blurs} blurId={clipId} />
    </g>
  );
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <BlurFilter id={`${clipId}-first`} blur={blurs.first} />
        <BlurFilter id={`${clipId}-second`} blur={blurs.second} />
        {iris ? (
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <polygon
              points={`${iris.x},${iris.y - iris.radius} ${iris.x + iris.radius},${iris.y} ${iris.x},${iris.y + iris.radius} ${iris.x - iris.radius},${iris.y}`}
            />
          </clipPath>
        ) : null}
      </defs>
      <rect width={width} height={height} fill={field.base} />
      {onTop === null ? pieces(styleOn(field.base)) : null}
      {overlay ? (
        <g clipPath={iris ? `url(#${clipId})` : undefined} opacity={overlay.opacity}>
          <rect width={width} height={height} fill={overlay.color} />
          {onTop === null ? pieces(styleOn(overlay.color)) : null}
        </g>
      ) : null}
      {onTop === null ? null : pieces(onTop)}
    </svg>
  );
};
