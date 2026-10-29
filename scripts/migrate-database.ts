import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const { DATABASE_URL: url } = Bun.env;
if (url === undefined || url === '') {
  console.error('Set DATABASE_URL to the Postgres connection string.');
  process.exit(1);
}

await migrate(drizzle({ client: neon(url) }), { migrationsFolder: 'drizzle' });
console.info('The database schema is up to date.');
