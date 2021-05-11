import { Scene, SceneLoader, Mesh, Vector3, MeshBuilder, ActionManager, ExecuteCodeAction, ActionEvent } from "@babylonjs/core";

export const createHeart = (id: string, scene: Scene, position: Vector3, onCollide: (event: ActionEvent) => void) => {
  return SceneLoader.ImportMesh(
  "",
  "https://assets.babylonjs.com/meshes/", 
  "emoji_heart.glb",
  scene,
  function (meshes) {
      const hearth = new Mesh(`hearth${id}`, scene);
      meshes.forEach(mesh => {
        mesh.setParent(hearth);
        hearth.addChild(mesh);
      });
      hearth.scaling.scaleInPlace(15);
      
      const boxCollider = MeshBuilder.CreateBox("hearthCollider", { height: 2, width: .5, depth: .5  }, scene);
      boxCollider.isVisible = false;
      boxCollider.setParent(hearth);
      hearth.addChild(boxCollider);
      
      hearth.position = position;

      const hero = scene.getMeshByID('hero');
      if (!hero) {
        return;
      }
      
      boxCollider.actionManager = new ActionManager(scene);
      boxCollider.actionManager.registerAction(
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