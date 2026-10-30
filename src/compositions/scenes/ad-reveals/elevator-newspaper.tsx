import { Video } from '@remotion/media';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, Composition, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ElevatorNewspaperProps,
  elevatorNewspaperDefaults,
  elevatorNewspaperMeta,
  elevatorNewspaperSchema,
} from '@/schemas';
import { cameraFraming } from '../../elevator-newspaper/camera';
import { PLATE, trackedFrame } from '../../elevator-newspaper/page-track';
import { TrackedPage } from '../../elevator-newspaper/tracked-page';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const ElevatorNewspaper = (props: ElevatorNewspaperProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  const tracked = trackedFrame(frame);
  const framing = cameraFraming(frame, props.camera, width, height);
  const [doorLeft, doorRight] = tracked.doors;
  const page = { props, width: PLATE.width, height: PLATE.height };
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            transformOrigin: '0 0',
            transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.scale})`,
          }}
        >
          <Video src={staticFile(PLATE.src)} muted style={{ width: '100%', height: '100%' }} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: doorLeft,
              width: Math.max(0, doorRight - doorLeft),
              height: PLATE.height,
              overflow: 'hidden',
            }}
          >
            <ThreeCanvas
              width={PLATE.width}
              height={PLATE.height}
              orthographic
              dpr={pixelRatio}
              gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
              camera={{ position: [0, 0, 100], near: 1, far: 1000, zoom: 1 }}
              style={{ position: 'absolute', top: 0, left: -doorLeft }}
            >
              <TrackedPage
                {...page}
                side="cover"
                quad={tracked.left}
                light={tracked.light[0]}
                src={props.cover.photo}
              />
              <TrackedPage
                {...page}
                side="story"
                quad={tracked.right}
                light={tracked.light[1]}
                src={props.story.photo}
              />
            </ThreeCanvas>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const elevatorNewspaperScene: SceneModule = {
  id: 'elevator-newspaper',
  component: ElevatorNewspaper,
  render: (key) => (
    <Composition
      key={key}
      id="elevator-newspaper"
      component={ElevatorNewspaper}
      schema={elevatorNewspaperSchema}
      defaultProps={elevatorNewspaperDefaults}
      durationInFrames={elevatorNewspaperMeta.durationInFrames}
      fps={elevatorNewspaperMeta.fps}
      width={elevatorNewspaperMeta.width}
      height={elevatorNewspaperMeta.height}
    />
  ),
};
