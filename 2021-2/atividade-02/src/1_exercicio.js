// Construindo um sistema planetário.

import * as THREE from "three";

const rendSize = new THREE.Vector2();

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

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

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
  // Sistema Solar
  var all = new THREE.Object3D();
  all.name = "SolarSystem";

  // Grupo terra
  var earth = new THREE.Object3D();
  earth.name = "EixoTerra";

  // Eixo do Sol
  var sAxis = new THREE.AxesHelper(0.6);

  // Sol
  var sphereGeometry = new THREE.SphereGeometry(0.4, 20, 20);
  var sphereMat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
  });
  var sol = new THREE.Mesh(sphereGeometry, sphereMat);
  sol.name = "Sol";
  sol.add(sAxis);

  // Eixo da Terra
  var tAxis = new THREE.AxesHelper(0.15);

  // Terra
  sphereGeometry = new THREE.SphereGeometry(0.1, 10, 10);
  sphereMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
  var terra = new THREE.Mesh(sphereGeometry, sphereMat);
  terra.name = "Terra";
  terra.add(tAxis);

  // Eixo da Lua
  var lAxis = new THREE.AxesHelper(0.04);

  // Lua
  sphereGeometry = new THREE.SphereGeometry(0.03, 5, 5);
  sphereMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true });
  var lua = new THREE.Mesh(sphereGeometry, sphereMat);
  lua.name = "Lua";
  lua.add(lAxis);
  lua.position.set(0.0, 0.2, 0.0);

  earth.add(terra);
  earth.add(lua);
  all.add(sol);
  all.add(earth);
  scene.add(all);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate() {
  let rotSol = 0.002; // Rotação do Sol ao redor de seu em radianos
  let rotTerra = 0.005; // Rotação da Terra ao redor de seu eixo em radianos
  let rotSS = 0.001; // Rotação do sistema solar
  let rotET = 0.01; // Rotação lua ao retor da terra

  let pTerraLua = new THREE.Vector3(0.0, 0.7, 0.0);

  var obj;

  obj = scene.getObjectByName("Sol");
  obj.rotateZ(rotSol);
  obj.updateMatrix();

  obj = scene.getObjectByName("Terra");
  obj.rotateZ(rotTerra);
  obj.updateMatrix();

  obj = scene.getObjectByName("SolarSystem");
  obj.rotateZ(rotSS);
  obj.updateMatrix();

  obj = scene.getObjectByName("EixoTerra");
  obj.rotateOnAxis(new THREE.Vector3(1.0, 1.0, 1.0).normalize(), rotET);
  obj.position.copy(pTerraLua);
  obj.updateMatrix();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
