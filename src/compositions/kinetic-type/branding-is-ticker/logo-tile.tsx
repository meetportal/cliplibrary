import { Img } from 'remotion';

const WIDE_STRETCH = 0.72;
const PADDING = 0.16;

export type TileSize = { width: number; height: number };

export const tileSize = (height: number, aspect: number | null, widest: number): TileSize => {
  const shape = aspect ?? 1;
  const width = Math.max(height, Math.min(widest, height * shape * WIDE_STRETCH));
  return { width: Math.round(width), height: Math.round(height) };
};

export const LogoImage = ({
  src,
  aspect,
  box,
  opacity = 1,
}: {
  src: string | null;
  aspect: number | null;
  box: TileSize;
  opacity?: number;
}) => {
  if (src === null || aspect === null) {
    return null;
  }
  const pad = box.height * PADDING;
  const roomWidth = box.width - 2 * pad;
  const roomHeight = box.height - 2 * pad;
  const width = Math.min(roomWidth, roomHeight * aspect);
  const height = width / aspect;
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        left: Math.round((box.width - width) / 2),
        top: Math.round((box.height - height) / 2),
        width: Math.round(width),
        height: Math.round(height),
        opacity,
      }}
    />
  );
};
