import type { CSSProperties, ReactNode } from 'react';
import type { z } from 'zod';
import { emeraldRoseSchema } from '@/sites/templates/weddings/emerald-rose';
import { inkAndLaceSchema } from '@/sites/templates/weddings/ink-and-lace';
import type { SiteView } from './site-view';
import { emeraldRoseView } from './templates/emerald-rose';
import { inkAndLaceView } from './templates/ink-and-lace';

export interface BoundSite {
  scope: { className: string; style: CSSProperties };
  hasIntro: boolean;
  body: () => ReactNode;
  intro: (position: 'fixed' | 'absolute', onOpened: () => void) => ReactNode;
}

type Binder = (raw: unknown) => BoundSite | null;

const bind =
  <Content,>(schema: z.ZodType<Content>, view: SiteView<Content>): Binder =>
  (raw) => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return null;
    }
    const content = parsed.data;
    const { Body, Intro } = view;
    return {
      scope: view.scope(content),
      hasIntro: view.hasIntro(content),
      body: () => <Body content={content} />,
      intro: (position, onOpened) => (
        <Intro content={content} position={position} onOpened={onOpened} />
      ),
    };
  };

const BINDERS: Record<string, Binder> = {
  'emerald-rose': bind(emeraldRoseSchema, emeraldRoseView),
  'ink-and-lace': bind(inkAndLaceSchema, inkAndLaceView),
};

export const bindSite = (templateId: string, content: unknown): BoundSite | null =>
  BINDERS[templateId]?.(content) ?? null;
