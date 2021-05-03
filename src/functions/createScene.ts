import { Engine, Scene } from "@babylonjs/core";
import { buildGround } from "./buildGround";
import { createSkybox } from "./buildSky";
import { createCamera, createLight } from "./createCamera";

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  const camera = createCamera(scene)
  camera.attachControl(canvas, true);
  const light = createLight(scene)

  const { ground, largeGround } = buildGround(scene)
  const skybox = createSkybox(scene)
  skybox.position.y += 20
  return scene;
}
