import type { ElevatorNewspaperProps } from '@/schemas';
import { paintPaperPage } from '../footage/paper-page';
import { drawCover } from './page-cover';
import { drawStory } from './page-story';

export type PageCopy = Pick<ElevatorNewspaperProps, 'masthead' | 'cover' | 'story' | 'ink'> & {
  print: Pick<ElevatorNewspaperProps['print'], 'softness' | 'paperTint'>;
};

export type PageSide = 'cover' | 'story';

const PAGE_WIDTH = 1024;
const PAGE_HEIGHT = 1400;

export const drawPage = (
  canvas: HTMLCanvasElement,
  side: PageSide,
  copy: PageCopy,
  photo: CanvasImageSource | null,
) => {
  const draw = side === 'cover' ? drawCover : drawStory;
  paintPaperPage(
    canvas,
    [PAGE_WIDTH, PAGE_HEIGHT],
    { paper: copy.ink.paper, paperTint: copy.print.paperTint, softness: copy.print.softness },
    (context) => draw(context, copy, photo, [PAGE_WIDTH, PAGE_HEIGHT]),
  );
};
