// Mapeando uma imagem em Three.js

import * as THREE from "../../resources/threejs/r126/build/three.module.js";
import { GUI } from "../../resources/threejs/r126/examples/jsm/libs/dat.gui.module.js";

var texture;
var renderer;
var scene;
var camera;
var video;
var parameters;
var matShader;
var weights;
var cChanel;

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

main();
