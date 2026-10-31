import type { ComingSoonNewspaperProps } from '@/schemas';
import { readPhoto } from '../footage/photos';
import { TrackedPrint } from '../footage/tracked-print';
import { tween } from '../promo/timing';
import { LAST_PRINT_FRAME } from './plate';
import { useSpreadTexture } from './spread-texture';

const PAPER_KEY = { chroma: [0.405, 0.331], reach: 0.05 } as const;

const printFade = (frame: number, print: ComingSoonNewspaperProps['print']): number => {
  const end = Math.min(LAST_PRINT_FRAME, print.fadeStart + print.fadeFrames);
  const start = Math.min(print.fadeStart, end - 1);
  return tween(frame, [start, end], [1, 0]);
};

export const NewspaperPrints = ({
  props,
  frame,
}: {
  props: ComingSoonNewspaperProps;
  frame: number;
}) => {
  const left = useSpreadTexture('left', props, readPhoto(props.leftPage.photo));
  const right = useSpreadTexture('right', props, readPhoto(props.rightPage.photo));
  const { strength, shading } = props.print;
  const opacity = printFade(frame, props.print);
  return (
    <>
      <TrackedPrint
        name="left"
        map={left}
        strength={strength}
        shading={shading}
        opacity={opacity}
        colorKey={PAPER_KEY}
      />
      <TrackedPrint
        name="right"
        map={right}
        strength={strength}
        shading={shading}
        opacity={opacity}
        colorKey={PAPER_KEY}
      />
    </>
  );
};
