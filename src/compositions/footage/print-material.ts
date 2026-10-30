import * as THREE from 'three';

export type PrintMaterialOptions = {
  planes: THREE.Plane[];
  plate: THREE.Texture;
  width: number;
  height: number;
  stampShare: number;
};

const VERTEX_HEAD = `
uniform vec2 plateSize;
uniform float stampShare;
varying vec2 vPlateUv;
`;

const VERTEX_BODY = `
vPlateUv = vec2(
  (position.x + plateSize.x * 0.5) / plateSize.x,
  stampShare + (position.y + plateSize.y * 0.5) / plateSize.y * (1.0 - stampShare)
);
`;

const FRAGMENT_HEAD = `
uniform sampler2D plateMap;
uniform float shading;
uniform float paperWhite;
varying vec2 vPlateUv;
`;

const FRAGMENT_BODY = `
vec3 plate = texture2D(plateMap, vPlateUv).rgb;
float brightest = max(plate.r, max(plate.g, plate.b));
float tint = (brightest - min(plate.r, min(plate.g, plate.b))) / max(brightest, 0.001);
float paper = (1.0 - smoothstep(0.17, 0.27, tint)) * smoothstep(0.05, 0.12, brightest);
diffuseColor.a *= paper;
outgoingLight *= mix(1.0, clamp(brightest / paperWhite, 0.0, 1.15), shading);
`;

export const createPrintMaterial = ({
  planes,
  plate,
  width,
  height,
  stampShare,
}: PrintMaterialOptions) => {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    toneMapped: false,
    depthTest: false,
    clippingPlanes: planes,
  });
  const uniforms = {
    plateMap: { value: plate },
    plateSize: { value: new THREE.Vector2(width, height) },
    stampShare: { value: stampShare },
    shading: { value: 1 },
    paperWhite: { value: 0.74 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `${VERTEX_HEAD}${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n${VERTEX_BODY}`,
    );
    shader.fragmentShader = `${FRAGMENT_HEAD}${shader.fragmentShader}`.replace(
      '#include <opaque_fragment>',
      `${FRAGMENT_BODY}\n#include <opaque_fragment>`,
    );
  };
  return { material, uniforms };
};
