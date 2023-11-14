// Mapeando uma imagem em Three.js

import * as THREE from "three";
import { GUI } from "../../../resources/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";
import { EffectComposer } from "../../../resources/scripts/three.js/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../../../resources/scripts/three.js/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../../../resources/scripts/three.js/examples/jsm/postprocessing/ShaderPass.js";

const rendSize = new THREE.Vector2();

var renderer, scene, camera, video, composer, parameters;

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

function onWindowResize() {
  let minDim = Math.min(window.innerWidth, window.innerHeight);

  renderer.setSize(minDim * 0.8, minDim * 0.8);

  renderer.clear();
  renderer.render(scene, camera);
}

main();
