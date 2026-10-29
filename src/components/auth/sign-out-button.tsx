'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from './use-account';

export const SignOutButton = () => {
  const { signOut } = useAccount();
  return (
    <Button type="button" variant="outline" onClick={() => signOut().catch(() => undefined)}>
      <LogOut />
      Sign out
    </Button>
  );
};
