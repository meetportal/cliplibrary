'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type LiveSession,
  type LiveSessionSummary,
  type ServerMessage,
  serverMessageSchema,
} from '@/live/protocol';
import type { Project } from '@/project';
import { LIVE_SERVER_URL } from './live.config';

export type LiveStatus = 'connecting' | 'open' | 'closed';

const RECONNECT_MS = 1500;

export const liveSocketUrl = (sessionId: string | null): string => {
  const url = new URL('/ws', LIVE_SERVER_URL.replace(/^http/, 'ws'));
  if (sessionId !== null) {
    url.searchParams.set('session', sessionId);
  }
  return url.href;
};

const useLiveSocket = (
  sessionId: string | null,
  onMessage: (message: ServerMessage) => void,
): { status: LiveStatus; send: (data: string) => void } => {
  const [status, setStatus] = useState<LiveStatus>('connecting');
  const socket = useRef<WebSocket | null>(null);
  const handler = useRef(onMessage);
  handler.current = onMessage;

  useEffect(() => {
    let retry: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const connect = () => {
      const next = new WebSocket(liveSocketUrl(sessionId));
      socket.current = next;
      next.addEventListener('open', () => setStatus('open'));
      next.addEventListener('message', (event) => {
        const parsed = serverMessageSchema.safeParse(JSON.parse(String(event.data)));
        if (parsed.success) {
          handler.current(parsed.data);
        }
      });
      next.addEventListener('close', () => {
        if (!disposed) {
          setStatus('closed');
          retry = setTimeout(connect, RECONNECT_MS);
        }
      });
    };
    connect();
    return () => {
      disposed = true;
      clearTimeout(retry);
      socket.current?.close();
    };
  }, [sessionId]);

  const send = useCallback((data: string) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(data);
    }
  }, []);

  return { status, send };
};

export const useLiveSessions = (): {
  status: LiveStatus;
  sessions: LiveSessionSummary[] | null;
} => {
  const [sessions, setSessions] = useState<LiveSessionSummary[] | null>(null);
  const { status } = useLiveSocket(null, (message) => {
    if (message.type === 'sessions') {
      setSessions(message.sessions);
    }
  });
  return { status, sessions };
};

export interface LiveSessionState {
  status: LiveStatus;
  missing: boolean;
  session: LiveSession | null;
  project: Project | null;
  publish: (project: Project) => void;
}

export const useLiveSession = (sessionId: string): LiveSessionState => {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [missing, setMissing] = useState(false);
  const confirmed = useRef<number | null>(null);
  const base = useRef<number | null>(null);

  const { status, send } = useLiveSocket(sessionId, (message) => {
    if (message.type === 'missing') {
      setMissing(true);
    } else if (message.type === 'ack') {
      confirmed.current = message.version;
      base.current = message.version;
    } else if (message.type === 'session') {
      if (message.session.version !== confirmed.current) {
        setProject(message.session.project);
      }
      confirmed.current = message.session.version;
      base.current = message.session.version;
      setSession(message.session);
      setMissing(false);
    }
  });

  const publish = useCallback(
    (next: Project) => {
      if (base.current === null) {
        return;
      }
      send(JSON.stringify({ type: 'replace', baseVersion: base.current, project: next }));
      base.current += 1;
    },
    [send],
  );

  return { status, missing, session, project, publish };
};
