import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';
import { type AuthSearchParams, leaveIfSignedIn, resolveReturnTo } from '@/lib/auth-pages';

export const metadata: Metadata = { title: 'Sign in · Neuclip' };

const SignInPage = async ({ searchParams }: { searchParams: AuthSearchParams }) => {
  const returnTo = await resolveReturnTo(searchParams);
  await leaveIfSignedIn(returnTo);
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to publish websites, edit with AI and connect your tools."
      footer={
        <>
          New here?{' '}
          <Link
            href={`/sign-up?redirect_url=${encodeURIComponent(returnTo)}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm returnTo={returnTo} />
    </AuthShell>
  );
};

export default SignInPage;
