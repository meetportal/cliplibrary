'use client';

import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { isApprovedMetadata } from '@/auth/approval';

interface AccountUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  joinedAt: Date | null;
  approved: boolean;
}

export interface Account {
  loaded: boolean;
  user: AccountUser | null;
  signOut: () => Promise<void>;
}

export const useAccount = (): Account => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  return {
    loaded: isLoaded,
    user:
      isSignedIn === true && user !== null && user !== undefined
        ? {
            id: user.id,
            name: user.fullName ?? (email.split('@')[0] || 'You'),
            email,
            imageUrl: user.imageUrl,
            joinedAt: user.createdAt ?? null,
            approved: isApprovedMetadata(user.publicMetadata),
          }
        : null,
    signOut: () => clerk.signOut({ redirectUrl: '/' }),
  };
};

interface AuthErrorLike {
  message: string;
  longMessage?: string | undefined;
  errors?: readonly { message: string; longMessage?: string | undefined }[];
}

export const describeAuthError = (error: AuthErrorLike | null): string | null => {
  if (error === null) {
    return null;
  }
  const first = error.errors?.[0];
  const text = first?.longMessage ?? first?.message ?? error.longMessage ?? error.message;
  return /clerk/i.test(text) ? 'Something went wrong. Please try again.' : text;
};
