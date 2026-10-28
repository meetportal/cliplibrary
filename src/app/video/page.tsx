import type { Metadata } from 'next';
import { SharedVideoEditor } from '@/components/video/shared-video-editor';

export const metadata: Metadata = { title: 'Video · Clip Library' };

const VideoPage = () => <SharedVideoEditor />;

export default VideoPage;
