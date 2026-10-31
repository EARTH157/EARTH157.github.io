import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface RobotScene {
  show(url: string): Promise<void>;
}

// Longest side in scene units; sized so the arm and wheels stay inside the square stage
const MODEL_SIZE = 220;
const SWAY = 0.35;

export function createRobotScene(host: HTMLElement, { reduceMotion }: { reduceMotion: boolean }): RobotScene {
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

  // The glTF-only Draco decoder ships with three and is bundled by Vite (hashed, cacheable)
  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_GLTF_CONFIG);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  const material = new THREE.MeshPhongMaterial({ color: 0xd27d60, specular: 0x332222, shininess: 40, flatShading: true });
  const pivot = new THREE.Group();
  scene.add(pivot);
  const cache = new Map<string, Promise<THREE.Mesh>>();

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
          return mesh;
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
  new IntersectionObserver((entries) => (visible = entries[0].isIntersecting)).observe(host);

  renderer.setAnimationLoop((time) => {
    if (!visible) return;
    if (swaying) pivot.rotation.y = Math.sin((time / 1000) * 0.4) * SWAY;
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    async show(url: string) {
      const mesh = await load(url);
      pivot.clear();
      pivot.add(mesh);
    },
  };
}
