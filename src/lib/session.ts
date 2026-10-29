import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { isApprovedMetadata, PENDING_MESSAGE } from '@/auth/approval';

export type Access =
  | { kind: 'signed-out' }
  | { kind: 'pending'; userId: string }
  | { kind: 'approved'; userId: string };

export const currentUserId = async (): Promise<string | null> => (await auth()).userId;

export const currentAccess = async (): Promise<Access> => {
  const user = await currentUser();
  if (user === null) {
    return { kind: 'signed-out' };
  }
  return isApprovedMetadata(user.publicMetadata)
    ? { kind: 'approved', userId: user.id }
    : { kind: 'pending', userId: user.id };
};

export const isApprovedUser = async (userId: string): Promise<boolean> => {
  try {
    const user = await (await clerkClient()).users.getUser(userId);
    return isApprovedMetadata(user.publicMetadata);
  } catch {
    return false;
  }
};

export const accessDenied = (access: Exclude<Access, { kind: 'approved' }>): Response =>
  access.kind === 'signed-out'
    ? Response.json({ problem: 'Sign in to continue.' }, { status: 401 })
    : Response.json({ problem: PENDING_MESSAGE }, { status: 403 });
