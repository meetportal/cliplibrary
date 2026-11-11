import { clamp01, type Vec3 } from './layout';
import { SHEET } from './paper';

const TURN_END = 0.72;
const OPEN_START = 0.5;
const REACH = 0.55;

const ease = (value: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(value));

export type PageTurn = { spine: Vec3; angle: number; open: number; handL: Vec3; handR: Vec3 };

export const pageTurn = (progress: number, paperAt: Vec3): PageTurn => {
  const width = SHEET.width;
  const turn = ease(progress / TURN_END);
  const open = ease((progress - OPEN_START) / (1 - OPEN_START));
  const angle = Math.PI * turn;
  const spineX = (-width / 2) * (1 - ease(progress));
  const grip = paperAt[1] - 0.12;
  const back = paperAt[2] - 0.04;
  const spine: Vec3 = [spineX, paperAt[1], paperAt[2]];
  const handL: Vec3 = [spineX - 0.02 - width * open, grip, back];
  const onCover = (share: number): Vec3 => [
    spineX + (width * share + 0.02) * Math.cos(angle) + 0.06 * Math.sin(angle),
    grip,
    back + width * share * Math.sin(angle),
  ];
  const slide = ease((turn - 0.5) / 0.5);
  const reached = onCover(REACH);
  const contact = paperAt[2] + 0.12;
  const toContact = ease(slide / 0.4);
  const settle = ease((slide - 0.75) / 0.25);
  const handR: Vec3 =
    turn <= 0.5
      ? onCover(1 - (1 - REACH) * Math.sin(Math.PI * turn))
      : [
          reached[0] + (spineX + width + 0.02 - reached[0]) * slide,
          grip,
          reached[2] + (contact - reached[2]) * toContact + (back - contact) * settle,
        ];
  return { spine, angle, open, handL, handR };
};
