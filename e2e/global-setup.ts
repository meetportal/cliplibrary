import { createClerkClient } from '@clerk/backend';
import { clerkSetup } from '@clerk/testing/playwright';
import { isApprovedMetadata } from '../src/auth/approval';

export const E2E_USER_EMAIL = 'e2e+clerk_test@neuclip.dev';

const ensureApprovedUser = async (): Promise<void> => {
  // biome-ignore lint/style/noProcessEnv: the end-to-end suite reads its auth secret from CI
  const { CLERK_SECRET_KEY: secretKey } = process.env;
  if (secretKey === undefined) {
    throw new Error('Set CLERK_SECRET_KEY to run the end-to-end suite.');
  }
  const { users } = createClerkClient({ secretKey });
  const { data } = await users.getUserList({ emailAddress: [E2E_USER_EMAIL] });
  const [existing] = data;
  if (existing === undefined) {
    await users.createUser({
      emailAddress: [E2E_USER_EMAIL],
      firstName: 'End-to-end',
      lastName: 'Tester',
      skipPasswordRequirement: true,
      publicMetadata: { approved: true },
    });
  } else if (!isApprovedMetadata(existing.publicMetadata)) {
    await users.updateUserMetadata(existing.id, { publicMetadata: { approved: true } });
  }
};

const globalSetup = async (): Promise<void> => {
  await clerkSetup();
  await ensureApprovedUser();
};

export default globalSetup;
