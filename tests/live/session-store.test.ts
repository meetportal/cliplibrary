import { describe, expect, it } from 'bun:test';
import { seedProjectForClip } from '@/core';
import { createSessionStore, type StoreEvent } from '@/live/session-store';

const project = seedProjectForClip('brand-reveal');

const clockStore = () => {
  let time = 1_000;
  const store = createSessionStore(() => time);
  return { store, tick: (ms: number) => (time += ms) };
};

describe('createSessionStore', () => {
  it('creates a session at version 0 with a start entry and notifies listeners', () => {
    const { store } = clockStore();
    const events: StoreEvent[] = [];
    store.subscribe((event) => events.push(event));
    const session = store.create('Launch', project);
    expect(session.version).toBe(0);
    expect(session.activity.map((entry) => entry.action)).toEqual(['create']);
    expect(events).toEqual([{ session, origin: null }]);
    expect(store.get(session.id)).toBe(session);
  });

  it('bumps the version and logs agent updates', () => {
    const { store } = clockStore();
    const session = store.create('Launch', project);
    const updated = store.update(
      session.id,
      { ...project, background: '#ffffff' },
      {
        source: 'agent',
        action: 'edit_video',
        summary: 'White background',
      },
    );
    expect(updated?.version).toBe(1);
    expect(updated?.project.background).toBe('#ffffff');
    expect(updated?.activity.at(-1)).toMatchObject({
      source: 'agent',
      summary: 'White background',
    });
  });

  it('rejects an editor replace based on an old version', () => {
    const { store } = clockStore();
    const session = store.create('Launch', project);
    store.update(session.id, project, { source: 'agent', action: 'edit_video', summary: 'x' });
    const result = store.replace(session.id, 0, project, 'client', {
      source: 'editor',
      action: 'edit',
      summary: 'Edited',
    });
    expect(result).toMatchObject({ ok: false, reason: 'stale' });
    expect(
      store.replace('nope', 0, project, 'client', {
        source: 'editor',
        action: 'edit',
        summary: 'e',
      }),
    ).toEqual({
      ok: false,
      reason: 'missing',
      session: null,
    });
  });

  it('passes the origin through and coalesces quick editor edits', () => {
    const { store, tick } = clockStore();
    const origins: (string | null)[] = [];
    store.subscribe((event) => origins.push(event.origin));
    const session = store.create('Launch', project);
    const edit = { source: 'editor', action: 'edit', summary: 'Edited' } as const;
    store.replace(session.id, 0, project, 'a', edit);
    tick(2_000);
    const second = store.replace(session.id, 1, project, 'a', edit);
    expect(origins).toEqual([null, 'a', 'a']);
    expect(second.ok ? second.session.activity.length : 0).toBe(2);
    tick(20_000);
    const third = store.replace(session.id, 2, project, 'a', edit);
    expect(third.ok ? third.session.activity.length : 0).toBe(3);
  });

  it('lists the most recently changed session first', () => {
    const { store, tick } = clockStore();
    const first = store.create('First', project);
    tick(10);
    store.create('Second', project);
    tick(10);
    store.record(first.id, { source: 'agent', action: 'render_frame', summary: 'Looked' });
    store.update(first.id, project, { source: 'agent', action: 'edit_video', summary: 'Edit' });
    expect(store.list().map((session) => session.title)).toEqual(['First', 'Second']);
  });
});
