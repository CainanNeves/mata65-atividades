import * as THREE from "../../../resources/threejs/r131/build/three.module.js";
import { GUI } from "../../../resources/threejs/r131/examples/jsm/libs/dat.gui.module.js";

var scene;
var renderer;
var camera;
var params;
var axis;
var dHorizontal, dVertical, resQ;
var numVerticesV, numVerticesH;
var positions = [];
var colors = [];
var indices = [];

const gui = new GUI();

function main() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  // renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);
  renderer.setSize(500, 500);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  // var camera = new THREE.OrthographicCamera( -20.0, 20.0, 20.0, -20.00, -1.0, 1.0 );
  camera = new THREE.OrthographicCamera(-5.0, 5.0, 5.0, -5.0, -1.0, 1.0);

  axis = new THREE.AxesHelper();

  buildGUI();

  animate();
}

function animate() {
  positions = [];
  colors = [];
  indices = [];
  numVerticesH = 0;
  numVerticesV = 0;

  for (var i = -4; i <= 4; i += 4 / dHorizontal) {
    for (var j = -4; j <= 4; j += 4 / dVertical) {
      positions.push(i, j, 0);
      colors.push(Math.abs(i % 255), Math.abs(j % 255), (i * j) % 255);
      if (i == 0) numVerticesH++;
    }
    numVerticesV++;
  }

  for (var i = 0; i < numVerticesV - 1; i++)
    for (var j = 0; j < numVerticesH - 1; j++) {
      indices.push(
        i * numVerticesH + j,
        (i + 1) * numVerticesH + j,
        (i + 1) * numVerticesH + j + 1
      );
      indices.push(
        i * numVerticesH + j,
        (i + 1) * numVerticesH + (j + 1),
        i * numVerticesH + (j + 1)
      );
    }

  console.log(indices);
  const malhaGeometry = new THREE.BufferGeometry();

  malhaGeometry.setIndex(indices);
  malhaGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  malhaGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  var matColor = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    wireframe: true,
  });

  var final = new THREE.Mesh(malhaGeometry, matColor);

  if (params.dh != dHorizontal || params.dv != dVertical) {
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
    dh: 4,
    dv: 4,
  };

  gui.add(params, "dh", 1, 10, 4).name("Horizontal");
  gui.add(params, "dv", 1, 10, 0.1).name("Vertical");

  gui.open();
}

function update() {
  if (params.dh != dHorizontal) dHorizontal = params.dh;
  if (params.dv != dVertical) dVertical = params.dv;
}

main();
