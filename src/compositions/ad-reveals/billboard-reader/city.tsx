import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { BillboardReaderProps } from '@/schemas';
import { buildCity, LANES, ROAD_LENGTH, ROAD_START, TOWER } from './city-layout';
import { mix } from './color';
import { GROUND_Y, ROAD, SHORE_X } from './layout';
import { Ocean } from './ocean';
import { towerTexture } from './textures';

type Placement = { position: Vec; scale: Vec; rotation?: number; color: string };
type Vec = [number, number, number];

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

const Instances = ({
  geometry,
  material,
  items,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: Placement[];
}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (mesh === null) {
      return;
    }
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.scale.set(...item.scale);
      dummy.rotation.set(0, item.rotation ?? 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, tint.set(item.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor !== null) {
      mesh.instanceColor.needsUpdate = true;
    }
    mesh.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, Math.max(1, items.length)]}
      frustumCulled={false}
    />
  );
};

const fronds = () => {
  const points: number[] = [];
  for (let index = 0; index < 7; index++) {
    const angle = (index / 7) * Math.PI * 2;
    const side = 0.22;
    points.push(0, 0.1, 0);
    points.push(Math.cos(angle - side) * 0.45, 0.05, Math.sin(angle - side) * 0.45);
    points.push(Math.cos(angle) * 1, -0.45, Math.sin(angle) * 1);
    points.push(0, 0.1, 0);
    points.push(Math.cos(angle) * 1, -0.45, Math.sin(angle) * 1);
    points.push(Math.cos(angle + side) * 0.45, 0.05, Math.sin(angle + side) * 0.45);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geometry.computeVertexNormals();
  return geometry;
};

const lambert = () => new THREE.MeshLambertMaterial({ color: '#ffffff' });

const flatStrip = (from: number, to: number, y: number, color: string) => (
  <mesh
    position={[(from + to) / 2, y, ROAD_START + ROAD_LENGTH / 2]}
    rotation={[-Math.PI / 2, 0, 0]}
  >
    <planeGeometry args={[to - from, ROAD_LENGTH + 400]} />
    <meshLambertMaterial
      color={color}
      polygonOffset
      polygonOffsetFactor={-1}
      polygonOffsetUnits={-2}
    />
  </mesh>
);

const wrapZ = (z: number) =>
  ROAD_START + ((((z - ROAD_START) % ROAD_LENGTH) + ROAD_LENGTH) % ROAD_LENGTH);

export const City = ({
  colors,
  frame,
  traffic,
  surf,
  sun,
  eye,
}: {
  colors: BillboardReaderProps['colors'];
  frame: number;
  traffic: boolean;
  surf: number;
  sun: THREE.Vector3;
  eye: Vec;
}) => {
  const city = useMemo(() => buildCity(), []);
  const shapes = useMemo(() => {
    const roof = new THREE.ConeGeometry(0.72, 1, 4, 1);
    roof.rotateY(Math.PI / 4);
    roof.translate(0, 0.5, 0);
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    return {
      box,
      roof,
      tree: new THREE.IcosahedronGeometry(1, 1),
      crown: fronds(),
      trunk: new THREE.CylinderGeometry(0.16, 0.24, 1, 6).translate(0, 0.5, 0),
      car: new THREE.BoxGeometry(1.9, 1.3, 4.2).translate(0, 0.65, 0),
    };
  }, []);
  const materials = useMemo(
    () => ({
      walls: lambert(),
      roofs: lambert(),
      trees: lambert(),
      cars: lambert(),
      palms: lambert(),
      fronds: new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide }),
    }),
    [],
  );
  const palette = useMemo(() => {
    const tree = mix(colors.roofs, '#1b1822', 0.72);
    return {
      wall: (t: number) => mix(colors.walls, colors.roofs, 0.08 + t * 0.22),
      roof: (t: number) => mix(colors.roofs, colors.walls, t * 0.18),
      tree: (t: number) => mix(tree, colors.roofs, t * 0.12),
      ground: mix(mix(colors.walls, colors.roofs, 0.45), '#2a2333', 0.25),
      sand: mix(colors.walls, colors.skyHorizon, 0.5),
      asphalt: mix(colors.roofs, '#1a1622', 0.72),
      line: mix(colors.walls, '#ffffff', 0.4),
      trunk: mix(tree, '#5a4a52', 0.3),
    };
  }, [colors]);
  const walls = useMemo(
    () =>
      city.blocks.map((block) => ({
        position: [block.x, GROUND_Y, block.z] as Vec,
        scale: [block.width, block.height, block.depth] as Vec,
        color: palette.wall(block.tint),
      })),
    [city, palette],
  );
  const roofs = useMemo(
    () =>
      city.blocks.map((block) => ({
        position: [block.x, GROUND_Y + block.height, block.z] as Vec,
        scale: [block.width * 1.08, block.roof, block.depth * 1.08] as Vec,
        color: palette.roof(block.tint),
      })),
    [city, palette],
  );
  const trees = useMemo(
    () =>
      city.trees.map((tree) => ({
        position: [tree.x, GROUND_Y + tree.size * 0.85, tree.z] as Vec,
        scale: [tree.size, tree.size * 0.95, tree.size] as Vec,
        color: palette.tree(tree.tint),
      })),
    [city, palette],
  );
  const trunks = useMemo(
    () =>
      city.palms.map((palm) => ({
        position: [palm.x, GROUND_Y, palm.z] as Vec,
        scale: [palm.size, 8 * palm.size, palm.size] as Vec,
        color: palette.trunk,
      })),
    [city, palette],
  );
  const crowns = useMemo(
    () =>
      city.palms.map((palm) => ({
        position: [palm.x, GROUND_Y + 8 * palm.size, palm.z] as Vec,
        scale: [2.8 * palm.size, 2.2 * palm.size, 2.8 * palm.size] as Vec,
        rotation: palm.tint * 3,
        color: palette.tree(palm.tint),
      })),
    [city, palette],
  );
  const step = Math.round(frame);
  const cars = useMemo(
    () =>
      traffic
        ? city.cars.map((car) => {
            const lane = LANES[car.lane] ?? LANES[0];
            const shade = car.tint < 0.15 ? '#c2484f' : car.tint < 0.55 ? '#e9e5ee' : '#4c4658';
            return {
              position: [
                lane.x,
                GROUND_Y,
                wrapZ(car.z + lane.direction * lane.speed * step),
              ] as Vec,
              scale: [1, 1, 1] as Vec,
              color: shade,
            };
          })
        : [],
    [city, traffic, step],
  );
  const tower = useMemo(() => towerTexture(colors.walls), [colors.walls]);
  return (
    <group>
      <mesh
        position={[(ROAD.to + 1100) / 2, GROUND_Y - 0.05, -300]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1100 - ROAD.to, 2400]} />
        <meshLambertMaterial color={palette.ground} />
      </mesh>
      {flatStrip(SHORE_X, ROAD.from, GROUND_Y, palette.sand)}
      {flatStrip(ROAD.from, ROAD.to, GROUND_Y + 0.02, palette.asphalt)}
      {flatStrip(-16.9, -16.1, GROUND_Y + 0.05, palette.line)}
      <Ocean
        color={colors.ocean}
        horizon={colors.skyHorizon}
        frame={frame}
        surf={surf}
        sun={sun}
        eye={eye}
      />
      <Instances geometry={shapes.box} material={materials.walls} items={walls} />
      <Instances geometry={shapes.roof} material={materials.roofs} items={roofs} />
      <Instances geometry={shapes.tree} material={materials.trees} items={trees} />
      <Instances geometry={shapes.trunk} material={materials.palms} items={trunks} />
      <Instances geometry={shapes.crown} material={materials.fronds} items={crowns} />
      {cars.length > 0 ? (
        <Instances geometry={shapes.car} material={materials.cars} items={cars} />
      ) : null}
      <mesh position={[TOWER.x, GROUND_Y + TOWER.height / 2, TOWER.z]}>
        <boxGeometry args={[TOWER.width, TOWER.height, TOWER.width]} />
        <meshLambertMaterial
          map={tower}
          emissive="#ffffff"
          emissiveMap={tower}
          emissiveIntensity={0.28}
        />
      </mesh>
    </group>
  );
};
