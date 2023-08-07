// Construindo um sistema planetário.

import * as THREE from "../../../resources/threejs/r131/build/three.module.js";

var scene = null;
var renderer = null;
var camera = null;

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  renderer.setSize(window.innerHeight * 0.7, window.innerHeight * 0.7);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
  scene.add(camera);

  buildScene();

  renderer.clear();
  requestAnimationFrame(animate);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {
  // Sistema Solar: Sol, Terra e Lua
  var sphereGeometry = new THREE.SphereGeometry(1.0, 10, 10);
  var sphereMat = new THREE.MeshBasicMaterial({ wireframe: true });
  var sistemaSolar = new THREE.InstancedMesh(sphereGeometry, sphereMat, 3);
  sistemaSolar.name = "SistemaSolar";
  sistemaSolar.needsUpdate = true;

  scene.add(sistemaSolar);

  const instanceColors = [0xffff00, 0x0000ff, 0xaaaaaa];

  for (let i = 0; i < 3; i++)
    sistemaSolar.setColorAt(i, new THREE.Color(instanceColors[i]));
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate(time) {
  var rotSol = 0.0009 * time;
  var rotTerra = 0.0007 * time;
  var rotLua = 0.0005 * time;

  var transfMat = new THREE.Matrix4();
  var aux = new THREE.Matrix4();

  var obj = scene.getObjectByName("SistemaSolar");
  obj.rotateZ(0.001);

  // Sol

  transfMat.multiply(aux.makeRotationZ(rotSol));
  transfMat.multiply(aux.makeScale(0.4, 0.4, 0.4));
  obj.setMatrixAt(0, transfMat);

  // Terra

  transfMat.identity();
  transfMat.multiply(aux.makeTranslation(0.0, 0.7, 0.0));
  transfMat.multiply(aux.makeScale(0.1, 0.1, 0.1));
  transfMat.multiply(aux.makeRotationY(rotTerra));
  obj.setMatrixAt(1, transfMat);

  // Lua

  transfMat.identity();
  transfMat.multiply(aux.makeTranslation(0.0, 0.9, 0.0));
  transfMat.multiply(aux.makeScale(0.03, 0.03, 0.03));
  transfMat.multiply(aux.makeRotationZ(rotLua));
  obj.setMatrixAt(2, transfMat);

  obj.instanceMatrix.needsUpdate = true;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
