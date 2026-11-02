import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MusicStudio } from '@/components/music/music-studio';
import { shareMetadata } from '@/lib/share-metadata';
import { findMusicPreset, MUSIC_PRESETS } from '@/music';

type Props = { params: Promise<{ presetId: string }> };

export const generateStaticParams = () => MUSIC_PRESETS.map((preset) => ({ presetId: preset.id }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const preset = findMusicPreset((await params).presetId);
  return preset === undefined
    ? { title: 'Music' }
    : shareMetadata(`${preset.title} · Neuclip`, preset.description);
};

const MusicPresetPage = async ({ params }: Props) => {
  const preset = findMusicPreset((await params).presetId);
  if (preset === undefined) {
    notFound();
  }
  return <MusicStudio preset={preset} />;
};

export default MusicPresetPage;
