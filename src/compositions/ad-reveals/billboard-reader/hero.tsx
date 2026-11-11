import { useMemo } from 'react';
import * as THREE from 'three';
import type { BillboardReaderProps } from '@/schemas';
import { READER, TOP, type Vec3 } from './layout';
import { pageTurn } from './page-turn';
import { Paper } from './paper';

const UP = new THREE.Vector3(0, 1, 0);

const Limb = ({
  from,
  to,
  radius,
  material,
}: {
  from: Vec3;
  to: Vec3;
  radius: number;
  material: THREE.Material;
}) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const length = Math.max(0.001, start.distanceTo(end));
  const middle = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    UP,
    end.clone().sub(start).normalize(),
  );
  return (
    <mesh position={middle} quaternion={quaternion} material={material} castShadow>
      <capsuleGeometry args={[radius, length, 6, 16]} />
    </mesh>
  );
};

const Ball = ({
  at,
  radius,
  material,
  scale = [1, 1, 1],
}: {
  at: Vec3;
  radius: number;
  material: THREE.Material;
  scale?: Vec3;
}) => (
  <mesh position={at} scale={scale} material={material} castShadow>
    <sphereGeometry args={[radius, 24, 16]} />
  </mesh>
);

const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const kneeTurn = (knee: Vec3, angle: number, drop: number, reach: number): Vec3 => [
  knee[0],
  knee[1] - drop * Math.cos(angle) - reach * Math.sin(angle),
  knee[2] + reach * Math.cos(angle) + drop * Math.sin(angle),
];

const capeGeometry = (sway: number) => {
  const geometry = new THREE.PlaneGeometry(1, 1, 10, 12);
  const position = geometry.getAttribute('position');
  if (position !== undefined) {
    for (let index = 0; index < position.count; index++) {
      const u = position.getX(index) + 0.5;
      const v = 0.5 - position.getY(index);
      const across = (u - 0.5) * 2;
      const half = 0.36 + 0.14 * v;
      const x = across * half;
      const wrap = 1 - across * across;
      const folds = Math.sin(u * Math.PI * 4) * 0.035 * v;
      const y = 1.32 - 1.28 * v + 0.08 * v * wrap;
      const z = -0.34 - 0.16 * v - 0.14 * wrap * (1 - 0.5 * v) + folds + sway * v * v;
      position.setXYZ(index, x, y, z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
};

export const Hero = ({
  frame,
  flip,
  lower,
  colors,
  kick,
}: {
  frame: number;
  flip: number;
  lower: number;
  colors: BillboardReaderProps['colors'];
  kick: number;
}) => {
  const materials = useMemo(
    () => ({
      suit: new THREE.MeshStandardMaterial({ color: colors.suit, roughness: 0.55 }),
      trim: new THREE.MeshStandardMaterial({ color: colors.trim, roughness: 0.5 }),
      accent: new THREE.MeshStandardMaterial({ color: colors.accent, roughness: 0.4 }),
      cape: new THREE.MeshStandardMaterial({
        color: colors.cape,
        roughness: 0.7,
        side: THREE.DoubleSide,
      }),
      visor: new THREE.MeshStandardMaterial({ color: '#120e1a', roughness: 0.22, metalness: 0.3 }),
    }),
    [colors.suit, colors.trim, colors.accent, colors.cape],
  );
  const sway = 0.05 * Math.sin(frame / 26);
  const cape = useMemo(() => capeGeometry(Math.round(sway * 400) / 400), [sway]);
  const bob = 0.012 * Math.sin(frame / 19);
  const paperAt: Vec3 = [0, 1.72 - 0.62 * lower + bob, 0.95];
  const { spine, angle, open, handL, handR } = pageTurn(flip, paperAt);
  const shoulderL: Vec3 = [-0.46, 1.24, -0.08];
  const shoulderR: Vec3 = [0.46, 1.24, -0.08];
  const elbowL: Vec3 = [-0.66 - 0.12 * open, 0.98, 0.32];
  const elbowR: Vec3 = [0.66 + 0.12 * open, 0.98, 0.32];
  const swingL = kick * 0.16 * Math.sin(frame / 21);
  const swingR = kick * 0.16 * Math.sin(frame / 21 + 2.1);
  const kneeL: Vec3 = [-0.22, 0.24, 0.8];
  const kneeR: Vec3 = [0.24, 0.24, 0.8];
  const ankleL = kneeTurn(kneeL, swingL, 0.74, 0.06);
  const ankleR = kneeTurn(kneeR, swingR, 0.74, 0.06);
  const toeL = kneeTurn(kneeL, swingL, 0.98, 0.22);
  const toeR = kneeTurn(kneeR, swingR, 0.98, 0.22);
  const { suit, trim, accent, visor } = materials;
  return (
    <group position={[READER.x, TOP, READER.z]} rotation={[0, READER.turn, 0]} scale={READER.scale}>
      <Ball at={[0, 0.22, -0.05]} radius={0.3} material={suit} scale={[1.18, 0.82, 1]} />
      <Limb from={[0, 0.36, -0.06]} to={[0, 1.18, -0.1]} radius={0.37} material={suit} />
      <mesh position={[0, 0.44, -0.06]} rotation={[Math.PI / 2, 0, 0]} material={trim} castShadow>
        <torusGeometry args={[0.37, 0.065, 12, 32]} />
      </mesh>
      <mesh position={[0, 1.02, 0.29]} scale={[0.1, 0.13, 0.04]} material={accent}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
      <Limb from={[0, 1.4, -0.08]} to={[0, 1.55, -0.06]} radius={0.12} material={suit} />
      <Ball at={[0, 1.8, -0.04]} radius={0.3} material={suit} />
      <Ball at={[0, 1.82, 0.07]} radius={0.3} material={visor} scale={[0.92, 0.3, 0.8]} />
      <Ball at={shoulderL} radius={0.2} material={suit} />
      <Ball at={shoulderR} radius={0.2} material={suit} />
      <Limb from={shoulderL} to={elbowL} radius={0.12} material={suit} />
      <Limb from={shoulderR} to={elbowR} radius={0.12} material={suit} />
      <Limb from={elbowL} to={lerp(elbowL, handL, 0.55)} radius={0.11} material={suit} />
      <Limb from={elbowR} to={lerp(elbowR, handR, 0.55)} radius={0.11} material={suit} />
      <Limb from={lerp(elbowL, handL, 0.5)} to={handL} radius={0.13} material={trim} />
      <Limb from={lerp(elbowR, handR, 0.5)} to={handR} radius={0.13} material={trim} />
      <Ball at={handL} radius={0.15} material={trim} />
      <Ball at={handR} radius={0.15} material={trim} />
      <Limb from={[-0.2, 0.2, 0.02]} to={kneeL} radius={0.18} material={suit} />
      <Limb from={[0.2, 0.2, 0.02]} to={kneeR} radius={0.18} material={suit} />
      <Limb from={kneeL} to={lerp(kneeL, ankleL, 0.5)} radius={0.17} material={suit} />
      <Limb from={kneeR} to={lerp(kneeR, ankleR, 0.5)} radius={0.17} material={suit} />
      <Limb from={lerp(kneeL, ankleL, 0.42)} to={ankleL} radius={0.2} material={trim} />
      <Limb from={lerp(kneeR, ankleR, 0.42)} to={ankleR} radius={0.2} material={trim} />
      <Limb from={ankleL} to={toeL} radius={0.17} material={trim} />
      <Limb from={ankleR} to={toeR} radius={0.17} material={trim} />
      <mesh geometry={cape} material={materials.cape} castShadow />
      <Paper spine={spine} angle={angle} tilt={-0.08 + 0.02 * Math.sin(frame / 23)} />
    </group>
  );
};
