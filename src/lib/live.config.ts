declare global {
  // biome-ignore lint/style/noNamespace: Next.js types process.env through the NodeJS namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_LIVE_SERVER_URL?: string;
    }
  }
}

export const LIVE_SERVER_URL = (
  process.env.NEXT_PUBLIC_LIVE_SERVER_URL ?? 'http://localhost:3210'
).replace(/\/$/, '');
