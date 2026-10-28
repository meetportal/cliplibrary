import { describe, expect, it, mock } from 'bun:test';

mock.module('@/components/clip-timeline/clip-preview', () => ({
  ClipPreview: () => null,
}));

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { seedProjectForClip } from '@/core';
import { placeClip } from '@/live/video-builder';
import type { Project } from '@/project';

const renderEditor = () =>
  render(
    <ClipTimelineEditor
      title="Phone Spin In"
      storageKey="cliplibrary-clip:phone-spin-in"
      initialProject={seedProjectForClip('phone-spin-in')}
      demoSrc={null}
    />,
  );

describe('ClipTimelineEditor', () => {
  it('renders the clip as a composition element block on the timeline', () => {
    renderEditor();
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(1);
  });

  it('shows element property controls for the auto-selected element', () => {
    renderEditor();
    expect(screen.getByText('Transform')).toBeInTheDocument();
    expect(screen.getByLabelText('From (frame)')).toBeInTheDocument();
  });

  it('inserts another built-in animation as a second composition block', () => {
    renderEditor();
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Add animation'), {
      target: { value: 'scene-transition' },
    });
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(2);
  });

  it('follows remote projects and publishes local edits when synced', async () => {
    const remote = seedProjectForClip('phone-spin-in');
    const published: Project[] = [];
    const publish = (project: Project) => published.push(project);
    const view = render(
      <ClipTimelineEditor
        title="Live"
        initialProject={remote}
        demoSrc={null}
        sync={{ remote, publish }}
        sidebar={<p>Agent activity</p>}
      />,
    );
    expect(screen.getByText('Agent activity')).toBeInTheDocument();

    const grown = placeClip(remote, { clipId: 'brand-reveal' });
    view.rerender(
      <ClipTimelineEditor
        title="Live"
        initialProject={remote}
        demoSrc={null}
        sync={{ remote: grown, publish }}
      />,
    );
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(2);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(published).toHaveLength(0);

    fireEvent.change(screen.getByLabelText('Add animation'), {
      target: { value: 'scene-transition' },
    });
    await waitFor(() => expect(published).toHaveLength(1));
    expect(published[0]?.tracks[0]?.elements).toHaveLength(3);
  });
});
