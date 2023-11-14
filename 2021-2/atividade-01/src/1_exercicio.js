import * as THREE from "three";
import { GUI } from "../../../resources/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";

const rendSize = new THREE.Vector2();

var scene;
var renderer;
var camera;
var params;
var axis;
var n;
var positions = [];
var colors = [];
var pi = Math.PI;

const gui = new GUI();

function main() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  // var camera = new THREE.OrthographicCamera( -20.0, 20.0, 20.0, -20.00, -1.0, 1.0 );
  camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);

  axis = new THREE.AxesHelper();

  buildGUI();

  animate();
}

function animate() {
  positions = [];
  colors = [];

  if (n == 0) {
    for (var i = 0; i <= 360; i += 360 / 360) {
      var y = Math.sin(i * (pi / 180));
      var x = Math.cos(i * (pi / 180));
      positions.push(x, y, 0.0);
      colors.push(x, y, i / 360);
    }
  } else {
    for (var i = 0; i <= n * 360; i++) {
      var y = Math.sin(i * (pi / 180)) * (1 / (1 + i / 360));
      var x = Math.cos(i * (pi / 180)) * (1 / (1 + i / 360));
      positions.push(x, y, 0.0);
      colors.push(x, y, i / 360);
    }
  }

  const spiralGeometry = new THREE.BufferGeometry();

  spiralGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  spiralGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  var matColor = new THREE.LineBasicMaterial({ vertexColors: true });

  var lineColor = new THREE.Line(spiralGeometry, matColor);

  if (n != params.voltas) {
    update();
    scene.clear();
    scene.add(camera);
    scene.add(axis);
    scene.add(lineColor);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  } else {
    scene.clear();
    scene.add(camera);
    scene.add(axis);
    scene.add(lineColor);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}

function buildGUI() {
  params = {
    voltas: 0,
  };

  gui.add(params, "voltas", 0, 100, 1).name("Número de voltas");

  gui.open();
}

function update() {
  if (params.voltas != n) {
    n = params.voltas;
  }
}

main();
