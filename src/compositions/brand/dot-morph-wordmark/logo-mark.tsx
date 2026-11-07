import { Easing, Img } from 'remotion';
import type { DotMorphWordmarkProps } from '@/schemas';
import type { LogoBox } from './layout';
import { evenTween } from './letters';
import { progress, settle, type Timeline } from './timeline';

const RISE = 36;
const PLATE_ROUNDNESS = 0.3;

export const LogoMark = ({
  frame,
  line,
  box,
  src,
  props,
}: {
  frame: number;
  line: Timeline;
  box: LogoBox;
  src: string;
  props: DotMorphWordmarkProps;
}) => {
  const from = line.toFrame(line.logoStart);
  const to = line.toFrame(line.logoEnd);
  if (frame <= from) {
    return null;
  }
  const opacity = progress(frame, [from, from + (to - from) * 0.6], Easing.out(Easing.quad));
  const rise = evenTween(frame, [from, to], [RISE, 0], settle);
  const plate = props.mark.plate;
  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        padding: box.inset,
        boxSizing: 'border-box',
        borderRadius: plate ? Math.min(box.width, box.height) * PLATE_ROUNDNESS : 0,
        backgroundColor: plate ? props.colors.plate : 'transparent',
        opacity: opacity < 1 ? opacity : undefined,
        transform: rise === 0 ? undefined : `translateY(${rise}px)`,
      }}
    >
      <Img src={src} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
