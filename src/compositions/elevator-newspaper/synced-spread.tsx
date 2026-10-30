import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PLATE_STAMP } from '@/footage/footage-spec';
import type { ElevatorNewspaperProps } from '@/schemas';
import { gridGeometry, placeGrid, usePageTexture } from './page-mesh';
import { readPhoto } from './page-photos';
import { PLATE, trackedFrame } from './page-track';
import type { PlateSource } from './plate-source';

const plateGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.PlaneGeometry(PLATE.width, PLATE.height);
  const bottom = PLATE_STAMP.rows / (PLATE.height + PLATE_STAMP.rows);
  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute([0, 1, 1, 1, 0, bottom, 1, bottom], 2),
  );
  return geometry;
};

const printMaterial = (planes: THREE.Plane[]) =>
  new THREE.MeshBasicMaterial({
    transparent: true,
    toneMapped: false,
    depthTest: false,
    clippingPlanes: planes,
  });

const useDisposed = <T extends { dispose: () => void }>(value: T): T => {
  useEffect(() => () => value.dispose(), [value]);
  return value;
};

export const SyncedSpread = ({
  props,
  frame,
  source,
}: {
  props: ElevatorNewspaperProps;
  frame: number;
  source: PlateSource | null;
}) => {
  const gl = useThree((state) => state.gl);
  gl.localClippingEnabled = true;
  const coverMap = usePageTexture('cover', props, readPhoto(props.cover.photo));
  const storyMap = usePageTexture('story', props, readPhoto(props.story.photo));
  const planes = useMemo(
    () => [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
    ],
    [],
  );
  const coverGeometry = useDisposed(useMemo(gridGeometry, []));
  const storyGeometry = useDisposed(useMemo(gridGeometry, []));
  const coverMaterial = useDisposed(useMemo(() => printMaterial(planes), [planes]));
  const storyMaterial = useDisposed(useMemo(() => printMaterial(planes), [planes]));
  const plate = useDisposed(useMemo(plateGeometry, []));
  const plateMap = useDisposed(
    useMemo(() => {
      const texture = new THREE.CanvasTexture(source?.image ?? document.createElement('canvas'));
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }, [source]),
  );
  const plateMaterial = useDisposed(
    useMemo(
      () => new THREE.MeshBasicMaterial({ map: plateMap, toneMapped: false, depthTest: false }),
      [plateMap],
    ),
  );
  const seen = useRef(0);
  for (const [material, map] of [
    [coverMaterial, coverMap],
    [storyMaterial, storyMap],
  ] as const) {
    if (material.map !== map) {
      material.map = map;
      material.needsUpdate = true;
    }
    material.opacity = props.print.strength;
  }

  const pose = (index: number) => {
    const tracked = trackedFrame(index);
    placeGrid(coverGeometry, tracked.left, PLATE.width, PLATE.height);
    placeGrid(storyGeometry, tracked.right, PLATE.width, PLATE.height);
    const [left, right] = tracked.doors;
    planes[0]?.set(new THREE.Vector3(1, 0, 0), PLATE.width / 2 - left);
    planes[1]?.set(new THREE.Vector3(-1, 0, 0), right - PLATE.width / 2);
    tracked.light.forEach((light, side) => {
      const tone = 1 - props.print.shading * (1 - Math.min(1, light));
      (side === 0 ? coverMaterial : storyMaterial).color.setScalar(tone);
    });
  };

  if (source === null) {
    pose(frame);
  }
  useFrame(() => {
    if (source === null) {
      return;
    }
    if (source.version !== seen.current) {
      seen.current = source.version;
      plateMap.needsUpdate = true;
    }
    pose(source.index ?? frame);
  });

  return (
    <>
      {source === null ? null : <mesh geometry={plate} material={plateMaterial} renderOrder={0} />}
      <mesh geometry={coverGeometry} material={coverMaterial} renderOrder={1} />
      <mesh geometry={storyGeometry} material={storyMaterial} renderOrder={1} />
    </>
  );
};
