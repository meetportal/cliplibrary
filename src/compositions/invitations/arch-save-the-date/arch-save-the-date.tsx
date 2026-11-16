import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ArchSaveTheDateProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { Arch, ArchDefs } from './arch';
import { CardText } from './card-text';
import { ChandelierDefs } from './chandelier';
import { canvasMeasurer, facesOf, useFontsReady } from './fonts';
import { Garden } from './garden';
import {
  aboutVanish,
  archDepth,
  cardScale,
  dollyAt,
  scaleAtDepth,
  terraceScale,
  VANISH_Y,
} from './geometry';
import { buildLayout } from './layout';
import { Birds, Haze, Sky } from './sky';
import { buildCues, cameraOf, exitAmount } from './timeline';

export const ArchSaveTheDate = (props: ArchSaveTheDateProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const faces = facesOf(props.lettering);
  const ready = useFontsReady(faces);
  const layout = useMemo(
    () => buildLayout(props, facesOf(props.lettering), canvasMeasurer(ready)),
    [props, ready],
  );
  const { arcade, colors } = props;
  const arches = Math.max(1, Math.round(arcade.arches));
  const camera = cameraOf(props, durationInFrames);
  const dolly = dollyAt(frame, camera);
  const card = cardScale(dolly);
  const cues = useMemo(() => buildCues(props, durationInFrames), [props, durationInFrames]);
  const exit = exitAmount(frame, cues);
  const dusk = ramp(frame, cues.dusk, durationInFrames, Easing.inOut(Easing.sin));
  const haze = ramp(frame, cues.details - 30, cues.details + 30, Easing.inOut(Easing.sin));
  const birds = ramp(frame, cues.flourish, cues.flourish + 40);
  const order = Array.from({ length: arches }, (_, index) => arches - 1 - index);
  return (
    <AbsoluteFill style={{ opacity: props.showScenery ? 1 : 1 - exit }}>
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0 }}
      >
        <ChandelierDefs crystal={colors.crystal} />
        <ArchDefs arch={colors.arch} />
        {props.showScenery ? (
          <g transform={aboutVanish(terraceScale(dolly))}>
            <Sky props={props} frame={frame} dusk={dusk} />
            <Birds props={props} frame={frame} appear={birds} />
            <Garden props={props} />
            <Haze props={props} amount={haze} />
          </g>
        ) : null}
        {order.map((index) => {
          const scale = scaleAtDepth(archDepth(index, arches, dolly));
          return scale === null ? null : (
            <g key={index} transform={aboutVanish(scale)}>
              <Arch props={props} frame={frame} />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill
        style={{
          transform: card === 1 ? undefined : `scale(${card.toFixed(6)})`,
          transformOrigin: `${width / 2}px ${(VANISH_Y * height) / 1920}px`,
        }}
      >
        <CardText props={props} faces={faces} layout={layout} frame={frame} cues={cues} />
      </AbsoluteFill>
      {props.showScenery && exit > 0 ? (
        <AbsoluteFill style={{ backgroundColor: colors.fade, opacity: exit }} />
      ) : null}
    </AbsoluteFill>
  );
};
