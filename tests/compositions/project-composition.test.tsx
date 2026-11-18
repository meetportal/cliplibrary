import { describe, expect, it, mock } from 'bun:test';

const FakeCompositionElementView = () => (
  <canvas data-testid="scene-canvas" style={{ position: 'absolute', left: 120, top: 80 }} />
);

mock.module('@/compositions/project/elements/composition-element', () => ({
  CompositionElementView: FakeCompositionElementView,
}));

import { Thumbnail } from '@remotion/player';
import { render } from '@testing-library/react';
import { createCompositionElement, createTextElement, createTrack, type Project } from '@/project';

const { ProjectComposition } = await import('@/compositions/project/project-composition');

const renderProject = (project: Project) =>
  render(
    <Thumbnail
      component={ProjectComposition}
      inputProps={project}
      compositionWidth={project.width}
      compositionHeight={project.height}
      durationInFrames={project.durationInFrames}
      fps={project.fps}
      frameToDisplay={0}
    />,
  );

const trackWith = (content: string) => {
  const track = createTrack(content);
  track.elements.push(createTextElement({ content, from: 0, durationInFrames: 30 }));
  return track;
};

describe('ProjectComposition', () => {
  it('paints the first track last so it sits on top without relying on z-index', () => {
    const project: Project = {
      fps: 30,
      width: 640,
      height: 360,
      durationInFrames: 30,
      background: '#000000',
      tracks: [trackWith('top layer'), trackWith('bottom layer')],
    };
    const { container } = renderProject(project);
    const text = container.textContent ?? '';
    expect(text.indexOf('bottom layer')).toBeGreaterThanOrEqual(0);
    expect(text.indexOf('bottom layer')).toBeLessThan(text.indexOf('top layer'));
    expect(container.innerHTML).not.toContain('z-index');
  });

  it('gives every scene canvas paint containment so the browser export captures it in place', () => {
    const track = createTrack('scene');
    track.elements.push(createCompositionElement('scene', {}, { from: 0, durationInFrames: 30 }));
    const project: Project = {
      fps: 30,
      width: 640,
      height: 360,
      durationInFrames: 30,
      background: '#000000',
      tracks: [track],
    };
    const { getByTestId } = renderProject(project);
    expect(getComputedStyle(getByTestId('scene-canvas')).contain).toBe('paint');
  });
});
