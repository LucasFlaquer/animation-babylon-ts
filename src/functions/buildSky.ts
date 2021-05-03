import { Color3, CubeTexture, MeshBuilder, Scene, StandardMaterial, Texture } from "@babylonjs/core";

export function createSkybox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skybox", { size: 150 })
  const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene)
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture("/assets/skybox/skybox4", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox
}