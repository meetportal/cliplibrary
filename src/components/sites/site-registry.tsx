import type { CSSProperties, ReactNode } from 'react';

export interface BoundSite {
  scope: { className: string; style: CSSProperties };
  hasIntro: boolean;
  body: () => ReactNode;
  intro: (position: 'fixed' | 'absolute', onOpened: () => void) => ReactNode;
}

type Binder = (raw: unknown) => BoundSite | null;

const BINDERS: Record<string, Binder> = {};

export const bindSite = (templateId: string, content: unknown): BoundSite | null =>
  BINDERS[templateId]?.(content) ?? null;
