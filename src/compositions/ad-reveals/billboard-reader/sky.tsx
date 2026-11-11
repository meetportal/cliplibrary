import { useMemo } from 'react';
import * as THREE from 'three';
import { mix } from './color';

const vertexShader = `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 top;
uniform vec3 horizon;
uniform vec3 glow;
uniform vec3 sun;
varying vec3 vDirection;
void main() {
  vec3 direction = normalize(vDirection);
  float height = clamp(direction.y, 0.0, 1.0);
  float blend = pow(smoothstep(0.0, 0.62, height), 0.75);
  vec3 color = mix(horizon, top, blend);
  float facing = max(dot(direction, sun), 0.0);
  float above = smoothstep(-0.004, 0.004, direction.y);
  float halo = pow(facing, 12.0) * 0.14 + pow(facing, 160.0) * 0.3;
  float disk = smoothstep(0.99975, 0.99988, facing);
  color += above * glow * (halo + disk * 0.55);
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

export const Sky = ({
  top,
  horizon,
  sun,
}: {
  top: string;
  horizon: string;
  sun: THREE.Vector3;
}) => {
  const uniforms = useMemo(
    () => ({
      top: { value: new THREE.Color() },
      horizon: { value: new THREE.Color() },
      glow: { value: new THREE.Color() },
      sun: { value: new THREE.Vector3() },
    }),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms,
      }),
    [uniforms],
  );
  uniforms.sun.value.copy(sun);
  uniforms.top.value.set(top);
  uniforms.horizon.value.set(horizon);
  uniforms.glow.value.set(mix(horizon, '#fff3dc', 0.7));
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[1800, 48, 24]} />
    </mesh>
  );
};
