import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/** A projected point in host pixels. */
export interface ScreenPoint {
  x: number;
  y: number;
}

export interface RobotScene {
  /** Shows the model and tracks the given anchors. Resolves false if a newer call replaced it. */
  show(url: string, anchors: number[][]): Promise<boolean>;
  setActive(active: boolean): void;
  /** Zooms in (factor < 1) or out (factor > 1), eased and clamped to the allowed range. */
  zoom(factor: number): void;
  /** Eases the camera back to the starting view and resumes the idle sway. */
  resetView(): void;
  /** Called after every rendered frame with the anchors and the model's centre, in host pixels. */
  onFrame(callback: (points: ScreenPoint[], centre: ScreenPoint) => void): void;
}

// Longest side in scene units; sized so the arm and wheels stay inside the square stage
const MODEL_SIZE = 220;
const SWAY = 0.35;
// Camera distance range for zooming; the starting view is about 680 away
const MIN_DISTANCE = 300;
const MAX_DISTANCE = 1100;

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
  controls.minDistance = MIN_DISTANCE;
  controls.maxDistance = MAX_DISTANCE;
  controls.update();
  const homePosition = camera.position.clone();
  // A plain mouse wheel keeps scrolling the page; Ctrl/⌘ + wheel (and trackpad pinch, which
  // browsers report as Ctrl + wheel) zooms. Stopping the event on the host, in the capture
  // phase, keeps it away from OrbitControls without preventing the page scroll.
  host.addEventListener(
    'wheel',
    (event) => {
      if (!event.ctrlKey && !event.metaKey) event.stopPropagation();
    },
    { capture: true, passive: true },
  );
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
  controls.addEventListener('start', () => {
    swaying = false;
    zoomTarget = null;
    returningHome = false;
  });

  // Button zoom and reset ease towards a goal over a few frames
  let zoomTarget: number | null = null;
  let returningHome = false;
  const offset = new THREE.Vector3();

  let visible = true;
  let active = true;
  new IntersectionObserver((entries) => (visible = entries[0].isIntersecting)).observe(host);

  let current: THREE.Mesh | null = null;
  let anchors: THREE.Vector3[] = [];
  let frameCallback: ((points: ScreenPoint[], centre: ScreenPoint) => void) | null = null;
  let request = 0;
  const world = new THREE.Vector3();

  function toScreen(point: THREE.Vector3): ScreenPoint {
    const { clientWidth: w, clientHeight: h } = host;
    const ndc = point.project(camera);
    return { x: ((ndc.x + 1) / 2) * w, y: ((1 - ndc.y) / 2) * h };
  }

  function project(): ScreenPoint[] {
    if (!current) return [];
    return anchors.map((local) => toScreen(world.copy(local).applyMatrix4(current!.matrixWorld)));
  }

  // Easing measured in time, not frames, so slow devices finish zoom/reset just as fast
  let lastTime = 0;
  const ease = (rate: number, dt: number) => 1 - Math.pow(1 - rate, dt * 60);

  renderer.setAnimationLoop((time) => {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.25) : 1 / 60;
    lastTime = time;
    if (!visible || !active) return;
    if (swaying) pivot.rotation.y = Math.sin((time / 1000) * 0.4) * SWAY;
    if (zoomTarget !== null) {
      offset.copy(camera.position).sub(controls.target);
      const distance = offset.length();
      const next = distance + (zoomTarget - distance) * ease(0.18, dt);
      camera.position.copy(controls.target).add(offset.setLength(next));
      if (Math.abs(zoomTarget - next) < 1) zoomTarget = null;
    }
    if (returningHome) {
      camera.position.lerp(homePosition, ease(0.15, dt));
      if (camera.position.distanceTo(homePosition) < 1) {
        camera.position.copy(homePosition);
        returningHome = false;
      }
    }
    controls.update();
    renderer.render(scene, camera);
    if (frameCallback && current) frameCallback(project(), toScreen(current.getWorldPosition(world)));
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
    zoom(factor) {
      const from = zoomTarget ?? camera.position.distanceTo(controls.target);
      zoomTarget = THREE.MathUtils.clamp(from * factor, MIN_DISTANCE, MAX_DISTANCE);
      returningHome = false;
    },
    resetView() {
      zoomTarget = null;
      returningHome = true;
      swaying = !reduceMotion;
    },
    onFrame(callback) {
      frameCallback = callback;
    },
  };
}
