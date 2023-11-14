// Modificando a geometria dos objetos utilizando Vertex Shaders

import * as THREE from "three";

import { GUI } from "../../../resources/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";

const gui = new GUI();

const rendSize = new THREE.Vector2();

var controls, scene, camera, renderer, shaderMat;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = window.innerWidth * 0.8;
  rendSize.y = window.innerHeight * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70.0,
    rendSize.x / rendSize.y,
    0.01,
    1000.0
  );
  camera.position.y = 2.0;
  camera.position.z = 13.0;
  camera.updateProjectionMatrix();

  initGUI();

  geraTerreno();

  requestAnimationFrame(anime);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
function anime(time) {
  var obj = scene.getObjectByName("terreno");

  renderer.clear();
  renderer.render(scene, camera);

  requestAnimationFrame(anime);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function geraTerreno() {
  const positions = [];
  const indices = [];
  const colors = [];

  var cp = new THREE.Color(1.0, 0.5, 0.2);

  for (let x = -50.0; x < 50.0; x += 100.0 / 80.0) {
    for (let z = -50.0; z < 50.0; z += 100.0 / 80.0) {
      positions.push(x, 0.0, z);
      colors.push(cp.r, cp.g, cp.b);
    }
  }

  for (let i = 0; i < 79; i++)
    for (let j = 0; j < 79; j++) {
      indices.push(i * 80 + j);
      indices.push(i * 80 + (j + 1));
      indices.push((i + 1) * 80 + j);

      indices.push(i * 80 + (j + 1));
      indices.push((i + 1) * 80 + (j + 1));
      indices.push((i + 1) * 80 + j);
    }

  const ptos = new THREE.BufferGeometry();

  ptos.setIndex(indices);
  ptos.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  ptos.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  shaderMat = new THREE.ShaderMaterial({
    uniforms: { uAmp: { type: "f", value: 2.0 } },
    vertexShader: document.getElementById("minVertShader").textContent,
    fragmentShader: document.getElementById("minFragShader").textContent,
    wireframe: true,
    vertexColors: true,
    side: THREE.DoubleSide,
  });

  const objPtos = new THREE.Mesh(ptos, shaderMat);
  objPtos.name = "terreno";
  scene.add(objPtos);

  var axis = new THREE.AxesHelper(8.0);
  axis.name = "eixos";
  axis.rotateX((-90.0 * Math.PI) / 180.0);
  axis.position.y = 0.2;
  axis.updateMatrix();
  objPtos.add(axis);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {
  controls = { Amplitude: 1.0 };

  gui.add(controls, "Amplitude", 0.1, 20.0).onChange(mudaUniform);

  gui.open();
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function mudaUniform() {
  var obj = scene.getObjectByName("terreno");
  obj.material.uniforms.uAmp.value = controls.Amplitude;
  obj.material.uniformsNeedUpdate = true;
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function onWindowResize() {
  rendSize.x = window.innerWidth * 0.8;
  rendSize.y = window.innerHeight * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  camera.aspect = rendSize.x / rendSize.y;
  camera.updateProjectionMatrix();

  renderer.clear();
  renderer.render(scene, camera);
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

main();
