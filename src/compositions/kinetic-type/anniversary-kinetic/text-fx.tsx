import type { ReactNode } from 'react';
import { Easing } from 'remotion';
import { Line } from './line';
import type { Scene } from './scene';
import { Shred } from './shred';

export const out = Easing.out(Easing.cubic);

export const blurOf = (amount: number): string =>
  amount > 0.05 ? `blur(${amount.toFixed(2)}px)` : 'none';

export const middleOf = (scene: Scene) => scene.height / 2;

export const shredOf = (
  scene: Scene,
  amount: number,
  size: number,
  frame: number,
  children: ReactNode,
) => (
  <Shred
    amount={amount * scene.props.effects.glitch}
    frame={frame}
    center={middleOf(scene)}
    span={size * 1.3}
    height={scene.height}
    shift={size * 0.16}
    color={scene.palette.ink}
  >
    {children}
  </Shred>
);

export const Plain = ({
  scene,
  size,
  filter = 'none',
  opacity = 1,
  y = 0,
  scale = 1,
}: {
  scene: Scene;
  size: number;
  filter?: string;
  opacity?: number;
  y?: number;
  scale?: number;
}) => (
  <Line
    face={scene.face}
    size={size}
    center={middleOf(scene) + y}
    color={scene.palette.ink}
    style={{
      filter,
      opacity,
      transform: scale === 1 ? 'none' : `scale(${scale.toFixed(4)})`,
    }}
  >
    {scene.beat.text}
  </Line>
);
