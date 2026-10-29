import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { applyEdits, editOperationSchema } from '@/agent/edits';
import { jsonSchema } from '@/agent/instructions';
import { siteFieldGuide } from '@/agent/site';
import {
  checkSharedSite,
  editSitePath,
  publicSitePath,
  type SharedSite,
  type SiteLinkQuery,
} from '@/sites/site-link';
import { findSiteTemplate, SITE_TEMPLATES } from '@/sites/templates';
import { failure, json } from './results';
import { mergeProps } from './video-builder';

export interface SiteToolContext {
  sign: (site: SharedSite) => SiteLinkQuery;
}

const siteInput = z
  .object({
    slug: z.string(),
    templateId: z.string(),
    content: z.record(z.string(), z.unknown()),
  })
  .describe('The site object exactly as the last create_site or edit_site returned it');

export const registerSiteTools = (server: McpServer, origin: string, { sign }: SiteToolContext) => {
  const published = (candidate: unknown): CallToolResult => {
    const checked = checkSharedSite(candidate);
    if (!checked.ok) {
      return failure(checked.error);
    }
    const { site } = checked;
    const query = sign(site);
    return json({
      title: findSiteTemplate(site.templateId)?.headline(site.content) ?? site.slug,
      siteUrl: `${origin}${publicSitePath(site.slug, query)}`,
      editorUrl: `${origin}${editSitePath(site.templateId, query)}`,
      site,
    });
  };

  server.registerTool(
    'list_site_templates',
    {
      title: 'List website templates',
      description:
        'List the website templates people can publish, such as wedding invitation sites with a countdown, venue map and RSVP button. Each has a demo and a gallery preview.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    () =>
      json({
        templates: SITE_TEMPLATES.map(({ meta }) => ({
          id: meta.id,
          title: meta.title,
          description: meta.description,
          category: meta.category,
          tags: meta.tags,
          preview: `${origin}/site-previews/${meta.id}.jpg`,
          demo: `${origin}/preview/${meta.id}`,
        })),
      }),
  );

  server.registerTool(
    'get_site_template',
    {
      title: 'Get website template details',
      description:
        'Everything needed to fill one website template: its field guide (what each /content path controls), default content and the content JSON schema. Call this before create_site.',
      inputSchema: { templateId: z.string() },
      annotations: { readOnlyHint: true },
    },
    ({ templateId }) => {
      const template = findSiteTemplate(templateId);
      if (template === undefined) {
        return failure(`Unknown template "${templateId}". Use list_site_templates.`);
      }
      return json({
        id: template.id,
        title: template.meta.title,
        description: template.meta.description,
        fieldGuide: siteFieldGuide(template),
        defaultContent: template.defaults,
        contentSchema: JSON.parse(jsonSchema(template.schema)) as unknown,
      });
    },
  );

  server.registerTool(
    'create_site',
    {
      title: 'Publish a website',
      description:
        "Publish a website from a template. content is merged deeply over the template's default content (lists replace), then operations, if any, are applied as RFC 6902 JSON Patch against { templateId, content }. Websites are static and nothing is stored on the server: the whole site lives in its link. Share siteUrl with guests and editorUrl with the owner, and pass the returned site into edit_site for changes. Photos must be https image links.",
      inputSchema: {
        templateId: z.string(),
        slug: z.string().describe('Lowercase words joined by hyphens, for example maya-and-daniel'),
        content: z
          .record(z.string(), z.unknown())
          .optional()
          .describe('Content overrides, see get_site_template'),
        operations: z.array(editOperationSchema).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    ({ templateId, slug, content, operations }) => {
      const template = findSiteTemplate(templateId);
      if (template === undefined) {
        return failure(`Unknown template "${templateId}". Use list_site_templates.`);
      }
      const draft = { templateId, content: mergeProps(template.defaults, content ?? {}) };
      if (operations === undefined || operations.length === 0) {
        return published({ slug, ...draft });
      }
      const edited = applyEdits('site', draft, operations);
      return edited.ok ? published({ slug, ...edited.document }) : failure(edited.error);
    },
  );

  server.registerTool(
    'edit_site',
    {
      title: 'Edit a website',
      description:
        'Change a website with RFC 6902 JSON Patch operations against { templateId, content } (paths start with /content/, see get_site_template). Batch related changes in one call. Returns new siteUrl and editorUrl links: always share the newest ones, older links keep showing the older version. Set slug to move it to a new address.',
      inputSchema: {
        site: siteInput,
        operations: z.array(editOperationSchema),
        slug: z.string().optional().describe('A new address for the website'),
      },
      annotations: { readOnlyHint: true },
    },
    ({ site, operations, slug }) => {
      const edited = applyEdits(
        'site',
        { templateId: site.templateId, content: site.content },
        operations,
      );
      return edited.ok
        ? published({ slug: slug ?? site.slug, ...edited.document })
        : failure(edited.error);
    },
  );
};
