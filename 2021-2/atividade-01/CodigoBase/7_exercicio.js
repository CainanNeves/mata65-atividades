import * as THREE from "../../../resources/threejs/r131/build/three.module.js";

function main() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();

  var camera = new THREE.Camera();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

main();
