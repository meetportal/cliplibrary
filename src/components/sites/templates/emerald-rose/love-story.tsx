import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { FloralCluster, Heart } from './ornaments';

const Polaroid = ({
  src,
  caption,
  className,
}: {
  src: string;
  caption: string;
  className?: string;
}) => (
  <figure
    className={cn(
      'bg-white p-3 pb-2 shadow-[0_18px_30px_-16px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:rotate-0',
      className,
    )}
  >
    {src === '' ? (
      <div className="aspect-square w-full bg-(--er-primary)/15" />
    ) : (
      // biome-ignore lint/performance/noImgElement: user photos come from arbitrary hosts and uploads
      <img src={src} alt={caption} className="aspect-square w-full object-cover" />
    )}
    <figcaption className={cn(SCRIPT, 'pt-2 text-center text-(--er-text) text-3xl')}>
      {caption}
    </figcaption>
  </figure>
);

export const LoveStory = ({ content }: { content: EmeraldRoseContent }) => {
  const { story, photos } = content;
  const paragraphs = story.text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '');
  return (
    <section id="er-story" className="scroll-mt-14 bg-(--er-paper) px-5 py-16">
      <Reveal className="flex flex-col items-center">
        <span className={cn(SCRIPT, 'text-3xl text-(--er-muted)')}>our</span>
        <h2 className={cn(CAPS, 'flex items-center gap-2 text-2xl')}>
          L<Heart className="size-5" />
          ve story
        </h2>
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
        <Reveal className="relative mx-auto h-[380px] w-full max-w-sm">
          <div className="absolute inset-x-6 top-4 bottom-8 rounded-sm bg-(--er-primary)" />
          <FloralCluster className="-top-6 -left-6 absolute z-10 w-40" />
          <Polaroid
            src={photos.storyThen}
            caption={story.thenLabel}
            className="absolute top-8 left-2 w-[58%] -rotate-6"
          />
          <Polaroid
            src={photos.storyNow}
            caption={story.nowLabel}
            className="absolute right-2 bottom-0 w-[58%] rotate-[5deg]"
          />
        </Reveal>
        <Reveal delay={150} className="flex flex-col gap-5 text-center">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(SERIF, 'whitespace-pre-line text-(--er-text) text-xl leading-relaxed')}
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
};
