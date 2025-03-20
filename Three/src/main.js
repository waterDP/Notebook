/*
 * @Author: water.li
 * @Date: 2025-03-15 21:53:26
 * @Description:
 * @FilePath: \Notebook\Three\src\main.js
 */

import * as THREE from "three";
// 引入相机轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper)

const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 });

const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 10, 0)
scene.add(mesh);

const width = 800
const height = 500
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
camera.position.set(200, 200, 200)
camera.lookAt(mesh.position)

const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.decay = 0 // 不随着距离的改变而衰减
pointLight.position.set(400, 200, 300)
scene.add(pointLight)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)
renderer.render(scene, camera)
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
  renderer.render(scene, camera)
})