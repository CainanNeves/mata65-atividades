import * as THREE from "three";

const rendSize = new THREE.Vector2();

function main() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();

  var camera = new THREE.Camera();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

main();
