// Mapeando uma imagem em Three.js

import * as THREE from "three";
import { GUI } from "../../../resources/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";

const rendSize = new THREE.Vector2();

var texture,
  renderer,
  scene,
  camera,
  video,
  parameters,
  matShader,
  weights,
  cChanel;

const gui = new GUI();

function main() {
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

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

  // const material = new THREE.MeshBasicMaterial( { map: texture } );
  weights = new THREE.Vector3(0.299, 0.587, 0.114);

  const uniform = {
    uSampler: { type: "t", value: texture },
    uW: { type: "v3", value: weights },
    grayscale: { value: cChanel },
  };

  matShader = new THREE.ShaderMaterial({
    uniforms: uniform,
    vertexShader: document.getElementById("base-vs").textContent,
    fragmentShader: document.getElementById("grayScale-fs").textContent,
  });

  var plane = new THREE.Mesh(planeGeometry, matShader);
  scene.add(plane);

  buildGUI();

  // Global Axis
  // var globalAxis = new THREE.AxesHelper(1.0);
  // globalAxis.position.set(0.0, 0.0, 0.5);
  // scene.add(globalAxis);

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

  renderer.clear();
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
  renderer.render(scene, camera);
  update();
}

function buildGUI() {
  parameters = {
    gray: true,
    pesoR: 0.299,
    pesoG: 0.587,
    pesoB: 0.114,
  };

  gui.add(parameters, "gray").name("Grayscale");
  gui.add(parameters, "pesoR").min(0.0).max(1.0).step(0.01);
  gui.add(parameters, "pesoG").min(0.0).max(1.0).step(0.01);
  gui.add(parameters, "pesoB").min(0.0).max(1.0).step(0.01);

  gui.open();
}

function update() {
  if (matShader != null) {
    weights.x = parameters.pesoR;
    weights.y = parameters.pesoG;
    weights.z = parameters.pesoB;
    matShader.uniforms.uW.value = weights;
    if (parameters.gray) matShader.uniforms.grayscale.value = 1;
    else matShader.uniforms.grayscale.value = 0;
  }
}

function onWindowResize() {
  let minDim = Math.min(window.innerWidth, window.innerHeight);

  renderer.setSize(minDim * 0.8, minDim * 0.8);

  renderer.clear();
  renderer.render(scene, camera);
}

main();
