import { Scene, SceneLoader, Mesh, Vector3, MeshBuilder, ActionManager, ExecuteCodeAction, ActionEvent } from "@babylonjs/core";

export const createHeart = async (
  id: string,
  scene: Scene,
  position: Vector3,
  onCollide: (event: ActionEvent) => void,
  onSuccess?: (heart: Mesh) => void,
) => {
  return SceneLoader.ImportMesh(
    "",
    "https://assets.babylonjs.com/meshes/",
    "emoji_heart.glb",
    scene,
    function (meshes) {
      const heart = new Mesh(`heart${id}`, scene);
      meshes.forEach(mesh => {
        mesh.setParent(heart);
        heart.addChild(mesh);
      });
      heart.scaling.scaleInPlace(15);

      const boxCollider = MeshBuilder.CreateBox("heartCollider", { height: 2, width: .8, depth: .35 }, scene);
      boxCollider.isVisible = false;
      boxCollider.setParent(heart);
      heart.addChild(boxCollider);

      heart.position = position;

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

      if (onSuccess) {
        onSuccess(heart);
      }

      return heart;
    });
}