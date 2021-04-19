import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/loaders/glTF";
import { Engine, HemisphericLight, MeshBuilder, ParticleSystem, Scene, Sound, StandardMaterial, Texture, Vector3, Vector4, } from "@babylonjs/core"
import { createScene } from './functions/createScene'


const canvasElement = document.createElement('canvas')
canvasElement.id = "renderCanvas"

const engine = new Engine(canvasElement, true)
const scene = createScene(engine, canvasElement)


engine.runRenderLoop(() => {
  scene.render()
})

const rootEl = document.getElementById('root')!
rootEl.appendChild(canvasElement)


window.addEventListener("resize", () => {
  engine.resize()
})
engine.resize()
