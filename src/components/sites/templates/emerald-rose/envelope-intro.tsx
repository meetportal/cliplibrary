'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import type { SiteIntroProps } from '../../site-view';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { FloralCluster, WaxSeal } from './ornaments';

type Phase = 'closed' | 'flap' | 'card' | 'leaving';

const NEXT: Record<Phase, { phase: Phase | 'done'; after: number } | null> = {
  closed: null,
  flap: { phase: 'card', after: 650 },
  card: { phase: 'leaving', after: 1100 },
  leaving: { phase: 'done', after: 750 },
};

const TRIANGLE = {
  top: 'polygon(0 0, 100% 0, 50% 56%)',
  left: 'polygon(0 0, 54% 54%, 0 100%)',
  right: 'polygon(100% 0, 46% 54%, 100% 100%)',
  bottom: 'polygon(0 100%, 50% 46%, 100% 100%)',
};

export const EnvelopeIntro = ({
  content,
  position,
  onOpened,
}: SiteIntroProps<EmeraldRoseContent>) => {
  const [phase, setPhase] = useState<Phase>('closed');
  const { couple, intro } = content;

  useEffect(() => {
    const next = NEXT[phase];
    if (next === null) {
      return;
    }
    const timer = setTimeout(() => {
      if (next.phase === 'done') {
        onOpened();
      } else {
        setPhase(next.phase);
      }
    }, next.after);
    return () => clearTimeout(timer);
  }, [phase, onOpened]);

  const opened = phase !== 'closed';
  const rising = phase === 'card' || phase === 'leaving';

  return (
    <div
      className={cn(
        position,
        'inset-0 z-40 flex flex-col items-center justify-center gap-8 overflow-hidden bg-(--er-bg) px-6 text-(--er-text) transition-opacity duration-700',
        phase === 'leaving' && 'opacity-0',
      )}
    >
      <div className="flex flex-col items-center text-center">
        <span className={cn(CAPS, 'text-(--er-muted) text-[11px]')}>{couple.greeting}</span>
        <span className={cn(SCRIPT, 'mt-3 text-6xl leading-[0.95]')}>{couple.firstName}</span>
        <span className={cn(SERIF, 'my-1 text-(--er-accent) text-4xl italic leading-none')}>
          &amp;
        </span>
        <span className={cn(SCRIPT, 'text-6xl leading-[0.95]')}>{couple.secondName}</span>
      </div>
      <button
        type="button"
        aria-label={intro.prompt}
        onClick={() => setPhase('flap')}
        disabled={opened}
        className="group relative aspect-[10/7] w-[min(82%,360px)] cursor-pointer [perspective:900px] focus-visible:outline-none"
      >
        <span className="absolute inset-0 rounded-md bg-(--er-primary-deep) shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)]" />
        <span
          className={cn(
            'absolute inset-x-[7%] top-[6%] bottom-[8%] flex flex-col items-center justify-center rounded-sm bg-(--er-paper) shadow-md transition-transform duration-1000 ease-out',
            rising ? '-translate-y-[42%]' : 'translate-y-0',
          )}
        >
          <span className={cn(SCRIPT, 'text-(--er-text) text-3xl')}>{couple.monogram}</span>
          <span className={cn(CAPS, 'mt-1 text-(--er-muted) text-[9px]')}>Save the date</span>
        </span>
        <span
          className="absolute inset-0 rounded-md bg-(--er-primary)"
          style={{ clipPath: TRIANGLE.left }}
        />
        <span
          className="absolute inset-0 rounded-md bg-(--er-primary)"
          style={{ clipPath: TRIANGLE.right }}
        />
        <span
          className="absolute inset-0 rounded-md bg-(--er-primary-deep) brightness-110"
          style={{ clipPath: TRIANGLE.bottom }}
        />
        <span
          className={cn(
            'absolute inset-0 origin-top bg-(--er-primary) brightness-90 transition-transform duration-700 ease-in-out [backface-visibility:hidden]',
            opened ? '-z-10 rotate-x-180' : 'z-10',
          )}
          style={{ clipPath: TRIANGLE.top }}
        />
        <FloralCluster className="-top-[22%] -left-[14%] absolute z-20 w-[62%] drop-shadow-md" />
        <span
          className={cn(
            'absolute top-[56%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300',
            opened && 'opacity-0',
          )}
        >
          <WaxSeal
            monogram={couple.monogram}
            className="size-20 drop-shadow-lg transition-transform group-hover:scale-105"
          />
        </span>
      </button>
      <span
        className={cn(
          CAPS,
          'animate-pulse text-(--er-muted) text-xs transition-opacity',
          opened && 'opacity-0',
        )}
      >
        {intro.prompt}
      </span>
    </div>
  );
};
