// Mapeando uma imagem em Three.js

import * as THREE from "../../resources/threejs/r126/build/three.module.js";
import { GUI } from "../../resources/threejs/r126/examples/jsm/libs/dat.gui.module.js";
import { EffectComposer } from "../../resources/threejs/r126/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../../resources/threejs/r126/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../../resources/threejs/r126/examples/jsm/postprocessing/ShaderPass.js";

var renderer;
var scene;
var camera;
var video;
var composer;
var parameters;

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

  var matShader = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: texture },
      uPixelSize: {
        type: "v2",
        value: new THREE.Vector2(
          1.0 / texture.image.width,
          1.0 / texture.image.height
        ),
      },
    },
    vertexShader: document.getElementById("base-vs").textContent,
    fragmentShader: document.getElementById("grayScale-fs").textContent,
  });

  const myShaderPass = new ShaderPass(matShader);
  composer.addPass(myShaderPass);

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
