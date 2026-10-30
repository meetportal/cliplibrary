import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { continueRender, delayRender, getRemotionEnvironment } from 'remotion';
import * as THREE from 'three';
import type { ElevatorNewspaperProps } from '@/schemas';
import { gridGeometry, placeGrid, usePageTexture } from './page-mesh';
import { readPhoto } from './page-photos';
import { PLATE, trackedFrame } from './page-track';
import type { PlateSource } from './plate-source';
import { createPrintMaterial } from './print-material';

const STAMP_SHARE = PLATE.stampRows / (PLATE.height + PLATE.stampRows);

const plateGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.PlaneGeometry(PLATE.width, PLATE.height);
  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute([0, 1, 1, 1, 0, STAMP_SHARE, 1, STAMP_SHARE], 2),
  );
  return geometry;
};

const useDisposed = <T extends { dispose: () => void }>(value: T): T => {
  useEffect(() => () => value.dispose(), [value]);
  return value;
};

const useRenderedPlate = (source: PlateSource, frame: number) => {
  const advance = useThree((state) => state.advance);
  useLayoutEffect(() => {
    if (!getRemotionEnvironment().isRendering) {
      return;
    }
    if (source.index === frame) {
      advance(performance.now());
      return;
    }
    const handle = delayRender(`Waiting for footage frame ${frame}`);
    const listener = () => {
      if (source.index !== frame) {
        return;
      }
      source.listeners.delete(listener);
      advance(performance.now());
      continueRender(handle);
    };
    source.listeners.add(listener);
    return () => {
      source.listeners.delete(listener);
    };
  }, [source, frame, advance]);
};

export const SyncedSpread = ({
  props,
  frame,
  source,
}: {
  props: ElevatorNewspaperProps;
  frame: number;
  source: PlateSource;
}) => {
  const gl = useThree((state) => state.gl);
  gl.localClippingEnabled = true;
  const coverMap = usePageTexture('cover', props, readPhoto(props.cover.photo));
  const storyMap = usePageTexture('story', props, readPhoto(props.story.photo));
  const plateMap = useDisposed(
    useMemo(() => {
      const texture = new THREE.CanvasTexture(source.image);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }, [source]),
  );
  const planes = useMemo(
    () => [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
    ],
    [],
  );
  const prints = useMemo(() => {
    const make = () =>
      createPrintMaterial({
        planes,
        plate: plateMap,
        width: PLATE.width,
        height: PLATE.height,
        stampShare: STAMP_SHARE,
      });
    return [make(), make()] as const;
  }, [planes, plateMap]);
  useEffect(
    () => () => {
      for (const { material } of prints) {
        material.dispose();
      }
    },
    [prints],
  );
  const coverGeometry = useDisposed(useMemo(gridGeometry, []));
  const storyGeometry = useDisposed(useMemo(gridGeometry, []));
  const plate = useDisposed(useMemo(plateGeometry, []));
  const plateMaterial = useDisposed(
    useMemo(
      () => new THREE.MeshBasicMaterial({ map: plateMap, toneMapped: false, depthTest: false }),
      [plateMap],
    ),
  );
  const seen = useRef(-1);
  for (const [print, map] of [
    [prints[0], coverMap],
    [prints[1], storyMap],
  ] as const) {
    if (print.material.map !== map) {
      print.material.map = map;
      print.material.needsUpdate = true;
    }
    print.material.opacity = props.print.strength;
    print.uniforms.shading.value = props.print.shading;
  }
  useRenderedPlate(source, frame);

  useFrame(() => {
    if (source.version !== seen.current) {
      seen.current = source.version;
      plateMap.needsUpdate = true;
    }
    const tracked = trackedFrame(source.index ?? frame);
    placeGrid(coverGeometry, tracked.left, PLATE.width, PLATE.height);
    placeGrid(storyGeometry, tracked.right, PLATE.width, PLATE.height);
    const [left, right] = tracked.doors;
    planes[0]?.set(new THREE.Vector3(1, 0, 0), PLATE.width / 2 - left);
    planes[1]?.set(new THREE.Vector3(-1, 0, 0), right - PLATE.width / 2);
  });

  return (
    <>
      <mesh geometry={plate} material={plateMaterial} renderOrder={0} />
      <mesh geometry={coverGeometry} material={prints[0].material} renderOrder={1} />
      <mesh geometry={storyGeometry} material={prints[1].material} renderOrder={1} />
    </>
  );
};
