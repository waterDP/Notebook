import * as BABYLON from "@babylonjs/core/Legacy/legacy";

const canvas = document.getElementById("renderCanvas")!;
const engine = new BABYLON.Engine(canvas as HTMLCanvasElement, true);
const scene = new BABYLON.Scene(engine);

/**
 * 坐标参照系
    Babylon.js使用了两种 坐标参照系 ，即世界坐标系world和局部坐标系local，世界坐标系可以理解为：全局坐标系。世界坐标系的原点位置任何时候都是(0, 0, 0)不会被改变，而局部坐标系会随着物体位置、旋转、缩放的改变而改变。例如：一个物体的初始位置是(0, 0, 0)，它世界坐标系和局部坐标系就都是(0, 0, 0)，当这个物体移动到位置(0, 10, 0)的时候，也就是向上移动了10的距离，这个时候它世界坐标系还是(0, 0, 0)和局部坐标系是(0, 10, 0)。

    在Playground例子的中，坐标的轴线都有标准的颜色标识，X轴为红色，Y轴为绿色，Z轴为蓝色。

    创建物体时，物体的中心就在世界坐标的原点(0, 0, 0)处，其位置的值始终是一个相对于世界坐标原点的值。例如位置(0, 10, 0)，就是相对于(0, 0, 0)网上偏离了10个单位。

    之前也讲到，局部坐标是随着物体的移动而移动的，并且无论物体的位置、方向、大小如何，局部坐标的原点始终在会处于物体的中心。物体旋转和缩放需要一个支点，一般来说都是位于其局部坐标的原点，简单来说也就是该物体的中心，所以我们看到的效果就是中心缩放和中心旋转。如果想改变支点怎么办？比如地球绕着太阳旋转，支点就肯定不能是自身中心，强大的Babylon肯定是有办法的，那就是通过使用变换节点TransformNode或矩阵Matrix来为物体设置新的支点。
 */

// ^ 位置Position
// 常规设置
const pilot = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
pilot.position = new BABYLON.Vector3(2, 3, 4);

// 或者单独设置
pilot.position.x = 2;
pilot.position.y = 3;
pilot.position.z = 4;

// ^ 旋转Rotation

// 常规设置
const alpha = Math.PI / 2;
const beta = Math.PI / 2;
const gramma = Math.PI / 2;
pilot.rotation = new BABYLON.Vector3(alpha, beta, gramma);

// 单独设置
pilot.rotation.x = alpha;
pilot.rotation.y = beta;
pilot.rotation.z = gramma;

