import { Scene, SceneLoader, Mesh, Vector3 } from "@babylonjs/core";

export const createBarrel = (id: string, scene: Scene, position: Vector3, callback: (barrel: Mesh) => void) => {
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
      barrel.position = position;

      callback(barrel);
  });
}