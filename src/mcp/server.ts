import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogTools } from './catalog-tools';
import { registerVideoTools } from './video-tools';

const INSTRUCTIONS = `Clip Library builds short promo and launch videos from a library of labelled, editable animation clips.
Workflow: search_clips for each beat of the video (opener, feature, proof, cta, closer), get_clip to learn a clip's props, create_video with the chosen clips and their props, then add_clip and edit_video to refine. Each call returns the whole video and an editorUrl; nothing is stored on the server, so pass the latest video into the next call and give the person the latest editorUrl to open it in the browser editor.`;

export const createMcpServer = (origin: string): McpServer => {
  const server = new McpServer(
    { name: 'cliplibrary', version: '0.1.0' },
    { instructions: INSTRUCTIONS },
  );
  registerCatalogTools(server, origin);
  registerVideoTools(server, origin);
  return server;
};
