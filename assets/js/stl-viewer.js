// Interactive STL sequence viewer: drag to orbit/zoom a mesh, and scrub a
// slider through a numbered sequence of frames (e.g. one evolved individual
// per generation). Point it at a folder built by utils/stage_stl_sequence.rb
// — <div class="stl-viewer" data-model="/assets/models/<name>/"></div> — and
// it reads that folder's manifest.json to know how many frames there are.
//
// Multiple .stl-viewer elements on one page each get their own independent
// scene; nothing here is specific to any one dataset.

import * as THREE from 'three';
import { STLLoader } from './vendor/three/STLLoader.js';
import { OrbitControls } from './vendor/three/OrbitControls.js';

const TARGET_RADIUS = 1; // every frame is centered + scaled to this radius,
                          // so generations of different sizes stay comparable
const PLAY_INTERVAL_MS = 180;

async function initViewer(root) {
  const base = root.dataset.model;
  const canvas = root.querySelector('.stl-viewer__canvas');
  const wrap = root.querySelector('.stl-viewer__canvas-wrap');
  const status = root.querySelector('.stl-viewer__status');
  const slider = root.querySelector('.stl-viewer__slider');
  const playButton = root.querySelector('.stl-viewer__play');
  const label = root.querySelector('.stl-viewer__label');

  let manifest;
  try {
    const res = await fetch(base + 'manifest.json');
    if (!res.ok) throw new Error(res.statusText);
    manifest = await res.json();
  } catch (err) {
    status.textContent = 'Could not load model data.';
    return;
  }

  const total = manifest.count;
  const pattern = manifest.pattern || 'frame-%04d.stl';
  slider.min = 1;
  slider.max = total;
  slider.value = 1;

  // --- Three.js scene setup -------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.6, 3);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-4, -2, -3);
  scene.add(fill);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.8;
  controls.maxDistance = 8;

  let currentMesh = null;
  const loader = new STLLoader();
  const geometryCache = new Map();

  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(wrap);
  resize();

  function setMesh(geometry) {
    if (currentMesh) {
      scene.remove(currentMesh);
      currentMesh.geometry.dispose();
      currentMesh.material.dispose();
    }

    let material;
    if (geometry.hasColors) {
      material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        opacity: geometry.alpha ?? 1,
        transparent: (geometry.alpha ?? 1) < 1,
      });
    } else {
      material = new THREE.MeshStandardMaterial({ color: 0x4dd8c9, metalness: 0.15, roughness: 0.55 });
    }

    const mesh = new THREE.Mesh(geometry, material);

    geometry.computeBoundingSphere();
    const sphere = geometry.boundingSphere;
    if (sphere && sphere.radius > 0) {
      const scale = TARGET_RADIUS / sphere.radius;
      mesh.scale.setScalar(scale);
      mesh.position.copy(sphere.center).multiplyScalar(-scale);
    }

    scene.add(mesh);
    currentMesh = mesh;
  }

  async function getFrame(index) {
    if (geometryCache.has(index)) return geometryCache.get(index);
    const filename = pattern.replace('%04d', String(index).padStart(4, '0'));
    const geometry = await loader.loadAsync(base + filename);
    geometryCache.set(index, geometry);
    return geometry;
  }

  let loadToken = 0;
  async function showFrame(index) {
    const token = ++loadToken;
    status.hidden = false;
    status.textContent = 'Loading…';
    try {
      const geometry = await getFrame(index);
      if (token !== loadToken) return; // a newer request superseded this one
      setMesh(geometry);
      status.hidden = true;
      label.textContent = `Gen ${index} / ${total}`;
    } catch (err) {
      if (token === loadToken) status.textContent = 'Failed to load this frame.';
    }
  }

  // --- Controls ---------------------------------------------------------
  slider.addEventListener('input', () => showFrame(Number(slider.value)));

  let playTimer = null;
  function stopPlaying() {
    if (playTimer === null) return;
    clearInterval(playTimer);
    playTimer = null;
    playButton.textContent = '▶';
    playButton.setAttribute('aria-label', 'Play');
  }
  slider.addEventListener('pointerdown', stopPlaying);

  playButton.addEventListener('click', () => {
    if (playTimer !== null) {
      stopPlaying();
      return;
    }
    playButton.textContent = '⏸';
    playButton.setAttribute('aria-label', 'Pause');
    playTimer = setInterval(() => {
      const next = Number(slider.value) >= total ? 1 : Number(slider.value) + 1;
      slider.value = next;
      showFrame(next);
    }, PLAY_INTERVAL_MS);
  });

  // --- Render loop --------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  showFrame(1);
}

function init() {
  document.querySelectorAll('.stl-viewer[data-model]').forEach((root) => {
    initViewer(root).catch(() => {
      const status = root.querySelector('.stl-viewer__status');
      if (status) status.textContent = 'Could not start the 3D viewer.';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
