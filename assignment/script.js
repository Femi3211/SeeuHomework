import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const materials = {
  grass: new THREE.MeshBasicMaterial({ color: "green" }),
  road: new THREE.MeshBasicMaterial({ color: "gray" }),
  building: new THREE.MeshBasicMaterial({ color: "#2e8bc0" }),
  stickFigure: new THREE.MeshBasicMaterial({ color: "red" }),
};

// Ground plane
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), materials.grass);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Roads
function createRoad(width, height, position, rotation = 0) {
  const road = new THREE.Mesh(new THREE.PlaneGeometry(width, height), materials.road);
  road.rotation.x = -Math.PI / 2;
  road.rotation.z = rotation;
  road.position.set(...position);
  scene.add(road);
}

createRoad(5, 40, [0, 0.01, 0]);
createRoad(18, 5, [-11, 0.01, -6]);
createRoad(18, 5, [11, 0.01, -6]);

// Buildings
function createBuilding(x, z, width, height, depth, rotationY = 0, label = "") {
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    materials.building
  );
  building.position.set(x, height / 2, z);
  building.rotation.y = rotationY;
  scene.add(building);
  if (label) addLabel(building, label);
  return building;
}

function addLabel(building, text) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "70px Arial";
  context.fillStyle = "black";
  context.fillText(text, 50, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  
  sprite.scale.set(2, 1, 1);
  sprite.position.set(0, 2, 0);
  building.add(sprite);
}

createBuilding(-5.5, 14, 6, 3, 7, 0, "301");
createBuilding(-5.5, 5, 6, 3, 7, 0, "302");
createBuilding(-5.5, -14, 6, 3, 7, 0, "303");
createBuilding(11, 6, 8, 3, 15, Math.PI / 10, "801");

// Stick figure
function createStickFigure() {
  const group = new THREE.Group();

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), materials.stickFigure);
  head.position.y = 3;
  group.add(head);

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), materials.stickFigure);
  body.position.y = 2;
  group.add(body);

  // Arms
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), materials.stickFigure);
  leftArm.position.set(-0.75, 2.5, 0);
  leftArm.rotation.z = Math.PI / 4;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), materials.stickFigure);
  rightArm.position.set(0.75, 2.5, 0);
  rightArm.rotation.z = -Math.PI / 4;
  group.add(rightArm);

  // Legs
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), materials.stickFigure);
  leftLeg.position.set(-0.4, 0.5, 0);
  leftLeg.rotation.z = Math.PI / 10;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), materials.stickFigure);
  rightLeg.position.set(0.4, 0.5, 0);
  rightLeg.rotation.z = -Math.PI / 10;
  group.add(rightLeg);

  // Initial position of the stick figure
  group.position.set(0, 0.5, 0);
  scene.add(group);

  return group;
}

const stickFigure = createStickFigure();

// Animation for stick figure movement
gsap.to(stickFigure.position, {
  duration: 20,
  repeat: -1,
  ease: "linear",
  keyframes: [
    { x: 0, z: 15 },           // Move up the main road
    { x: -5.5, z: 15 },        // Move to the top building (301)
    { x: 0, z: 12 },           // Return to main road
    { x: 0, z: 2 },            // Middle building (302)
    { x: -5.5, z: 2 },         // Side of the middle building
    { x: 0, z: 2 },            // Return to main road
    { x: 0, z: -15 },          // Bottom building (303)
    { x: -5.5, z: -15 },       // Side of bottom building
    { x: 0, z: -12 },          // Return to main road
    { x: 0, z: 0 },            // Back to starting point
  ],
});

// Animation loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
