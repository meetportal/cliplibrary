import { clamp01, type Vec3 } from './layout';
import { SHEET } from './paper';

const TURN_END = 0.76;
const GRIP_GAP = 0.02;
const CLEAR = 0.17;
const HOLD = 0.04;
const RIDE = 0.19;
const REACH = 0.44;
const REST_ELBOW = { x: 0.66, y: 0.98, z: 0.32, spread: 0.12 } as const;
const FRONT_ELBOW = { out: 0.26, drop: 0.5, ahead: 0.02 } as const;

const ease = (value: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(value));

const within = (value: number, from: number, to: number) => ease((value - from) / (to - from));

const bump = (value: number, rise: [number, number], fall: [number, number]) =>
  within(value, rise[0], rise[1]) * (1 - within(value, fall[0], fall[1]));

export type PageTurn = {
  spine: Vec3;
  angle: number;
  handL: Vec3;
  handR: Vec3;
  elbowL: Vec3;
  elbowR: Vec3;
};

export const pageTurn = (progress: number, paperAt: Vec3): PageTurn => {
  const width = SHEET.width;
  const turn = ease(progress / TURN_END);
  const glide = ease(progress);
  const open = (glide + glide * glide) / 2;
  const angle = Math.PI * turn;
  const spineX = (-width / 2) * (1 - glide);
  const grip = paperAt[1] - 0.12;
  const back = paperAt[2] - HOLD;
  const spine: Vec3 = [spineX, paperAt[1], paperAt[2]];

  const outL = within(progress, 0.06, 0.52) * (CLEAR - GRIP_GAP) * (1 - within(progress, 0.8, 1));
  const reachL = GRIP_GAP + width * within(progress, 0.06, 0.52) + outL;
  const handL: Vec3 = [spineX - reachL, grip, back];

  const sweep = angle * (1 - within(progress, 0.32, 1));
  const radius =
    width +
    GRIP_GAP +
    (CLEAR - GRIP_GAP) * bump(progress, [0, 0.14], [0.88, 1]) -
    (width + CLEAR - REACH) * bump(progress, [0.14, 0.4], [0.4, 0.92]);
  const lift = HOLD + (RIDE - HOLD) * bump(progress, [0.06, 0.3], [0.8, 0.98]);
  const handR: Vec3 = [
    spineX + radius * Math.cos(sweep) + lift * Math.sin(sweep),
    grip,
    paperAt[2] + radius * Math.sin(sweep) - lift * Math.cos(sweep),
  ];

  const ahead = bump(progress, [0.06, 0.3], [0.76, 1]);
  const restR: Vec3 = [REST_ELBOW.x + REST_ELBOW.spread * open, REST_ELBOW.y, REST_ELBOW.z];
  const frontR: Vec3 = [
    spineX + width + FRONT_ELBOW.out,
    grip - FRONT_ELBOW.drop,
    paperAt[2] + FRONT_ELBOW.ahead,
  ];
  const elbowR: Vec3 = [
    restR[0] + (frontR[0] - restR[0]) * ahead,
    restR[1] + (frontR[1] - restR[1]) * ahead,
    restR[2] + (frontR[2] - restR[2]) * ahead,
  ];
  const elbowL: Vec3 = [-REST_ELBOW.x - REST_ELBOW.spread * open, REST_ELBOW.y, REST_ELBOW.z];
  return { spine, angle, handL, handR, elbowL, elbowR };
};
