'use client';

import { HandleSSOCallback } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_RETURN_PARAM, signInHref, withoutAuthReturn } from '@/auth/links';

export const AuthReturn = () => {
  const router = useRouter();
  const params = useSearchParams();
  if (params.get(AUTH_RETURN_PARAM) === null) {
    return null;
  }
  const destination = () => withoutAuthReturn(new URL(window.location.href));
  return (
    <HandleSSOCallback
      navigateToApp={({ decorateUrl }) => {
        const url = decorateUrl(destination());
        if (url.startsWith('http')) {
          window.location.href = url;
        } else {
          router.replace(url);
          router.refresh();
        }
      }}
      navigateToSignIn={() => router.replace(`${signInHref(destination())}&resume=1`)}
      navigateToSignUp={() =>
        router.replace(`/sign-up?redirect_url=${encodeURIComponent(destination())}&resume=1`)
      }
    />
  );
};
