// Controle de camera com GUI.

import * as THREE from "three";
import { OrbitControls } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/loaders/OBJLoader.js";

var scene, renderer, camera, camControl;

const rendSize = new THREE.Vector2();

var pixelSize = new THREE.Vector2();

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function main() {
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(0x000000, 1.0);

  rendSize.x = window.innerWidth * 0.8;
  rendSize.y = window.innerHeight * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45.0,
    window.innerWidth / window.innerHeight,
    0.01,
    50.0
  );

  var ambientLight = new THREE.AmbientLight(0x111111);
  ambientLight.name = "ambient";
  scene.add(ambientLight);

  // Luz do sol
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 3).normalize();
  directionalLight.name = "directional";
  scene.add(directionalLight);

  loadTextures();

  var texture = new THREE.TextureLoader().load(
    "../Lab00-Assets/Assets/Textures/grass.jpg",
    carregaTerreno
  );

  buildScene();

  render();
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(Math.round(percentComplete, 2) + "% downloaded");
  }
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {
  var loader = new OBJLoader();
  loader.setPath("../Lab00-Assets/Assets/Models/OBJ/");
  loader.load(
    "happy-buddha.obj",

    function (obj) {
      var material = new THREE.MeshPhysicalMaterial({
        color: 0x708090,
        metalness: 0.9,
        roughness: 0.6,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
      });

      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      obj.name = "buda";
      obj.scale.set(0.5, 0.5, 0.5);
      obj.position.set(5.0, 0.0, -5.0);

      scene.add(obj);
    }
  );

  loader.load(
    "teapot.obj",

    function (obj) {
      var material = new THREE.MeshPhysicalMaterial({
        color: 0x708090,
        metalness: 0.3,
        roughness: 0.9,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      });

      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      obj.name = "teapot";

      obj.scale.set(0.01, 0.01, 0.01);

      scene.add(obj);
    }
  );

  var objGLTF = new GLTFLoader();

  objGLTF.setPath("../Lab00-Assets/Assets/Models/Building/");
  objGLTF.load(
    "scene.gltf",
    function (gltf) {
      const model = gltf.scene;

      model.name = "cena";
      model.scale.set(0.01, 0.01, 0.01);
      model.position.set(
        72.968564453125,
        -0.09081176757813661,
        58.9188037109375
      );
      scene.add(model);
      console.log(model.name);
      ajusteCamera();
    },
    onProgress
  );
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function loadTextures() {
  // cria Mapeamento de Ambiente
  const path = "../Lab00-Assets/Assets/Textures/Cubemaps/skyboxsun25deg/";
  const textCubeMap = [
    path + "px.jpg",
    path + "nx.jpg",
    path + "py.jpg",
    path + "ny.jpg",
    path + "pz.jpg",
    path + "nz.jpg",
  ];

  const textureCube = new THREE.CubeTextureLoader().load(textCubeMap);
  scene.background = textureCube;
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function carregaTerreno(texture) {
  if (!texture.image) {
    console.log("ERROR: loading texture");
    return;
  }

  pixelSize.x = 1.0 / texture.image.width;
  pixelSize.y = 1.0 / texture.image.height;

  var matShader = new THREE.ShaderMaterial({
    uniforms: {
      uSampler: { type: "t", value: texture },
      uPixelSize: { type: "v2", value: pixelSize },
    },
    vertexShader: document.getElementById("ImageProcessing_VS").textContent,
    fragmentShader: document.getElementById("ImageProcessing_FS").textContent,
  });

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50.0, 50.0, 50, 50),
    matShader
  );
  plane.rotateX((-90.0 * Math.PI) / 180.0);
  plane.name = "imagem";
  scene.add(plane);

  var axis = new THREE.AxesHelper(8.0);
  axis.name = "eixos";
  axis.rotateX((-90.0 * Math.PI) / 180.0);
  axis.position.y = 0.2;
  axis.updateMatrix();
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function ajusteCamera() {
  var obj = scene.getObjectByName("cena");

  console.log(obj);

  const helper = new THREE.BoxHelper();
  helper.setFromObject(obj);

  helper.geometry.computeBoundingBox();

  const box = new THREE.Box3().setFromObject(obj);
  console.log(box.min.x, box.min.y, box.min.z);

  camera.position.x = (box.max.x + box.min.x) / 2.0;
  camera.position.y = box.max.y / 5.0;
  camera.position.z = 0.0;

  camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

  var farPlane = Math.max(
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z
  );

  camera.far = farPlane * 10.0;
  camera.updateProjectionMatrix();

  // Controle de Camera Orbital
  camControl = new OrbitControls(camera, renderer.domElement);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
