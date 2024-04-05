/*
 * @Author: water.li
 * @Date: 2024-04-05 20:56:45
 * @Description:
 * @FilePath: \Notebook\Babylon\src\history\3.参数化形状的物体.ts
 */

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

const canvas = document.getElementById("renderCanvas")!;
const engine = new BABYLON.Engine(canvas as HTMLCanvasElement, true);
const scene = new BABYLON.Scene(engine);

// ^ 线条

const myPoints = [
  new BABYLON.Vector3(0, 0, 0),
  new BABYLON.Vector3(0, 1, 1),
  new BABYLON.Vector3(0, 1, 0),
];

const line = BABYLON.MeshBuilder.CreateLines(
  "line",
  { points: myPoints },
  scene
);
