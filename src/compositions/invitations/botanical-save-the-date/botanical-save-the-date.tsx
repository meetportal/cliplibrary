import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BotanicalSaveTheDateProps } from '@/schemas';
import { CardText } from './card-text';
import { facesOf, useFontsReady } from './fonts';
import { buildLayout } from './layout';
import { canvasMeasurer } from './measure';
import { shade } from './paint';
import { Scenery } from './scenery';
import { buildTimeline } from './timeline';
import { useLogo } from './use-logo';

export const BotanicalSaveTheDate = (props: BotanicalSaveTheDateProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const faces = facesOf(props.lettering);
  const ready = useFontsReady(faces);
  const logo = useLogo(props.logo);
  const layout = useMemo(
    () => buildLayout(props, facesOf(props.lettering), canvasMeasurer(ready)),
    [props, ready],
  );
  const timeline = useMemo(() => buildTimeline(props), [props]);
  const page = props.colors.background;
  return (
    <AbsoluteFill
      style={{
        background: props.showBackground
          ? `linear-gradient(180deg, ${page} 0%, ${shade(page, 0.035)} 100%)`
          : 'transparent',
      }}
    >
      <Scenery
        props={props}
        frame={frame}
        width={width}
        height={height}
        duration={durationInFrames}
      />
      <CardText
        props={props}
        faces={faces}
        layout={layout}
        timeline={timeline}
        frame={frame}
        logo={logo}
      />
    </AbsoluteFill>
  );
};
