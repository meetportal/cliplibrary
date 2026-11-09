import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { PhoneSpinInProps } from '@/schemas';
import { PHONE } from '../../kit/phone/phone-geometry';
import { facingBrightness, PhoneModel } from '../../kit/phone/phone-model';
import { offscreenDrop, pixelsPerUnit, Stage } from '../../kit/phone/stage';
import { resolveCustom } from '../../kit/resolve-custom';
import { Backdrop } from './backdrop';
import { contrastRatio } from './contrast';
import { CopyLayer } from './copy';
import { useFacesReady } from './fonts';
import { settle, tween } from './reveal';
import { useLogo } from './use-logo';

const TAU = Math.PI * 2;

const usable = (value: string) => value.trim() !== '' && !value.includes('{{');

const isDark = (color: string) => contrastRatio(color, '#000000') < 6;

const phonePose = (props: PhoneSpinInProps, frame: number, duration: number) => {
  const { layout, phone, stage, timing } = props;
  const side = layout.arrangement === 'text-right' ? -1 : 1;
  const restX = layout.arrangement === 'split' ? 0 : side * layout.phoneX;
  const away = 1 - tween(frame, [0, timing.spinFrames], [0, 1], settle);
  const rise = offscreenDrop(stage, layout.phoneSize, phone.startTip) + Math.max(0, layout.phoneY);
  const rotationY =
    -side * phone.restAngle -
    away * side * phone.spinTurns * TAU +
    Math.sin(frame / 48) * phone.sway;
  return {
    restX,
    position: [
      restX + side * away * phone.slideIn,
      layout.phoneY - away * rise + phone.float * ((2 * frame) / duration - 1),
      0,
    ] as [number, number, number],
    rotation: [0.04 + away * phone.startTip, rotationY, -away * phone.startLean * side] as [
      number,
      number,
      number,
    ],
  };
};

export const PhoneSpinIn = (props: PhoneSpinInProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const logo = useLogo(props.logo);
  const ready = useFacesReady(props.type.font);
  const { colors, layout, stage } = props;
  const pose = phonePose(props, frame, durationInFrames);
  const unit = pixelsPerUnit(stage, height);
  const centerX = width / 2 + pose.restX * unit;
  const half = (PHONE.width / 2) * layout.phoneSize * unit;
  const dark = isDark(colors.background);
  const copy = (
    <CopyLayer
      props={props}
      frame={frame}
      phone={{ left: centerX - half, right: centerX + half }}
      frameWidth={width}
      logo={logo}
      ready={ready}
    />
  );
  const split = layout.arrangement === 'split';
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          center={colors.background}
          edge={colors.backgroundEdge}
          focusX={(centerX / width) * 100}
        />
      ) : null}
      {split ? copy : null}
      <Stage stage={stage} dark={dark} rimColor={colors.primary}>
        <group position={pose.position} rotation={pose.rotation} scale={layout.phoneSize}>
          <PhoneModel
            screenUrl={usable(props.screen) ? resolveCustom(props.screen) : null}
            finish={props.phone.finish}
            reflections={stage.reflections}
            brightness={facingBrightness(pose.rotation[1])}
          />
        </group>
      </Stage>
      {split ? null : copy}
    </AbsoluteFill>
  );
};
