// Desenhando uma malha de triangulos em Three.js

import * as THREE from "../../resources/threejs/r126/build/three.module.js";

var mesh;
var renderer;
var scene;
var camera;
var rotY = 0.0;

function main() {
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  renderer.setSize(500, 500);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(-5.0, 5.0, 5.0, -5.0, -5.0, 5.0);
  scene.add(camera);

  // *************************************************
  // Geometria da Superfície
  // *************************************************

  var incremento = 0.17;
  var pi = Math.PI;
  var umax = pi;
  var vmax = pi;
  var numVertices = 0,
    numX = 0;

  const positions = [];
  const indices = [];
  const colors = [];

  for (var v = -pi; v <= vmax; v += incremento) {
    for (var u = -pi; u <= umax; u += incremento) {
      var x = (2 * Math.sin(3 * u)) / (2 + Math.cos(v));
      var y =
        (2 * (Math.sin(u) + 2 * Math.sin(2 * u))) /
        (2 + Math.cos(v + (2 * pi) / 3));
      // var z = (Math.cos(u) - ((2 * Math.cos(2 * u)) * (2 + Math.cos(v)))) * ((2 + Math.cos(v + (2*pi / 3))) / 4);
      var z =
        (1 / 4) *
        (2 + Math.cos(v)) *
        (2 + Math.cos(v + (2 * pi) / 3)) *
        (Math.cos(u) - 2 * Math.cos(2 * u));
      positions.push(x, y, z);
      numX++;
      colors.push(Math.cos(x), Math.cos(y), Math.cos(z));
    }
    numVertices++;
  }

  // *************************************************
  // Indexação
  // *************************************************

  for (var i = 0; i < numVertices; i++) {
    for (var j = 0; j < numVertices; j++) {
      var nextLine = (i + 1) * numVertices + j;
      var thisLine = i * numVertices + j;

      if (thisLine + 1 >= numX) {
        indices.push(thisLine % numX, nextLine % numX, (nextLine % numX) + 1);
        indices.push(
          thisLine % numX,
          (nextLine % numX) + 1,
          (thisLine + 1) % numX
        );
      } else if (nextLine >= numX) {
        indices.push(thisLine, nextLine % numX, (nextLine % numX) + 1);
        indices.push(thisLine, (nextLine % numX) + 1, thisLine + 1);
      } else if (nextLine + 1 >= numX) {
        indices.push(thisLine, nextLine % numX, (nextLine + 1) % numX);
        indices.push(thisLine, (nextLine + 1) % numX, thisLine + 1);
      } else {
        indices.push(thisLine, nextLine, nextLine + 1);
        indices.push(thisLine, nextLine + 1, thisLine + 1);
      }
    }
  }

  const bufAttrColor = new Float32Array(colors);
  const surface = new THREE.BufferGeometry();

  surface.setIndex(indices);
  surface.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  surface.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(bufAttrColor, 3)
  );

  var surfaceMaterial = new THREE.MeshBasicMaterial({
    // color: 0xbffff,
    vertexColors: true,
    wireframe: true,
  });

  mesh = new THREE.Mesh(surface, surfaceMaterial);

  scene.add(mesh);

  render();
}

function render() {
  if (mesh) {
    const helper = new THREE.BoxHelper();
    helper.setFromObject(mesh);

    helper.geometry.computeBoundingBox();

    var maxCoord = Math.max(
      helper.geometry.boundingBox.max.x,
      helper.geometry.boundingBox.max.y,
      helper.geometry.boundingBox.max.z
    );

    camera.top = camera.far = camera.left = maxCoord * 1.2;
    camera.bottom = camera.near = camera.right = -maxCoord * 1.2;

    camera.updateProjectionMatrix();

    // Global Axis
    var globalAxis = new THREE.AxesHelper(maxCoord);
    scene.add(globalAxis);

    requestAnimationFrame(animate);
  } else requestAnimationFrame(render);
}

main();

function animate(time) {
  time *= 0.001;
  const speedY = 0.1 + 3.0 * 0.05;

  rotY = time * speedY;

  mesh.rotation.y = rotY;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
