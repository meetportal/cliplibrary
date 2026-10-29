'use client';

import { type FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import type { SubmitRsvp } from '../../site-view';
import { CAPS, SCRIPT, SERIF } from './fonts';
import { FloralCluster, WaxSeal } from './ornaments';
import { Reveal } from './reveal';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const FIELD =
  'w-full rounded-sm border border-(--er-accent)/40 bg-white/70 px-3 py-2.5 text-(--er-text) text-lg outline-none transition focus:border-(--er-primary) focus:bg-white';

const LABEL = cn(CAPS, 'text-(--er-muted) text-[10px]');

export const RsvpForm = ({
  content,
  onRsvp,
}: {
  content: EmeraldRoseContent;
  onRsvp: SubmitRsvp;
}) => {
  const [status, setStatus] = useState<Status>('idle');
  const [attending, setAttending] = useState(true);
  const { couple, rsvp, event } = content;

  const submit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    setStatus('sending');
    try {
      await onRsvp({
        name: String(form.get('name') ?? '').trim(),
        attending,
        guests: attending ? Number(form.get('guests') ?? 1) : 1,
        dietary: String(form.get('dietary') ?? ''),
        message: String(form.get('message') ?? ''),
      });
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <section id="er-rsvp" className="scroll-mt-14 bg-(--er-primary) px-5 py-16">
      <Reveal className="relative mx-auto max-w-lg">
        <FloralCluster className="-top-12 -right-8 absolute z-10 w-48 rotate-12" />
        <div className="rounded-sm border-(--er-accent) border-[3px] bg-(--er-paper) p-1.5 shadow-2xl">
          <div className="flex flex-col items-center gap-4 border border-(--er-accent)/60 px-5 py-10 @md:px-10">
            <h2 className={cn(SCRIPT, 'text-6xl')}>RSVP</h2>
            <span className={cn(CAPS, 'text-(--er-muted) text-[10px]')}>
              Kindly reply by {event.rsvpBy}
            </span>
            <p className={cn(SERIF, 'text-center text-xl leading-relaxed')}>{rsvp.message}</p>
            {status === 'sent' ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <WaxSeal monogram={couple.monogram} className="size-24" />
                <p className={cn(SERIF, 'text-2xl italic')}>{rsvp.thanks}</p>
              </div>
            ) : (
              <form onSubmit={submit} className={cn(SERIF, 'mt-2 flex w-full flex-col gap-4')}>
                <label className="flex flex-col gap-1.5">
                  <span className={LABEL}>Your name</span>
                  <input name="name" required maxLength={80} className={FIELD} />
                </label>
                <fieldset className="flex flex-col gap-1.5">
                  <legend className={cn(LABEL, 'mb-1.5')}>Will you celebrate with us?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[true, false].map((choice) => (
                      <button
                        key={String(choice)}
                        type="button"
                        aria-pressed={attending === choice}
                        onClick={() => setAttending(choice)}
                        className={cn(
                          'rounded-sm border px-3 py-2.5 text-lg transition',
                          attending === choice
                            ? 'border-(--er-primary) bg-(--er-primary) text-(--er-bg)'
                            : 'border-(--er-accent)/40 bg-white/70',
                        )}
                      >
                        {choice ? 'Joyfully accept' : 'Regretfully decline'}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {attending ? (
                  <label className="flex flex-col gap-1.5">
                    <span className={LABEL}>How many guests, including you?</span>
                    <select name="guests" defaultValue="1" className={FIELD}>
                      {[1, 2, 3, 4, 5, 6].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <label className="flex flex-col gap-1.5">
                  <span className={LABEL}>Dietary needs</span>
                  <input name="dietary" maxLength={300} className={FIELD} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={LABEL}>A note for the couple</span>
                  <textarea name="message" rows={3} maxLength={1000} className={FIELD} />
                </label>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={cn(
                    CAPS,
                    'mt-2 rounded-full bg-(--er-primary) px-6 py-3 text-(--er-bg) text-xs transition hover:brightness-125 disabled:opacity-60',
                  )}
                >
                  {status === 'sending' ? 'Sending' : 'Send reply'}
                </button>
                {status === 'failed' ? (
                  <p className="text-center text-(--er-secondary) text-base">
                    That did not go through. Please try again.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
};
