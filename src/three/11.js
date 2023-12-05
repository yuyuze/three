// animations
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  AxesHelper,
  Clock,
  OrthographicCamera,
  BufferGeometry,
  BufferAttribute,
  SphereGeometry,
  MeshStandardMaterial,
  AmbientLight,
  SpotLight,
  CubeTextureLoader,
  EquirectangularReflectionMapping
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

console.log('OrbitControls', OrbitControls);
const scene = new Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
// 透视相机
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

camera.position.z = 10;

// const geometry = new BufferGeometry();
const ambientLight = new AmbientLight(0xffffff, 0.5);
ambientLight.position.set(0, 0, 0);
const spotLight = new SpotLight(0xffffff, 0.5);
const geometry = new SphereGeometry(4);

const material = new MeshStandardMaterial({});
// material.envMap = blueTexture;
// material.metalness = 1;
// material.roughness = 0;
const mesh = new Mesh(geometry, material);

camera.lookAt(mesh.position);

scene.add(camera);
scene.add(mesh);
spotLight.position.set(6, 6, 6);
// Axes helper
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);
scene.add(ambientLight);
scene.add(spotLight);

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = sizes.width;
  canvas.height = sizes.height;
  const renderer = new WebGLRenderer({
    canvas
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.querySelector('#root')?.append(renderer.domElement);

  console.log('canvas.width, canvas.height', canvas.width, canvas.height);
  renderer.setSize(canvas.width, canvas.height);
  renderer.domElement.className = 'webgl';
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.update();
  // document.getElementById('root').appendChild(renderer.domElement)
  // time 存储事件
  //  let time = Date.now();
  // 解决方法二
  const clock = new Clock();
  const cursor = {
    x: 0,
    y: 0
  };
  function tick() {
    // // 如何固定帧率 解决方法一
    // const currentTime = Date.now();
    // // 时间差
    // const deltaTime = currentTime - time;
    //
    // time = currentTime;
    //
    // console.log('tick')
    // // 无论帧速率如何，都已相同速度旋转
    // mesh.position.x += 0.00001 * deltaTime

    // clock 记录当前开始的时间到现在为止的时间
    // const elapsedTime = clock.getElapsedTime()
    // mesh.rotation.y = elapsedTime *  (Math.PI / 2);
    // update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // // up是正的所以要负号
    // camera.position.y = cursor.y * 3;
    camera.lookAt(mesh.position);
    controls.update();
    // render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick();

  // window.addEventListener('mousemove', event => {
  //   cursor.x = event.clientX / window.innerWidth - 0.5;
  //   cursor.y = -(event.clientY / window.innerHeight - 0.5);
  //   console.log(cursor)
  // })
  // 像素比 pixel ratio
  window.addEventListener('resize', (event) => {
    console.log(1111);
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // 对应切换屏幕的时候 做的操作防止他出现锯齿
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
  });

  window.addEventListener('dblclick', function () {
    const fullScreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (fullScreenElement !== renderer.domElement) {
      if (renderer.domElement.requestFullscreen) {
        renderer.domElement.requestFullscreen();
      } else if (renderer.domElement.webkitRequestFullscreen) {
        renderer.domElement.webkitRequestFullscreen();
      }
    } else {
      if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
};
