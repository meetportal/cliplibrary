import { AbsoluteFill, Sequence } from 'remotion';
import type { Project } from '@/project';
import { ElementView } from './element-view';

const PROJECT_ROOT_CLASS = 'neuclip-project';

const PROJECT_CANVAS_CSS = `.${PROJECT_ROOT_CLASS} canvas { contain: paint; }`;

export const ProjectComposition = (project: Project) => (
  <AbsoluteFill className={PROJECT_ROOT_CLASS} style={{ backgroundColor: project.background }}>
    <style>{PROJECT_CANVAS_CSS}</style>
    {project.tracks.toReversed().map((track) => (
      <AbsoluteFill key={track.id}>
        {track.elements.map((element) => (
          <Sequence
            key={element.id}
            from={element.from}
            durationInFrames={element.durationInFrames}
          >
            <ElementView element={element} />
          </Sequence>
        ))}
      </AbsoluteFill>
    ))}
  </AbsoluteFill>
);
