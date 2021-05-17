import { ActionManager, ArcRotateCamera, Engine, ExecuteCodeAction, Scene, SceneLoader, TargetCamera, Vector3, Mesh, ParticleHelper, AbstractMesh, Sound, ActionEvent, ParticleSystem, Texture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock } from "@babylonjs/gui";
import { buildGround } from "./buildGround";
import { createSkybox } from "./buildSky";
import { createCamera, createLight } from "./createCamera";
import { loadHero } from "./loadHero";
import { createBarrel } from "./createBarrel";
import { createHeart } from "./createHeart";
import { createMesh } from "./createMesh";

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  const camera = createCamera(scene)
  camera.attachControl(canvas, true);
  const light = createLight(scene)

  const { ground, largeGround } = buildGround(scene)
  const skybox = createSkybox(scene)
  skybox.position.y += 20

  const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const totalHearts = 10;
  let heartIndex = 1;
  let isGameOver = false;

  const collaborators = new TextBlock('collaborators', 'Lucas Flaquer - 180952 && Gustavo Daltoé - 180974');
  collaborators.top = `-${window.screen.height / 2 - 100}px`;
  collaborators.color = '#fff';
  collaborators.fontSize = 18;

  const scoreBoard = new TextBlock('scoreBoard', `${heartIndex - 1}/${totalHearts}`);
  scoreBoard.top = `-${window.screen.height / 2 - 150}px`;
  scoreBoard.color = '#fff';
  scoreBoard.fontWeight = 'bold';
  scoreBoard.fontSize = 32;

  gui.addControl(scoreBoard);
  gui.addControl(collaborators);

  function refreshScoreBoard() {
    scoreBoard.text = `${heartIndex - 1}/${totalHearts}`;
  }

  const airplane = scene.getMeshByID('aiirplane');
  if (!airplane) {
    createMesh('', scene, new Vector3(5, 2.3), 'aerobatic_plane.glb', 'air', 15)
  }
  const alien = scene.getMeshByID('alien');
  if (!alien) {
    createMesh('', scene, new Vector3(2, 1.5, -20), 'alien.glb', 'alien', 2.5)
  }
  const chair = scene.getMeshByID('chair');
  if (!chair) {
    createMesh('', scene, new Vector3(-15), 'clothFolds.glb', 'chair', .5)
  }
  const dragon = scene.getMeshByID('dragon');
  if (!dragon) {
    createMesh('', scene, new Vector3(-3, 1, -20), 'toast_acrobatics.glb', 'dragon', 12)
  }
  const helmet = scene.getMeshByID('helmet');
  if (!helmet) {
    createMesh('', scene, new Vector3(23, 1, 5), 'shark.glb', 'helmet', .53)
  }
  const venlitaltor = scene.getMeshByID('ventilator');
  if (!venlitaltor) {
    createMesh('', scene, new Vector3(2, .5, -20), 'ufo.glb', 'ventilator', 8)
  }

  SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
    const hero = new Mesh('hero', scene);
    newMeshes[0].setParent(hero);
    hero.addChild(newMeshes[0]);
    //Scale the model down        
    hero.scaling.scaleInPlace(0.1);

    //Hero character variables 
    const heroSpeed = .1;
    const heroSpeedBackwards = 0.09;
    const heroRotationSpeed = 0.1;
    const boundaryRadius = 18;
    let animating = true;
    const walkAnim = scene.getAnimationGroupByName("Walking");
    const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    const sambaAnim = scene.getAnimationGroupByName("Samba");

    const generateRandomPosition = () => {
      const x = Math.ceil(Math.random() * 11) * (Math.round(Math.random()) ? 1 : -1); // random between -10 and 10
      const y = 0;
      const z = Math.ceil(Math.random() * 11) * (Math.round(Math.random()) ? 1 : -1);

      return new Vector3(x, y, z);
    }

    const highlightHeart = (index: number) => {
      const heart = scene.getMeshByID(`heart${index}`);

      if (!heart) return;

      const meshes = heart.getChildMeshes();
      meshes.forEach(mesh => {
        mesh.scaling.scaleInPlace(2);
      })
    }

    const collectHeart = (event: ActionEvent) => {
      const heart = event.source.parent;
      const { id } = heart;
      const index = Number(id.split('heart')[1]);

      if (index !== heartIndex) return;

      const particles = new ParticleSystem("particles", 50, scene);

      particles.particleTexture = new Texture('/assets/heart.png', scene);
      particles.emitter = heart.position;
      particles.targetStopDuration = 0.5;

      particles.start();

      heartIndex++;
      heart.dispose();

      new Sound('heart', '/assets/heart.mp3', scene, null, { loop: false, autoplay: true });

      if (heartIndex > totalHearts) {
        endGame();
      } else {
        highlightHeart(heartIndex);
      }

      refreshScoreBoard();
    }

    async function explode(mesh: AbstractMesh) {
      const { position } = mesh;
      return ParticleHelper.CreateAsync("explosion", scene).then((set) => {
        set.systems.forEach(s => {
          s.disposeOnStop = true;
          s.emitter = position;
        });
        set.start();

        new Sound('note', '/assets/explosion.mp3', scene, null, { loop: false, autoplay: true });
      });
    }

    function startGame() {
      isGameOver = false;
      heartIndex = 1;

      refreshScoreBoard();

      const barrel = scene.getMeshByID('barrel');
      if (!barrel) {
        createBarrel('', scene, new Vector3(10), (event) => {
          explode(event.source.parent);
          event.source.parent.dispose();
        });
      }

      for (let i = 0; i < totalHearts; i++) {
        const position = generateRandomPosition();

        createHeart(`${i + 1}`, scene, position, collectHeart, () => {
          if (i === 0) {
            highlightHeart(1);
          }
        });
      }


    };

    function endGame() {
      isGameOver = true;
      const button = Button.CreateSimpleButton("button", "Reiniciar");
      button.width = 0.1;
      button.height = "40px";
      button.color = "white";
      button.background = "green";
      button.top = `${window.screen.height / 2 - 200}px`;

      button.onPointerClickObservable.add(function () {
        sambaAnim?.stop();
        button.dispose();
        startGame();
      });

      gui.addControl(button);

      sambaAnim?.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
    };

    const camera1 = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
    scene.activeCamera = camera1;
    scene.activeCamera.attachControl(canvas, true);
    camera1.lowerRadiusLimit = 2;
    camera1.upperRadiusLimit = 10;
    camera1.wheelDeltaPercentage = 0.01;
    camera1.target = hero as any

    var inputMap = {} as any;
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    const isHeroInsideBoundaries = (speed: number) => {
      const direction = hero.forward.scaleInPlace(speed);
      const z = direction.z < 0 ? -1 : 1;
      const x = direction.x < 0 ? -1 : 1;

      const zNext = hero.position.z + speed + z;
      const xNext = hero.position.x + speed + x;

      const heroRadius = Math.sqrt(Math.pow(xNext, 2) + Math.pow(zNext, 2));

      return heroRadius < boundaryRadius;
    }

    scene.onBeforeRenderObservable.add(() => {
      if (isGameOver)
        return;

      var keydown = false;
      //Manage the movements of the character (e.g. position, direction)
      if (inputMap["w"] && isHeroInsideBoundaries(heroSpeed)) {
        hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
        keydown = true;
      }
      if (inputMap["s"] && isHeroInsideBoundaries(-heroSpeedBackwards)) {
        hero.moveWithCollisions(hero.forward.scaleInPlace(-heroSpeedBackwards));
        keydown = true;
      }
      if (inputMap["a"]) {
        hero.rotate(Vector3.Up(), -heroRotationSpeed);
        keydown = true;
      }
      if (inputMap["d"]) {
        hero.rotate(Vector3.Down(), -heroRotationSpeed);
        keydown = true;
      }

      //Manage animations to be played  
      if (keydown) {
        if (!animating) {
          animating = true;
          if (inputMap["s"]) {
            //Walk backwards
            if (walkBackAnim)
              walkBackAnim.start(true, 1.0, walkBackAnim.from, walkBackAnim.to, false);
          }
          else if
            (inputMap["b"]) {
            //Samba!
            if (sambaAnim)
              sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
          }
          else {
            //Walk
            if (walkAnim)
              walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
        }
      }
      else {

        if (animating) {
          //Default animation is idle when no key is down   
          if (idleAnim)
            idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

          //Stop all animations besides Idle Anim when no key is down
          if (sambaAnim && walkAnim && walkBackAnim) {

            sambaAnim.stop();
            walkAnim.stop();
            walkBackAnim.stop();
          }

          //Ensure animation are played only once per rendering loop
          animating = false;
        }
      }

    })

    startGame();
  });

  scene.collisionsEnabled = true;
  return scene;
}
