'use client';

import { useCallback, useRef, useState } from 'react';
import { uploadAsset } from '@/lib/site-api';

const MAX_EDGE = 2000;
const KEEP_AS_IS_BYTES = 1_500_000;

const collectObjectUrls = (value: unknown, found: Set<string>): Set<string> => {
  if (typeof value === 'string' && value.startsWith('blob:')) {
    found.add(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      collectObjectUrls(item, found);
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value)) {
      collectObjectUrls(item, found);
    }
  }
  return found;
};

const swapStrings = (value: unknown, swaps: ReadonlyMap<string, string>): unknown => {
  if (typeof value === 'string') {
    return swaps.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => swapStrings(item, swaps));
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, swapStrings(item, swaps)]),
    );
  }
  return value;
};

type Values = Record<string, unknown>;

export const swapValues = (values: Values, swaps: ReadonlyMap<string, string>): Values =>
  Object.fromEntries(Object.entries(values).map(([key, item]) => [key, swapStrings(item, swaps)]));

const shrink = async (blob: Blob): Promise<Blob> => {
  if (blob.size <= KEEP_AS_IS_BYTES || blob.type === 'image/gif') {
    return blob;
  }
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = new OffscreenCanvas(
    Math.round(bitmap.width * scale),
    Math.round(bitmap.height * scale),
  );
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
};

export const usePhotoUploads = (apply: (swap: (current: Values) => Values) => void) => {
  const [pending, setPending] = useState(0);
  const [problem, setProblem] = useState<string | null>(null);
  const started = useRef(new Set<string>());

  const upload = useCallback(
    (next: unknown) => {
      const fresh = [...collectObjectUrls(next, new Set())].filter(
        (url) => !started.current.has(url),
      );
      for (const url of fresh) {
        started.current.add(url);
        setPending((count) => count + 1);
        fetch(url)
          .then((response) => response.blob())
          .then(shrink)
          .then(uploadAsset)
          .then((result) => {
            if (result.ok) {
              setProblem(null);
              apply((current) => swapValues(current, new Map([[url, result.value.url]])));
            } else {
              setProblem(result.problem);
            }
          })
          .catch(() => setProblem('That photo could not be uploaded.'))
          .finally(() => setPending((count) => count - 1));
      }
    },
    [apply],
  );

  return { upload, uploading: pending > 0, problem };
};
