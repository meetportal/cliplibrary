import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { PendulumBrandSwingProps } from '@/schemas';
import { Backdrop } from './backdrop';
import { bobShape, safeAmplitude } from './bob';
import { usePendulumFont } from './fonts';
import { buildLayout } from './layout';
import { buildPalette } from './palette';
import { PendulumCanvas } from './pendulum-canvas';
import { angleAt, edgeMask, edgeSpeed, FRAME, makeSwing, passAt, radians } from './swing';
import { TextBlock } from './text-block';
import { useBobLogo } from './use-bob-logo';

const WIDEST_SWING = 40;
const MIN_FEATHER = 2;
const MAX_FEATHER = 110;
const FEATHER_PER_SPEED = 2;

const monogramOf = (name: string) =>
  name.includes('{{') ? '' : (Array.from(name.trim())[0] ?? '').toUpperCase();

export const PendulumBrandSwing = (props: PendulumBrandSwingProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const family = usePendulumFont(props.type.font);
  const logo = useBobLogo(props.logo);
  const palette = useMemo(() => buildPalette(props.colors), [props.colors]);
  const { pendulum } = props;
  const aspect = logo?.box.aspect ?? null;
  const reach = logo?.reach ?? 1;
  const shape = useMemo(
    () => bobShape(pendulum.bobSize, aspect, reach),
    [pendulum.bobSize, aspect, reach],
  );
  const swing = useMemo(
    () =>
      makeSwing(
        durationInFrames,
        pendulum.swing * safeAmplitude(shape, pendulum.length, radians(WIDEST_SWING)),
        pendulum.dwell,
        pendulum.length,
      ),
    [durationInFrames, shape, pendulum.length, pendulum.swing, pendulum.dwell],
  );
  const layout = useMemo(
    () => (family === null ? null : buildLayout(props, family, swing, shape)),
    [props, family, swing, shape],
  );
  const angle = angleAt(swing, frame);
  const pass = passAt(swing, frame);
  const inks = { text: palette.text, accent: palette.accent };
  const feather = Math.min(
    MAX_FEATHER,
    MIN_FEATHER + edgeSpeed(swing, frame, props.layout.copyY) * FEATHER_PER_SPEED,
  );
  return (
    <AbsoluteFill
      style={{
        width: FRAME.width,
        height: FRAME.height,
        backgroundColor: props.showBackground ? palette.edge : 'transparent',
      }}
    >
      {props.showBackground ? <Backdrop center={palette.center} edge={palette.edge} /> : null}
      {layout === null || family === null ? null : (
        <>
          <TextBlock
            block={layout.brand}
            family={family}
            inks={inks}
            accentInitial={props.type.accentInitial}
          />
          <AbsoluteFill style={{ maskImage: edgeMask(angle, !pass.revealLeft, feather) }}>
            <TextBlock block={layout.states[pass.from]} family={family} inks={inks} />
          </AbsoluteFill>
          <AbsoluteFill style={{ maskImage: edgeMask(angle, pass.revealLeft, feather) }}>
            <TextBlock block={layout.states[pass.to]} family={family} inks={inks} />
          </AbsoluteFill>
          <TextBlock block={layout.services} family={family} inks={inks} />
          <TextBlock
            block={layout.website}
            family={family}
            inks={{ text: palette.website, accent: palette.website }}
          />
        </>
      )}
      <PendulumCanvas
        swing={swing}
        time={frame}
        shape={shape}
        palette={palette}
        logo={logo}
        look={{
          cordWidth: pendulum.string,
          trail: pendulum.trail,
          shadow: pendulum.shadow,
          monogram: monogramOf(props.companyName),
          family,
        }}
      />
    </AbsoluteFill>
  );
};
