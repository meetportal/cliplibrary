import { currentUser } from '@clerk/nextjs/server';
import { Check, Hourglass, Lock, Plug } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { isApprovedMetadata, PENDING_MESSAGE } from '@/auth/approval';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button } from '@/components/ui/button';
import { requireUserId } from '@/lib/auth-pages';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Profile · Neuclip' };

const FEATURES = [
  { title: 'Edit with AI', detail: 'Describe a change and the AI editor makes it.' },
  { title: 'Publish websites', detail: 'Get a shareable link for any website template.' },
  { title: 'Connect MCP clients', detail: 'Build videos and websites from your own agent.' },
] as const;

const ProfilePage = async () => {
  await requireUserId('/account');
  const user = await currentUser();
  if (user === null) {
    return null;
  }
  const approved = isApprovedMetadata(user.publicMetadata);
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const name = user.fullName ?? email.split('@')[0] ?? 'You';
  const joined = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(user.createdAt);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        {/* biome-ignore lint/performance/noImgElement: avatars come from the sign-in provider's CDN */}
        <img src={user.imageUrl} alt="" className="size-20 rounded-full object-cover" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="truncate font-semibold text-2xl tracking-tight">{name}</h1>
          <p className="truncate text-muted-foreground text-sm">{email}</p>
          <p className="text-muted-foreground text-xs">Member since {joined}</p>
        </div>
        <SignOutButton />
      </section>

      <section
        className={cn(
          'flex items-start gap-3 rounded-2xl p-5',
          approved ? 'bg-emerald-500/10' : 'bg-amber-500/10',
        )}
      >
        {approved ? (
          <Check className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Hourglass className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">
            {approved ? 'Your account is approved' : 'Waiting for approval'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {approved ? 'Every feature below is open to you.' : PENDING_MESSAGE}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-lg">What you can do</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex flex-col gap-2 rounded-2xl bg-muted/50 p-4">
              <span className="flex items-center gap-2 font-medium text-sm">
                {approved ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="size-4 text-muted-foreground" />
                )}
                {feature.title}
              </span>
              <span className="text-muted-foreground text-sm">{feature.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col items-start gap-3 rounded-2xl bg-muted/50 p-5">
        <h2 className="font-semibold">Connect your agent</h2>
        <p className="text-muted-foreground text-sm">
          Create an API key and add neuclip to Claude Code, Cursor or any MCP client.
        </p>
        <Button asChild>
          <Link href="/integrations">
            <Plug />
            Set up MCP
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default ProfilePage;
