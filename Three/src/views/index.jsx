import { useEffect } from 'react';
import * as THREE from 'three';

const Page = () => {
  useEffect(() => {
    console.log(THREE);
    const canvas = document.getElementById('c');
    const width = canvas.width = window.innerWidth
    const height = canvas.height = window.innerHeight

    const scene = new THREE.Scene()
    // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    const directiLight = new THREE.DirectionalLight(0xffffff, 0.5)
    scene.add(ambientLight, directiLight)


    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const faces = []

    for(let i = 0; i < geometry.groups.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random()
      })
      faces.push(material)
    }

    const material = new THREE.MeshLambertMaterial({
      color: 0x1890ff
    })
    const mesh = new THREE.Mesh(geometry, faces)

    scene.add(mesh)

    const axesHelper = new THREE.AxesHelper()
    scene.add(axesHelper)
    
    const aspect = width / height
    const camera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      aspect,
      -aspect,
      0.01,
      100
    )
  
    // 设置相机位置
    camera.position.set(2, 2, 3)
    // 相机朝向
    camera.lookAt(scene.position)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    })

    renderer.setPixelRatio(window.devicePixelRatio || 1)

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
