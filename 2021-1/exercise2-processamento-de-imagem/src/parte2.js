// Mapeando uma imagem em Three.js

import * as THREE from "three";
import { GUI } from "../../../resources/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";
import { EffectComposer } from "../../../resources/scripts/three.js/examples/jsm/postprocessing/EffectComposer.js";
import { HalftonePass } from "../../../resources/scripts/three.js/examples/jsm/postprocessing/HalftonePass.js";
import { RenderPass } from "../../../resources/scripts/three.js/examples/jsm/postprocessing/RenderPass.js";

const rendSize = new THREE.Vector2();

var renderer, scene, camera, video, parameters, composer;

const gui = new GUI();

function main() {
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(rendSize.x * 1.8, rendSize.y);

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  video = document.getElementById("video");

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1.0, 1.0);

  scene.add(camera);

  // Plane
  var planeGeometry = new THREE.PlaneGeometry();
  const texture = new THREE.VideoTexture(video);

  var planeMat = new THREE.MeshBasicMaterial({ map: texture });

  var plane = new THREE.Mesh(planeGeometry, planeMat);
  plane.position.set(0.0, 0.0, -0.5);
  scene.add(plane);

  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const params = {
    shape: 1,
    radius: 5,
    rotateR: Math.PI / 12,
    rotateB: (Math.PI / 12) * 2,
    rotateG: (Math.PI / 12) * 3,
    scatter: 0,
    blending: 1,
    blendingMode: 1,
    greyscale: false,
    disable: false,
  };

  const halftonePass = new HalftonePass(
    window.innerWidth,
    window.innerHeight,
    params
  );

  composer.addPass(halftonePass);

  buildGUI();

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
      video: {
        width: 1280,
        height: 720,
        facingMode: "user",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(fStream)
      .catch(videoError);
  } else console.error("MediaDevices interface not available.");

  animate();
}

function fStream(stream) {
  // apply the stream to the video element used in the texture
  video.srcObject = stream;
  video.play();
}

function videoError(error) {
  console.error("Unable to access the camera/webcam.", error);
}

function animate() {
  requestAnimationFrame(animate);
  if (!parameters.disable) renderer.render(scene, camera);
  else composer.render();
}

function buildGUI() {
  parameters = {
    disable: false,
  };

  gui.add(parameters, "disable").name("Enable");

  gui.open();
}

function onWindowResize() {
  let minDim = Math.min(window.innerWidth, window.innerHeight);

  renderer.setSize(minDim * 0.8, minDim * 0.8);

  renderer.clear();
  renderer.render(scene, camera);
}

main();
