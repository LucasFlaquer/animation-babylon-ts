import { Scene, SceneLoader, Mesh, Vector3, MeshBuilder, ActionManager, ExecuteCodeAction, ActionEvent } from "@babylonjs/core";

export const createMesh = (
  id: string,
  scene: Scene,
  position: Vector3,
  mesh: string,
  meshName: string,
  scale: number,
) => {

  return SceneLoader.ImportMesh(
    "",
    "https://assets.babylonjs.com/meshes/",
    mesh,
    scene,
    function (meshes) {
      const barrel = new Mesh(`${meshName}-${id}`, scene);
      meshes.forEach(mesh => {
        mesh.setParent(barrel);
        barrel.addChild(mesh);
      });
      barrel.scaling.scaleInPlace(scale);
      barrel.position = position;
    });
}