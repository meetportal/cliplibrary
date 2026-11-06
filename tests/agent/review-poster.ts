import type { Design } from '@/design';
import { POST_SIZE, rect, star, type ThemeSpec, text, themed } from '@/posters/kit';
import { templateDesign } from '@/posters/pack';

const { width, height } = POST_SIZE;

const reviewPosterTemplate = themed(
  width,
  height,
  {
    colors: {
      background: { value: '#121212', hint: 'Page' },
      primary: { value: '#ffb703', hint: 'The star' },
      surface: { value: '#ffffff', hint: 'The card' },
      text: { value: '#121212', hint: 'Reviewer names' },
    },
    fonts: { heading: { label: 'Heading font', value: 'Figtree' } },
    copy: {
      title: { label: 'Title', value: 'CLIENT' },
      names: { label: 'Reviewer', value: ['Jordan Mills', 'Ava Stone'] },
    },
  } as const satisfies ThemeSpec,
  (t) => [
    rect(0, 0, width, height, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 80, 80, 920, {
      fontFamily: t.font('heading'),
      fontSize: 120,
      fontWeight: 900,
      fill: t.color('surface'),
    }),
    star(5, 860, 260, 110, t.color('primary'), { innerRatio: 0.42, name: 'Star' }),
    rect(80, 500, 920, 500, t.color('surface'), { cornerRadius: 18, name: 'Review card' }),
    t.list('names').map((name, index) =>
      text(name, 120, 560 + index * 200, 840, {
        fontFamily: t.font('heading'),
        fontSize: 48,
        fontWeight: 800,
        fill: t.color('text'),
      }),
    ),
  ],
);

export const reviewPoster: Design = templateDesign(reviewPosterTemplate, 'review-poster', 'Review');
