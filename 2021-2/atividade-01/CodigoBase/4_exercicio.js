import * as THREE from "../../../resources/threejs/r131/build/three.module.js";
import { GUI } from "../../../resources/threejs/r131/examples/jsm/libs/dat.gui.module.js";

var scene;
var renderer;
var camera;
var params;
var axis;
var alternado, diagonal, xis;
var positions = [];
var colors = [];
var indices = [];
var pi = Math.PI;

const gui = new GUI();

function main() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  // renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);
  renderer.setSize(500, 500);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  // var camera = new THREE.OrthographicCamera( -20.0, 20.0, 20.0, -20.00, -1.0, 1.0 );
  camera = new THREE.OrthographicCamera(-3.0, 3.0, 3.0, -3.0, -1.0, 1.0);

  axis = new THREE.AxesHelper();

  buildGUI();

  animate();
}

function animate() {
  positions = [];
  indices = [];

  var numVertices = 5;

  for (var i = -2; i <= 2; i++)
    for (var j = -2; j <= 2; j++) positions.push(i, j, 0);

  if (diagonal) {
    for (var i = 0; i < numVertices - 1; i++)
      for (var j = 0; j < numVertices - 1; j++) {
        indices.push(
          i * numVertices + j,
          (i + 1) * numVertices + j,
          (i + 1) * numVertices + j + 1
        );
        indices.push(
          i * numVertices + j,
          (i + 1) * numVertices + (j + 1),
          i * numVertices + (j + 1)
        );
      }
  } else if (alternado) {
    for (var i = 0; i < numVertices - 1; i += 1)
      for (var j = 0; j < numVertices - 1; j += 1) {
        if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
          indices.push(
            i * numVertices + j,
            (i + 1) * numVertices + j,
            (i + 1) * numVertices + j + 1
          );
          indices.push(
            i * numVertices + j,
            (i + 1) * numVertices + (j + 1),
            i * numVertices + (j + 1)
          );
        } else {
          indices.push(
            i * numVertices + j,
            i * numVertices + j + 1,
            (i + 1) * numVertices + j
          );
          indices.push(
            (i + 1) * numVertices + j,
            (i + 1) * numVertices + (j + 1),
            i * numVertices + (j + 1)
          );
        }
      }
  } else {
    for (var i = 0; i < numVertices - 1; i += 1)
      for (var j = 0; j < numVertices - 1; j += 1) {
        indices.push(
          i * numVertices + j,
          (i + 1) * numVertices + j,
          (i + 1) * numVertices + j + 1
        );
        indices.push(
          i * numVertices + j,
          (i + 1) * numVertices + (j + 1),
          i * numVertices + (j + 1)
        );
        indices.push(
          i * numVertices + j,
          i * numVertices + j + 1,
          (i + 1) * numVertices + j
        );
        indices.push(
          (i + 1) * numVertices + j,
          (i + 1) * numVertices + (j + 1),
          i * numVertices + (j + 1)
        );
      }
  }

  const malhaGeometry = new THREE.BufferGeometry();

  malhaGeometry.setIndex(indices);
  malhaGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  var matColor = new THREE.MeshBasicMaterial({
    wireframe: true,
  });

  var final = new THREE.Mesh(malhaGeometry, matColor);

  if (params.x != alternado || params.y != diagonal || params.z != xis) {
    update();
    scene.clear();
    scene.add(camera);
    scene.add(axis);
    scene.add(final);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  } else {
    scene.clear();
    scene.add(camera);
    scene.add(axis);
    scene.add(final);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}

function buildGUI() {
  params = {
    x: true,
    y: false,
    z: false,
  };

  gui.add(params, "x").name("A").listen();
  gui.add(params, "y").name("B").listen();
  gui.add(params, "z").name("C").listen();

  gui.open();
}

function update() {
  if (params.x != alternado) {
    alternado = params.x;
    if (params.x) {
      params.y = params.z = false;
    }
  }
  if (params.y != diagonal) {
    diagonal = params.y;
    if (params.y) {
      params.x = params.z = false;
    }
  }
  if (params.z != xis) {
    xis = params.z;
    if (params.z) {
      params.x = params.y = false;
    }
  }
}

main();
