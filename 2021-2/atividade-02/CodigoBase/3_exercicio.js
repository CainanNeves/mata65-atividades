import * as THREE from "../../../resources/threejs/r131/build/three.module.js";
import { GUI } from "../../../resources/threejs/r131/examples/jsm/libs/dat.gui.module.js";

var scene;
var renderer;
var camera;
var params;
var axis;
var n, teste;
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
  camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);

  axis = new THREE.AxesHelper();

  buildGUI();

  animate();
}

function animate() {
  positions = [];
  colors = [];
  indices = [];

  positions.push(0, 0, 0);
  colors.push(1, 1, 1);

  if (!teste) {
    for (var i = 0; i <= 360; i += 5) {
      var y = Math.sin(i * (pi / 180));
      var x = Math.cos(i * (pi / 180));
      positions.push(x, y, 0.0);
      colors.push(
        (153 - (i * 153) / 360) / 255,
        (53 + i * (202 / 360)) / 255,
        (153 - (i * 153) / 360) / 255
      );
    }
    positions.push(1, 0, 0);

    for (var i = 0; i <= 72; i++) {
      indices.push(0, i, i + 1);
    }
  } else {
    for (var i = 0; i <= 360; i += 5) {
      var y = Math.sin(i * (pi / 180));
      var x = Math.cos(i * (pi / 180));
      positions.push(x, y, 0.0);
      if (i > 0) {
        positions.push(x, y, 0);
        colors.push(
          0,
          (255 - i * (255 / 360)) / 255,
          (255 - (i * 255) / 360) / 255
        );
        colors.push(
          (153 - (i * 153) / 360) / 255,
          (53 + i * (202 / 360)) / 255,
          (153 - (i * 153) / 360) / 255
        );
      }
    }

    positions.push(1, 0, 0);

    for (var i = 0; i <= 72 * 2; i++) {
      indices.push(0, i, i + 1);
    }
  }

  const circleGeometry = new THREE.BufferGeometry();

  circleGeometry.setIndex(indices);
  circleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  circleGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  var matColor = new THREE.MeshBasicMaterial({
    //color:0xffff00,
    vertexColors: THREE.VertexColors,
    wireframe: !n,
  });

  var lineColor = new THREE.Mesh(circleGeometry, matColor);
  //lineColor.translateY(-0.5);
  if (n != params.colo || teste != params.quebra) {
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
    color: false,
    quebra: false,
  };

  gui.add(params, "color").name("DesativarWireframe");
  gui.add(params, "quebra").name("Cor Partida");

  gui.open();
}

function update() {
  if (params.color != n || teste != params.quebra) {
    n = params.color;
    teste = params.quebra;
  }
}

main();
