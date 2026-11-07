import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import type { MarkBox } from './layout';
import { type Body, bandClip, motionStyle, piecesFor } from './pieces';
import { markSettledAt, type Timeline } from './timeline';

const OVERLAP = 4;

export const Mark = ({
  frame,
  box,
  src,
  line,
  props,
}: {
  frame: number;
  box: MarkBox;
  src: string;
  line: Timeline;
  props: ArcBurstWordmarkProps;
}) => {
  const { mark } = props;
  const inset = mark.plate ? mark.padding : 0;
  const base: CSSProperties = {
    position: 'absolute',
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
    padding: inset,
    boxSizing: 'border-box',
    borderRadius: mark.plate ? (Math.min(box.width, box.height) * mark.roundness) / 100 : 0,
    backgroundColor: mark.plate ? props.colors.plate : 'transparent',
  };
  const image = <Img src={src} style={{ width: '100%', height: '100%', display: 'block' }} />;
  if (frame >= markSettledAt(line, props.build.style)) {
    return <div style={base}>{image}</div>;
  }
  const body: Body = {
    ascent: box.height,
    inkTop: box.height,
    inkBottom: 0,
    size: box.height,
  };
  const build = {
    ...props.build,
    swing: props.build.swing * Math.min(1, Math.max(0.35, (box.height * 2) / box.width)),
  };
  const style = mark.plate ? 'swing' : build.style;
  return (
    <>
      {piecesFor(0, line.markStart, box.width, body, { ...build, style }, false).map(
        (piece, at) => {
          const motion = motionStyle(piece, frame, line.flight);
          if (motion === null) {
            return null;
          }
          return (
            <div
              key={`mark-${at}`}
              style={{
                ...base,
                ...motion.style,
                clipPath:
                  piece.band === null ? undefined : bandClip(piece.band, body, box.width, OVERLAP),
              }}
            >
              {image}
            </div>
          );
        },
      )}
    </>
  );
};
