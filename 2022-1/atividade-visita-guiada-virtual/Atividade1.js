// Controle de camera com GUI.

import * as THREE from "three";
import { AnimationMixer } from "three";
import { PointerLockControls } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/controls/PointerLockControls.js";
import { GUI } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/loaders/GLTFLoader.js";
import { MTLLoader } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "../Lab00-Assets/Assets/scripts/three.js/examples/jsm/loaders/OBJLoader.js";

var scene,
  renderer,
  camera,
  camWalk,
  camDrone,
  camGuide,
  controlWalk,
  controlDrone,
  controlGuide,
  currentCamera = "drone",
  guiControls,
  controls,
  moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false,
  moveUp = false,
  moveDown = false,
  passoActive = false,
  passoTime = 0.0,
  animation,
  mixer,
  clip,
  action,
  guideCanMove = false,
  percurso = [0, 0, 0],
  guideSpeed = 5,
  esperandoPercurso = true;

const direction = new THREE.Vector3();
const velocity = new THREE.Vector3();
const rendSize = new THREE.Vector2();
const clock = new THREE.Clock();
var gui = new GUI();

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function main() {
  renderer = new THREE.WebGLRenderer();
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

  rendSize.x = window.innerWidth * 0.8;
  rendSize.y = window.innerHeight * 0.8;

  renderer.setSize(rendSize.x, rendSize.y);

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45.0,
    window.innerWidth / window.innerHeight,
    0.01,
    500.0
  );

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  initGUI();

  buildScene();

  animate();
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {
  guiControls = { Mode: "Walk" };

  gui.add(guiControls, "Mode", ["Walk", "Drone", "Guide"]).onChange((event) => {
    if (guiControls.Mode === "Walk") walkCamera();
    else if (guiControls.Mode === "Drone") droneCamera();
    else guideMove();
  });
  gui.open();
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
  var objMTL = new MTLLoader();
  objMTL.setPath("../Lab00-Assets/Assets/Models/OBJ/sponza/");
  objMTL.load("sponza.mtl", loadMaterials);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function loadMaterials(materials) {
  materials.preload();

  var objLoader = new OBJLoader();

  objLoader.setMaterials(materials);
  objLoader.setPath("../Lab00-Assets/Assets/Models/OBJ/sponza/");
  objLoader.load("sponza.obj", loadMesh, onProgress);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function loadMesh(object) {
  object.name = "cena";

  scene.add(object);

  guideLoad();
  walkCamera();

  // if(currentCamera === "walk"){
  //     walkCamera();
  // }else if(currentCamera === "drone"){
  //     droneCamera()
  // }else{
  //     guideLoad()
  // }
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function walkCamera() {
  var obj = scene.getObjectByName("cena");

  const helper = new THREE.BoxHelper();
  helper.setFromObject(obj);

  helper.geometry.computeBoundingBox();

  const box = new THREE.Box3().setFromObject(obj);

  camera.position.x = (box.max.x + box.min.x) / 2.0;
  camera.position.y = box.max.y / 10.0;
  camera.position.z = 0.0;

  camera.lookAt(new THREE.Vector3(box.max.x, box.max.y / 7.0, 0.0));

  var farPlane = Math.max(
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z
  );

  camera.far = farPlane * 10.0;

  camera.updateProjectionMatrix();

  controls = new PointerLockControls(camera, renderer.domElement);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        velocity.z = 0.0;
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        velocity.x = 0.0;
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        velocity.z = 0.0;
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        velocity.x = 0.0;
        moveRight = false;
        break;
    }
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function animateWalk(delta) {
  if (controls.isLocked === true) {
    if (scene.getObjectByName("dog"))
      scene.getObjectByName("dog").visible = false;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 3000.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 3000.0 * delta;
    // console.log(- velocity.x * delta )
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    if (velocity.z != 0.0 || velocity.x != 0.0) {
      passoActive = true;
      camera.position.y += Math.sin(passoTime * 10) * 3;
    }
  }
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function droneCamera() {
  var obj = scene.getObjectByName("cena");

  const helper = new THREE.BoxHelper();
  helper.setFromObject(obj);

  helper.geometry.computeBoundingBox();

  const box = new THREE.Box3().setFromObject(obj);

  camera.position.x = (box.max.x + box.min.x) / 2.0;
  camera.position.y = box.max.y / 10.0;
  camera.position.z = 0.0;

  var farPlane = Math.max(
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z
  );

  camera.far = farPlane * 10.0;

  camera.updateProjectionMatrix();

  controls = new PointerLockControls(camera, renderer.domElement);

  controls.pointerSpeed = 0.7;

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
      case "KeyQ":
        moveUp = true;
        break;
      case "KeyE":
        moveDown = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        velocity.z = 0.0;
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        velocity.x = 0.0;
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        velocity.z = 0.0;
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        velocity.x = 0.0;
        moveRight = false;
        break;
      case "KeyQ":
        velocity.y = 0.0;
        moveUp = false;
        break;
      case "KeyE":
        velocity.y = 0.0;
        moveDown = false;
        break;
    }
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}
/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function droneMove(delta) {
  if (controls.isLocked === true) {
    if (scene.getObjectByName("dog"))
      scene.getObjectByName("dog").visible = false;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;

    // console.log(velocity)
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.y = Number(moveUp) - Number(moveDown);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 2000.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 2000.0 * delta;
    if (moveUp || moveDown) velocity.y -= direction.y * 150.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y;
  }
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function guideLoad() {
  const loader = new GLTFLoader();

  loader.load(
    "../Lab00-Assets/Assets/Models/LowPolyWolf/scene.gltf",
    function (gltf) {
      const model = gltf.scene;
      model.name = "dog";
      model.scale.set(30, 30, 30);
      mixer = new AnimationMixer(gltf);
      animation = gltf.animations;
      scene.add(model);
      guideCamera();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log(error);
    }
  );
  renderer.outputEncoding = THREE.sRGBEncoding;
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function guideCamera() {
  var obj = scene.getObjectByName("dog");

  const helper = new THREE.BoxHelper();
  helper.setFromObject(obj);

  helper.geometry.computeBoundingBox();

  clip = THREE.AnimationClip.findByName(animation, "Run");
  action = mixer.clipAction(clip, obj);
  action.loop = THREE.LoopRepeat;
  action.setTime = 0.5;

  const box = new THREE.Box3().setFromObject(obj);

  camera.position.x = box.max.x + 20.0;
  camera.position.y = box.max.y + 20.0;
  camera.position.z = (box.max.z + box.min.z) / 2.0;

  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  obj.applyQuaternion(quaternion);

  camera.lookAt(
    new THREE.Vector3(box.max.x, box.max.y / 2, (box.max.z + box.max.z) / 2.0)
  );

  camera.applyQuaternion(quaternion);

  var farPlane = Math.max(
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z
  );

  camera.far = farPlane * 10.0;

  camera.updateProjectionMatrix();

  controls = new PointerLockControls(camera, renderer.domElement);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  const onKeyDown = function (event) {
    switch (event.code) {
      case "Space":
        if (controls.isLocked === true) {
          if (esperandoPercurso) {
            if (percurso[0] === 0 && percurso[1] === 0 && percurso[2] === 0) {
              percurso[0] = 1;
              guideCanMove = true;
            } else if (percurso[0]) {
              percurso[0] = 0;
              percurso[1] = 1;
              guideCanMove = true;
            } else if (percurso[1]) {
              percurso[1] = 0;
              percurso[2] = 1;
              guideCanMove = true;
            } else if (percurso[2]) {
              percurso[2] = 0;
              resetGuide = true;
              guideCanMove = false;
            }
            esperandoPercurso = false;
          }
        }
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function guideMove() {
  if (controls.isLocked === true) {
    var obj = scene.getObjectByName("cena");

    const helper = new THREE.BoxHelper();
    helper.setFromObject(obj);

    helper.geometry.computeBoundingBox();

    const box = new THREE.Box3().setFromObject(obj);

    var obj2 = scene.getObjectByName("dog");
    obj2.visible = true;

    const helper2 = new THREE.BoxHelper();
    helper2.setFromObject(obj2);

    helper2.geometry.computeBoundingBox();

    const box2 = new THREE.Box3().setFromObject(obj2);

    if (percurso[0]) {
      camera.position.x = (box2.min.x + box2.max.x) / 2.0 - 50.0;
      camera.position.y = box2.max.y;
      camera.position.z = (box2.min.z + box2.max.z) / 2.0;
    } else if (percurso[1]) {
      camera.position.x = (box2.min.x + box2.max.x) / 2.0;
      camera.position.y = box2.max.y;
      camera.position.z = (box2.max.z + box2.min.z) / 2.0 - 50.0;
    } else if (percurso[2]) {
      camera.position.x = (box2.max.x + box2.min.x) / 2.0 + 50.0;
      camera.position.y = box2.max.y;
      camera.position.z = (box2.max.z + box2.min.z) / 2.0;
    }

    // console.log(box2.max.x)

    if (guideCanMove) {
      if (percurso[0]) {
        camera.lookAt(
          new THREE.Vector3(
            box2.max.x,
            box2.max.y / 2.0,
            (box2.min.z + box2.max.z) / 2.0
          )
        );
      } else if (percurso[1]) {
        camera.lookAt(
          new THREE.Vector3(
            (box2.min.x + box2.max.x) / 2.0,
            box2.max.y - 5.0,
            box2.max.z
          )
        );
      } else if (percurso[2]) {
        camera.lookAt(
          new THREE.Vector3(
            box2.min.x,
            box2.max.y - 5.0,
            (box2.min.z + box2.max.z) / 2.0
          )
        );
      }
    }

    obj2 = scene.getObjectByName("dog");

    if (guideCanMove && !action.isRunning()) {
      action.fadeIn();
      action.play();
      // console.log("PLAY")
    } else if (!guideCanMove && action.isRunning()) {
      action.halt();
      action.stop();
      // console.log("STOP")
    }

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

    if (percurso[0] === 1 && guideCanMove) {
      obj2.position.x += guideSpeed;
      if (obj2.position.x >= box.max.x - 700.0) {
        guideCanMove = false;
        if (!esperandoPercurso) {
          obj2.applyQuaternion(quaternion);
        }
        esperandoPercurso = true;
      }
    } else if (percurso[1] === 1 && guideCanMove) {
      obj2.position.z += guideSpeed;
      if (obj2.position.z >= box.max.z - 800.0) {
        guideCanMove = false;
        if (!esperandoPercurso) {
          obj2.applyQuaternion(quaternion);
        }
        esperandoPercurso = true;
      }
    } else if (percurso[2] === 1 && guideCanMove) {
      obj2.position.x -= guideSpeed;
      if (obj2.position.x <= (box.max.x + box.min.x) / 2.0) {
        guideCanMove = false;
        esperandoPercurso = true;
      }
    }
  }
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function boundary() {
  var obj = scene.getObjectByName("cena");

  const helper = new THREE.BoxHelper();
  helper.setFromObject(obj);

  helper.geometry.computeBoundingBox();

  const box = new THREE.Box3().setFromObject(obj);

  if (camera.position.x >= box.max.x - 500.0) {
    camera.position.x = box.max.x - 505.0;
  } else if (camera.position.x <= box.min.x + 500.0) {
    camera.position.x = box.min.x + 505.0;
  } else if (camera.position.z >= box.max.z - 550.0) {
    camera.position.z = box.max.z - 555.0;
  } else if (camera.position.z <= box.min.z + 550.0) {
    camera.position.z = box.min.z + 555.0;
  } else if (camera.position.y >= box.max.y - 50.0) {
    camera.position.y = box.max.y - 55.0;
  } else if (camera.position.y <= box.min.y + 140.0) {
    camera.position.y = box.min.y + 141.0;
  }
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function shouldWalk() {
  if (passoActive) {
    const tamPasso = Math.PI;
    const proxPasso = 1 + Math.floor((passoTime + 0.000001) / tamPasso);
    const proxPassoTime = proxPasso * tamPasso;
    passoTime = Math.min(clock.getElapsedTime(), proxPassoTime);
    if (passoTime == proxPassoTime) {
      passoActive = false;
    }
  }
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function animate() {
  const delta = clock.getDelta();

  requestAnimationFrame(animate);
  boundary();
  if (guiControls.Mode === "Walk") {
    animateWalk(delta);
    shouldWalk();
  } else if (guiControls.Mode === "Drone") {
    droneMove(delta);
  } else {
    if (scene.getObjectByName("dog")) {
      guideMove();
      mixer.update(delta);
    }
  }

  render();
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

function render() {
  renderer.render(scene, camera);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
