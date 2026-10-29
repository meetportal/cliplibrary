'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useFinish = (returnTo: string) => {
  const router = useRouter();
  return useCallback(
    ({ decorateUrl }: { decorateUrl: (url: string) => string }) => {
      const url = decorateUrl(returnTo);
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    },
    [returnTo, router],
  );
};
