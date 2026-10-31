import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/** A projected anchor in host pixels; `front` is false when it faces away from the camera. */
export interface ScreenPoint {
  x: number;
  y: number;
  front: boolean;
}

export interface RobotScene {
  /** Shows the model and tracks the given anchors. Resolves false if a newer call replaced it. */
  show(url: string, anchors: number[][]): Promise<boolean>;
  setActive(active: boolean): void;
  onFrame(callback: (points: ScreenPoint[]) => void): void;
}

// Longest side in scene units; sized so the arm and wheels stay inside the square stage
const MODEL_SIZE = 220;
const SWAY = 0.35;

interface LoadedModel {
  mesh: THREE.Mesh;
  size: THREE.Vector3;
}

export function createRobotScene(host: HTMLElement, { reduceMotion, touch }: { reduceMotion: boolean; touch: boolean }): RobotScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);
  camera.position.set(380, 230, 520);

  scene.add(new THREE.HemisphereLight(0xfff4ea, 0x2a1d17, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(300, 500, 400);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc9a8, 1.4);
  rim.position.set(-400, 200, -300);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, -10, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  // Zoom off so the wheel keeps scrolling the page
  controls.enableZoom = false;
  controls.update();
  // Keep the robot the right way up
  const polar = controls.getPolarAngle();
  controls.minPolarAngle = touch ? polar : 0.5;
  controls.maxPolarAngle = touch ? polar : 1.55;
  // On touch screens a vertical swipe scrolls the page; only sideways drags turn the robot
  if (touch) renderer.domElement.style.touchAction = 'pan-y';

  const draco = new DRACOLoader();
  // The glTF-only Draco decoder ships with three and is bundled by Vite (hashed, cacheable)
  draco.setDecoderPath(DRACO_GLTF_CONFIG);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  const material = new THREE.MeshPhongMaterial({ color: 0xd27d60, specular: 0x332222, shininess: 40, flatShading: true });
  const pivot = new THREE.Group();
  scene.add(pivot);
  const cache = new Map<string, Promise<LoadedModel>>();

  // The GLB files are Y-up already, so the mesh is only centred and scaled, not rotated
  function load(url: string) {
    if (!cache.has(url)) {
      cache.set(
        url,
        loader.loadAsync(url).then((gltf) => {
          let geometry: THREE.BufferGeometry | undefined;
          gltf.scene.traverse((obj) => {
            if (!geometry && (obj as THREE.Mesh).isMesh) geometry = (obj as THREE.Mesh).geometry;
          });
          if (!geometry) throw new Error(`No mesh in ${url}`);
          geometry.center();
          geometry.computeBoundingBox();
          const size = geometry.boundingBox!.getSize(new THREE.Vector3());
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.setScalar(MODEL_SIZE / Math.max(size.x, size.y, size.z));
          return { mesh, size };
        }),
      );
    }
    return cache.get(url)!;
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  // Gentle sway until the visitor grabs the model
  let swaying = !reduceMotion;
  controls.addEventListener('start', () => (swaying = false));

  let visible = true;
  let active = true;
  new IntersectionObserver((entries) => (visible = entries[0].isIntersecting)).observe(host);

  let current: THREE.Mesh | null = null;
  let anchors: THREE.Vector3[] = [];
  let frameCallback: ((points: ScreenPoint[]) => void) | null = null;
  let request = 0;
  const world = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const toCamera = new THREE.Vector3();

  function project(): ScreenPoint[] {
    if (!current) return [];
    const { clientWidth: w, clientHeight: h } = host;
    const centre = current.getWorldPosition(new THREE.Vector3());
    return anchors.map((local) => {
      world.copy(local).applyMatrix4(current!.matrixWorld);
      // Rough facing test: anchor's outward direction from the model centre vs. the camera
      normal.copy(world).sub(centre);
      toCamera.copy(camera.position).sub(world);
      const front = normal.dot(toCamera) > 0;
      const ndc = world.project(camera);
      return { x: ((ndc.x + 1) / 2) * w, y: ((1 - ndc.y) / 2) * h, front };
    });
  }

  renderer.setAnimationLoop((time) => {
    if (!visible || !active) return;
    if (swaying) pivot.rotation.y = Math.sin((time / 1000) * 0.4) * SWAY;
    controls.update();
    renderer.render(scene, camera);
    if (frameCallback) frameCallback(project());
  });

  return {
    async show(url, anchorFractions) {
      const token = ++request;
      const { mesh, size } = await load(url);
      // A newer selection arrived while this model was loading: leave the scene to it
      if (token !== request) return false;
      pivot.clear();
      pivot.add(mesh);
      current = mesh;
      // Fractions of the bounding box -> local (centred, unscaled) geometry coordinates
      anchors = anchorFractions.map(([fx, fy, fz]) => new THREE.Vector3((fx - 0.5) * size.x, (fy - 0.5) * size.y, (fz - 0.5) * size.z));
      return true;
    },
    setActive(value) {
      active = value;
    },
    onFrame(callback) {
      frameCallback = callback;
    },
  };
}
