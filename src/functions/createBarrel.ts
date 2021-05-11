import { Scene, SceneLoader, Mesh, Vector3, MeshBuilder, ActionManager, ExecuteCodeAction, ActionEvent } from "@babylonjs/core";

export const createBarrel = (id: string, scene: Scene, position: Vector3, onCollide: (event: ActionEvent) => void) => {
  return SceneLoader.ImportMesh(
  "",
  "https://assets.babylonjs.com/meshes/", 
  "ExplodingBarrel.glb",
  scene,
  function (meshes) {
      const barrel = new Mesh(`barrel${id}`, scene);
      meshes.forEach(mesh => {
        mesh.setParent(barrel);
        barrel.addChild(mesh);
      });
      barrel.scaling.scaleInPlace(0.015);
      
      const collider = MeshBuilder.CreateCylinder("barrelCollider", { diameter: .65, height: 2 }, scene);
      collider.setParent(barrel);
      barrel.addChild(collider);
      
      barrel.position = position;

      const hero = scene.getMeshByID('hero');
      if (!hero) {
        return;
      }
      
      collider.actionManager = new ActionManager(scene);
      collider.actionManager.registerAction(
        new ExecuteCodeAction(
          { 
            trigger: ActionManager.OnIntersectionEnterTrigger, 
            parameter: hero,
          },
          onCollide
        )
      );
  });
}