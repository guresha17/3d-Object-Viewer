import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

//Scene
const scene = new THREE.Scene();

//Create our object

//sphere
const geometry = new THREE.SphereGeometry(2, 64, 64);
// 5 = radius, 64 = widthSegments, 64 = heightSegments

//cone
// const geometry = new THREE.ConeGeometry(2, 4, 4);
// 2 = radius, 4 = height, 4 = radialSegments

const material = new THREE.MeshStandardMaterial({
  color: "#00ff00",
  roughness: 0.5,
});

const mesh = new THREE.Mesh(geometry, material);
// mesh is a combination of geometry and material

scene.add(mesh);

//Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Light

const light = new THREE.PointLight(0xffffff, 100, 100);
light.position.set(0, 10, 10);
scene.add(light);

//Camera

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 25;
scene.add(camera);

//Renderer

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.render(scene, camera);

//Resize

window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update Camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;

  renderer.setSize(sizes.width, sizes.height);
});

//Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

const loop = () => {
  // mesh.position.x += 0.1;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

//Timeline magic

// Timeline for the 3D object animation
const objectTl = gsap.timeline({
  defaults: { duration: 3, repeat: -1, yoyo: true },
});
objectTl.fromTo(
  mesh.position,
  { x: 0, ease: "power1.inOut" },
  { x: 10, ease: "power1.inOut" }
);
objectTl.to(mesh.scale, { x: 4, y: 4, z: 4, ease: "power1.inOut" }, "<");
objectTl.to(
  mesh.material.color,
  { r: 1, g: 0, b: 0, ease: "power1.inOut" },
  "<"
); // Change to red color

// Separate timeline for nav and title animations
const uiTl = gsap.timeline({ defaults: { duration: 2 } });
uiTl.fromTo("nav", { y: "-100%" }, { y: "0%" });
uiTl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//Mouse Animation Color

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes / height) * 255),
      150,
    ];

    //Lets Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
