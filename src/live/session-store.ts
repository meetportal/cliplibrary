import type { Project } from '@/project';
import type { LiveActivity, LiveSession } from './protocol';

const ACTIVITY_LIMIT = 60;
const EDITOR_COALESCE_MS = 10_000;

interface ActivityInput {
  source: LiveActivity['source'];
  action: string;
  summary: string;
  ok?: boolean;
  detail?: string | null;
}

export interface StoreEvent {
  session: LiveSession;
  origin: string | null;
}

type Listener = (event: StoreEvent) => void;

type ReplaceResult =
  | { ok: true; session: LiveSession }
  | { ok: false; reason: 'missing' | 'stale'; session: LiveSession | null };

export interface SessionStore {
  create: (title: string, project: Project) => LiveSession;
  get: (id: string) => LiveSession | null;
  list: () => LiveSession[];
  update: (id: string, project: Project, activity: ActivityInput) => LiveSession | null;
  replace: (
    id: string,
    baseVersion: number,
    project: Project,
    origin: string,
    activity: ActivityInput,
  ) => ReplaceResult;
  record: (id: string, activity: ActivityInput) => LiveSession | null;
  subscribe: (listener: Listener) => () => void;
}

const shortId = (): string => crypto.randomUUID().slice(0, 8);

export const createSessionStore = (now: () => number = Date.now): SessionStore => {
  const sessions = new Map<string, LiveSession>();
  const listeners = new Set<Listener>();

  const emit = (session: LiveSession, origin: string | null): LiveSession => {
    sessions.set(session.id, session);
    for (const listener of listeners) {
      listener({ session, origin });
    }
    return session;
  };

  const entry = (activity: ActivityInput): LiveActivity => ({
    id: shortId(),
    at: now(),
    source: activity.source,
    action: activity.action,
    summary: activity.summary,
    ok: activity.ok ?? true,
    detail: activity.detail ?? null,
  });

  const coalesces = (last: LiveActivity | undefined, activity: ActivityInput): boolean =>
    last !== undefined &&
    last.source === 'editor' &&
    activity.source === 'editor' &&
    last.action === activity.action &&
    now() - last.at < EDITOR_COALESCE_MS;

  const withActivity = (session: LiveSession, activity: ActivityInput): LiveActivity[] => {
    const kept = coalesces(session.activity.at(-1), activity)
      ? session.activity.slice(0, -1)
      : session.activity;
    return [...kept, entry(activity)].slice(-ACTIVITY_LIMIT);
  };

  const commit = (
    session: LiveSession,
    project: Project,
    activity: ActivityInput,
    origin: string | null,
  ): LiveSession =>
    emit(
      {
        ...session,
        project,
        version: session.version + 1,
        updatedAt: now(),
        activity: withActivity(session, activity),
      },
      origin,
    );

  return {
    create: (title, project) => {
      const at = now();
      return emit(
        {
          id: shortId(),
          title,
          version: 0,
          createdAt: at,
          updatedAt: at,
          project,
          activity: [entry({ source: 'agent', action: 'create', summary: `Started "${title}"` })],
        },
        null,
      );
    },
    get: (id) => sessions.get(id) ?? null,
    list: () => [...sessions.values()].sort((a, b) => b.updatedAt - a.updatedAt),
    update: (id, project, activity) => {
      const session = sessions.get(id);
      return session === undefined ? null : commit(session, project, activity, null);
    },
    replace: (id, baseVersion, project, origin, activity) => {
      const session = sessions.get(id);
      if (session === undefined) {
        return { ok: false, reason: 'missing', session: null };
      }
      if (session.version !== baseVersion) {
        return { ok: false, reason: 'stale', session };
      }
      return { ok: true, session: commit(session, project, activity, origin) };
    },
    record: (id, activity) => {
      const session = sessions.get(id);
      return session === undefined
        ? null
        : emit({ ...session, activity: withActivity(session, activity) }, null);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
