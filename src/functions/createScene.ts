import { Engine, HemisphericLight, Scene } from "@babylonjs/core";
import { createCamera, createLight } from "./createCamera";

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  const camera = createCamera(scene)
  camera.attachControl(canvas, true);
  const light = createLight(scene)



  return scene;
}
