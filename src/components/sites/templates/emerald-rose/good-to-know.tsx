import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { RingsBand } from './ornaments';
import { PillLink } from './pill-link';
import { Reveal } from './reveal';

const Detail = ({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) => (
  <Reveal className="flex flex-col items-center gap-3 text-center">
    <h3 className={cn(SCRIPT, 'text-5xl')}>{title}</h3>
    <p className={cn(SERIF, 'max-w-md whitespace-pre-line text-xl leading-relaxed')}>{text}</p>
    {children}
  </Reveal>
);

export const GoodToKnow = ({ content }: { content: EmeraldRoseContent }) => {
  const { details, dressCode, faqs } = content;
  return (
    <section id="er-details" className="scroll-mt-14">
      <RingsBand />
      <div className="mx-auto grid max-w-5xl gap-14 px-5 py-16 @3xl:grid-cols-2">
        {details.map((detail, index) => (
          <Detail key={index} title={detail.title} text={detail.text}>
            {detail.linkUrl === '' || detail.linkLabel === '' ? null : (
              <PillLink href={detail.linkUrl}>{detail.linkLabel}</PillLink>
            )}
          </Detail>
        ))}
        <Detail title="Dress code" text={dressCode.text}>
          <div className="mt-2 flex gap-3">
            {dressCode.swatches.map((swatch, index) => (
              <span
                key={index}
                className="size-10 rounded-full shadow-inner ring-(--er-accent)/40 ring-2 ring-offset-2 ring-offset-(--er-bg)"
                style={{ backgroundColor: swatch.color }}
              />
            ))}
          </div>
        </Detail>
      </div>
      {faqs.length === 0 ? null : (
        <>
          <RingsBand />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-5 py-16">
            <Reveal>
              <h2 className={cn(SCRIPT, 'text-6xl')}>FAQs</h2>
            </Reveal>
            {faqs.map((faq, index) => (
              <Reveal key={index} className="flex flex-col items-center gap-2 text-center">
                <h3 className={cn(CAPS, 'font-medium text-sm')}>{faq.question}</h3>
                <p
                  className={cn(
                    SERIF,
                    'whitespace-pre-line text-(--er-muted) text-xl leading-relaxed',
                  )}
                >
                  {faq.answer}
                </p>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
