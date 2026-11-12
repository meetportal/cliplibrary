import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CrumpledPaperRevealProps } from '@/schemas';
import { clamp01, lerp } from '../../kit/motion';
import { useLogoBox } from '../../kit/use-logo-box';
import { useMeasure } from './fonts';
import { layoutSheet } from './layout';
import { buildMesh, foldAt, lightAt, posePoints, SHEET } from './mesh';
import { paletteFor } from './palette';
import { PaperFacets, PaperShading, PaperShadow } from './paper';
import { SheetCopy } from './sheet-copy';
import { BEATS, centerAt, copyAt, crumpleAt, printScaleAt, squeezeAt, turnAt } from './timeline';
import { Wall } from './wall';

const DEGREE = Math.PI / 180;

export const CrumpledPaperReveal = (props: CrumpledPaperRevealProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const mesh = useMemo(buildMesh, []);
  const palette = useMemo(() => paletteFor(props.colors), [props.colors]);
  const measure = useMeasure();
  const logoBox = useLogoBox(props.logo);
  const headlineText = props.type.headlineCaps
    ? props.headline.toLocaleUpperCase()
    : props.headline;
  const layout = useMemo(
    () =>
      layoutSheet({
        headline: headlineText,
        tagline: props.tagline.toLocaleUpperCase(),
        name: props.companyName.toLocaleUpperCase(),
        measure,
        headlineSize: props.type.headlineSize,
        taglineSize: props.type.taglineSize,
        nameSize: props.type.nameSize,
        logoHeight: props.lockup.logoHeight,
      }),
    [
      headlineText,
      props.tagline,
      props.companyName,
      measure,
      props.type.headlineSize,
      props.type.taglineSize,
      props.type.nameSize,
      props.lockup.logoHeight,
    ],
  );

  const phase = (frame / durationInFrames) * Math.PI * 2;
  const crumple = crumpleAt(frame);
  const center = centerAt(frame);
  const tilt = props.paper.tilt * DEGREE;
  const rotation = tilt + turnAt(frame, props.paper.spin) * DEGREE;
  const points = posePoints(mesh, {
    crumple,
    squeeze: squeezeAt(frame),
    time: frame,
    wrinkles: props.paper.wrinkles,
    radius: props.paper.ballSize * SHEET.width,
    rotation,
    cx: center.x,
    cy: center.y,
  });
  const light = lightAt(phase * 3, props.light.drift);
  const print = 1 - clamp01(crumple / 0.35);
  const shadowOffset = { x: lerp(24, 56, crumple), y: lerp(34, 92, crumple) };
  const fade = {
    headline: copyAt(frame, BEATS.headlineIn),
    logo: copyAt(frame, BEATS.logoIn),
    tagline: copyAt(frame, BEATS.taglineIn),
    name: copyAt(frame, BEATS.nameIn),
  };

  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Wall
          palette={palette}
          width={width}
          height={height}
          phase={phase}
          drift={props.light.drift}
          strength={props.light.windowShadow}
        />
      ) : null}
      <PaperShadow
        mesh={mesh}
        points={points}
        offset={shadowOffset}
        color={palette.dropShadow}
        width={width}
        height={height}
      />
      <PaperFacets
        mesh={mesh}
        points={points}
        light={light}
        palette={palette}
        print={print}
        width={width}
        height={height}
      />
      <div
        style={{
          position: 'absolute',
          left: center.x - SHEET.width / 2,
          top: center.y - SHEET.height / 2,
          width: SHEET.width,
          height: SHEET.height,
          transform: `rotate(${rotation}rad) scale(${printScaleAt(frame, (value) => foldAt(value, 0.6))})`,
          transformOrigin: '50% 50%',
        }}
      >
        <SheetCopy
          props={props}
          layout={layout}
          palette={palette}
          fade={fade}
          headlineLines={layout.headline.lines}
          logoBox={logoBox}
        />
      </div>
      <PaperShading
        mesh={mesh}
        points={points}
        light={light}
        palette={palette}
        print={print}
        width={width}
        height={height}
      />
    </AbsoluteFill>
  );
};
