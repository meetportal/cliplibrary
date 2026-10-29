'use client';

import { useEffect, useRef, useState } from 'react';
import { saveSite } from '@/lib/site-api';

export type SaveState =
  | { kind: 'saved'; at: string | null }
  | { kind: 'pending' }
  | { kind: 'failed'; problem: string };

const SAVE_DELAY_MS = 800;

export const useAutosave = ({
  slug,
  editKey,
  value,
  ready,
}: {
  slug: string;
  editKey: string | null;
  value: unknown;
  ready: boolean;
}): SaveState => {
  const [state, setState] = useState<SaveState>({ kind: 'saved', at: null });
  const saved = useRef(value);

  useEffect(() => {
    if (editKey === null || Object.is(saved.current, value)) {
      return;
    }
    setState({ kind: 'pending' });
    if (!ready) {
      return;
    }
    const timer = setTimeout(() => {
      saveSite(slug, editKey, value)
        .then((result) => {
          if (result.ok) {
            saved.current = value;
            setState({ kind: 'saved', at: result.value.updatedAt });
          } else {
            setState({ kind: 'failed', problem: result.problem });
          }
        })
        .catch(() => undefined);
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [slug, editKey, value, ready]);

  return state;
};
