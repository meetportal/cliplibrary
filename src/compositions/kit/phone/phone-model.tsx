import { useMemo } from 'react';
import { Easing, interpolate } from 'remotion';
import * as THREE from 'three';
import type { PhoneFinish } from '@/schemas';
import { AntennaBands, BottomPorts, CameraPlateau, SideButtons } from './phone-details';
import {
  bodyGeometry,
  capsuleGeometry,
  GLASS_SURFACE,
  glassFaceGeometry,
  glassSlabGeometry,
  PHONE,
  screenGeometry,
} from './phone-geometry';
import { phoneMaterials } from './phone-materials';
import { useTexture } from './use-texture';

const SCREEN_LIFT = 0.002;
const SCREEN_ASPECT = PHONE.screenWidth / PHONE.screenHeight;
const EMPTY_SCREEN = '#dcdcd8';
const ISLAND = { width: 0.374, height: 0.108, fromTop: 0.0986 } as const;

const DynamicIsland = () => (
  <mesh
    position={[0, PHONE.screenHeight / 2 - ISLAND.fromTop, GLASS_SURFACE + SCREEN_LIFT * 2]}
    geometry={capsuleGeometry(ISLAND.width, ISLAND.height)}
    renderOrder={2}
  >
    <meshBasicMaterial
      color="#030304"
      toneMapped={false}
      polygonOffset
      polygonOffsetFactor={-3}
      polygonOffsetUnits={-6}
    />
  </mesh>
);

export const facingBrightness = (rotationY: number): number =>
  interpolate(Math.cos(rotationY), [0.08, 0.55], [0, 1], {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const coverFit = (texture: THREE.Texture): THREE.Texture => {
  const image = texture.image as { width?: number; height?: number } | undefined;
  const aspect =
    image?.width !== undefined && image.height !== undefined && image.height > 0
      ? image.width / image.height
      : SCREEN_ASPECT;
  if (aspect > SCREEN_ASPECT) {
    const share = SCREEN_ASPECT / aspect;
    texture.repeat.set(share, 1);
    texture.offset.set((1 - share) / 2, 0);
  } else {
    const share = aspect / SCREEN_ASPECT;
    texture.repeat.set(1, share);
    texture.offset.set(0, 1 - share);
  }
  texture.needsUpdate = true;
  return texture;
};

const screenPlacement = {
  position: [0, 0, GLASS_SURFACE + SCREEN_LIFT] as [number, number, number],
  renderOrder: 1,
};

const ScreenImage = ({ url, brightness }: { url: string; brightness: number }) => {
  const base = useTexture(url);
  const map = useMemo(() => coverFit(base), [base]);
  const tint = useMemo(() => new THREE.Color(brightness, brightness, brightness), [brightness]);
  return (
    <mesh {...screenPlacement} geometry={screenGeometry()}>
      <meshBasicMaterial
        map={map}
        color={tint}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-4}
      />
    </mesh>
  );
};

const EmptyScreen = ({ brightness }: { brightness: number }) => {
  const tint = useMemo(
    () => new THREE.Color(EMPTY_SCREEN).multiplyScalar(brightness),
    [brightness],
  );
  return (
    <mesh {...screenPlacement} geometry={screenGeometry()}>
      <meshBasicMaterial
        color={tint}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-4}
      />
    </mesh>
  );
};

export const PhoneModel = ({
  screenUrl,
  finish,
  reflections,
  brightness,
}: {
  screenUrl: string | null;
  finish: PhoneFinish;
  reflections: number;
  brightness: number;
}) => {
  const materials = phoneMaterials(finish, reflections);
  const glassCenter = PHONE.depth / 2 + PHONE.glassLift;
  return (
    <group>
      <mesh geometry={bodyGeometry()} material={materials.frame} castShadow receiveShadow />
      <mesh
        position={[0, 0, glassCenter]}
        geometry={glassSlabGeometry()}
        material={materials.frontGlass}
      />
      {screenUrl === null ? (
        <EmptyScreen brightness={brightness} />
      ) : (
        <ScreenImage url={screenUrl} brightness={brightness} />
      )}
      <DynamicIsland />
      <mesh
        position={[0, 0, GLASS_SURFACE + SCREEN_LIFT * 3]}
        geometry={glassFaceGeometry()}
        material={materials.glare}
        renderOrder={3}
      />
      <mesh
        position={[0, 0, -glassCenter]}
        geometry={glassSlabGeometry()}
        material={materials.back}
        castShadow
      />
      <CameraPlateau materials={materials} />
      <SideButtons materials={materials} />
      <AntennaBands materials={materials} />
      <BottomPorts materials={materials} />
    </group>
  );
};
