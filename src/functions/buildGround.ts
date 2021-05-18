import { MeshBuilder, Scene, StandardMaterial, Texture } from "@babylonjs/core";
const VILLAGE_ASSET = "https://assets.babylonjs.com/environments/valleygrass.png"
export function buildGround(scene: Scene) {

  const largeGroundMaterial = new StandardMaterial("largeGroundMat", scene)
  largeGroundMaterial.diffuseTexture = new Texture("/assets/ground-texture.jpg", scene)

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "assets/groundHeight.png",
    { width: 65, height: 65, subdivisions: 20, minHeight: 0, maxHeight: 10 },
    scene
  )
  largeGround.material = largeGroundMaterial
  largeGround.position.y = -0.01

  return { largeGround }


}