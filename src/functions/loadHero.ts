import { Scene, SceneLoader, Vector3 } from "@babylonjs/core";

export function loadHero(scene: Scene) {
  const hero = SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
    const hero = newMeshes[0];
    //Scale the model down        
    hero.scaling.scaleInPlace(0.1);

    //Hero character variables 
    const heroSpeed = 0.03;
    const heroSpeedBackwards = 0.01;
    const heroRotationSpeed = 0.1;
    const animating = true;
    const walkAnim = scene.getAnimationGroupByName("Walking");
    const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    const sambaAnim = scene.getAnimationGroupByName("Samba");

    return hero

  });
  if (hero) return hero
}