import { afterEach, expect, mock } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register({ url: 'http://localhost:3000' });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: mock(),
    removeEventListener: mock(),
    addListener: mock(),
    removeListener: mock(),
    dispatchEvent: mock(),
  }),
});

if (typeof Element.prototype.scrollIntoView !== 'function') {
  Object.defineProperty(Element.prototype, 'scrollIntoView', { writable: true, value: mock() });
}

if (!('ResizeObserver' in globalThis)) {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: class {
      observe = mock();
      unobserve = mock();
      disconnect = mock();
    },
  });
}

const matchers = await import('@testing-library/jest-dom/matchers');
expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0]);

const { cleanup } = await import('@testing-library/react');
afterEach(() => {
  cleanup();
});

mock.module('server-only', () => ({}));

const signedInUser = {
  id: 'user_test',
  fullName: 'Test User',
  imageUrl: '',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  primaryEmailAddress: { emailAddress: 'test@example.com' },
  publicMetadata: { approved: true },
};

mock.module('@clerk/nextjs', () => ({
  useAuth: () => ({ isLoaded: true, isSignedIn: true, userId: signedInUser.id }),
  useUser: () => ({ isLoaded: true, isSignedIn: true, user: signedInUser }),
  useClerk: () => ({ loaded: true, signOut: () => Promise.resolve() }),
}));

mock.module('@/db/client', () => import('./tests/test-database'));
