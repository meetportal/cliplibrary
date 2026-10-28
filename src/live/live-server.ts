import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { Server, ServerWebSocket } from 'bun';
import { createLiveMcpServer, type LiveMcpOptions } from './mcp-server';
import {
  clientMessageSchema,
  type LiveSession,
  type ServerMessage,
  summarizeSession,
} from './protocol';

interface SocketData {
  clientId: string;
  sessionId: string | null;
}

type LiveSocket = ServerWebSocket<SocketData>;

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers': '*',
  'access-control-expose-headers': 'mcp-session-id',
};

const withCors = (response: Response): Response => {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
};

const send = (socket: LiveSocket, message: ServerMessage): void => {
  socket.send(JSON.stringify(message));
};

export interface LiveServerOptions extends LiveMcpOptions {
  port: number;
}

export const startLiveServer = (options: LiveServerOptions): Server<SocketData> => {
  const { store } = options;
  const watchers = new Map<string | null, Set<LiveSocket>>();

  const watching = (sessionId: string | null): Set<LiveSocket> => {
    const existing = watchers.get(sessionId);
    if (existing !== undefined) {
      return existing;
    }
    const created = new Set<LiveSocket>();
    watchers.set(sessionId, created);
    return created;
  };

  const sessionsMessage = (): ServerMessage => ({
    type: 'sessions',
    sessions: store.list().map(summarizeSession),
  });

  store.subscribe(({ session, origin }) => {
    for (const socket of watching(session.id)) {
      if (socket.data.clientId !== origin) {
        send(socket, { type: 'session', session });
      }
    }
    for (const socket of watching(null)) {
      send(socket, sessionsMessage());
    }
  });

  const handleMcp = async (request: Request): Promise<Response> => {
    const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
    const server = createLiveMcpServer(options);
    await server.connect(transport);
    return transport.handleRequest(request);
  };

  const greet = (socket: LiveSocket, session: LiveSession | null): void => {
    const { sessionId } = socket.data;
    if (sessionId === null) {
      send(socket, sessionsMessage());
    } else if (session === null) {
      send(socket, { type: 'missing', sessionId });
    } else {
      send(socket, { type: 'session', session });
    }
  };

  const onMessage = (socket: LiveSocket, raw: string | Buffer): void => {
    const { sessionId, clientId } = socket.data;
    const parsed = clientMessageSchema.safeParse(JSON.parse(String(raw)));
    if (sessionId === null || !parsed.success) {
      return;
    }
    const result = store.replace(
      sessionId,
      parsed.data.baseVersion,
      parsed.data.project,
      clientId,
      {
        source: 'editor',
        action: 'edit',
        summary: 'Edited in the browser',
      },
    );
    if (result.ok) {
      send(socket, { type: 'ack', version: result.session.version });
    } else {
      greet(socket, result.session);
    }
  };

  return Bun.serve<SocketData>({
    port: options.port,
    idleTimeout: 255,
    fetch: async (request, server) => {
      const url = new URL(request.url);
      if (request.method === 'OPTIONS') {
        return withCors(new Response(null, { status: 204 }));
      }
      if (url.pathname === '/ws') {
        const upgraded = server.upgrade(request, {
          data: { clientId: crypto.randomUUID(), sessionId: url.searchParams.get('session') },
        });
        return upgraded ? undefined : new Response('Expected a WebSocket', { status: 426 });
      }
      if (url.pathname === '/mcp') {
        return withCors(await handleMcp(request));
      }
      if (url.pathname === '/health') {
        return withCors(Response.json({ ok: true, videos: store.list().length }));
      }
      return withCors(new Response('Not found', { status: 404 }));
    },
    websocket: {
      open: (socket) => {
        watching(socket.data.sessionId).add(socket);
        greet(socket, socket.data.sessionId === null ? null : store.get(socket.data.sessionId));
      },
      message: onMessage,
      close: (socket) => {
        watching(socket.data.sessionId).delete(socket);
      },
    },
  });
};
