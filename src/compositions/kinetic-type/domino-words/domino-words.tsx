import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DominoWordsProps } from '@/schemas';
import { BrandLockup, FooterLine, layoutBrand } from './brand';
import { ballAt, cameraAt, planCamera, smoothFront } from './camera';
import { buildChain } from './chain';
import { BRAND_FACE, useMeasure, WORD_FACES } from './fonts';
import { inkFor, punchColor } from './ink';
import { useLogoImage } from './logo';
import { slabCorners } from './physics';
import { Pusher } from './pusher';
import { Backdrop, FloorLine, type LitSpan, ReflectionFade, SideShade } from './stage';
import { anglesAt, buildSchedule } from './timeline';
import { DominoWord, FloorShadow } from './word';

const STAND_GAP = 80;
const LIT_FRAMES = 8;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const DominoWords = (props: DominoWordsProps) => {
  const { words, colors, floor, pusher, timing, camera } = props;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const face = WORD_FACES[words.font];
  const stageColors = { ...colors, primary: punchColor(colors) };
  const faces = useMemo(() => [face, BRAND_FACE], [face]);
  const measure = useMeasure(faces);
  const logo = useLogoImage(props.logo);
  const brand = layoutBrand(props.brand, props.companyName, logo, measure, width);
  const standRoom = Math.max(200, floor.y - brand.bottom - STAND_GAP);
  const chain = useMemo(
    () => buildChain(words, props.headline, face, measure, standRoom),
    [words, props.headline, face, measure, standRoom],
  );
  const schedule = useMemo(() => buildSchedule(chain, timing), [chain, timing]);
  const plan = useMemo(
    () => planCamera(chain, schedule, props, width, standRoom),
    [chain, schedule, props, width, standRoom],
  );
  const view = cameraAt(plan, camera, frame, width);
  const angles = anglesAt(chain, schedule, frame, timing.settle);
  const first = chain[0];
  const last = chain.at(-1);
  const toScreen = (x: number) => width / 2 + (x - view.x) * view.zoom;
  const pusherX = ballAt(plan.ball, pusher, timing.hitAt, frame);
  const pusherVisible =
    pusher.show && first !== undefined && toScreen(pusherX + pusher.radius * 2) > -100;
  const world = (reflected: boolean) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transformOrigin: '0 0',
        transform: `translate(${(width / 2 - view.x * view.zoom).toFixed(3)}px, ${floor.y - floor.thickness / 2}px) scale(${view.zoom.toFixed(6)})`,
      }}
    >
      {floor.shadow > 0 && !reflected
        ? chain.map((domino, index) => {
            const corners = slabCorners(domino, angles[index] ?? 0);
            return (
              <FloorShadow
                key={`shadow-${index.toString()}`}
                minX={Math.min(...corners.map(([x]) => x))}
                maxX={Math.max(...corners.map(([x]) => x))}
                size={domino.size}
                strength={floor.shadow}
              />
            );
          })
        : null}
      {pusherVisible ? <Pusher x={pusherX} pusher={pusher} colors={stageColors} /> : null}
      {chain.map((domino, index) => (
        <DominoWord
          key={`${index.toString()}-${domino.text}`}
          domino={domino}
          angle={angles[index] ?? 0}
          face={face}
          plain={reflected}
          ink={inkFor({
            props,
            index,
            count: chain.length,
            start: schedule.starts[index] ?? 0,
            land: schedule.land,
            frame,
          })}
        />
      ))}
    </div>
  );
  const landed = clamp01((frame - schedule.land + 1) / LIT_FRAMES);
  const lit: LitSpan[] = [];
  if (floor.trail && first !== undefined) {
    const from = first.pivot - first.thickness;
    const reach = Math.max(from, smoothFront(plan.keys, frame));
    lit.push({
      from: toScreen(from),
      to: toScreen(reach),
      strength: 0.85 * clamp01((frame - timing.hitAt) / LIT_FRAMES),
    });
  }
  if (last !== undefined && landed > 0) {
    lit.push({
      from: toScreen(last.pivot),
      to: toScreen(last.pivot + last.length),
      strength: landed,
    });
  }
  const reflect = props.showBackground && floor.reflection > 0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground ? <Backdrop colors={colors} /> : null}
      {reflect ? (
        <AbsoluteFill
          style={{
            transformOrigin: `0px ${floor.y}px`,
            transform: 'scaleY(-1)',
            opacity: floor.reflection,
          }}
        >
          {world(true)}
        </AbsoluteFill>
      ) : null}
      {reflect ? (
        <ReflectionFade
          colors={colors}
          floorY={floor.y}
          depth={floor.reflectionDepth}
          height={height}
        />
      ) : null}
      {props.showBackground ? <SideShade colors={colors} /> : null}
      <FloorLine floor={floor} colors={stageColors} lit={lit} />
      {world(false)}
      <BrandLockup
        layout={brand}
        logo={logo}
        companyName={props.companyName}
        colors={colors}
        measure={measure}
        width={width}
        top={props.brand.top}
      />
      <FooterLine
        website={props.website}
        size={props.brand.footerSize}
        colors={colors}
        measure={measure}
        width={width}
        height={height}
      />
    </AbsoluteFill>
  );
};
