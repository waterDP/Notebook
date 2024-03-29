import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Vector4, Nullable, Scene, Mesh, Color4 } from "@babylonjs/core";

const canvas = document.getElementById("renderCanvas")!;
const engine = new BABYLON.Engine(canvas as HTMLCanvasElement, true);
const scene = new BABYLON.Scene(engine);

// ^ 立文体 Box

const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);

export declare function CreateBox(
  name: string,
  options?: {
    size?: number; // 立方体每一面的大小，也就是长宽高统一都是这个值 default 1
    width?: number; // 单独设置高度Y，覆盖size的高度
    height?: number; // 单独设置高度X，覆盖size的高度
    depth?: number; // 单独设置高度Y，覆盖size的高度
    faceUV?: Vector4[]; // 是一个长度为6的数组，代表立方体的6个面，可以对其分别设置Color4颜色
    faceColors?: Color4[]; // 是一个长度为6的数组，代表立方体的6个面，可以对其分别设置Color4颜色
    sideOrientation?: number; // 物体可被看到的面 默认0，正面，可选：0 正面，1 背面，2 双面
    frontUVs?: Vector4;
    backUVs?: Vector4;
    wrap?: boolean;
    topBaseAt?: number;
    bottomBaseAt?: number;
    updatable?: boolean; // 如果设置为true，则表示该物体的顶点数据可以被更新
  },
  scene?: Nullable<Scene>
): Mesh;

// ^ 球休 Shpere

const shpere = BABYLON.MeshBuilder.CreateSphere("shpere", {}, scene);

export declare function CreateSphere(
  name: string,
  options?: {
    segments?: number; // 水平分段数，决定了球体的精度，值越小棱角就越明显
    diameter?: number; // 球体通用直径，相当于XYZ方向都是同一个值
    diameterX?: number; // X轴直径, 覆盖diameter的X方向的值
    diameterY?: number;
    diameterZ?: number;
    arc?: number;
    slice?: number;
    sideOrientation?: number;
    frontUVs?: Vector4;
    backUVs?: Vector4;
    updatable?: boolean;
  },
  scene?: Nullable<Scene>
): Mesh;
