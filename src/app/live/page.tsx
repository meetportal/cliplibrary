import type { Metadata } from 'next';
import { LiveSessions } from '@/components/live/live-sessions';

export const metadata: Metadata = { title: 'Live videos · Clip Library' };

const LivePage = () => <LiveSessions />;

export default LivePage;
