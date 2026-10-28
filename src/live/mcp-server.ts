import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogTools } from './mcp-catalog-tools';
import { type LiveRenderer, registerVideoTools } from './mcp-video-tools';
import type { SessionStore } from './session-store';

const INSTRUCTIONS = `Clip Library builds short promo and launch videos from a library of labelled, editable animation clips.
Workflow: search_clips for each beat of the video (opener, feature, proof, cta, closer), get_clip to learn a clip's props, create_video with the chosen clips and their props, then add_clip and edit_video to refine. Every change shows live in the browser editor at the video's liveUrl, and people can edit there too, so call get_video before editing a video you have not touched for a while. Use render_frame to check the result.`;

export interface LiveMcpOptions {
  store: SessionStore;
  appUrl: string;
  renderer: LiveRenderer;
}

export const createLiveMcpServer = ({ store, appUrl, renderer }: LiveMcpOptions): McpServer => {
  const server = new McpServer(
    { name: 'cliplibrary', version: '0.1.0' },
    { instructions: INSTRUCTIONS },
  );
  registerCatalogTools(server, appUrl);
  registerVideoTools(server, store, appUrl, renderer);
  return server;
};
