import 'server-only';
import { clerkClient } from '@clerk/nextjs/server';

export interface ApiKeySummary {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export type KeyResult<T> = { ok: true; value: T } | { ok: false; status: number; problem: string };

const NOT_ENABLED =
  'API keys are not switched on for this app yet. An admin needs to enable them before you can connect MCP clients.';

const failure = (error: unknown): { ok: false; status: number; problem: string } => {
  const text = error instanceof Error ? error.message : String(error);
  return /not enabled|feature_not_enabled/i.test(JSON.stringify(error) + text)
    ? { ok: false, status: 503, problem: NOT_ENABLED }
    : { ok: false, status: 502, problem: 'Could not reach the key service. Please try again.' };
};

const keys = async () => (await clerkClient()).apiKeys;

const isoOrNull = (value: number | null | undefined): string | null =>
  typeof value === 'number' ? new Date(value).toISOString() : null;

export const listApiKeys = async (userId: string): Promise<KeyResult<ApiKeySummary[]>> => {
  try {
    const { data } = await (await keys()).list({ subject: userId });
    return {
      ok: true,
      value: data
        .filter((key) => !(key.revoked || key.expired))
        .map((key) => ({
          id: key.id,
          name: key.name,
          createdAt: new Date(key.createdAt).toISOString(),
          lastUsedAt: isoOrNull(key.lastUsedAt),
        })),
    };
  } catch (error) {
    return failure(error);
  }
};

const MAX_NAME_ATTEMPTS = 20;

const isNameTaken = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && 'status' in error && error.status === 409;

const createUniquelyNamed = async (userId: string, name: string, attempt = 1) => {
  const candidate = attempt === 1 ? name : `${name} ${attempt}`;
  try {
    return await (await keys()).create({ name: candidate, subject: userId, createdBy: userId });
  } catch (error) {
    if (isNameTaken(error) && attempt < MAX_NAME_ATTEMPTS) {
      return createUniquelyNamed(userId, name, attempt + 1);
    }
    throw error;
  }
};

export const createApiKey = async (
  userId: string,
  name: string,
): Promise<KeyResult<{ secret: string; key: ApiKeySummary }>> => {
  try {
    const created = await createUniquelyNamed(userId, name);
    const { secret } =
      created.secret === undefined ? await (await keys()).getSecret(created.id) : created;
    return {
      ok: true,
      value: {
        secret: secret ?? '',
        key: {
          id: created.id,
          name: created.name,
          createdAt: new Date(created.createdAt).toISOString(),
          lastUsedAt: null,
        },
      },
    };
  } catch (error) {
    return failure(error);
  }
};

export const revokeApiKey = async (userId: string, keyId: string): Promise<KeyResult<null>> => {
  try {
    const api = await keys();
    if ((await api.get(keyId)).subject !== userId) {
      return { ok: false, status: 404, problem: 'That key does not exist.' };
    }
    await api.revoke({ apiKeyId: keyId, revocationReason: 'Revoked by its owner' });
    return { ok: true, value: null };
  } catch (error) {
    return failure(error);
  }
};
