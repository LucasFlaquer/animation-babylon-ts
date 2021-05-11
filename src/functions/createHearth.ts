import { Scene, SceneLoader, Mesh, Vector3, MeshBuilder } from "@babylonjs/core";

export const createHearth = (id: string, scene: Scene, position: Vector3, callback: (barrel: Mesh) => void) => {
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
      // boxCollider.isVisible = false;
      boxCollider.setParent(hearth);
      hearth.addChild(boxCollider);
      
      hearth.position = position;

      callback(boxCollider);
  });
}