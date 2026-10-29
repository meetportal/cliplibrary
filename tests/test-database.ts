import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

const testDatabase = drizzle({ client: new PGlite() });

let migrated: Promise<void> | null = null;

export const database = () => testDatabase;

export const resetTestDatabase = async (): Promise<void> => {
  migrated ??= migrate(testDatabase, { migrationsFolder: 'drizzle' });
  await migrated;
  await testDatabase.execute(sql`truncate table sites, videos`);
};
