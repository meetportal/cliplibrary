import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { seedProjectForClip } from '@/core';
import { liveSocketUrl, useLiveSession, useLiveSessions } from '@/lib/use-live';
import type { LiveSession, ServerMessage } from '@/live/protocol';

class FakeSocket {
  static readonly OPEN = 1;
  static instances: FakeSocket[] = [];
  readonly sent: unknown[] = [];
  readyState = 0;
  private readonly listeners = new Map<string, ((event: { data?: string }) => void)[]>();

  constructor() {
    FakeSocket.instances.push(this);
  }

  addEventListener(type: string, listener: (event: { data?: string }) => void) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  send(data: string) {
    this.sent.push(JSON.parse(data));
  }

  close() {
    this.readyState = 3;
  }

  open() {
    this.readyState = FakeSocket.OPEN;
    for (const listener of this.listeners.get('open') ?? []) {
      listener({});
    }
  }

  receive(message: ServerMessage) {
    for (const listener of this.listeners.get('message') ?? []) {
      listener({ data: JSON.stringify(message) });
    }
  }
}

const original = globalThis.WebSocket;

beforeEach(() => {
  FakeSocket.instances = [];
  globalThis.WebSocket = FakeSocket as unknown as typeof WebSocket;
});

afterEach(() => {
  globalThis.WebSocket = original;
});

const project = seedProjectForClip('brand-reveal');

const session = (version: number, background = '#0a0a0a'): LiveSession => ({
  id: 'abc',
  title: 'Launch',
  version,
  createdAt: 1,
  updatedAt: 2,
  project: { ...project, background },
  activity: [],
});

const socket = (): FakeSocket => {
  const last = FakeSocket.instances.at(-1);
  if (last === undefined) {
    throw new Error('no socket');
  }
  return last;
};

describe('liveSocketUrl', () => {
  it('points at the live server websocket', () => {
    expect(liveSocketUrl(null)).toBe('ws://localhost:3210/ws');
    expect(liveSocketUrl('abc')).toBe('ws://localhost:3210/ws?session=abc');
  });
});

describe('useLiveSessions', () => {
  it('lists sessions pushed by the server', () => {
    const { result } = renderHook(() => useLiveSessions());
    act(() => {
      socket().open();
      socket().receive({ type: 'sessions', sessions: [] });
    });
    expect(result.current).toEqual({ status: 'open', sessions: [] });
  });
});

describe('useLiveSession', () => {
  it('takes remote projects, keeps the project on activity-only updates and publishes edits', () => {
    const { result } = renderHook(() => useLiveSession('abc'));
    act(() => {
      socket().open();
      socket().receive({ type: 'session', session: session(3) });
    });
    const first = result.current.project;
    expect(first?.background).toBe('#0a0a0a');

    act(() => socket().receive({ type: 'session', session: session(3) }));
    expect(result.current.project).toBe(first);

    act(() => result.current.publish({ ...project, background: '#ffffff' }));
    act(() => result.current.publish({ ...project, background: '#eeeeee' }));
    expect(socket().sent).toMatchObject([
      { type: 'replace', baseVersion: 3 },
      { type: 'replace', baseVersion: 4 },
    ]);

    act(() => socket().receive({ type: 'ack', version: 4 }));
    expect(result.current.project).toBe(first);

    act(() => socket().receive({ type: 'session', session: session(6, '#222222') }));
    expect(result.current.project?.background).toBe('#222222');
  });

  it('reports a session the server does not have', () => {
    const { result } = renderHook(() => useLiveSession('gone'));
    act(() => socket().receive({ type: 'missing', sessionId: 'gone' }));
    expect(result.current.missing).toBe(true);
  });
});
