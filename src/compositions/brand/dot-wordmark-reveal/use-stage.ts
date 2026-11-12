import { useMemo } from 'react';
import type { DotWordmarkRevealProps } from '@/schemas';
import { usableImage, useLogoBox } from '../../kit/use-logo-box';
import { LINE_FACES, NAME_FACES, useMeasured } from './fonts';
import { revealFrames, type Stage } from './geometry';
import { layoutLine, layoutLockup } from './layout';
import { buildPalette } from './palette';
import { buildSchedule, flipTargets } from './timeline';

const splitWords = (text: string) =>
  text
    .trim()
    .split(/\s+/)
    .filter((word) => word !== '');

export const useStage = (
  props: DotWordmarkRevealProps,
  width: number,
  height: number,
  duration: number,
) => {
  const palette = useMemo(() => buildPalette(props.colors), [props.colors]);
  const nameFace = NAME_FACES[props.name.font];
  const lineFace = LINE_FACES[props.line.font];
  const letters = useMemo(() => [...props.companyName.trim()], [props.companyName]);
  const words = useMemo(() => splitWords(props.tagline), [props.tagline]);
  const measured = useMeasured(nameFace, lineFace, letters, words);
  const logoBox = useLogoBox(props.logo);
  const showLogo = usableImage(props.logo) && logoBox !== null;
  const stage = useMemo<Stage>(() => {
    const centerY = height / 2 + props.layout.offsetY;
    const line = layoutLine(
      words,
      measured,
      props.line.size,
      centerY,
      width,
      Math.round(props.dot.size * 1.8),
    );
    const schedule = buildSchedule(words.length, props.timing.hop, props.timing.write, duration);
    const lockup = layoutLockup(
      props,
      showLogo ? logoBox : null,
      letters,
      measured,
      nameFace.tracking,
      width,
      centerY,
    );
    const flips = props.line.flips && props.showBackground;
    return {
      schedule,
      lockup,
      line,
      palette,
      targets: flips ? flipTargets(schedule.lands) : schedule.lands.map(() => null),
      pill: { w: props.dot.size, h: Math.round(props.dot.size * 1.8) },
      caret: Math.max(props.dot.size, Math.round(lockup.nameSize * 0.17)),
      center: { x: width / 2, y: centerY },
      coverRadius: Math.hypot(width / 2, height / 2 + Math.abs(props.layout.offsetY)) * 1.02,
      frameWidth: width,
      frameHeight: height,
    };
  }, [
    props,
    showLogo,
    logoBox,
    letters,
    measured,
    nameFace,
    words,
    palette,
    width,
    height,
    duration,
  ]);
  const { lockup } = stage;
  const writer = useMemo(() => {
    const x0 = lockup.nameLeft - stage.caret;
    const x1 = lockup.nameRight + stage.caret * 0.9;
    return {
      x0,
      x1,
      y: lockup.nameTop + lockup.nameSize * 0.875 + stage.caret * 0.75,
      reveals: revealFrames(
        stage,
        x0,
        x1,
        lockup.letters.map((one) => one.left + one.width / 2),
      ),
    };
  }, [stage, lockup]);
  return { stage, writer, nameFace, lineFace, logoBox: showLogo ? logoBox : null };
};
