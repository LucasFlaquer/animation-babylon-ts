import { ArcRotateCamera, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

export const createCamera = (scene: Scene) => {
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
  return camera
}

export const createLight = (scene: Scene) => {
  return new HemisphericLight("light", new Vector3(1, 1, 0), scene)
}