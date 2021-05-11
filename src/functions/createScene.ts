import { ActionManager, ArcRotateCamera, Engine, ExecuteCodeAction, Scene, SceneLoader, TargetCamera, Vector3, Mesh, ParticleHelper, AbstractMesh, Sound } from "@babylonjs/core";
import { buildGround } from "./buildGround";
import { createSkybox } from "./buildSky";
import { createCamera, createLight } from "./createCamera";
import { loadHero } from "./loadHero";
import { createBarrel } from "./createBarrel";
import { createHeart } from "./createHeart";

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  const camera = createCamera(scene)
  camera.attachControl(canvas, true);
  const light = createLight(scene)

  const { ground, largeGround } = buildGround(scene)
  const skybox = createSkybox(scene)
  skybox.position.y += 20

  
  const hero = SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
    const hero = new Mesh('hero', scene);
    newMeshes[0].setParent(hero);
    hero.addChild(newMeshes[0]);
    //Scale the model down        
    hero.scaling.scaleInPlace(0.1);

    async function explode(mesh: AbstractMesh) {
      const { position } = mesh;
      return ParticleHelper.CreateAsync("explosion", scene).then((set) => {
        set.systems.forEach(s => {
          s.disposeOnStop = true;
          s.emitter = position;
        });
        set.start();

        new Sound('note', '/explosion.mp3', scene, null, { loop: false, autoplay: true });
      });
    }

    createBarrel('1', scene, new Vector3(10), (event) => {
      explode(event.source.parent);
      event.source.parent.dispose();
    });

    createHeart('1', scene, new Vector3(-10), (event) => {
      explode(event.source.parent);
      event.source.parent.dispose();
    });

    //Hero character variables 
    const heroSpeed = .1;
    const heroSpeedBackwards = 0.1;
    const heroRotationSpeed = 0.1;
    const boundaryRadius = 18;
    let animating = true;
    const walkAnim = scene.getAnimationGroupByName("Walking");
    const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    const sambaAnim = scene.getAnimationGroupByName("Samba");

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

          else {
            //Walk
            if (walkAnim)
              walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
        }
      }

    })

  });

  scene.collisionsEnabled = true;
  return scene;
}
