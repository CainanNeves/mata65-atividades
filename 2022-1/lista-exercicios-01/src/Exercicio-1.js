// Desenhando objetos gráficos 2D

import * as THREE from "three";

import { GUI } from "../../../resources/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";

const gui = new GUI();
const rendSize = new THREE.Vector2();

var controls,
  scene,
  camera,
  renderer,
  curObj = null;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = rendSize.y =
    Math.min(window.innerWidth, window.innerHeight) * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  scene = new THREE.Scene();

  initGUI();

  camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);

  // ******************************************************************** //
  // **                          Circulo                               ** //
  // ******************************************************************** //
  const circleVert = [];

  let r = 0.5;
  let circleDef = 1;
  let rad = Math.PI / 180;

  for (let i = 0; i < 360; i += circleDef) {
    let degree = i * rad;
    var y = r * Math.sin(degree);
    var x = r * Math.cos(degree);
    circleVert.push(new THREE.Vector3(x, y, 0));
  }

  const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x6600cc });

  var circleGeometry = new THREE.BufferGeometry().setFromPoints(circleVert);

  var drawCircle = new THREE.LineLoop(circleGeometry, circleMaterial);
  drawCircle.name = "circle";
  drawCircle.visible = true;
  scene.add(drawCircle);

  // ******************************************************************** //
  // **                           Coração                              ** //
  // ******************************************************************** //

  const heartVert = [];

  r = 0.05;

  for (let i = 0; i < 360; i += 0.1) {
    let degree = i * rad;
    var x = r * (16 * (Math.sin(degree) * Math.sin(degree) * Math.sin(degree)));
    var y =
      r *
      (13 * Math.cos(degree) -
        5 * Math.cos(2 * degree) -
        2 * Math.cos(3 * degree) -
        Math.cos(4 * degree));
    heartVert.push(new THREE.Vector3(x, y, 0));
  }

  const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  var heartGeometry = new THREE.BufferGeometry().setFromPoints(heartVert);

  var drawHeart = new THREE.LineLoop(heartGeometry, heartMaterial);
  drawHeart.name = "heart";
  drawHeart.visible = false;
  scene.add(drawHeart);

  // ******************************************************************** //
  // **                           Astroid                              ** //
  // ******************************************************************** //

  const astroidVert = [];

  r = 0.8;

  for (let i = 0; i < 360; i += 1) {
    let degree = i * rad;
    var x = r * (Math.cos(degree) * Math.cos(degree) * Math.cos(degree));
    var y = r * (Math.sin(degree) * Math.sin(degree) * Math.sin(degree));
    astroidVert.push(new THREE.Vector3(x, y, 0));
  }

  const astroidMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  var astroidGeometry = new THREE.BufferGeometry().setFromPoints(astroidVert);

  var drawAstroid = new THREE.LineLoop(astroidGeometry, astroidMaterial);
  drawAstroid.name = "astroid";
  drawAstroid.visible = false;
  scene.add(drawAstroid);

  // ******************************************************************** //
  // **                     Estrela em um circulo                      ** //
  // ******************************************************************** //

  const starVert = [];
  const starCircleVert = [];

  r = 0.8;

  for (let i = 0; i < 360; i += circleDef) {
    let degree = i * rad;
    var y = r * Math.sin(degree);
    var x = r * Math.cos(degree);
    starCircleVert.push(new THREE.Vector3(x, y, 0));
  }

  for (let i = 0; i < 720; i += 144) {
    let degree = i * rad;
    var x = r * Math.cos(degree);
    var y = r * Math.sin(degree);
    starVert.push(new THREE.Vector3(x, y, 0));
  }

  const starCircleMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  var starGeometry = new THREE.BufferGeometry().setFromPoints(starVert);
  var starCircleGeometry = new THREE.BufferGeometry().setFromPoints(
    starCircleVert
  );

  var drawStarCircle = new THREE.LineLoop(
    starCircleGeometry,
    starCircleMaterial
  );
  var drawStar = new THREE.LineLoop(starGeometry, starMaterial);

  drawStar.name = "star";
  drawStar.visible = false;
  drawStarCircle.name = "starcircle";
  drawStarCircle.visible = false;
  scene.add(drawStarCircle);
  scene.add(drawStar);

  // ******************************************************************** //
  // **                         Renderização                           ** //
  // ******************************************************************** //

  renderer.clear();
  renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {
  var controls = {
    Formas: "Circulo",
  };

  gui
    .add(controls, "Formas", ["Circulo", "Coração", "Astroid", "Estrela"])
    .onChange(changeForm);
  gui.open();
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeForm(val) {
  switch (val) {
    case "Circulo":
      curObj = scene.getObjectByName("circle");
      curObj.visible = true;
      scene.getObjectByName("heart").visible = false;
      scene.getObjectByName("astroid").visible = false;
      scene.getObjectByName("star").visible = false;
      scene.getObjectByName("starcircle").visible = false;
      break;
    case "Coração":
      curObj = scene.getObjectByName("heart");
      curObj.visible = true;
      scene.getObjectByName("circle").visible = false;
      scene.getObjectByName("astroid").visible = false;
      scene.getObjectByName("star").visible = false;
      scene.getObjectByName("starcircle").visible = false;
      break;
    case "Astroid":
      scene.getObjectByName("astroid").visible = true;
      scene.getObjectByName("circle").visible = false;
      scene.getObjectByName("heart").visible = false;
      scene.getObjectByName("star").visible = false;
      scene.getObjectByName("starcircle").visible = false;
      break;
    case "Estrela":
      scene.getObjectByName("star").visible = true;
      scene.getObjectByName("starcircle").visible = true;
      scene.getObjectByName("circle").visible = false;
      scene.getObjectByName("heart").visible = false;
      scene.getObjectByName("astroid").visible = false;
      break;
  }

  renderer.clear();
  renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function onWindowResize() {
  let minDim = Math.min(window.innerWidth, window.innerHeight);

  renderer.setSize(minDim * 0.8, minDim * 0.8);

  renderer.clear();
  renderer.render(scene, camera);
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //
main();
