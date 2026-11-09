import { AbsoluteFill, Img } from 'remotion';
import type { ComingSoonFlipsProps } from '@/schemas';
import type { Face } from './fonts';
import type { Axis, Lockup } from './layout';
import { PlasterWall } from './plaster-wall';
import type { LightPose } from './timeline';

const REACH = 3;
const FLOOR = Math.exp(-(REACH * REACH) / 2);
const MAX_STOPS = 90;
const DRIFT = 10;
const PLATE_ROUNDNESS = 0.24;

type Light = ComingSoonFlipsProps['light'];

const falloff = (distance: number, flat: number, sigma: number) => {
  const outside = Math.max(0, Math.abs(distance) - flat) / sigma;
  return Math.max(0, (Math.exp(-(outside * outside) / 2) - FLOOR) / (1 - FLOOR));
};

const TRAVEL_REACH = 1.5;

export const slatSpread = (light: Light) =>
  ((Math.max(1, Math.round(light.slats)) - 1) / 2) * light.slatGap + TRAVEL_REACH * light.softness;

const rgba = (hex: string, alpha: number) => {
  const [red, green, blue] = [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));
  return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(4)})`;
};

const percent = (at: number, length: number) => `${((at / length) * 100).toFixed(3)}%`;

export const beamShadow = (
  light: Light,
  axis: Axis,
  pose: LightPose,
  local: number,
  shadow: string,
): string => {
  const count = Math.max(1, Math.round(light.slats));
  const bloom = pose.bloom;
  const sigma = light.softness + (light.restWidth / 3 - light.softness) * bloom;
  const flat = axis.extent * bloom;
  const gap = light.slatGap * (1 - bloom);
  const offsets = Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * gap);
  const drift = Math.sin(local / 45) * DRIFT * bloom;
  const center = axis.center + pose.shift + drift;
  const span = ((count - 1) / 2) * gap + flat + REACH * sigma;
  const from = Math.max(0, center - span);
  const to = Math.min(axis.length, center + span);
  const samples = Math.min(MAX_STOPS, Math.max(8, Math.ceil((to - from) / (sigma * 0.45))));
  const shadeAt = (at: number) => {
    const lit = offsets.reduce(
      (sum, offset) => sum + falloff(at - center - offset, flat, sigma),
      0,
    );
    return rgba(shadow, 1 - Math.min(1, light.strength * lit) * pose.glow);
  };
  const points =
    to <= from
      ? [0, axis.length]
      : [
          0,
          ...Array.from(
            { length: samples + 1 },
            (_, index) => from + ((to - from) * index) / samples,
          ),
          axis.length,
        ];
  const stops = points.map((at) => `${shadeAt(at)} ${percent(at, axis.length)}`);
  return `linear-gradient(${light.angle}deg, ${stops.join(', ')})`;
};

export const windowShadow = (
  region: { top: number; bottom: number; fade: 'top' | 'bottom' },
  height: number,
  shadow: string,
): string => {
  const solid = rgba(shadow, 1);
  const clear = rgba(shadow, 0);
  const top = percent(region.top, height);
  const bottom = percent(region.bottom, height);
  return region.fade === 'top'
    ? `linear-gradient(180deg, ${solid} 0%, ${solid} ${top}, ${clear} ${bottom}, ${clear} 100%)`
    : `linear-gradient(180deg, ${clear} 0%, ${clear} ${top}, ${solid} ${bottom}, ${solid} 100%)`;
};

export const LitWall = ({
  props,
  lockup,
  logoSrc,
  nameFace,
  beam,
  window,
}: {
  props: ComingSoonFlipsProps;
  lockup: Lockup;
  logoSrc: string | null;
  nameFace: Face;
  beam: string | null;
  window: string | null;
}) => {
  const { logo, name } = lockup;
  const plate = props.lockup.plate;
  return (
    <AbsoluteFill>
      <PlasterWall props={props} />
      {logo !== null && logoSrc !== null ? (
        <div
          style={{
            position: 'absolute',
            left: logo.left,
            top: logo.top,
            width: logo.width,
            height: logo.height,
            padding: lockup.inset,
            boxSizing: 'border-box',
            borderRadius: plate ? Math.min(logo.width, logo.height) * PLATE_ROUNDNESS : 0,
            backgroundColor: plate ? props.colors.plate : 'transparent',
          }}
        >
          <Img src={logoSrc} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
      ) : null}
      {name === null ? null : (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: name.top,
            textAlign: 'center',
            fontFamily: nameFace.family,
            fontWeight: nameFace.weight,
            fontSize: name.size,
            lineHeight: 1,
            whiteSpace: 'pre',
            color: props.colors.name,
          }}
        >
          {props.companyName.trim()}
        </div>
      )}
      {beam === null ? null : <AbsoluteFill style={{ backgroundImage: beam }} />}
      {window === null ? null : <AbsoluteFill style={{ backgroundImage: window }} />}
    </AbsoluteFill>
  );
};
