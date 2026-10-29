import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const connect = () => {
  // biome-ignore lint/style/noProcessEnv: the database connection string is server-only configuration
  const { DATABASE_URL: url } = process.env;
  if (url === undefined || url === '') {
    throw new Error('Set DATABASE_URL to the Postgres connection string.');
  }
  return drizzle({ client: neon(url) });
};

let connection: ReturnType<typeof connect> | null = null;

export const database = () => {
  connection ??= connect();
  return connection;
};
