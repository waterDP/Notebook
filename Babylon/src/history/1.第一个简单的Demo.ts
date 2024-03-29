/*
 * @Author: water.li
 * @Date: 2024-03-29 22:00:19
 * @Description:
 * @FilePath: \Notebook\Babylon\src\lib\index copy.ts
 */
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

export function initial() {
  const canvas = document.getElementById("renderCanvas")!;
  const engine = new BABYLON.Engine(canvas as HTMLCanvasElement, true);
  const scene = createScene();
  function createScene() {
    const scene = new BABYLON.Scene(engine);

    // 添加一个相机
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      new BABYLON.Vector3(0, 0, 5),
      scene
    );
    camera.attachControl(canvas, true);

    // 添加一组灯光到场景
    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // 添加一个球到场景中
    BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);

    return scene;
  }
  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", () => {
    engine.resize();
  });
}
