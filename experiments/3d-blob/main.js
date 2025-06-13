import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvasContainer = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const aspectRatio = window.innerWidth / window.innerHeight;
const viewSize = 200;
const orthographicCamera = new THREE.OrthographicCamera(
  (-viewSize * aspectRatio) / 2,
  (viewSize * aspectRatio) / 2,
  viewSize / 2,
  -viewSize / 2,
  -2000,
  2000
);

const controls = new OrbitControls(orthographicCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

orthographicCamera.position.set(100, 100, 150);
orthographicCamera.zoom = 0.9;
controls.target.set(50, 50, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// blob geometry
const geometry = new THREE.IcosahedronGeometry(50, 50);
const pos = geometry.attributes.position;
const count = pos.count;

for (let i = 0; i < count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  const z = pos.getZ(i);
  const offset = 0.25 * Math.sin(x * 0.05) * Math.cos(y * 0.05) * Math.sin(z * 0.05);
  const scale = 1 + offset;
  pos.setXYZ(i, x * scale, y * scale, z * scale);
}

pos.needsUpdate = true;
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({
  color: 0x5588ff,
  roughness: 0.4,
  metalness: 0.1,
  flatShading: false,
});

const blob = new THREE.Mesh(geometry, material);
scene.add(blob);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, 100, 100);
scene.add(dirLight);

function animate() {
  requestAnimationFrame(animate);
  blob.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, orthographicCamera);
}

animate();
