import 'server-only';
import { join } from 'node:path';
import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import { createSiteStore } from '@/sites/store';

export const siteStore = createSiteStore(
  createStorage({ driver: fsDriver({ base: join(process.cwd(), '.data', 'sites') }) }),
);
