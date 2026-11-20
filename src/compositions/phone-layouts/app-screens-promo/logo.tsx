import { Img } from 'remotion';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';

export const fitBox = (aspect: number, width: number, height: number) =>
  aspect >= width / height ? { width, height: width / aspect } : { width: height * aspect, height };

export const LogoImage = ({
  src,
  box,
  width,
  height,
}: {
  src: string;
  box: LogoBox;
  width: number;
  height: number;
}) => {
  const imageWidth = width / box.w;
  const imageHeight = height / box.h;
  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden' }}>
      <Img
        src={resolveCustom(src)}
        style={{
          position: 'absolute',
          left: -box.x * imageWidth,
          top: -box.y * imageHeight,
          width: imageWidth,
          height: imageHeight,
          maxWidth: 'none',
          maxHeight: 'none',
        }}
      />
    </div>
  );
};
