import { useMemo } from 'react';
import * as THREE from 'three';
import { mix } from './color';
import { GROUND_Y, SHORE_X, type Vec3 } from './layout';
import { surfTexture } from './textures';
import { glitterTexture, ripplesTexture, shoreFadeTexture } from './water-textures';

const WIDTH = 2600;
const LENGTH = 3600;
const CENTER_Z = -700;
const SURF_BAND = 34;
const GLITTER = { near: 90, far: 2300, nearWidth: 40, farWidth: 260 } as const;

const flat = (width: number, length: number) => {
  const geometry = new THREE.PlaneGeometry(width, length);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
};

const glitterStrip = () => {
  const { near, far, nearWidth, farWidth } = GLITTER;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [
        -nearWidth / 2,
        0,
        -near,
        nearWidth / 2,
        0,
        -near,
        farWidth / 2,
        0,
        -far,
        -farWidth / 2,
        0,
        -far,
      ],
      3,
    ),
  );
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  return geometry;
};

export const Ocean = ({
  color,
  horizon,
  frame,
  surf,
  sun,
  eye,
}: {
  color: string;
  horizon: string;
  frame: number;
  surf: number;
  sun: THREE.Vector3;
  eye: Vec3;
}) => {
  const assets = useMemo(() => {
    const lines = surfTexture();
    lines.repeat.set(SURF_BAND / 17, LENGTH / 70);
    const ripples = ripplesTexture();
    ripples.repeat.set(WIDTH / 70, LENGTH / 140);
    return {
      lines,
      ripples,
      fade: shoreFadeTexture(),
      glitter: glitterTexture(),
      sea: flat(WIDTH, LENGTH),
      band: flat(SURF_BAND, LENGTH),
      strip: glitterStrip(),
    };
  }, []);
  assets.lines.offset.set(frame * 0.004, 0);
  assets.ripples.offset.set(frame * 0.0006, frame * 0.0011);
  const foam = mix(color, '#ffffff', 0.75);
  const shine = mix(horizon, '#fff6e8', 0.6);
  const centerX = SHORE_X - WIDTH / 2;
  const heading = Math.atan2(-sun.x, -sun.z);
  return (
    <group>
      <mesh geometry={assets.sea} position={[centerX, GROUND_Y - 0.3, CENTER_Z]}>
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh geometry={assets.sea} position={[centerX, GROUND_Y - 0.28, CENTER_Z]}>
        <meshBasicMaterial
          map={assets.ripples}
          color={mix(color, '#ffffff', 0.35)}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
      <group position={[eye[0], GROUND_Y - 0.25, eye[2]]} rotation={[0, heading, 0]}>
        <mesh geometry={assets.strip}>
          <meshBasicMaterial
            map={assets.glitter}
            color={shine}
            transparent
            opacity={0.62 + 0.06 * Math.sin(frame / 9)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>
      {surf > 0 ? (
        <mesh geometry={assets.band} position={[SHORE_X - SURF_BAND / 2, GROUND_Y - 0.2, CENTER_Z]}>
          <meshBasicMaterial
            map={assets.lines}
            alphaMap={assets.fade}
            color={foam}
            transparent
            opacity={Math.min(1, 0.6 * surf)}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      <mesh position={[SHORE_X + 0.4, GROUND_Y - 0.1, CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, LENGTH]} />
        <meshBasicMaterial color={foam} transparent opacity={0.55 + 0.1 * Math.sin(frame / 17)} />
      </mesh>
    </group>
  );
};
