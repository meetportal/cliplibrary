import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogTools } from './catalog-tools';
import { registerSiteTools } from './site-tools';
import { registerVideoTools } from './video-tools';

const INSTRUCTIONS = `Neuclip builds short promo and launch videos from a library of labelled, editable animation clips, and publishes websites from templates.
Videos: search_clips for each beat of the video (opener, feature, proof, cta, closer), get_clip to learn a clip's props, create_video with the chosen clips and their props, then add_clip and edit_video with its videoId to refine. Videos are saved to the person's account and their editorUrl never changes. The person can also edit in the browser, so call get_video before editing a video you have not seen in this conversation. list_videos finds earlier videos.
Websites: list_site_templates, get_site_template to learn its content fields, then create_site to publish it at a slug the person chooses. Websites are saved to the person's account: create_site returns a siteId, a siteUrl for guests and an editorUrl for the owner, and edit_site changes the live website at the same links. get_site shows the current content and list_sites finds earlier websites.`;

export const createMcpServer = (origin: string, ownerId: string): McpServer => {
  const server = new McpServer(
    { name: 'neuclip', version: '0.3.0' },
    { instructions: INSTRUCTIONS },
  );
  registerCatalogTools(server, origin);
  registerVideoTools(server, origin, ownerId);
  registerSiteTools(server, origin, ownerId);
  return server;
};
