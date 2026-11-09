import { Environment, Lightformer } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type * as THREE from 'three';
import type { PhoneStage } from '@/schemas';
import { useCanvasPixelRatio } from '../pixel-ratio';

type Vec3 = [number, number, number];

const CameraRig = ({ position, target, fov }: { position: Vec3; target: Vec3; fov: number }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  camera.position.set(...position);
  camera.fov = fov;
  camera.near = 1;
  camera.far = 120;
  camera.updateProjectionMatrix();
  camera.lookAt(...target);
  return null;
};

const Studio = ({ reflections, dark }: { reflections: number; dark: boolean }) => (
  <Environment resolution={512} frames={1}>
    <color attach="background" args={[dark ? '#1f1f24' : '#6c6c73']} />
    <Lightformer
      form="rect"
      intensity={1.1 * reflections}
      position={[-3.5, 3, 7]}
      rotation={[-0.35, -0.45, 0]}
      scale={[7, 9, 1]}
    />
    <Lightformer
      form="rect"
      intensity={3.2 * reflections}
      position={[0, 7, 3]}
      rotation={[Math.PI / 2.2, 0, 0]}
      scale={[16, 3, 1]}
    />
    <Lightformer
      form="rect"
      intensity={2.6 * reflections}
      position={[-7, 0.5, 2]}
      rotation={[0, Math.PI / 2.3, 0]}
      scale={[1.2, 12, 1]}
    />
    <Lightformer
      form="rect"
      intensity={2.2 * reflections}
      position={[7, 0.5, 2]}
      rotation={[0, -Math.PI / 2.3, 0]}
      scale={[1.2, 12, 1]}
    />
    <Lightformer
      form="rect"
      intensity={1.4 * reflections}
      position={[0, 0, -9]}
      rotation={[0, Math.PI, 0]}
      scale={[12, 8, 1]}
    />
    <Lightformer
      form="rect"
      intensity={(dark ? 0.2 : 0.7) * reflections}
      position={[0, -7, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[16, 4, 1]}
    />
    <Lightformer form="circle" intensity={1.6 * reflections} position={[3, 3, 9]} scale={2.4} />
  </Environment>
);

export const pixelsPerUnit = (stage: PhoneStage, height: number): number =>
  height / (2 * Math.tan((stage.fieldOfView * Math.PI) / 360) * stage.cameraDistance);

export const offscreenDrop = (stage: PhoneStage, scale: number, tipBack: number): number =>
  Math.tan((stage.fieldOfView * Math.PI) / 360) * stage.cameraDistance +
  1.55 * scale * Math.cos(tipBack) -
  0.3;

export const Stage = ({
  stage,
  dark,
  rimColor,
  children,
}: {
  stage: PhoneStage;
  dark: boolean;
  rimColor: string;
  children: ReactNode;
}) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 110) * 0.6 * stage.cameraDrift;
  const driftY = Math.cos(frame / 140) * 0.3 * stage.cameraDrift;
  const position: Vec3 = [driftX, driftY, stage.cameraDistance];
  const pixelRatio = useCanvasPixelRatio(2);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="variance"
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: stage.fieldOfView, position }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig
        position={position}
        target={[driftX * 0.4, driftY * 0.4, 0]}
        fov={stage.fieldOfView}
      />
      <ambientLight intensity={dark ? 0.25 : 0.55} />
      <directionalLight
        position={[-2.5, 4, 12]}
        intensity={stage.keyLight}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={stage.shadowSoftness}
        shadow-blurSamples={24}
        shadow-bias={-0.0004}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <directionalLight position={[6, 3, -3]} intensity={stage.rimLight} color={rimColor} />
      <directionalLight position={[-6, 1, -3]} intensity={stage.rimLight * 0.6} color={rimColor} />
      <Studio reflections={stage.reflections} dark={dark} />
      <mesh position={[0, 0, -1.8]} receiveShadow>
        <planeGeometry args={[160, 100]} />
        <shadowMaterial transparent opacity={stage.shadow} color={dark ? '#000000' : '#15151a'} />
      </mesh>
      {children}
    </ThreeCanvas>
  );
};
