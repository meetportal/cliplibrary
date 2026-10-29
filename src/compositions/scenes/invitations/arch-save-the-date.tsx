import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ArchSaveTheDateProps,
  archSaveTheDateDefaults,
  archSaveTheDateMeta,
  archSaveTheDateSchema,
} from '@/schemas';
import { BrassLanterns } from '../../invitations/arch-save-the-date/brass-lanterns';
import { FallingPetals } from '../../invitations/arch-save-the-date/falling-petals';
import { archShape, CENTER_X, type WorldBox } from '../../invitations/arch-save-the-date/geometry';
import { InviteLines } from '../../invitations/arch-save-the-date/invite-lines';
import { JharokhaWall } from '../../invitations/arch-save-the-date/jharokha-wall';
import { MarigoldBalcony } from '../../invitations/arch-save-the-date/marigold-balcony';
import { SunsetSky } from '../../invitations/arch-save-the-date/sunset-sky';
import { smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const cameraScale = (frame: number, duration: number, camera: ArchSaveTheDateProps['camera']) =>
  tween(frame, [0, camera.pushFrames], [camera.zoomFrom, 1], smooth) *
  (1 + camera.drift * Math.min(1, frame / duration));

const visibleWorld = (
  width: number,
  height: number,
  camera: ArchSaveTheDateProps['camera'],
): WorldBox => {
  const reach = 1 / Math.min(1, camera.zoomFrom);
  const left = Math.floor(CENTER_X - CENTER_X * reach) - 2;
  const top = Math.floor(camera.focusY - camera.focusY * reach) - 2;
  const right = Math.ceil(CENTER_X + (width - CENTER_X) * reach) + 2;
  const bottom = Math.ceil(camera.focusY + (height - camera.focusY) * reach) + 2;
  return { left, top, width: right - left, height: bottom - top };
};

const ArchSaveTheDate = ({
  copy,
  type,
  timing,
  camera,
  arch,
  wall,
  sky,
  skyline,
  lanterns,
  balcony,
  petals,
  look,
  motion,
}: ArchSaveTheDateProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const time = frame * motion.speed;
  const prefix = `arch${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const id = (name: string) => `${prefix}${name}`;
  const shape = archShape(arch);
  const scale = cameraScale(frame, durationInFrames, camera);
  const world = visibleWorld(width, height, camera);
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${CENTER_X}px, ${camera.focusY}px) scale(${scale.toFixed(5)}) translate(${-CENTER_X}px, ${-camera.focusY}px)`,
        }}
      >
        <svg
          aria-hidden="true"
          width={world.width}
          height={world.height}
          viewBox={`${world.left} ${world.top} ${world.width} ${world.height}`}
          style={{ position: 'absolute', left: world.left, top: world.top }}
        >
          {look.showBackdrop ? (
            <SunsetSky
              shape={shape}
              sky={sky}
              skyline={skyline}
              time={time}
              ids={{ sky: id('sky'), water: id('water'), blur: id('cloud'), halo: id('sun') }}
            />
          ) : null}
          {balcony.show ? (
            <MarigoldBalcony shape={shape} balcony={balcony} time={time} gradientId={id('stone')} />
          ) : null}
          <BrassLanterns
            shape={shape}
            lanterns={lanterns}
            time={time}
            ids={{ glass: id('glass'), halo: id('glow') }}
          />
          <JharokhaWall
            shape={shape}
            arch={arch}
            wall={wall}
            world={world}
            ids={{ wall: id('wall'), opening: id('opening'), eave: id('eave') }}
          />
        </svg>
      </AbsoluteFill>
      <InviteLines copy={copy} type={type} timing={timing} />
      <FallingPetals petals={petals} time={time} width={width} height={height} />
    </TransitionFrame>
  );
};

export const archSaveTheDateScene: SceneModule = {
  id: 'arch-save-the-date',
  component: ArchSaveTheDate,
  render: (key) => (
    <Composition
      key={key}
      id="arch-save-the-date"
      component={ArchSaveTheDate}
      schema={archSaveTheDateSchema}
      defaultProps={archSaveTheDateDefaults}
      durationInFrames={archSaveTheDateMeta.durationInFrames}
      fps={archSaveTheDateMeta.fps}
      width={archSaveTheDateMeta.width}
      height={archSaveTheDateMeta.height}
    />
  ),
};
