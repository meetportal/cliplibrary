import { Video } from '@remotion/media';
import { ThreeCanvas } from '@remotion/three';
import { useCallback, useState } from 'react';
import {
  AbsoluteFill,
  Composition,
  getRemotionEnvironment,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  type ElevatorNewspaperProps,
  elevatorNewspaperDefaults,
  elevatorNewspaperMeta,
  elevatorNewspaperSchema,
} from '@/schemas';
import { cameraFraming } from '../../elevator-newspaper/camera';
import { PLATE } from '../../elevator-newspaper/page-track';
import { createPlateSource, receivePlateFrame } from '../../elevator-newspaper/plate-source';
import { SyncedSpread } from '../../elevator-newspaper/synced-spread';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const PLATE_HEIGHT = PLATE.height + PLATE.stampRows;

const usePreviewPlate = () => {
  const [source] = useState(() =>
    getRemotionEnvironment().isRendering ? null : createPlateSource(PLATE.width, PLATE_HEIGHT),
  );
  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      if (source !== null) {
        receivePlateFrame(source, frame as HTMLCanvasElement, PLATE.height);
      }
    },
    [source],
  );
  return { source, onVideoFrame };
};

const ElevatorNewspaper = (props: ElevatorNewspaperProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  const framing = cameraFraming(frame, props.camera, width, height);
  const { source, onVideoFrame } = usePreviewPlate();
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            transformOrigin: '0 0',
            transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.scale})`,
          }}
        >
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <Video
              src={staticFile(PLATE.src)}
              muted
              headless={source !== null}
              onVideoFrame={source === null ? undefined : onVideoFrame}
              style={{ width: PLATE.width, height: PLATE_HEIGHT }}
            />
          </AbsoluteFill>
          <ThreeCanvas
            width={PLATE.width}
            height={PLATE.height}
            orthographic
            dpr={pixelRatio}
            gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
            camera={{ position: [0, 0, 100], near: 1, far: 1000, zoom: 1 }}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <SyncedSpread props={props} frame={frame} source={source} />
          </ThreeCanvas>
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
