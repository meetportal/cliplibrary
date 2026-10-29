import { redirect } from 'next/navigation';
import { safeReturnPath, signInHref } from '@/auth/links';
import { currentUserId } from './session';

export type AuthSearchParams = Promise<{ redirect_url?: string }>;

export const resolveReturnTo = async (searchParams: AuthSearchParams): Promise<string> =>
  safeReturnPath((await searchParams).redirect_url ?? null);

export const leaveIfSignedIn = async (returnTo: string): Promise<void> => {
  if ((await currentUserId()) !== null) {
    redirect(returnTo);
  }
};

export const requireUserId = async (returnTo: string): Promise<string> => {
  const userId = await currentUserId();
  if (userId === null) {
    redirect(signInHref(returnTo));
  }
  return userId;
};
