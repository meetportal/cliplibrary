import { AbsoluteFill, Composition, Freeze, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ComingSoonNewspaperProps,
  comingSoonNewspaperDefaults,
  comingSoonNewspaperMeta,
  comingSoonNewspaperSchema,
} from '@/schemas';
import { NewspaperPrints } from '../../coming-soon-newspaper/newspaper-prints';
import { COMING_SOON_PLATE, LAST_PLATE_FRAME } from '../../coming-soon-newspaper/plate';
import { WordmarkOutro } from '../../coming-soon-newspaper/wordmark';
import { cameraFraming } from '../../elevator-newspaper/camera';
import { FootageStage } from '../../footage/footage-stage';
import { smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const ComingSoonNewspaper = (props: ComingSoonNewspaperProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const plateFrame = Math.min(frame, LAST_PLATE_FRAME);
  const framing = cameraFraming(plateFrame, props.camera, width, height);
  const { dim } = props;
  const dimmed = dim.amount * tween(frame, [dim.start, dim.start + dim.frames], [0, 1], smooth);
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill style={{ backgroundColor: dim.color, overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            transformOrigin: '0 0',
            transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.scale})`,
          }}
        >
          <Freeze frame={LAST_PLATE_FRAME} active={frame > LAST_PLATE_FRAME}>
            <FootageStage plate={COMING_SOON_PLATE} frame={plateFrame}>
              <NewspaperPrints props={props} frame={plateFrame} />
            </FootageStage>
          </Freeze>
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: dim.color, opacity: dimmed }} />
        <WordmarkOutro wordmark={props.wordmark} frame={frame} />
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const comingSoonNewspaperScene: SceneModule = {
  id: 'coming-soon-newspaper',
  component: ComingSoonNewspaper,
  render: (key) => (
    <Composition
      key={key}
      id="coming-soon-newspaper"
      component={ComingSoonNewspaper}
      schema={comingSoonNewspaperSchema}
      defaultProps={comingSoonNewspaperDefaults}
      durationInFrames={comingSoonNewspaperMeta.durationInFrames}
      fps={comingSoonNewspaperMeta.fps}
      width={comingSoonNewspaperMeta.width}
      height={comingSoonNewspaperMeta.height}
    />
  ),
};
