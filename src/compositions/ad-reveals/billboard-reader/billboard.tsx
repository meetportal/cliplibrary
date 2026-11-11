import { useMemo } from 'react';
import * as THREE from 'three';
import { mix } from './color';
import { BOARD, FACE_Z, GROUND_Y, LAMP_XS, TOP, type Vec3 } from './layout';

const STEEL = '#221c2c';
const POLE_TOP = -6.3;
const DECK_Y = -5.45;
const RAIL = 0.8;
const DECK_FRONT = 1.9;
const RAIL_STEP = 1.36;

const Bar = ({
  from,
  to,
  size,
  material,
}: {
  from: Vec3;
  to: Vec3;
  size: number;
  material: THREE.Material;
}) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const length = start.distanceTo(end);
  const middle = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    end.clone().sub(start).normalize(),
  );
  return (
    <mesh position={middle} quaternion={quaternion} material={material}>
      <boxGeometry args={[size, length, size]} />
    </mesh>
  );
};

const Lamp = ({
  x,
  on,
  color,
  steel,
}: {
  x: number;
  on: number;
  color: string;
  steel: THREE.Material;
}) => (
  <group position={[x, TOP, 0]}>
    <Bar from={[0, 0, -0.2]} to={[0, 1.5, -0.2]} size={0.12} material={steel} />
    <Bar from={[0, 1.45, -0.2]} to={[0, 1.75, 1.35]} size={0.1} material={steel} />
    <group position={[0, 1.7, 1.45]} rotation={[0.55, 0, 0]}>
      <mesh material={steel} castShadow>
        <boxGeometry args={[0.95, 0.22, 0.5]} />
      </mesh>
      <mesh position={[0, -0.115, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.36]} />
        <meshBasicMaterial
          color={mix('#3a3340', color, on)}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  </group>
);

export const Billboard = ({
  face,
  pool,
  boardColor,
  lampColor,
  glow,
  lamps,
}: {
  face: THREE.Texture;
  pool: THREE.Texture;
  boardColor: string;
  lampColor: string;
  glow: number;
  lamps: number[];
}) => {
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.75, metalness: 0.25 }),
    [],
  );
  const shell = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: mix(boardColor, '#0b0812', 0.55),
        roughness: 0.8,
        metalness: 0.1,
      }),
    [boardColor],
  );
  const average = lamps.reduce((sum, value) => sum + value, 0) / Math.max(1, lamps.length);
  const level = 0.78 + 0.22 * average;
  const faceWidth = BOARD.width - BOARD.rim * 2;
  const faceHeight = BOARD.height - BOARD.rim * 2;
  const poolWidth = faceWidth * 0.3;
  const posts = Math.floor((BOARD.width + 1) / RAIL_STEP);
  const railX = (posts * RAIL_STEP) / 2;
  return (
    <group>
      <mesh position={[0, (GROUND_Y + POLE_TOP) / 2, -0.2]} material={steel}>
        <cylinderGeometry args={[0.95, 1.05, POLE_TOP - GROUND_Y, 28]} />
      </mesh>
      <mesh position={[0, POLE_TOP + 0.55, 0.2]} material={steel}>
        <boxGeometry args={[4.6, 1.3, 2.6]} />
      </mesh>
      <mesh position={[0, DECK_Y, 0.55]} material={steel} receiveShadow>
        <boxGeometry args={[BOARD.width + 1.2, 0.2, 2.9]} />
      </mesh>
      {[-6.5, -2.2, 2.2, 6.5].map((x) => (
        <Bar
          key={x}
          from={[x * 0.35, POLE_TOP, 0.1]}
          to={[x, DECK_Y - 0.1, DECK_FRONT - 0.2]}
          size={0.16}
          material={steel}
        />
      ))}
      {Array.from({ length: posts + 1 }, (_value, index) => -railX + index * RAIL_STEP).map((x) => (
        <Bar
          key={x}
          from={[x, DECK_Y, DECK_FRONT]}
          to={[x, DECK_Y + RAIL, DECK_FRONT]}
          size={0.07}
          material={steel}
        />
      ))}
      <Bar
        from={[-railX, DECK_Y + RAIL, DECK_FRONT]}
        to={[railX, DECK_Y + RAIL, DECK_FRONT]}
        size={0.08}
        material={steel}
      />
      <Bar
        from={[-railX, DECK_Y + RAIL / 2, DECK_FRONT]}
        to={[railX, DECK_Y + RAIL / 2, DECK_FRONT]}
        size={0.05}
        material={steel}
      />
      <mesh material={shell} castShadow receiveShadow>
        <boxGeometry args={[BOARD.width, BOARD.height, BOARD.depth]} />
      </mesh>
      <mesh position={[0, 0, FACE_Z]}>
        <planeGeometry args={[faceWidth, faceHeight]} />
        <meshBasicMaterial
          map={face}
          color={new THREE.Color(level, level, level)}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, FACE_Z + 0.004]} receiveShadow>
        <planeGeometry args={[faceWidth, faceHeight]} />
        <shadowMaterial transparent opacity={0.38} color="#0d0818" />
      </mesh>
      {LAMP_XS.map((x, index) => (
        <mesh key={x} position={[x, 0, FACE_Z + 0.008]}>
          <planeGeometry args={[poolWidth, faceHeight]} />
          <meshBasicMaterial
            map={pool}
            color={lampColor}
            transparent
            opacity={glow * (lamps[index] ?? 0)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      {LAMP_XS.map((x, index) => (
        <Lamp key={x} x={x} on={lamps[index] ?? 0} color={lampColor} steel={steel} />
      ))}
    </group>
  );
};
