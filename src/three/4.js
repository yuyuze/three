// animations
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  AxesHelper,
  Clock, OrthographicCamera
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

console.log('OrbitControls', OrbitControls)
const scene = new Scene();
// 透视相机
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight, 1, 1000
);
// camera
// 自动拍照相机
// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new OrthographicCamera(-aspectRatio, aspectRatio,1, -1, 0.1 , 100);

camera.position.z = 2;

// red cube
const geometry = new BoxGeometry(1, 1, 1);

const material = new MeshBasicMaterial({
  color: 0xff0000
});

const mesh = new Mesh(geometry, material);

camera.lookAt(mesh.position);

scene.add(camera);
scene.add(mesh)
// Axes helper
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const renderer = new WebGLRenderer({
    canvas
  });
  document.querySelector('#root')?.appendChild(canvas);
  console.log('canvas.width, canvas.height', canvas.width, canvas.height);
  renderer.setSize(canvas.width, canvas.height);
 // time 存储事件
 //  let time = Date.now();
  // 解决方法二
  const clock = new Clock()
  const cursor = {
    x: 0,
    y: 0,
  }
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
    camera.lookAt((mesh.position))
    // render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick()

  // window.addEventListener('mousemove', event => {
  //   cursor.x = event.clientX / window.innerWidth - 0.5;
  //   cursor.y = -(event.clientY / window.innerHeight - 0.5);
  //   console.log(cursor)
  // })
};
