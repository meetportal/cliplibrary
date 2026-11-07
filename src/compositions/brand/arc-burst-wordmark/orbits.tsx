import { Easing } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import { ARC_STYLES, arcPath, seeded, strokeFor, type WordLayout } from './layout';
import { progress, settle, smooth, type Timeline } from './timeline';

const ACCENT_START_WIDTH = 2;

export const Orbits = ({
  frame,
  word,
  line,
  props,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
}) => {
  const count = props.build.orbits;
  const appear = line.buildStart - 4;
  if (count === 0 || frame < appear || frame >= line.orbitsGone) {
    return null;
  }
  const unit = word.size * 0.045;
  const fade = 1 - progress(frame, [line.orbitsGone - 6, line.orbitsGone], Easing.linear);
  return (
    <g opacity={fade}>
      {Array.from({ length: count }, (_, index) => {
        const [sx, sy, sr, sa, ss, sl, sg] = seeded(`arc-burst-orbit-${index}`, 7);
        const born = appear + (sg ?? 0) * 6;
        const grow = progress(frame, [born, born + 10], settle);
        const retract = progress(
          frame,
          [line.buildEnd - 22 + (sg ?? 0) * 4, line.orbitsGone - 1],
          Easing.inOut(Easing.sin),
        );
        const span = (1.2 + (sl ?? 0) * 2.2) * grow * (1 - retract);
        if (span <= 0.02) {
          return null;
        }
        const center = {
          x: word.left + (word.width * (index + 0.5 + ((sx ?? 0.5) - 0.5) * 0.6)) / count,
          y:
            word.firstBaseline +
            (word.baseline - word.firstBaseline) * (index % 2) -
            word.inkTop * (0.3 + (sy ?? 0.5) * 0.4),
        };
        const radius = word.size * (0.42 + (sr ?? 0) * 0.55);
        const direction = index % 2 === 0 ? 1 : -1;
        const head = (sa ?? 0) * Math.PI * 2 + direction * (0.07 + (ss ?? 0) * 0.05) * frame;
        const style = ARC_STYLES[(index + 1) % ARC_STYLES.length] ?? 'thin';
        return (
          <path
            key={`orbit-${index}`}
            d={arcPath(center, radius, head - span * direction, head)}
            fill="none"
            stroke={props.colors.primary}
            {...strokeFor(style, unit)}
          />
        );
      })}
    </g>
  );
};

const accentGeometry = (word: WordLayout, accent: ArcBurstWordmarkProps['accent']) => {
  const chord = word.width * 1.04;
  const sag = Math.max(word.size * 0.12, chord * 0.035);
  const radius = (chord * chord) / (8 * sag) + sag / 2;
  const sweep = 2 * Math.asin(Math.min(1, chord / (2 * radius)));
  const y = word.baseline + word.inkBottom + accent.gap + accent.thickness / 2;
  return {
    center: { x: word.center.x, y: y + sag - radius },
    radius,
    from: Math.PI / 2 + sweep / 2,
    to: Math.PI / 2 - sweep / 2,
    length: radius * sweep,
  };
};

export const AccentArc = ({
  frame,
  word,
  line,
  props,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
}) => {
  if (!props.accent.show) {
    return null;
  }
  const drawn = progress(frame, [line.accentStart, line.accentEnd], settle);
  const thicken = progress(
    frame,
    [line.accentStart, line.accentStart + (line.accentEnd - line.accentStart) / 3],
    smooth,
  );
  const thin = Math.min(ACCENT_START_WIDTH, props.accent.thickness);
  if (drawn <= 0) {
    return null;
  }
  const geometry = accentGeometry(word, props.accent);
  const visible = geometry.length * drawn;
  return (
    <path
      d={arcPath(geometry.center, geometry.radius, geometry.from, geometry.to)}
      fill="none"
      stroke={props.colors.primary}
      strokeWidth={thin + (props.accent.thickness - thin) * thicken}
      strokeLinecap="butt"
      strokeDasharray={`${visible.toFixed(2)} ${geometry.length.toFixed(2)}`}
      strokeDashoffset={(-(geometry.length - visible) / 2).toFixed(2)}
    />
  );
};
