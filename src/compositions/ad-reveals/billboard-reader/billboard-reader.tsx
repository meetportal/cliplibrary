import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { BillboardReaderProps } from '@/schemas';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import { useBoardAssets } from './assets';
import { Billboard } from './billboard';
import { drawBoardFace, drawLampPool, type FaceInput, faceInput } from './board-face';
import { City } from './city';
import { mix } from './color';
import { Hero } from './hero';
import { Sky } from './sky';
import { type CameraPose, cameraAt, endAzimuth, flipAt, lampLevels, lowerAt } from './timeline';

const SUN_ELEVATION = 0.05;

const CameraRig = ({ pose }: { pose: CameraPose }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  camera.position.set(...pose.position);
  camera.fov = pose.fov;
  camera.near = 1;
  camera.far = 2400;
  camera.updateProjectionMatrix();
  camera.lookAt(...pose.target);
  return null;
};

const canvasTexture = (draw: (canvas: HTMLCanvasElement) => void) => {
  const canvas = document.createElement('canvas');
  draw(canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
};

export const BillboardReader = (props: BillboardReaderProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  const assets = useBoardAssets(props.logo);
  const faceKey = JSON.stringify(faceInput(props));
  const face = useMemo(
    () =>
      assets === null
        ? null
        : canvasTexture((canvas) =>
            drawBoardFace(canvas, JSON.parse(faceKey) as FaceInput, assets.logo),
          ),
    [assets, faceKey],
  );
  const pool = useMemo(() => canvasTexture(drawLampPool), []);
  const { colors } = props;
  const pose = cameraAt(props.camera, frame, durationInFrames);
  const lamps = lampLevels(props.board, frame);
  const sunAzimuth = endAzimuth(props.camera);
  const sun = useMemo(
    () =>
      new THREE.Vector3(
        -Math.sin(sunAzimuth) * Math.cos(SUN_ELEVATION),
        Math.sin(SUN_ELEVATION),
        -Math.cos(sunAzimuth) * Math.cos(SUN_ELEVATION),
      ),
    [sunAzimuth],
  );
  const fog = useMemo(() => new THREE.Fog(colors.skyHorizon, 260, 2600), [colors.skyHorizon]);
  return (
    <AbsoluteFill style={{ backgroundColor: props.showBackground ? colors.skyHorizon : undefined }}>
      {face === null ? null : (
        <ThreeCanvas
          width={width}
          height={height}
          flat
          shadows="percentage"
          dpr={pixelRatio}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ fov: pose.fov, position: pose.position, near: 1, far: 2400 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <CameraRig pose={pose} />
          {props.showBackground ? <primitive attach="fog" object={fog} /> : null}
          <hemisphereLight args={[mix(colors.skyHorizon, '#ffffff', 0.35), '#3a3048', 1.7]} />
          <directionalLight
            position={[-26, 30, 34]}
            intensity={1.5}
            color={mix(colors.skyHorizon, '#ffffff', 0.55)}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0006}
            shadow-normalBias={0.02}
            shadow-camera-left={-13}
            shadow-camera-right={13}
            shadow-camera-top={13}
            shadow-camera-bottom={-13}
            shadow-camera-near={10}
            shadow-camera-far={110}
          />
          {props.showBackground ? (
            <Sky top={colors.skyTop} horizon={colors.skyHorizon} sun={sun} />
          ) : null}
          {props.showBackground ? (
            <City
              colors={colors}
              frame={frame}
              traffic={props.city.traffic}
              surf={props.city.surf}
              sun={sun}
              eye={pose.position}
            />
          ) : null}
          <Billboard
            face={face}
            pool={pool}
            boardColor={colors.board}
            lampColor={colors.lamp}
            glow={props.board.lampGlow}
            lamps={lamps}
          />
          {props.reader.show ? (
            <Hero
              frame={frame}
              flip={flipAt(props.reader, frame)}
              lower={lowerAt(props.reader, frame)}
              colors={colors}
              kick={props.reader.kick}
            />
          ) : null}
        </ThreeCanvas>
      )}
    </AbsoluteFill>
  );
};
