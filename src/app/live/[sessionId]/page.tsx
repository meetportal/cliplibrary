import type { Metadata } from 'next';
import { LiveSessionEditor } from '@/components/live/live-session-editor';

export const metadata: Metadata = { title: 'Live video · Clip Library' };

const LiveSessionPage = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;
  return <LiveSessionEditor sessionId={sessionId} />;
};

export default LiveSessionPage;
