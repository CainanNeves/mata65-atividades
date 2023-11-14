// Desenhando uma face triangular em Three.js

import * as THREE from "three";

const rendSize = new THREE.Vector2();

function main() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
  scene.add(camera);

  const positions = [];
  const indices = [];
  const color = [];

  positions.push(0.5, 0.5, 0.0);
  positions.push(-0.5, -0.5, 0.0);
  positions.push(0.5, -0.5, 0.0);

  indices.push(1, 2, 0);

  color.push(1, 0, 1);
  color.push(1, 1, 0);
  color.push(0, 1, 1);

  const triangleGeometry = new THREE.BufferGeometry();

  triangleGeometry.setIndex(indices);
  triangleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  triangleGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(color, 3)
  );

  var triangleMaterial = new THREE.MeshBasicMaterial({
    //color:0xffff00,
    vertexColors: true,
    wireframe: false,
  });

  var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

  scene.add(triangleMesh);

  renderer.clear();
  renderer.render(scene, camera);
}

main();
