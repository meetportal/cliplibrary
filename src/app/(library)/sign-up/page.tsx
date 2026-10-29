import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { type AuthSearchParams, leaveIfSignedIn, resolveReturnTo } from '@/lib/auth-pages';

export const metadata: Metadata = { title: 'Create your account · Neuclip' };

const SignUpPage = async ({ searchParams }: { searchParams: AuthSearchParams }) => {
  const returnTo = await resolveReturnTo(searchParams);
  await leaveIfSignedIn(returnTo);
  return (
    <AuthShell
      title="Create your account"
      subtitle="Publish websites, edit with AI and connect neuclip to your tools."
      footer={
        <>
          Already have an account?{' '}
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm returnTo={returnTo} />
    </AuthShell>
  );
};

export default SignUpPage;
