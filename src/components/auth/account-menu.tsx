'use client';

import { Globe, Hourglass, LogOut, Plug, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signInHref } from '@/auth/links';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAccount } from './use-account';

const Avatar = ({ src, name, className }: { src: string; name: string; className: string }) =>
  src === '' ? (
    <span
      className={cn(
        className,
        'flex items-center justify-center rounded-full bg-muted font-medium',
      )}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  ) : (
    // biome-ignore lint/performance/noImgElement: avatars come from the sign-in provider's CDN
    <img src={src} alt="" className={cn(className, 'rounded-full object-cover')} />
  );

export const AccountMenu = () => {
  const { loaded, user, signOut } = useAccount();
  const pathname = usePathname();
  if (!loaded) {
    return <span className="h-8 w-20" />;
  }
  if (user === null) {
    return (
      <div className="flex items-center gap-1.5">
        <Button asChild size="sm" variant="ghost">
          <Link href={signInHref(pathname)}>Sign in</Link>
        </Button>
        <Button asChild size="sm" className="rounded-full">
          <Link href={`/sign-up?redirect_url=${encodeURIComponent(pathname)}`}>Sign up</Link>
        </Button>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Your account"
        className="flex items-center gap-2 rounded-full py-1 pr-2.5 pl-1 text-foreground outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar src={user.imageUrl} name={user.name} className="size-7 text-xs" />
        <span className="hidden max-w-32 truncate font-medium text-sm sm:inline">
          {user.name.split(' ')[0]}
        </span>
        {user.approved ? null : (
          <Hourglass className="size-3.5 text-amber-500" aria-label="Waiting for approval" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate font-normal text-muted-foreground text-xs">{user.email}</span>
          <span
            className={cn(
              'mt-1 w-fit rounded-full px-2 py-0.5 font-medium text-[10px]',
              user.approved
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
            )}
          >
            {user.approved ? 'Approved' : 'Waiting for approval'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserRound />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/websites">
            <Globe />
            My websites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/integrations">
            <Plug />
            MCP & API keys
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut().catch(() => undefined)}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
