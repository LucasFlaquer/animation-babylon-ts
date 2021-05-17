import { MeshBuilder, Scene, StandardMaterial, Texture } from "@babylonjs/core";
const VILLAGE_ASSET = "https://assets.babylonjs.com/environments/valleygrass.png"
export function buildGround(scene: Scene) {

  const groundMat = new StandardMaterial("groundMat", scene)
  groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png", scene)
  groundMat.diffuseTexture.hasAlpha = true

  const ground = MeshBuilder.CreateGround("ground", { width: 24, height: 24 })
  ground.material = groundMat

  const largeGroundMaterial = new StandardMaterial("largeGroundMat", scene)
  largeGroundMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png", scene)

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "assets/groundHeight.png",
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 },
    scene
  )
  largeGround.material = largeGroundMaterial
  largeGround.position.y = -0.01

  return { ground, largeGround }


}