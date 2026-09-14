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

// Starting camera framing, as (horizontal distance, height) from the origin
// — every model is already normalized to TARGET_RADIUS, so this is the one
// place that controls how much of the viewport a model fills at rest.
// Pulled in from the original (radius 3, height 0.6) so it fills more of
// the frame.
const START_RADIUS = 2.15;
const START_HEIGHT = 0.43;

async function initViewer(root) {
  const base = root.dataset.model;
  // Play newest-frame-first when true (slider position 1 = last frame on
  // disk, counting down); set via data-reverse="true" per viewer instance —
  // not every future sequence will want the same direction.
  const reverse = root.dataset.reverse === 'true';
  // Both default on (matching the original evolved-design viewer) but are
  // opt-out per instance: data-wireframe="false" skips the triangle overlay,
  // data-angled="false" starts dead-on instead of at a 45° azimuth — a plain
  // shape like an antenna doesn't need either to read clearly.
  const showWireframe = root.dataset.wireframe !== 'false';
  const angledStart = root.dataset.angled !== 'false';
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

  // Slider "position" (1..total, what the user drags/what autoplay steps
  // through) vs. the actual frame number on disk — reversed decouples the
  // two so we don't have to physically renumber files to flip direction.
  function frameForPosition(position) {
    return reverse ? total - position + 1 : position;
  }

  // Progress through the sequence (0% at the first slider position, 100% at
  // the last), independent of `reverse` — it tracks the slider/scrubbing
  // position, not the underlying generation number.
  function percentForPosition(position) {
    if (total <= 1) return 100;
    return Math.round(((position - 1) / (total - 1)) * 100);
  }

  // --- Three.js scene setup -------------------------------------------
  // Fixed, theme-independent viewport background (not the page's --bg) so
  // the model reads clearly regardless of light/dark mode or its own color.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x161b22);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  // Start at a 45° azimuth rather than dead-on from the side, so the
  // model's depth/form reads immediately instead of looking flat.
  if (angledStart) {
    const azimuth = Math.PI / 4;
    camera.position.set(-START_RADIUS * Math.sin(azimuth), START_HEIGHT, START_RADIUS * Math.cos(azimuth));
  } else {
    camera.position.set(0, START_HEIGHT, START_RADIUS);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.7);
  fill.position.set(-4, -1, -3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x9fd8ff, 0.6);
  rim.position.set(-2, 3, -4);
  scene.add(rim);

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

  // Some STL exporters stamp every file with the same boilerplate
  // "COLOR=<gray> MATERIAL=..." header (e.g. this dataset's is a uniform
  // mid-gray at ~12% alpha) rather than real per-vertex color data. Taken
  // at face value that makes the whole mesh nearly transparent — barely
  // visible against the viewport background. So: only trust the file's
  // vertex colors when they actually vary across the mesh, and never trust
  // its alpha (a file's idea of "transparent" isn't one we want silently
  // making a model invisible) — always render fully opaque.
  function colorsAreUniform(colorAttr) {
    const arr = colorAttr.array;
    if (arr.length < 6) return true;
    const [r0, g0, b0] = arr;
    const eps = 0.01;
    for (let i = 3; i < arr.length; i += 3) {
      if (Math.abs(arr[i] - r0) > eps || Math.abs(arr[i + 1] - g0) > eps || Math.abs(arr[i + 2] - b0) > eps) {
        return false;
      }
    }
    return true;
  }

  function setMesh(geometry) {
    if (currentMesh) {
      scene.remove(currentMesh);
      currentMesh.geometry.dispose();
      currentMesh.material.dispose();
      currentMesh.children.forEach((child) => {
        child.geometry.dispose();
        child.material.dispose();
      });
    }

    const colorAttr = geometry.hasColors && geometry.getAttribute('color');
    const hasRealColors = colorAttr && !colorsAreUniform(colorAttr);

    // Some individuals' exported meshes have inconsistent (or fully
    // inverted) triangle winding — a known quirk of certain STL-writing
    // libraries. WebGL culls back-facing triangles by default, so a mesh
    // like that loses its visible outer shell and you end up looking at
    // the inside back wall instead, which reads as "see-through". Since
    // we can't fix the winding in the file itself, render both sides so
    // nothing gets culled — whichever surface is actually closest to the
    // camera still wins via normal depth testing, so correctly-wound
    // meshes are unaffected.
    const side = THREE.DoubleSide;

    const material = hasRealColors
      ? new THREE.MeshPhongMaterial({ vertexColors: true, side })
      : new THREE.MeshStandardMaterial({ color: 0x9aa3ac, metalness: 0.1, roughness: 0.6, side });

    const mesh = new THREE.Mesh(geometry, material);

    // Overlay the actual triangle mesh (every facet edge, not just silhouette
    // edges) so the evolved, low-poly structure itself is visible on top of
    // the solid shading, instead of it reading as a smooth blob. Skippable
    // per instance (data-wireframe="false") for simpler shapes where the
    // facets aren't the point.
    if (showWireframe) {
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }),
      );
      mesh.add(wireframe);
    }

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

  async function getFrame(frameNumber) {
    if (geometryCache.has(frameNumber)) return geometryCache.get(frameNumber);
    const filename = pattern.replace('%04d', String(frameNumber).padStart(4, '0'));
    const geometry = await loader.loadAsync(base + filename);
    geometryCache.set(frameNumber, geometry);
    return geometry;
  }

  let loadToken = 0;
  async function showPosition(position) {
    const frameNumber = frameForPosition(position);
    const token = ++loadToken;
    // Only show "Loading…" before anything has ever rendered. Once a mesh
    // is on screen, keep showing it while the next frame loads in the
    // background instead of flashing text over it every frame.
    if (!currentMesh) {
      status.hidden = false;
      status.textContent = 'Loading…';
    }
    try {
      const geometry = await getFrame(frameNumber);
      if (token !== loadToken) return; // a newer request superseded this one
      setMesh(geometry);
      status.hidden = true;
      label.textContent = `${percentForPosition(position)}%`;
    } catch (err) {
      if (token === loadToken) {
        status.hidden = false;
        status.textContent = 'Failed to load this frame.';
      }
    }
  }

  // Fire-and-forget prefetch so playback doesn't stall waiting on a frame
  // that hasn't started downloading yet.
  function prefetch(position) {
    const frameNumber = frameForPosition(position);
    if (!geometryCache.has(frameNumber)) getFrame(frameNumber).catch(() => {});
  }

  // --- Controls ---------------------------------------------------------
  slider.addEventListener('input', () => showPosition(Number(slider.value)));

  let playTimer = null;
  function stopPlaying() {
    if (playTimer === null) return;
    clearInterval(playTimer);
    playTimer = null;
    playButton.textContent = '▶';
    playButton.setAttribute('aria-label', 'Play');
  }
  function startPlaying() {
    if (playTimer !== null) return;
    playButton.textContent = '⏸';
    playButton.setAttribute('aria-label', 'Pause');
    playTimer = setInterval(() => {
      const next = Number(slider.value) >= total ? 1 : Number(slider.value) + 1;
      slider.value = next;
      showPosition(next);
      prefetch(next >= total ? 1 : next + 1);
    }, PLAY_INTERVAL_MS);
  }
  slider.addEventListener('pointerdown', stopPlaying);
  playButton.addEventListener('click', () => (playTimer !== null ? stopPlaying() : startPlaying()));

  // --- Render loop --------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  showPosition(1);
  prefetch(2);
  startPlaying();
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
