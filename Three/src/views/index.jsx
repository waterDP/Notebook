import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

const Page = () => {
  useEffect(() => {
    console.log(THREE);
    const canvas = document.getElementById('c');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const scene = new THREE.Scene();
    // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directiLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(ambientLight, directiLight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const faces = [];

    for (let i = 0; i < geometry.groups.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random(),
      });
      faces.push(material);
    }

    const material = new THREE.MeshLambertMaterial({
      color: 0x1890ff,
    });
    const mesh = new THREE.Mesh(geometry, faces);

    scene.add(mesh);

    // 创建辅助平面
    const gridHelper = new THREE.GridHelper();
    // 辅助坐标系
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper, gridHelper);

    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      aspect,
      -aspect,
      0.01,
      100
    );

    // 设置相机位置
    camera.position.set(2, 2, 3);
    // 相机朝向
    camera.lookAt(scene.position);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio || 1);

    // 设置渲染器大小
    renderer.setSize(width, height);

    renderer.render(scene, camera);

    // 创建轨道控制器
    const oribitControls = new OrbitControls(camera, canvas);
    oribitControls.enableDamping = true;

    const clock = new THREE.Clock();

    // 创建性能监控器
    const stats = new Stats();
    stats.setMode(0);
    document.body.appendChild(stats.domElement);
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // mesh.rotation.y += elapsedTime / 1000;
      // mesh.position.x += elapsedTime / 1000;
      // mesh.scale.x += elapsedTime / 1000;

      camera.position.x = Math.cos(elapsedTime);
      camera.position.y = Math.sin(elapsedTime);
      oribitControls.update();
      stats.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return (
    <>
      start your project
      <canvas id="c" />;
    </>
  );
};

export default Page;
