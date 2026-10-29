'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollToSection } from '../../kit/scroll-to-section';
import { CAPS, SCRIPT } from './fonts';

const SECTIONS = [
  { id: 'er-invitation', label: 'Invitation' },
  { id: 'er-story', label: 'Our story' },
  { id: 'er-venue', label: 'The venue' },
  { id: 'er-schedule', label: 'Order of the day' },
  { id: 'er-details', label: 'Details & FAQs' },
  { id: 'er-rsvp', label: 'RSVP' },
] as const;

export const SiteNav = ({ monogram }: { monogram: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-30 border-(--er-accent)/30 border-b bg-(--er-bg)/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <button
          type="button"
          onClick={() => scrollToSection('er-invitation')}
          className={cn(SCRIPT, 'text-2xl text-(--er-text)')}
        >
          {monogram}
        </button>
        <ul className="hidden items-center gap-6 @3xl:flex">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(CAPS, 'text-(--er-muted) text-[11px] hover:text-(--er-text)')}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-(--er-text) @3xl:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <ul className="flex flex-col gap-1 border-(--er-accent)/30 border-t px-5 py-3 @3xl:hidden">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  scrollToSection(section.id);
                }}
                className={cn(CAPS, 'w-full py-2 text-left text-(--er-text) text-xs')}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
};
