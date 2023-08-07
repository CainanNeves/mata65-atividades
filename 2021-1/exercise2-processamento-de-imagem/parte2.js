// Mapeando uma imagem em Three.js

import * as THREE from "../../resources/threejs/r126/build/three.module.js";
import { GUI } from "../../resources/threejs/r126/examples/jsm/libs/dat.gui.module.js";
import { EffectComposer } from "../../resources/threejs/r126/examples/jsm/postprocessing/EffectComposer.js";
import { HalftonePass } from "../../resources/threejs/r126/examples/jsm/postprocessing/HalftonePass.js";
import { RenderPass } from "../../resources/threejs/r126/examples/jsm/postprocessing/RenderPass.js";

var renderer;
var scene;
var camera;
var video;
var parameters;
var composer;

const gui = new GUI();

function main() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(1280, 720);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  video = document.getElementById("video");

  camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1.0, 1.0);
  scene.add(camera);

  // Plane
  var planeGeometry = new THREE.PlaneBufferGeometry();
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

main();
