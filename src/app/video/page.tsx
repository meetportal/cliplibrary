import type { Metadata } from 'next';
import { SharedVideoEditor } from '@/components/video/shared-video-editor';

export const metadata: Metadata = { title: 'Video · Neuclip' };

const VideoPage = () => <SharedVideoEditor />;

export default VideoPage;
