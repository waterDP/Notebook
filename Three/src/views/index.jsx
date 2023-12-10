import { useEffect } from 'react';
import * as THREE from 'three';

const Page = () => {
  useEffect(() => {
    console.log(THREE);
    const canvas = document.getElementById('c');
    const width = canvas.width = window.innerWidth
    const height = canvas.height = window.innerHeight

    const scene = new THREE.Scene()

    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const material = new THREE.MeshBasicMaterial({
      color: 0x189000
    })
    const mesh = new THREE.Mesh(geometry, material)
    
    scene.add(mesh)

    const camera = new THREE.PerspectiveCamera(75, width / height)

    // 设置相机位置
    camera.position.set(2, 2, 3)
    // 相机朝向
    camera.lookAt(scene.position)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      canvas
    })

    // 设置渲染器大小
    renderer.setSize(width, height)

    renderer.render(scene, camera)
  }, []);

  return <>
    start your project
    <canvas id="c" />;
  </>
};

export default Page;
