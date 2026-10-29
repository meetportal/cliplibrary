import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogTools } from './catalog-tools';
import { registerSiteTools, type SiteToolContext } from './site-tools';
import { registerVideoTools } from './video-tools';

const INSTRUCTIONS = `Neuclip builds short promo and launch videos from a library of labelled, editable animation clips, and publishes websites from templates.
Videos: search_clips for each beat of the video (opener, feature, proof, cta, closer), get_clip to learn a clip's props, create_video with the chosen clips and their props, then add_clip and edit_video to refine. Each call returns the whole video and an editorUrl; videos are not stored on the server, so pass the latest video into the next call and give the person the latest editorUrl to open it in the browser editor.
Websites: list_site_templates, get_site_template to learn its content fields, then create_site to publish it at a slug the person chooses. Websites are static and not stored on the server: each call returns the whole site plus a siteUrl for guests and an editorUrl for the owner. Pass the latest site into edit_site for changes and always share the newest links.`;

export const createMcpServer = (origin: string, sites: SiteToolContext): McpServer => {
  const server = new McpServer(
    { name: 'neuclip', version: '0.2.0' },
    { instructions: INSTRUCTIONS },
  );
  registerCatalogTools(server, origin);
  registerVideoTools(server, origin);
  registerSiteTools(server, origin, sites);
  return server;
};
