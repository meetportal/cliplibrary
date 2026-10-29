import { index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { customAlphabet } from 'nanoid';
import type { Project } from '@/project';

// biome-ignore lint/security/noSecrets: the id alphabet, lowercase letters and digits
export const newId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
};

export const sites = pgTable(
  'sites',
  {
    id: text('id').primaryKey().$defaultFn(newId),
    slug: text('slug').notNull().unique(),
    ownerId: text('owner_id').notNull(),
    templateId: text('template_id').notNull(),
    content: jsonb('content').$type<Record<string, unknown>>().notNull(),
    draft: jsonb('draft').$type<Record<string, unknown>>(),
    ...timestamps,
  },
  (table) => [index('sites_owner_updated_idx').on(table.ownerId, table.updatedAt)],
);

export const videos = pgTable(
  'videos',
  {
    id: text('id').primaryKey().$defaultFn(newId),
    ownerId: text('owner_id').notNull(),
    title: text('title').notNull(),
    project: jsonb('project').$type<Project>().notNull(),
    ...timestamps,
  },
  (table) => [index('videos_owner_updated_idx').on(table.ownerId, table.updatedAt)],
);
